const ASSET_COLORS = {
  Equity:        { border: 'var(--equity)', badge: 'rgba(124,110,247,0.15)', text: 'var(--equity)' },
  'Fixed Income':{ border: 'var(--fi)',     badge: 'rgba(76,139,201,0.15)',  text: 'var(--fi)' },
  Currency:      { border: 'var(--fx)',     badge: 'rgba(82,168,118,0.15)',  text: 'var(--fx)' },
  Commodities:   { border: 'var(--commod)', badge: 'rgba(201,168,76,0.15)', text: 'var(--commod)' },
};

const IMPACT_COLORS = {
  high:   { badge: 'rgba(224,82,82,0.12)',   text: 'var(--high)' },
  medium: { badge: 'rgba(224,156,82,0.12)',  text: 'var(--med)' },
  low:    { badge: 'rgba(82,168,118,0.12)',  text: 'var(--low)' },
};

export default function NewsCard({ article, index }) {
  const ac = ASSET_COLORS[article.assetClass] || ASSET_COLORS['Equity'];
  const ic = IMPACT_COLORS[article.impactLevel] || IMPACT_COLORS['low'];

  return (
    <div style={{
      background: 'var(--surface)',
      border: '1px solid var(--border)',
      borderLeft: `3px solid ${ac.border}`,
      padding: '20px 24px',
      marginBottom: 12,
      animation: 'fadeUp 0.4s ease forwards',
      animationDelay: `${index * 0.05}s`,
      opacity: 0,
      transition: 'background 0.2s, transform 0.2s',
    }}
    onMouseEnter={e => e.currentTarget.style.background = 'var(--surface2)'}
    onMouseLeave={e => e.currentTarget.style.background = 'var(--surface)'}
    >
      {/* Meta row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10, flexWrap: 'wrap' }}>
        <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.6rem', letterSpacing: '0.1em', textTransform: 'uppercase', padding: '3px 8px', borderRadius: 2, background: ac.badge, color: ac.text, fontWeight: 500 }}>
          {article.assetClass}
        </span>
        <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.6rem', letterSpacing: '0.1em', textTransform: 'uppercase', padding: '3px 8px', borderRadius: 2, background: ic.badge, color: ic.text, fontWeight: 500 }}>
          ● {article.impactLevel} impact
        </span>
        {(article.regions || []).map((r) => (
          <span key={r} style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.58rem', color: 'var(--muted)', padding: '2px 6px', border: '1px solid var(--border)', borderRadius: 2 }}>
            {r}
          </span>
        ))}
        <span style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.6rem', color: 'var(--muted)', marginLeft: 'auto' }}>
          {article.source} · {article.publishedAt}
        </span>
      </div>

      {/* Headline */}
      <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '1rem', fontWeight: 600, lineHeight: 1.4, marginBottom: 8, color: 'var(--text)' }}>
        {article.url
          ? <a href={article.url} target="_blank" rel="noreferrer" style={{ color: 'inherit', textDecoration: 'none' }}>{article.headline}</a>
          : article.headline
        }
      </div>

      {/* Summary */}
      <div style={{ fontSize: '0.82rem', color: '#9ba3af', lineHeight: 1.6, marginBottom: 12 }}>
        {article.summary}
      </div>

      {/* Impact grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, padding: 12, background: 'rgba(255,255,255,0.02)', border: '1px solid var(--border)', borderRadius: 2, marginBottom: 10 }}>
        <div>
          <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.58rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 4 }}>Qualitative Impact</div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text)', lineHeight: 1.5 }}>{article.qualitativeImpact}</div>
        </div>
        <div>
          <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.58rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 4 }}>Quantitative Impact</div>
          <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.75rem', color: 'var(--text)', lineHeight: 1.5 }}>{article.quantitativeImpact}</div>
        </div>
      </div>

      {/* Instruments */}
      {article.affectedInstruments?.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {article.affectedInstruments.map((inst) => (
            <span key={inst} style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.62rem', padding: '3px 8px', border: '1px solid var(--border)', color: 'var(--muted)', borderRadius: 2 }}>
              {inst}
            </span>
          ))}
        </div>
      )}

      {/* Investment angle */}
      {article.investmentAngle && article.investmentAngle !== 'N/A' && (
        <div style={{ marginTop: 10, paddingTop: 10, borderTop: '1px solid var(--border)', fontSize: '0.78rem', color: 'var(--accent)', fontStyle: 'italic', lineHeight: 1.5 }}>
          💡 {article.investmentAngle}
        </div>
      )}
    </div>
  );
}
