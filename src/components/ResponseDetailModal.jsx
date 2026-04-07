import { useState, useEffect } from 'react';
import { exportResponseToXLS } from '../utils/exportXLS';
import { exportResponseToPDF } from '../utils/exportPDF';

const API_URL = '/api';

export default function ResponseDetailModal({ response, onClose, token }) {
  const [error, setError] = useState('');
  const [exporting, setExporting] = useState(false);
  const [fullResponse, setFullResponse] = useState(response);
  const [loading, setLoading] = useState(!response.fields);

  // Cargar el detalle completo con fields si no los tiene
  useEffect(() => {
    if (!response.fields && response.id) {
      setLoading(true);
      fetch(`${API_URL}/form_responses.php?id=${response.id}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
        .then(res => res.json())
        .then(data => {
          setFullResponse(data);
          setLoading(false);
        })
        .catch(err => {
          console.error('Error cargando detalle:', err);
          setFullResponse(response);
          setLoading(false);
        });
    }
  }, [response, token]);

  const handleExportXLS = async () => {
    setExporting(true);
    try {
      exportResponseToXLS(fullResponse);
    } catch (err) {
      setError(`Error al exportar XLS: ${err.message}`);
    } finally {
      setExporting(false);
    }
  };

  const handleExportPDF = async () => {
    setExporting(true);
    try {
      await exportResponseToPDF(fullResponse);
    } catch (err) {
      setError(`Error al exportar PDF: ${err.message}`);
    } finally {
      setExporting(false);
    }
  };

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

  const getFieldLabel = (key) => {
    if (!fullResponse.fields) return key;
    const field = fullResponse.fields.find(f => f.slug === key || String(f.id) === String(key));
    return field ? field.label : key;
  };

  if (loading) {
    return (
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <p style={{ color: 'var(--text-muted)' }}>Cargando respuesta...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <div>
            <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '0.25rem' }}>{fullResponse.nombre}</h2>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{fullResponse.form_titulo}</p>
          </div>
          <button className="button button-text" onClick={onClose}>
            ✕
          </button>
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Email:</p>
          <p style={{ fontSize: '14px', marginBottom: '1rem' }}>{fullResponse.email}</p>

          <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>Enviado:</p>
          <p style={{ fontSize: '14px', marginBottom: '1rem' }}>{formatDate(fullResponse.created_at)}</p>
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '1rem' }}>Respuestas</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {fullResponse.respuestas && Object.entries(fullResponse.respuestas).map(([slug, value]) => (
              <div key={slug} style={{
                padding: '1rem',
                background: 'var(--bg-light)',
                borderRadius: '8px',
                borderLeft: '3px solid var(--primary)'
              }}>
                <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase', fontWeight: '600' }}>
                  {getFieldLabel(slug)}
                </p>
                <p style={{ fontSize: '14px', lineHeight: '1.5' }}>
                  {renderValue(value)}
                </p>
              </div>
            ))}
          </div>
        </div>

        {error && <div className="error-message" style={{ marginBottom: '1rem' }}>{error}</div>}

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
          <button className="button button-text" onClick={onClose} disabled={exporting}>
            Cerrar
          </button>
          <button
            className="button button-secondary"
            onClick={handleExportXLS}
            disabled={exporting}
            title="Descargar respuesta como archivo Excel"
          >
            {exporting ? 'Exportando...' : '📊 Exportar XLS'}
          </button>
          <button
            className="button button-secondary"
            onClick={handleExportPDF}
            disabled={exporting}
            title="Descargar respuesta como archivo PDF"
          >
            {exporting ? 'Exportando...' : '📄 Exportar PDF'}
          </button>
        </div>
      </div>
    </div>
  );
}
