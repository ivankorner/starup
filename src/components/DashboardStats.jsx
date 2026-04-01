export default function DashboardStats({ stats }) {
  return (
    <div className="stats-grid">
      <div className="stat-card">
        <div className="stat-icon total">≡</div>
        <div className="stat-label">Total</div>
        <div className="stat-value">{stats.total}</div>
      </div>

      <div className="stat-card startup">
        <div className="stat-icon startup">▲</div>
        <div className="stat-label">Startup</div>
        <div className="stat-value">{stats.startup}</div>
      </div>

      <div className="stat-card potencial">
        <div className="stat-icon potencial">◆</div>
        <div className="stat-label">Potencial</div>
        <div className="stat-value">{stats.potencial}</div>
      </div>
    </div>
  );
}
