import { useState, useEffect } from 'react';
import Header from './components/Header.jsx';
import StatsBar from './components/StatsBar.jsx';
import FilterBar from './components/FilterBar.jsx';
import NewsFeed from './components/NewsFeed.jsx';
import Sidebar from './components/Sidebar.jsx';

// In production (Vercel), latest.json is copied to dashboard/public/ by the build step.
// In dev, Vite serves it from the filesystem via the alias below.
const DIGEST_URL = '/latest.json';

export default function App() {
  const [digest, setDigest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters
  const [assetFilter, setAssetFilter] = useState('all');
  const [impactFilter, setImpactFilter] = useState(null);
  const [regionFilter, setRegionFilter] = useState(null);

  useEffect(() => {
    fetch(DIGEST_URL)
      .then((r) => {
        if (!r.ok) throw new Error(`HTTP ${r.status}`);
        return r.json();
      })
      .then((data) => {
        setDigest(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // Apply filters to articles
  const filteredArticles = digest?.articles?.filter((a) => {
    const assetMatch =
      assetFilter === 'all' ||
      (assetFilter === 'equity' && a.assetClass === 'Equity') ||
      (assetFilter === 'fi' && a.assetClass === 'Fixed Income') ||
      (assetFilter === 'fx' && a.assetClass === 'Currency') ||
      (assetFilter === 'commod' && a.assetClass === 'Commodities');

    const impactMatch = !impactFilter || a.impactLevel === impactFilter;

    const regionMatch =
      !regionFilter ||
      (a.regions || []).some((r) => r.toLowerCase().includes(regionFilter.toLowerCase()));

    return assetMatch && impactMatch && regionMatch;
  }) ?? [];

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', color: 'var(--muted)', fontFamily: 'IBM Plex Mono', fontSize: '0.75rem', letterSpacing: '0.1em' }}>
        LOADING DIGEST...
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', color: 'var(--muted)', fontFamily: 'IBM Plex Mono', fontSize: '0.75rem', gap: '12px' }}>
        <div style={{ color: 'var(--high)' }}>⚠ DIGEST NOT FOUND</div>
        <div>Run <code style={{ color: 'var(--accent)' }}>node src/index.js</code> to generate your first digest</div>
        <div style={{ fontSize: '0.65rem', marginTop: '8px' }}>({error})</div>
      </div>
    );
  }

  return (
    <div>
      <Header meta={digest.meta} />
      <StatsBar stats={digest.meta.stats} />

      <div style={{ padding: '10px 40px', borderBottom: '1px solid var(--border)', background: 'var(--bg)', fontFamily: 'IBM Plex Mono', fontSize: '0.62rem', color: 'var(--muted)', display: 'flex', gap: '12px', alignItems: 'center' }}>
        <span style={{ padding: '2px 8px', background: 'rgba(201,168,76,0.1)', color: 'var(--accent)', border: '1px solid rgba(201,168,76,0.2)', borderRadius: '2px', fontSize: '0.58rem' }}>
          {digest.meta.runLabel} RUN
        </span>
        <span>Last scanned: {new Date(digest.meta.generatedAt).toLocaleString('en-AU', { timeZone: 'Australia/Melbourne' })} AEST</span>
        <span>·</span>
        <span>{digest.meta.articlesAnalysed} articles analysed</span>
      </div>

      <FilterBar
        assetFilter={assetFilter} setAssetFilter={setAssetFilter}
        impactFilter={impactFilter} setImpactFilter={setImpactFilter}
        regionFilter={regionFilter} setRegionFilter={setRegionFilter}
      />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', minHeight: 'calc(100vh - 180px)' }}>
        <NewsFeed articles={filteredArticles} />
        <Sidebar opportunities={digest.opportunities} stats={digest.meta.stats} />
      </div>
    </div>
  );
}
