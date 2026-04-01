import { useState } from 'react';
import { textoVeredicto } from '../utils/scoring';

const API_URL = '/api';

export default function SubmissionEditModal({ submission, onClose, onSave, token }) {
  const [notasEvaluador, setNotasEvaluador] = useState(submission.notas_evaluador || '');
  const [veredicto, setVeredicto] = useState(submission.veredicto);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSave = async () => {
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`${API_URL}/submissions.php?id=${submission.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          notas_evaluador: notasEvaluador,
          veredicto,
          revisado: 1,
        }),
      });

      if (res.ok) {
        onSave();
      } else {
        setError('Error al guardar');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getVerdictClass = (v) => {
    if (v === 'startup') return 'verdict-startup';
    if (v === 'potencial') return 'verdict-potencial';
    return 'verdict-no-califica';
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '600' }}>{submission.nombre}</h2>
          <button className="button button-text" onClick={onClose}>
            ✕
          </button>
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Proyecto: {submission.nombre_proyecto || '—'}</p>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '1rem' }}>Email: {submission.email}</p>

          <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
            <div>
              <span style={{ fontSize: '28px', fontWeight: '600', color: 'var(--primary)' }}>
                {submission.score}
              </span>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)' }}>Puntaje</p>
            </div>
            <div className={`verdict-badge ${getVerdictClass(veredicto)}`} style={{ alignSelf: 'flex-start' }}>
              {veredicto.toUpperCase()}
            </div>
          </div>

          <p style={{ fontSize: '13px', color: 'var(--text-body)', lineHeight: '1.5', padding: '1rem', background: 'var(--bg-light)', borderRadius: '8px', marginBottom: '1rem' }}>
            {textoVeredicto(veredicto)}
          </p>
        </div>

        <div className="form-group">
          <label className="form-label">Cambiar Veredicto</label>
          <select value={veredicto} onChange={(e) => setVeredicto(e.target.value)}>
            <option value="startup">Startup</option>
            <option value="potencial">Potencial</option>
            <option value="no-califica">No Califica</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Notas del Evaluador</label>
          <textarea
            value={notasEvaluador}
            onChange={(e) => setNotasEvaluador(e.target.value)}
            placeholder="Agrega notas sobre esta iniciativa..."
            rows="4"
          />
        </div>

        {error && <div className="error-message" style={{ marginBottom: '1rem' }}>{error}</div>}

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
          <button className="button button-text" onClick={onClose} disabled={loading}>
            Cancelar
          </button>
          <button className="button button-primary" onClick={handleSave} disabled={loading}>
            {loading ? 'Guardando...' : 'Guardar'}
          </button>
        </div>
      </div>
    </div>
  );
}
