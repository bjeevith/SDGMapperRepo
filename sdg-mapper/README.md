# SDG Goal Mapper

AI-powered tool that reads a company's official sustainability website, extracts their goals, and maps each one across all 17 UN SDGs — with causal reasoning, trade-off analysis, and concrete recommendations.

**Live app:** your URL will appear here after deployment.

---

## Architecture

```
Browser (GitHub Pages)
    │  POST /api/claude
    ▼
Vercel Serverless Function  ←  ANTHROPIC_API_KEY (secret, never in browser)
    │  POST https://api.anthropic.com/v1/messages
    ▼
Anthropic Claude API
```

- **GitHub Pages** — hosts the static React frontend (free)
- **Vercel** — hosts the `/api/claude` proxy function (free hobby tier)
- **GitHub Actions** — auto-builds and deploys on every push to `main`

---

## Deployment — Step by Step

### Prerequisites
- A GitHub account
- A Vercel account (free at vercel.com — sign in with GitHub)
- An Anthropic API key (console.anthropic.com)

---

### Step 1 — Push to GitHub

```bash
# In this project folder:
git init
git add .
git commit -m "Initial commit — SDG Goal Mapper v5"

# Create a new repo on github.com, then:
git remote add origin https://github.com/YOUR_USERNAME/sdg-mapper.git
git push -u origin main
```

---

### Step 2 — Deploy the API proxy to Vercel

The Vercel function is what keeps your API key secret.

1. Go to [vercel.com](https://vercel.com) → **Add New Project**
2. Import your `sdg-mapper` GitHub repo
3. Vercel will auto-detect the `api/` folder — no framework preset needed
4. **Before deploying**, go to **Environment Variables** and add:
   - Key: `ANTHROPIC_API_KEY`
   - Value: `sk-ant-...` (your key from console.anthropic.com)
5. Click **Deploy**
6. Note your Vercel URL: `https://sdg-mapper-xxx.vercel.app`

---

### Step 3 — Point the frontend at your Vercel proxy

Open `src/App.jsx` and find the `VERCEL_PROXY_URL` line near the top of `callClaude`:

The fetch call already uses a relative `/api/claude` path. For GitHub Pages to reach your Vercel function, you need to set the full URL:

Open `src/App.jsx`, find this line in `callClaude`:
```js
const res = await fetch("/api/claude", {
```

Replace it with your Vercel URL:
```js
const res = await fetch("https://sdg-mapper-xxx.vercel.app/api/claude", {
```

Then commit and push:
```bash
git add src/App.jsx
git commit -m "Point frontend at Vercel proxy"
git push
```

GitHub Actions will automatically rebuild and redeploy to Pages.

---

### Step 4 — Enable GitHub Pages

1. Go to your repo on GitHub → **Settings** → **Pages**
2. Under **Source**, select **Deploy from a branch**
3. Branch: `gh-pages` / Folder: `/ (root)`
4. Click **Save**

After ~1 minute, your app will be live at:
`https://YOUR_USERNAME.github.io/sdg-mapper/`

---

### Step 5 — Verify it works

1. Open your GitHub Pages URL
2. Enter "Google" and click Analyze
3. Confirm a URL → goals should extract
4. Click Analyze on a goal → SDG analysis should run

If goals extract but analysis fails, check:
- Vercel function logs (Vercel dashboard → your project → Logs)
- That `ANTHROPIC_API_KEY` is set in Vercel environment variables
- That the fetch URL in `App.jsx` points to your actual Vercel URL

---

## Local Development

```bash
npm install

# Terminal 1 — Vercel dev server (runs the /api/claude function locally)
npx vercel dev --listen 3001

# Terminal 2 — Vite dev server (proxies /api → localhost:3001)
npm run dev
```

App runs at `http://localhost:5173`.

You'll need a `.env` file (never commit this):
```
ANTHROPIC_API_KEY=sk-ant-your-key-here
```

---

## Cost Estimate

Each full analysis (extraction + one goal analyzed) uses approximately:
- ~2,000 tokens for goal extraction (with web search)
- ~3,000–5,000 tokens for SDG analysis

At Claude Sonnet pricing (~$3/million input tokens, ~$15/million output tokens), a full session costs roughly **$0.02–0.05**. Monitor usage at console.anthropic.com.

---

## Project Structure

```
sdg-mapper/
├── src/
│   ├── App.jsx          # Main React app (all UI + logic)
│   └── main.jsx         # React entry point
├── api/
│   └── claude.js        # Vercel serverless proxy (hides API key)
├── public/
│   └── favicon.svg
├── .github/
│   └── workflows/
│       └── deploy.yml   # Auto-build + deploy to GitHub Pages
├── index.html
├── vite.config.js
├── vercel.json
└── package.json
```
