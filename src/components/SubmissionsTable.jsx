import { useState } from 'react';
import SubmissionEditModal from './SubmissionEditModal';
import ResponseDetailModal from './ResponseDetailModal';

export default function SubmissionsTable({ submissions, token, onRefresh, loading }) {
  const [selectedSubmission, setSelectedSubmission] = useState(null);

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatResponses = (respuestas) => {
    if (!respuestas || typeof respuestas !== 'object') return '';
    return Object.values(respuestas).slice(0, 2).join(' • ');
  };

  return (
    <>
      <div style={{ marginBottom: '2rem' }}>
        {loading ? (
          <p style={{ color: 'var(--text-muted)' }}>Cargando...</p>
        ) : submissions.length === 0 ? (
          <p style={{ color: 'var(--text-muted)' }}>No hay respuestas</p>
        ) : (
          <div className="submissions-list">
            {submissions.map((submission) => (
              <div key={submission.id} className="submission-card">
                <div className="submission-header">
                  <div>
                    <div className="submission-name">{submission.nombre}</div>
                    <div className="submission-meta">
                      {submission.form_titulo && `${submission.form_titulo} · `}
                      {formatDate(submission.created_at)}
                    </div>
                  </div>
                </div>

                <div className="submission-tweet" style={{ fontSize: '13px' }}>
                  {formatResponses(submission.respuestas)}
                </div>
                <div className="submission-email">{submission.email}</div>

                <div className="submission-footer">
                  <button
                    className="button button-text"
                    onClick={() => setSelectedSubmission(submission)}
                    style={{ fontSize: '12px' }}
                  >
                    Ver detalle
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedSubmission && (
        selectedSubmission.form_titulo ? (
          // Nueva respuesta dinámica
          <ResponseDetailModal
            response={selectedSubmission}
            onClose={() => setSelectedSubmission(null)}
            token={token}
          />
        ) : (
          // Submission antigua del formulario Radar
          <SubmissionEditModal
            submission={selectedSubmission}
            onClose={() => setSelectedSubmission(null)}
            onSave={() => {
              setSelectedSubmission(null);
              onRefresh();
            }}
            token={token}
          />
        )
      )}
    </>
  );
}
