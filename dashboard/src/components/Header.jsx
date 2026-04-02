export default function Header({ meta }) {
  return (
    <div style={{
      borderBottom: '1px solid var(--border)',
      padding: '20px 40px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      position: 'sticky',
      top: 0,
      background: 'rgba(10,12,15,0.97)',
      backdropFilter: 'blur(12px)',
      zIndex: 100,
    }}>
      <div style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.3rem', fontWeight: 600, letterSpacing: '0.02em', color: 'var(--accent)' }}>
        Market<span style={{ color: 'var(--text)' }}>Intel</span>
      </div>
      <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.7rem', color: 'var(--muted)', textAlign: 'right', lineHeight: 1.8 }}>
        <div>
          <span style={{ display: 'inline-block', width: 6, height: 6, borderRadius: '50%', background: 'var(--low)', marginRight: 6, animation: 'pulse 2s infinite' }} />
          {meta.runLabel} DIGEST — {new Date(meta.generatedAt).toLocaleDateString('en-AU', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase()}
        </div>
        <div>Bloomberg · FT · WSJ &nbsp;·&nbsp; {meta.articlesAnalysed} items processed</div>
      </div>
    </div>
  );
}
