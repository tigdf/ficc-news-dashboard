const chipBase = {
  padding: '5px 12px',
  borderRadius: 2,
  fontFamily: 'IBM Plex Mono, monospace',
  fontSize: '0.65rem',
  letterSpacing: '0.08em',
  textTransform: 'uppercase',
  cursor: 'pointer',
  border: '1px solid var(--border)',
  background: 'var(--surface2)',
  color: 'var(--muted)',
  transition: 'all 0.15s',
};

const activeStyles = {
  all:    { borderColor: 'var(--accent)',  color: 'var(--accent)',  background: 'rgba(201,168,76,0.08)' },
  equity: { borderColor: 'var(--equity)', color: 'var(--equity)', background: 'rgba(124,110,247,0.08)' },
  fi:     { borderColor: 'var(--fi)',     color: 'var(--fi)',     background: 'rgba(76,139,201,0.08)' },
  fx:     { borderColor: 'var(--fx)',     color: 'var(--fx)',     background: 'rgba(82,168,118,0.08)' },
  commod: { borderColor: 'var(--commod)', color: 'var(--commod)', background: 'rgba(201,168,76,0.08)' },
  high:   { borderColor: 'var(--high)',   color: 'var(--high)',   background: 'rgba(224,82,82,0.08)' },
  medium: { borderColor: 'var(--med)',    color: 'var(--med)',    background: 'rgba(224,156,82,0.08)' },
  low:    { borderColor: 'var(--low)',    color: 'var(--low)',    background: 'rgba(82,168,118,0.08)' },
  US:     { borderColor: 'var(--accent)', color: 'var(--accent)', background: 'rgba(201,168,76,0.08)' },
  AUS:    { borderColor: 'var(--accent)', color: 'var(--accent)', background: 'rgba(201,168,76,0.08)' },
  Global: { borderColor: 'var(--accent)', color: 'var(--accent)', background: 'rgba(201,168,76,0.08)' },
};

function Chip({ label, id, isActive, onClick }) {
  return (
    <div
      onClick={onClick}
      style={{ ...chipBase, ...(isActive ? (activeStyles[id] || activeStyles.all) : {}) }}
    >
      {label}
    </div>
  );
}

function Sep() {
  return <div style={{ width: 1, height: 20, background: 'var(--border)' }} />;
}

export default function FilterBar({
  assetFilter, setAssetFilter,
  impactFilter, setImpactFilter,
  regionFilter, setRegionFilter,
}) {
  return (
    <div style={{
      padding: '14px 40px',
      display: 'flex',
      gap: 8,
      alignItems: 'center',
      borderBottom: '1px solid var(--border)',
      flexWrap: 'wrap',
      background: 'var(--surface)',
    }}>
      <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.62rem', color: 'var(--muted)', letterSpacing: '0.1em', textTransform: 'uppercase', marginRight: 2 }}>Asset</span>
      {[
        { label: 'All', id: 'all' },
        { label: 'Equity', id: 'equity' },
        { label: 'Fixed Income', id: 'fi' },
        { label: 'Currency', id: 'fx' },
        { label: 'Commodities', id: 'commod' },
      ].map((c) => (
        <Chip key={c.id} label={c.label} id={c.id} isActive={assetFilter === c.id}
          onClick={() => setAssetFilter(c.id)} />
      ))}

      <Sep />

      <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.62rem', color: 'var(--muted)', letterSpacing: '0.1em', textTransform: 'uppercase', marginRight: 2 }}>Impact</span>
      {['high', 'medium', 'low'].map((id) => (
        <Chip key={id} label={id} id={id} isActive={impactFilter === id}
          onClick={() => setImpactFilter(impactFilter === id ? null : id)} />
      ))}

      <Sep />

      <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.62rem', color: 'var(--muted)', letterSpacing: '0.1em', textTransform: 'uppercase', marginRight: 2 }}>Region</span>
      {['US', 'AUS', 'Global'].map((id) => (
        <Chip key={id} label={id} id={id} isActive={regionFilter === id}
          onClick={() => setRegionFilter(regionFilter === id ? null : id)} />
      ))}
    </div>
  );
}
