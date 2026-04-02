// src/output/digestWriter.js
// Writes the completed digest to data/digests/ as a dated JSON file.
// Also writes a "latest.json" symlink so the dashboard always reads
// the most recent run without needing to know the filename.

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIGESTS_DIR = path.resolve(__dirname, '../../data/digests');

export function writeDigest(articles, opportunities) {
  // Ensure output directory exists
  if (!fs.existsSync(DIGESTS_DIR)) {
    fs.mkdirSync(DIGESTS_DIR, { recursive: true });
  }

  const now = new Date();
  const runLabel = now.getHours() < 12 ? 'AM' : 'PM';

  // Stats summary
  const stats = {
    total: articles.length,
    high: articles.filter((a) => a.impactLevel === 'high').length,
    medium: articles.filter((a) => a.impactLevel === 'medium').length,
    low: articles.filter((a) => a.impactLevel === 'low').length,
    byAssetClass: {
      Equity: articles.filter((a) => a.assetClass === 'Equity').length,
      'Fixed Income': articles.filter((a) => a.assetClass === 'Fixed Income').length,
      Currency: articles.filter((a) => a.assetClass === 'Currency').length,
      Commodities: articles.filter((a) => a.assetClass === 'Commodities').length,
    },
  };

  const digest = {
    meta: {
      generatedAt: now.toISOString(),
      runLabel,          // 'AM' or 'PM'
      nextRun: null,     // filled in by scheduler
      articlesAnalysed: articles.length,
      opportunitiesFound: opportunities.length,
      stats,
    },
    articles,
    opportunities,
  };

  // Write dated file e.g. 2026-03-25-AM.json
  const dateStr = now.toISOString().split('T')[0];
  const filename = `${dateStr}-${runLabel}.json`;
  const filepath = path.join(DIGESTS_DIR, filename);
  fs.writeFileSync(filepath, JSON.stringify(digest, null, 2));
  console.log(`💾 Digest written: ${filepath}`);

  // Always overwrite latest.json — dashboard reads this
  const latestPath = path.join(DIGESTS_DIR, 'latest.json');
  fs.writeFileSync(latestPath, JSON.stringify(digest, null, 2));
  console.log(`💾 latest.json updated`);

  return digest;
}
