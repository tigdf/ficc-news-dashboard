// src/scheduler.js
// Optional: runs the pipeline on a local schedule using node-cron.
// Use this if running the agent on a local machine or VPS.
// For GitHub Actions deployment, the schedule is defined in .github/workflows/agent.yml instead.
//
// Run with: node src/scheduler.js

import 'dotenv/config';
import cron from 'node-cron';
import { fetchMarketNews } from './agents/searchAgent.js';
import { analyseAllArticles } from './agents/analysisAgent.js';
import { generateOpportunities } from './agents/opportunityAgent.js';
import { writeDigest } from './output/digestWriter.js';

async function runPipeline() {
  try {
    const rawArticles = await fetchMarketNews();
    if (!rawArticles.length) return;
    const analysedArticles = await analyseAllArticles(rawArticles);
    const opportunities = await generateOpportunities(analysedArticles);
    writeDigest(analysedArticles, opportunities);
  } catch (err) {
    console.error('❌ Scheduled run failed:', err.message);
  }
}

// 6:00 AM AEST = 20:00 UTC (previous day)
// 6:00 PM AEST = 08:00 UTC
// Cron format: minute hour * * *
cron.schedule('0 20 * * *', () => {
  console.log('⏰ Scheduled AM run triggered (6:00 AM AEST)');
  runPipeline();
});

cron.schedule('0 8 * * *', () => {
  console.log('⏰ Scheduled PM run triggered (6:00 PM AEST)');
  runPipeline();
});

console.log('⏰ Scheduler started. Runs at 6:00 AM and 6:00 PM AEST.');
console.log('   Press Ctrl+C to stop.\n');
