const ASSET_COLORS = {
  Equity:        { badge: 'rgba(124,110,247,0.15)', text: 'var(--equity)' },
  'Fixed Income':{ badge: 'rgba(76,139,201,0.15)',  text: 'var(--fi)' },
  Currency:      { badge: 'rgba(82,168,118,0.15)',  text: 'var(--fx)' },
  Commodities:   { badge: 'rgba(201,168,76,0.15)',  text: 'var(--commod)' },
};

const CONVICTION_COLORS = {
  High:   { badge: 'rgba(224,82,82,0.12)',  text: 'var(--high)' },
  Medium: { badge: 'rgba(224,156,82,0.12)', text: 'var(--med)' },
  Low:    { badge: 'rgba(82,168,118,0.12)', text: 'var(--low)' },
};

function SectionTitle({ children }) {
  return (
    <div style={{
      fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.65rem', letterSpacing: '0.15em',
      textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 16,
      display: 'flex', alignItems: 'center', gap: 12,
    }}>
      {children}
      <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
    </div>
  );
}

function OpportunityCard({ opp, index }) {
  const ac = ASSET_COLORS[opp.assetClass] || ASSET_COLORS['Equity'];
  const cc = CONVICTION_COLORS[opp.conviction] || CONVICTION_COLORS['Medium'];

  return (
    <div style={{
      background: 'var(--bg)', border: '1px solid var(--border)', padding: 16, marginBottom: 10,
      animation: 'fadeUp 0.5s ease forwards', animationDelay: `${index * 0.1}s`, opacity: 0,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
        <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.6rem', letterSpacing: '0.1em', textTransform: 'uppercase', padding: '3px 8px', borderRadius: 2, background: ac.badge, color: ac.text, fontWeight: 500 }}>
          {opp.assetClass}
        </span>
        <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.6rem', padding: '3px 8px', borderRadius: 2, background: cc.badge, color: cc.text }}>
          {opp.conviction} conv.
        </span>
      </div>

      <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '0.88rem', fontWeight: 600, lineHeight: 1.4, marginBottom: 8, color: 'var(--text)' }}>
        {opp.thesis}
      </div>

      <div style={{ fontSize: '0.76rem', color: '#9ba3af', lineHeight: 1.6, marginBottom: 10 }}>
        {opp.detail}
      </div>

      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {opp.instruments?.map((inst) => (
          <span key={inst} style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.58rem', padding: '2px 7px', borderRadius: 2, background: 'rgba(76,139,201,0.1)', color: 'var(--fi)', border: '1px solid rgba(76,139,201,0.2)' }}>
            {inst}
          </span>
        ))}
        {opp.timeframe && (
          <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.58rem', padding: '2px 7px', borderRadius: 2, background: 'rgba(201,168,76,0.1)', color: 'var(--accent)', border: '1px solid rgba(201,168,76,0.2)' }}>
            {opp.timeframe}
          </span>
        )}
        {opp.riskLevel && (
          <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.58rem', padding: '2px 7px', borderRadius: 2, background: 'rgba(224,82,82,0.1)', color: 'var(--high)', border: '1px solid rgba(224,82,82,0.2)' }}>
            {opp.riskLevel} risk
          </span>
        )}
      </div>
    </div>
  );
}

export default function Sidebar({ opportunities, stats }) {
  const coverageRows = [
    { label: 'Equity',       val: stats.byAssetClass?.Equity ?? 0,           color: 'var(--equity)' },
    { label: 'Fixed Income', val: stats.byAssetClass?.['Fixed Income'] ?? 0,  color: 'var(--fi)' },
    { label: 'Currency',     val: stats.byAssetClass?.Currency ?? 0,          color: 'var(--fx)' },
    { label: 'Commodities',  val: stats.byAssetClass?.Commodities ?? 0,       color: 'var(--commod)' },
  ];

  return (
    <div style={{ padding: '32px 28px', background: 'var(--surface)', borderLeft: '1px solid var(--border)' }}>
      <SectionTitle>Investment Opportunities</SectionTitle>

      {!opportunities?.length ? (
        <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.7rem', color: 'var(--muted)', padding: '20px 0' }}>
          No opportunities generated yet
        </div>
      ) : (
        opportunities.map((opp, i) => <OpportunityCard key={i} opp={opp} index={i} />)
      )}

      <div style={{ marginTop: 28 }}>
        <SectionTitle>Coverage</SectionTitle>
        <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.62rem', color: 'var(--muted)', lineHeight: 2.2, padding: 12, background: 'var(--bg)', border: '1px solid var(--border)' }}>
          {coverageRows.map((r) => (
            <div key={r.label} style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>{r.label}</span>
              <span style={{ color: r.color }}>{r.val} item{r.val !== 1 ? 's' : ''}</span>
            </div>
          ))}
          <div style={{ height: 1, background: 'var(--border)', margin: '8px 0' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>High impact</span><span style={{ color: 'var(--high)' }}>{stats.high}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Medium impact</span><span style={{ color: 'var(--med)' }}>{stats.medium}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span>Low impact</span><span style={{ color: 'var(--low)' }}>{stats.low}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
