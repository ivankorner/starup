import { useState } from 'react';

const API_URL = '/api';

export default function ResponseDetailModal({ response, onClose, token }) {
  const [error, setError] = useState('');

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const renderValue = (value) => {
    if (Array.isArray(value)) {
      return value.join(', ');
    }
    if (typeof value === 'object' && value !== null) {
      return JSON.stringify(value);
    }
    return value || '—';
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '0.25rem' }}>{response.nombre}</h2>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{response.form_titulo}</p>
          </div>
          <button className="button button-text" onClick={onClose}>
            ✕
          </button>
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Email:</p>
          <p style={{ fontSize: '14px', marginBottom: '1rem' }}>{response.email}</p>

          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Enviado:</p>
          <p style={{ fontSize: '14px', marginBottom: '1rem' }}>{formatDate(response.created_at)}</p>
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '1rem' }}>Respuestas</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {response.respuestas && Object.entries(response.respuestas).map(([key, value]) => (
              <div key={key} style={{
                padding: '1rem',
                background: 'var(--bg-light)',
                borderRadius: '8px',
                borderLeft: '3px solid var(--primary)'
              }}>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase', fontWeight: '600' }}>
                  {key}
                </p>
                <p style={{ fontSize: '14px', lineHeight: '1.5' }}>
                  {renderValue(value)}
                </p>
              </div>
            ))}
          </div>
        </div>

        {error && <div className="error-message" style={{ marginBottom: '1rem' }}>{error}</div>}

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
          <button className="button button-primary" onClick={onClose}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
