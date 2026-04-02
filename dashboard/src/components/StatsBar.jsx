export default function StatsBar({ stats }) {
  const cells = [
    { dot: 'var(--high)', num: stats.high, label: 'High Impact' },
    { dot: 'var(--med)', num: stats.medium, label: 'Medium Impact' },
    { dot: 'var(--equity)', num: stats.byAssetClass?.Equity ?? 0, label: 'Equity' },
    { dot: 'var(--fi)', num: stats.byAssetClass?.['Fixed Income'] ?? 0, label: 'Fixed Income' },
    { dot: 'var(--fx)', num: stats.byAssetClass?.Currency ?? 0, label: 'Currency' },
    { dot: 'var(--commod)', num: stats.byAssetClass?.Commodities ?? 0, label: 'Commodities' },
  ];

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(6, 1fr)',
      borderBottom: '1px solid var(--border)',
      background: 'var(--surface)',
    }}>
      {cells.map((c, i) => (
        <div key={i} style={{
          padding: '14px 24px',
          borderRight: i < cells.length - 1 ? '1px solid var(--border)' : 'none',
          display: 'flex',
          alignItems: 'center',
          gap: 10,
        }}>
          <div style={{ width: 10, height: 10, borderRadius: '50%', background: c.dot, flexShrink: 0 }} />
          <div>
            <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '1.4rem', fontWeight: 500, color: 'var(--text)', lineHeight: 1 }}>{c.num}</div>
            <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.58rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)', marginTop: 3 }}>{c.label}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
