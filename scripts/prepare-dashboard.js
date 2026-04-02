#!/usr/bin/env node
// scripts/prepare-dashboard.js
// Copies data/digests/latest.json → dashboard/public/latest.json
// so Vite bundles it as a static asset for Vercel.
// Run automatically as part of the GitHub Actions workflow before build.

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const src = path.resolve(__dirname, '../data/digests/latest.json');
const destDir = path.resolve(__dirname, '../dashboard/public');
const dest = path.join(destDir, 'latest.json');

if (!fs.existsSync(src)) {
  console.warn('⚠️  No latest.json found — dashboard will show "digest not found" until first agent run.');
  // Write a placeholder so the build succeeds
  const placeholder = {
    meta: { generatedAt: new Date().toISOString(), runLabel: 'N/A', articlesAnalysed: 0, opportunitiesFound: 0, stats: { high: 0, medium: 0, low: 0, total: 0, byAssetClass: {} } },
    articles: [],
    opportunities: [],
  };
  if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });
  fs.writeFileSync(dest, JSON.stringify(placeholder, null, 2));
  console.log('📋 Placeholder latest.json written to dashboard/public/');
} else {
  if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });
  fs.copyFileSync(src, dest);
  console.log('✅ latest.json copied to dashboard/public/');
}
