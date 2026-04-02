import NewsCard from './NewsCard.jsx';

export default function NewsFeed({ articles }) {
  return (
    <div style={{ padding: '32px 40px', borderRight: '1px solid var(--border)' }}>
      <div style={{
        fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.65rem', letterSpacing: '0.15em',
        textTransform: 'uppercase', color: 'var(--muted)', marginBottom: 20,
        display: 'flex', alignItems: 'center', gap: 12,
      }}>
        News Analysis
        <div style={{ flex: 1, height: 1, background: 'var(--border)' }} />
        <span>{articles.length} items</span>
      </div>

      {articles.length === 0 ? (
        <div style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: '0.72rem', color: 'var(--muted)', padding: '40px 0', textAlign: 'center' }}>
          No articles match the current filters
        </div>
      ) : (
        articles.map((article, i) => (
          <NewsCard key={i} article={article} index={i} />
        ))
      )}
    </div>
  );
}
