export default function DashboardStats({ stats }) {
  return (
    <div className="stats-grid">
      <div className="stat-card">
        <div className="stat-label">Total de Iniciativas</div>
        <div className="stat-value">{stats.total}</div>
      </div>

      <div className="stat-card startup">
        <div className="stat-label">Startup</div>
        <div className="stat-value">{stats.startup}</div>
      </div>

      <div className="stat-card potencial">
        <div className="stat-label">Potencial</div>
        <div className="stat-value">{stats.potencial}</div>
      </div>

      <div className="stat-card no-califica">
        <div className="stat-label">No Califica</div>
        <div className="stat-value">{stats.noCalifica}</div>
      </div>
    </div>
  );
}
