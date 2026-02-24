/**
 * Vercel Serverless Function — /api/claude (hardened)
 *
 * Security measures:
 * 1. CORS — only allows requests from the GitHub Pages origin
 * 2. Rate limiting — max 10 requests per IP per minute (in-memory)
 * 3. Input validation — enforces payload shape and size limits
 * 4. Prompt injection defense — strips common injection patterns
 * 5. Security headers on all responses
 */

// ── 1. CORS ──────────────────────────────────────────────────────────
const ALLOWED_ORIGINS = [
  "https://bjeevith.github.io",
  "http://localhost:5173",
  "http://localhost:3000",
];

// ── 2. Rate limiter (in-memory) ───────────────────────────────────────
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const RATE_LIMIT_MAX = 10;

function isRateLimited(ip) {
  const now = Date.now();
  const entry = rateLimitMap.get(ip) || { count: 0, windowStart: now };
  if (now - entry.windowStart > RATE_LIMIT_WINDOW_MS) {
    rateLimitMap.set(ip, { count: 1, windowStart: now });
    return false;
  }
  if (entry.count >= RATE_LIMIT_MAX) return true;
  entry.count++;
  rateLimitMap.set(ip, entry);
  return false;
}

// ── 3. Input validation ───────────────────────────────────────────────
const MAX_PROMPT_LENGTH = 8000;

function validateBody(body) {
  if (!body || typeof body !== "object") return "Invalid request body";
  if (!body.model || body.model !== "claude-sonnet-4-20250514") return "Model not permitted";
  if (!Array.isArray(body.messages) || body.messages.length === 0) return "Missing messages";
  if (body.messages.length > 2) return "Too many messages";
  const userMsg = body.messages.find(m => m.role === "user");
  if (!userMsg || typeof userMsg.content !== "string") return "Invalid user message";
  if (userMsg.content.length > MAX_PROMPT_LENGTH) return "Prompt too long";
  if (body.max_tokens && body.max_tokens > 8000) return "max_tokens too high";
  return null;
}

// ── 4. Prompt injection patterns ─────────────────────────────────────
const INJECTION_PATTERNS = [
  /ignore (all |previous |prior )?(instructions|prompts|rules)/i,
  /you are now/i,
  /disregard (all |your |previous )?instructions/i,
  /system prompt/i,
  /\[INST\]/i,
  /<\|im_start\|>/i,
  /\bDAN\b/,
  /jailbreak/i,
];

function containsInjection(text) {
  return INJECTION_PATTERNS.some(p => p.test(text));
}

// ── Main handler ──────────────────────────────────────────────────────
export default async function handler(req, res) {
  const origin = req.headers.origin || "";

  res.setHeader("Access-Control-Allow-Origin", ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0]);
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const ip = req.headers["x-forwarded-for"]?.split(",")[0]?.trim() || "unknown";
  if (isRateLimited(ip)) {
    return res.status(429).json({ error: "Too many requests — please wait a moment and try again." });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return res.status(500).json({ error: "Server configuration error" });

  const validationError = validateBody(req.body);
  if (validationError) return res.status(400).json({ error: validationError });

  const userContent = req.body.messages.find(m => m.role === "user")?.content || "";
  if (containsInjection(userContent)) {
    return res.status(400).json({ error: "Request contains disallowed content." });
  }

  try {
    const upstream = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "anthropic-beta": "web-search-2025-03-05",
      },
      body: JSON.stringify(req.body),
    });
    const data = await upstream.json();
    return res.status(upstream.status).json(data);
  } catch (err) {
    console.error("Proxy error:", err);
    return res.status(500).json({ error: "Proxy request failed" });
  }
}
