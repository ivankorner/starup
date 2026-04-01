export default function AdminPanel({ submissions, onSelectSubmission }) {
  const getVerdictClass = (veredicto) => {
    if (veredicto === 'startup') return 'verdict-startup';
    return 'verdict-potencial';
  };

  const getVerdictLabel = (veredicto) => {
    if (veredicto === 'startup') return 'Startup';
    return 'Potencial Startup';
  };

  const sortedSubmissions = [...submissions].reverse();

  return (
    <div className="form-container">
      <div className="admin-header">
        <h1 className="admin-title">Propuestas Recibidas</h1>
        <p className="admin-subtitle">Revisá y evaluá las iniciativas.</p>
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
