// src/index.js
// Main entry point. Runs the full pipeline:
//   1. Search agent fetches market news
//   2. Analysis agent enriches each article
//   3. Opportunity agent synthesises opportunities
//   4. Digest writer saves output for the dashboard
//
// Can be run directly: node src/index.js
// Or on a schedule via node-cron (see scheduler.js)

import 'dotenv/config';
import { fetchMarketNews } from './agents/searchAgent.js';
import { analyseAllArticles } from './agents/analysisAgent.js';
import { generateOpportunities } from './agents/opportunityAgent.js';
import { writeDigest } from './output/digestWriter.js';

async function runPipeline() {
  const startTime = Date.now();
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log(`🚀 Market Intelligence Pipeline starting...`);
  console.log(`   ${new Date().toLocaleString('en-AU', { timeZone: 'Australia/Melbourne' })} AEST`);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  if (!process.env.ANTHROPIC_API_KEY) {
    throw new Error('ANTHROPIC_API_KEY is not set. Copy .env.example to .env and add your key.');
  }

  try {
    // Step 1: Fetch news
    const rawArticles = await fetchMarketNews();

    if (!rawArticles.length) {
      console.warn('⚠️  No articles found. Skipping this run.');
      return;
    }

    // Step 2: Analyse each article
    const analysedArticles = await analyseAllArticles(rawArticles);

    // Step 3: Generate opportunities from the full batch
    const opportunities = await generateOpportunities(analysedArticles);

    // Step 4: Write output
    const digest = writeDigest(analysedArticles, opportunities);

    const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`✅ Pipeline complete in ${elapsed}s`);
    console.log(`   ${digest.meta.articlesAnalysed} articles · ${digest.meta.opportunitiesFound} opportunities`);
    console.log(`   High: ${digest.meta.stats.high} · Medium: ${digest.meta.stats.medium} · Low: ${digest.meta.stats.low}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  } catch (err) {
    console.error('\n❌ Pipeline failed:', err.message);
    console.error(err.stack);
    process.exit(1);
  }
}

runPipeline();
