/**
 * Vercel Serverless Function — /api/claude
 *
 * Proxies requests from the frontend to the Anthropic API,
 * injecting the API key from the environment variable ANTHROPIC_API_KEY.
 * The key is never exposed to the browser.
 *
 * Set ANTHROPIC_API_KEY in:
 *   Vercel Dashboard → Project → Settings → Environment Variables
 */
export default async function handler(req, res) {
  // Only allow POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.error("ANTHROPIC_API_KEY environment variable is not set");
    return res.status(500).json({ error: "Server configuration error: API key not set" });
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

    // Pass through the status code from Anthropic
    return res.status(upstream.status).json(data);
  } catch (err) {
    console.error("Proxy error:", err);
    return res.status(500).json({ error: "Proxy request failed", detail: err.message });
  }
}
