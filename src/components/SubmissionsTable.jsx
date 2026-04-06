import { useState } from 'react';
import SubmissionEditModal from './SubmissionEditModal';

export default function SubmissionsTable({ submissions, token, onRefresh, loading }) {
  const [selectedSubmission, setSelectedSubmission] = useState(null);

  const getVerdictClass = (veredicto) => {
    if (veredicto === 'startup') return 'verdict-startup';
    return 'verdict-potencial';
  };

  const getVerdictLabel = (veredicto) => {
    if (veredicto === 'startup') return 'Startup';
    return 'Potencial';
  };

  return (
    <>
      <div style={{ marginBottom: '2rem' }}>
        {loading ? (
          <p style={{ color: 'var(--text-muted)' }}>Cargando...</p>
        ) : submissions.length === 0 ? (
          <p style={{ color: 'var(--text-muted)' }}>No hay iniciativas</p>
        ) : (
          <div className="submissions-list">
            {submissions.map((submission) => (
              <div key={submission.id} className="submission-card">
                <div className="submission-header">
                  <div>
                    <div className="submission-name">{submission.nombre}</div>
                    <div className="submission-meta">
                      {submission.nombre_proyecto && `${submission.nombre_proyecto} · `}
                      {submission.created_at || submission.date} · {submission.sector}
                    </div>
                  </div>
                  <div className="submission-score">{submission.score}</div>
                </div>

                <div className="submission-tweet">{submission.tweet}</div>
                <div className="submission-email">{submission.email}</div>

                <div className="submission-footer">
                  <button
                    className="button button-text"
                    onClick={() => setSelectedSubmission(submission)}
                    style={{ fontSize: '12px' }}
                  >
                    Ver detalle
                  </button>
                  <div className={`verdict-badge ${getVerdictClass(submission.veredicto)}`}>
                    {getVerdictLabel(submission.veredicto)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedSubmission && (
        <SubmissionEditModal
          submission={selectedSubmission}
          onClose={() => setSelectedSubmission(null)}
          onSave={() => {
            setSelectedSubmission(null);
            onRefresh();
          }}
          token={token}
        />
      )}
    </>
  );
}
