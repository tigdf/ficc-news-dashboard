# FICC News Dashboard

AI-powered market intelligence agent. Scans Bloomberg, Financial Times, and Wall Street Journal twice daily and delivers structured analysis across equity, fixed income, FX, and commodities markets.

## How it works
```
Scheduler (cron, 6am + 6pm)
    → Scraper/Search Agent (Claude API + web_search tool)
    → Analysis Agent (Claude API: summarise, classify, score impact)
    → Output Router → Dashboard (React/HTML) AND/OR Email (Gmail MCP)
```

## Architecture

```
GitHub Actions (6am / 6pm AEST)
  → searchAgent.js    — Claude web_search: finds 10 market-moving articles
  → analysisAgent.js  — Claude: classifies, scores impact, extracts instruments
  → opportunityAgent.js — Claude: generates 3-5 investment opportunities
  → digestWriter.js   — writes data/digests/latest.json
  → prepare-dashboard.js — copies to dashboard/public/
  → git commit + push → Vercel redeploy (auto)
```

## Setup

### 1. Install dependencies

```bash
# Agent (root)
npm install

# Dashboard
cd dashboard && npm install && cd ..
```

### 2. Configure environment

```bash
cp .env.example .env
# Edit .env and add your ANTHROPIC_API_KEY
```

### 3. Run the agent manually (first test)

```bash
node src/index.js
```

This will fetch live news, analyse it, and write `data/digests/latest.json`.

### 4. Preview the dashboard locally

```bash
node scripts/prepare-dashboard.js   # copies digest to dashboard/public/
cd dashboard && npm run dev
# Open http://localhost:5173
```

### 5. Deploy dashboard to Vercel

```bash
npm i -g vercel
vercel --prod
```

Vercel reads `vercel.json` and builds from the `dashboard/` subfolder automatically.

### 6. Set up GitHub Actions

In your GitHub repo settings:
- Go to **Settings → Secrets and variables → Actions**
- Add a secret: `ANTHROPIC_API_KEY` = your Anthropic API key

The workflow (`.github/workflows/agent.yml`) will run automatically at 6am and 6pm AEST, commit the new digest, and trigger a Vercel redeploy.

## Project Structure

```
ficc-news-dashboard/
├── src/
│   ├── agents/
│   │   ├── searchAgent.js       # Fetches news via Claude web_search
│   │   ├── analysisAgent.js     # Classifies + scores each article
│   │   └── opportunityAgent.js  # Generates investment opportunities
│   ├── output/
│   │   └── digestWriter.js      # Writes JSON digest files
│   ├── config/
│   │   └── topics.js            # Asset classes, sources, keywords
│   ├── scheduler.js             # Optional local cron (alt to GitHub Actions)
│   └── index.js                 # Main pipeline entry point
├── dashboard/                   # React + Vite frontend
│   ├── src/
│   │   ├── App.jsx
│   │   └── components/
│   │       ├── Header.jsx
│   │       ├── StatsBar.jsx
│   │       ├── FilterBar.jsx
│   │       ├── NewsFeed.jsx
│   │       ├── NewsCard.jsx
│   │       └── Sidebar.jsx
│   └── public/
│       └── latest.json          # Served as static asset
├── data/digests/                # Historical digest JSON files
├── scripts/
│   └── prepare-dashboard.js    # Copies latest.json → dashboard/public/
├── .github/workflows/
│   └── agent.yml               # Scheduled GitHub Actions workflow
├── vercel.json                  # Vercel build config
└── .env.example
```

## Customisation

- **Add your holdings**: Edit `src/config/topics.js` to add a `HOLDINGS` array. Pass it into the analysis prompt in `analysisAgent.js` to get personalised impact assessments.
- **Change schedule**: Edit the cron expressions in `.github/workflows/agent.yml`.
- **Add more sources**: Add to the `SOURCES` array in `src/config/topics.js`.
- **Email digest**: The Gmail MCP integration can be added to `src/output/emailRenderer.js` (coming next).
