function StatsBar({
  totalPages,
  iterations,
  dampingFactor,
  onAddPage,
  onResetDataset,
  onToggleGraph,
  showGraph,
}) {
  return (
    <div className="stats-bar">
      <div className="stats-items">
        <div className="stat-chip">
          <span className="stat-label">Indexed Pages</span>
          <span className="stat-value">{totalPages}</span>
        </div>
        <div className="stat-chip">
          <span className="stat-label">PageRank Iterations</span>
          <span className="stat-value">{iterations}</span>
        </div>
        <div className="stat-chip">
          <span className="stat-label">Damping Factor</span>
          <span className="stat-value">{dampingFactor}</span>
        </div>
      </div>
      <div className="stats-actions">
        <button className="btn btn-graph" onClick={onToggleGraph}>
          {showGraph ? '🗺️ Hide Graph' : '🗺️ Link Graph'}
        </button>
        <button className="btn btn-add" onClick={onAddPage}>
          + Add New Page
        </button>
        <button className="btn btn-reset" onClick={onResetDataset}>
          ↺ Reset Dataset
        </button>
      </div>
    </div>
  );
}

export default StatsBar;

