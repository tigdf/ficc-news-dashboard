// src/config/topics.js
// Central config for what the agent monitors and how it classifies news

export const SOURCES = [
  'Bloomberg',
  'Financial Times',
  'Wall Street Journal',
];

export const ASSET_CLASSES = [
  'Equity',
  'Fixed Income',
  'Currency',
  'Commodities',
];

export const REGIONS = [
  'US',
  'Europe',
  'Australia',
  'Asia',
  'Global',
  'Emerging Markets',
  'Middle East',
];

export const IMPACT_LEVELS = ['high', 'medium', 'low'];

// Keywords guide the search agent toward market-relevant articles
export const SEARCH_KEYWORDS = [
  // Macro
  'interest rates', 'inflation', 'GDP', 'central bank', 'monetary policy',
  'recession', 'economic growth', 'fiscal policy', 'trade tariffs',
  // Equity
  'earnings', 'S&P 500', 'ASX 200', 'stock market', 'equity markets',
  'IPO', 'buyback', 'dividend',
  // Fixed Income
  'yield curve', 'Treasury yields', 'bond market', 'credit spreads',
  'Federal Reserve', 'RBA', 'ECB', 'BoE', 'rate decision',
  // Currency
  'USD', 'AUD', 'EUR', 'JPY', 'FX', 'currency', 'dollar',
  // Commodities
  'oil', 'crude', 'gold', 'copper', 'iron ore', 'LNG', 'coal',
  'OPEC', 'commodity', 'energy prices',
];

// How many articles to aim for per run
export const TARGET_ARTICLE_COUNT = 10;

// How many investment opportunities to generate
export const TARGET_OPPORTUNITY_COUNT = 3;
