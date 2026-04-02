// src/agents/opportunityAgent.js
// Synthesises the full batch of analysed articles and identifies
// 3-5 specific, actionable investment opportunities.

import Anthropic from '@anthropic-ai/sdk';
import { TARGET_OPPORTUNITY_COUNT } from '../config/topics.js';

const client = new Anthropic();

const OPPORTUNITY_SYSTEM_PROMPT = `You are the CIO of a macro hedge fund reviewing the morning news flow.
Based on the articles provided, identify ${TARGET_OPPORTUNITY_COUNT} specific investment opportunities.

Each opportunity should be cross-asset aware — consider how macro themes create opportunities 
across equities, fixed income, FX, and commodities simultaneously.

Return ONLY a JSON array. No preamble, no markdown fences. Each item:
{
  "thesis": "Punchy 8-12 word thesis statement",
  "assetClass": "Equity | Fixed Income | Currency | Commodities",
  "detail": "3-4 sentences: the trade rationale, what news flow supports it, and key risks",
  "instruments": ["specific tickers or instruments"],
  "timeframe": "e.g. 1-2 weeks | 1-3 months | 3-6 months",
  "riskLevel": "Low | Moderate | High",
  "conviction": "High | Medium | Low",
  "drivenBy": ["array of 1-3 headline strings that support this opportunity"]
}

Be specific — name instruments, not just sectors. 
Flag the key risk that would invalidate the thesis.
Prioritise opportunities with multiple confirming news items over single-catalyst trades.`;

export async function generateOpportunities(analysedArticles) {
  console.log('💡 Opportunity agent: generating investment opportunities...');

  // Summarise the articles for the opportunity prompt
  const articleSummaries = analysedArticles
    .map(
      (a, i) =>
        `[${i + 1}] ${a.headline} (${a.assetClass}, ${a.impactLevel} impact, ${a.regions.join('/')})\n` +
        `Summary: ${a.summary}\n` +
        `Investment angle: ${a.investmentAngle}`
    )
    .join('\n\n');

  const response = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 2048,
    system: OPPORTUNITY_SYSTEM_PROMPT,
    messages: [
      {
        role: 'user',
        content: `Here are today's market news items. Identify ${TARGET_OPPORTUNITY_COUNT} investment opportunities:\n\n${articleSummaries}`,
      },
    ],
  });

  const raw = response.content
    .filter((b) => b.type === 'text')
    .map((b) => b.text)
    .join('');

  const cleaned = raw.replace(/```json|```/g, '').trim();

  try {
    const opportunities = JSON.parse(cleaned);
    console.log(`✅ Opportunity agent: generated ${opportunities.length} opportunities`);
    return opportunities;
  } catch {
    console.error('❌ Failed to parse opportunities output');
    return [];
  }
}
