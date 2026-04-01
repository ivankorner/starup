import { useState } from 'react';
import SubmissionEditModal from './SubmissionEditModal';

export default function SubmissionsTable({ submissions, token, onRefresh, loading }) {
  const [search, setSearch] = useState('');
  const [filterVeredicto, setFilterVeredicto] = useState('');
  const [selectedSubmission, setSelectedSubmission] = useState(null);

  const filtered = submissions.filter((s) => {
    const matchSearch =
      s.nombre.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase()) ||
      (s.nombre_proyecto && s.nombre_proyecto.toLowerCase().includes(search.toLowerCase()));

    const matchVeredicto = !filterVeredicto || s.veredicto === filterVeredicto;

    return matchSearch && matchVeredicto;
  });

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
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
          <input
            type="text"
            placeholder="Buscar por nombre, email o proyecto..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ flex: 1, minWidth: '250px' }}
          />
          <select
            value={filterVeredicto}
            onChange={(e) => setFilterVeredicto(e.target.value)}
            style={{ minWidth: '150px' }}
          >
            <option value="">Todos los veredictos</option>
            <option value="startup">Startup</option>
            <option value="potencial">Potencial</option>
          </select>
        </div>

        {loading ? (
          <p style={{ color: 'var(--text-muted)' }}>Cargando...</p>
        ) : filtered.length === 0 ? (
          <p style={{ color: 'var(--text-muted)' }}>No hay iniciativas que coincidan</p>
        ) : (
          <div className="submissions-list">
            {filtered.map((submission) => (
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
