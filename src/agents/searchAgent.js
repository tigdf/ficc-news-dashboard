// src/agents/searchAgent.js
// Uses Claude's web_search tool to find recent market-relevant news
// across Bloomberg, FT, and WSJ without needing paid API access.

import Anthropic from '@anthropic-ai/sdk';
import { SOURCES, SEARCH_KEYWORDS, TARGET_ARTICLE_COUNT } from '../config/topics.js';

const client = new Anthropic();

const SEARCH_SYSTEM_PROMPT = `You are a senior financial news researcher. Your job is to find the most 
market-moving news published in the last 12 hours from Bloomberg, Financial Times, and Wall Street Journal.

Focus exclusively on news relevant to:
- Equity markets (indices, individual stocks, earnings, M&A)
- Fixed income (rates decisions, bond yields, credit spreads, central bank commentary)
- Currency / FX markets (major pairs, central bank intervention, rate differentials)
- Commodities (oil, gold, metals, energy, agricultural)

Return ONLY a JSON array. No preamble, no markdown fences. Each item must have exactly these fields:
{
  "headline": "string",
  "source": "Bloomberg | Financial Times | Wall Street Journal",
  "url": "string or null",
  "publishedAt": "approximate time e.g. 2 hours ago or HH:MM UTC",
  "rawSummary": "2-3 sentence factual summary of the article content"
}

Return ${TARGET_ARTICLE_COUNT} items. Prioritise high-impact, market-moving stories. 
If fewer than ${TARGET_ARTICLE_COUNT} relevant stories exist, return what you find.`;

export async function fetchMarketNews() {
  console.log('🔍 Search agent: fetching market news...');

  const searchQuery = `Latest market news from Bloomberg Financial Times Wall Street Journal: 
    ${SEARCH_KEYWORDS.slice(0, 12).join(', ')}. Published in last 12 hours.`;

  const response = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 4096,
    system: SEARCH_SYSTEM_PROMPT,
    tools: [
      {
        type: 'web_search_20250305',
        name: 'web_search',
      },
    ],
    messages: [
      {
        role: 'user',
        content: `Search for the most important market-moving financial news from the last 12 hours. 
        Focus on: ${SEARCH_KEYWORDS.join(', ')}.
        Sources to prioritise: ${SOURCES.join(', ')}.
        Return exactly the JSON array specified in your instructions.`,
      },
    ],
  });

  // Extract the final text response (after tool use)
  const textBlocks = response.content.filter((b) => b.type === 'text');
  if (!textBlocks.length) {
    throw new Error('Search agent returned no text content');
  }

  const rawText = textBlocks.map((b) => b.text).join('');

  // Strip any accidental markdown fences
  const cleaned = rawText.replace(/```json|```/g, '').trim();

  try {
    const articles = JSON.parse(cleaned);
    console.log(`✅ Search agent: found ${articles.length} articles`);
    return articles;
  } catch (err) {
    console.error('❌ Failed to parse search agent output:', rawText.slice(0, 500));
    throw new Error('Search agent returned invalid JSON');
  }
}
