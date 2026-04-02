// src/agents/analysisAgent.js
// Takes raw articles from searchAgent and enriches each one with:
// - Asset class classification
// - Impact level (high / medium / low)
// - Qualitative and quantitative impact assessment
// - Region tags
// - Affected instruments / positions

import Anthropic from '@anthropic-ai/sdk';
import { ASSET_CLASSES, REGIONS } from '../config/topics.js';

const client = new Anthropic();

const ANALYSIS_SYSTEM_PROMPT = `You are a senior buy-side analyst at a macro hedge fund. 
You have deep expertise across equities, fixed income, FX, and commodities.

For each news article provided, return a structured JSON analysis. 
Return ONLY a JSON object. No preamble, no markdown fences.

The JSON must have exactly these fields:
{
  "headline": "Concise, informative headline max 15 words — lead with asset class and key affected instrument",
  "source": "original source name",
  "url": "original url or null",
  "publishedAt": "original publishedAt value",
  "assetClass": "one of: ${ASSET_CLASSES.join(' | ')}",
  "summary": "3-4 sentence plain-English summary of the news and why it matters to markets",
  "qualitativeImpact": "2-3 sentences describing directional effects on prices, sentiment, flows, positioning",
  "quantitativeImpact": "Specific numbers where available: price moves, basis points, % changes, consensus vs actual. Use 'N/A' if not applicable.",
  "impactLevel": "high | medium | low",
  "regions": ["array", "from", "${REGIONS.join(' | ')}"],
  "affectedInstruments": ["array of specific tickers, contracts or instruments e.g. SPY, US10Y, AUD/USD, BRN"],
  "investmentAngle": "1-2 sentences on the most actionable takeaway for a portfolio manager"
}

Impact level guidance:
- high: Rate decisions, major data surprises, geopolitical shocks, earnings that move indices
- medium: Secondary data, sector-specific moves, analyst upgrades/downgrades with macro relevance  
- low: Confirmatory data, minor corporate news, low-market-impact commentary`;

export async function analyseArticle(article) {
  const response = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1024,
    system: ANALYSIS_SYSTEM_PROMPT,
    messages: [
      {
        role: 'user',
        content: `Analyse this article and return the structured JSON:

Headline: ${article.headline}
Source: ${article.source}
URL: ${article.url || 'N/A'}
Published: ${article.publishedAt}
Summary: ${article.rawSummary}`,
      },
    ],
  });

  const raw = response.content
    .filter((b) => b.type === 'text')
    .map((b) => b.text)
    .join('');

  const cleaned = raw.replace(/```json|```/g, '').trim();

  try {
    return JSON.parse(cleaned);
  } catch {
    console.error(`❌ Failed to parse analysis for: ${article.headline}`);
    // Return a degraded but usable object rather than crashing the whole run
    return {
      ...article,
      assetClass: 'Equity',
      summary: article.rawSummary,
      qualitativeImpact: 'Analysis unavailable',
      quantitativeImpact: 'N/A',
      impactLevel: 'low',
      regions: ['Global'],
      affectedInstruments: [],
      investmentAngle: 'N/A',
    };
  }
}

export async function analyseAllArticles(articles) {
  console.log(`📊 Analysis agent: analysing ${articles.length} articles...`);

  // Process sequentially to avoid rate limits
  const results = [];
  for (let i = 0; i < articles.length; i++) {
    console.log(`  Analysing ${i + 1}/${articles.length}: ${articles[i].headline.slice(0, 60)}...`);
    const analysed = await analyseArticle(articles[i]);
    results.push(analysed);
    // Small delay between calls to be respectful of rate limits
    if (i < articles.length - 1) {
      await new Promise((r) => setTimeout(r, 500));
    }
  }

  console.log(`✅ Analysis agent: complete`);
  return results;
}
