function ResultsPanel({ type, title, algorithmName, description, results, query, linkStats, onEdit, onDelete }) {
  const isOld = type === 'old';
  const accentColor = isOld ? 'red' : 'green';

  return (
    <div className={`results-panel panel-${accentColor}`}>
      <div className="panel-header">
        <div className={`panel-badge badge-${accentColor}`}>
          {isOld ? '📊' : '🔗'}
        </div>
        <div className="panel-header-text">
          <h2 className="panel-title">
            {title} <span className={`algo-label label-${accentColor}`}>– {algorithmName}</span>
          </h2>
          <p className="panel-description">{description}</p>
        </div>
      </div>

      <div className="panel-results">
        {!query ? (
          <div className="empty-state">
            <div className="empty-icon">🔍</div>
            <p className="empty-text">Enter a keyword to see rankings</p>
          </div>
        ) : results.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📭</div>
            <p className="empty-text">No pages match "<strong>{query}</strong>"</p>
            <p className="empty-hint">Try a different keyword or add new pages</p>
          </div>
        ) : (
          <div className="results-list">
            {results.map((result, index) => {
              const isTop = index === 0;
              const stats = linkStats[result.id] || { incoming: 0, outgoing: 0 };
              return (
                <div
                  key={result.id}
                  className={`result-card ${isTop ? `top-result top-${accentColor}` : ''}`}
                >
                  <div className="result-rank">
                    <span className={`rank-number rank-${accentColor}`}>#{index + 1}</span>
                    {isTop && <span className={`crown crown-${accentColor}`}>👑</span>}
                  </div>
                  <div className="result-body">
                    <div className="result-url">{result.url}</div>
                    <div className="result-content">{result.content}</div>
                    <div className="result-meta">
                      <span className={`result-score score-${accentColor}`}>
                        {isOld
                          ? `Keyword Count: ${result.frequency}`
                          : `PageRank: ${result.pageRankScore.toFixed(4)}`}
                      </span>
                      <span className="link-stats">
                        <span title="Incoming links">⬅ {stats.incoming}</span>
                        <span title="Outgoing links">➡ {stats.outgoing}</span>
                      </span>
                    </div>
                  </div>
                  <div className="result-actions">
                    <button
                      className="action-btn edit-btn"
                      onClick={() => onEdit(result)}
                      title="Edit page"
                    >
                      ✏️
                    </button>
                    <button
                      className="action-btn delete-btn"
                      onClick={() => onDelete(result.id)}
                      title="Delete page"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default ResultsPanel;

