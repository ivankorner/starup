export default function AdminPanel({ submissions, onSelectSubmission }) {
  const getVerdictClass = (veredicto) => {
    if (veredicto === 'startup') return 'verdict-startup';
    if (veredicto === 'potencial') return 'verdict-potencial';
    return 'verdict-no-califica';
  };

  const getVerdictLabel = (veredicto) => {
    if (veredicto === 'startup') return 'Startup';
    if (veredicto === 'potencial') return 'Potencial Startup';
    return 'No Califica';
  };

  const sortedSubmissions = [...submissions].reverse();

  return (
    <div className="form-container">
      <div className="admin-header">
        <h1 className="admin-title">Panel del evaluador</h1>
        <p className="admin-subtitle">Revisá y evaluá las iniciativas recibidas.</p>
      </div>

      {sortedSubmissions.length === 0 ? (
        <p className="admin-empty">No hay iniciativas enviadas todavía.</p>
      ) : (
        <div className="submissions-list">
          {sortedSubmissions.map((submission) => (
            <div
              key={submission.id}
              className="submission-card"
              onClick={() => onSelectSubmission(submission.id)}
            >
              <div className="submission-header">
                <div>
                  <div className="submission-name">{submission.nombre}</div>
                  <div className="submission-meta">
                    {submission.nombreProyecto && `${submission.nombreProyecto} · `}
                    {submission.date} · {submission.sector}
                  </div>
                </div>
                <div className="submission-score">{submission.score}</div>
              </div>

              <div className="submission-tweet">{submission.tweet}</div>
              <div className="submission-email">{submission.email}</div>

              <div className="submission-footer">
                <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                  Click para ver detalle
                </span>
                <div className={`verdict-badge ${getVerdictClass(submission.veredicto)}`}>
                  {getVerdictLabel(submission.veredicto)}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
