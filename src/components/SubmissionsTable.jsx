import { useState } from 'react';
import Swal from 'sweetalert2';
import SubmissionEditModal from './SubmissionEditModal';
import ResponseDetailModal from './ResponseDetailModal';
import { exportAllResponsesToXLS } from '../utils/exportXLS';
import { exportAllResponsesToPDF } from '../utils/exportPDF';

export default function SubmissionsTable({ submissions, token, onRefresh, loading }) {
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const [exporting, setExporting] = useState(false);

  const handleExportAllXLS = async () => {
    setExporting(true);
    try {
      // Cargar fields para todas las respuestas si no existen
      const responsesWithFields = await Promise.all(
        submissions.map(async (response) => {
          if (response.fields) return response;
          // Si no tiene fields, cargar el detalle completo
          const res = await fetch(`/api/form_responses.php?id=${response.id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (res.ok) {
            return res.json();
          }
          return response;
        })
      );
      exportAllResponsesToXLS(responsesWithFields);
    } catch (err) {
      console.error('Error exportando XLS:', err);
    } finally {
      setExporting(false);
    }
  };

  const handleExportAllPDF = async () => {
    setExporting(true);
    try {
      // Cargar fields para todas las respuestas si no existen
      const responsesWithFields = await Promise.all(
        submissions.map(async (response) => {
          if (response.fields) return response;
          // Si no tiene fields, cargar el detalle completo
          const res = await fetch(`/api/form_responses.php?id=${response.id}`, {
            headers: { 'Authorization': `Bearer ${token}` }
          });
          if (res.ok) {
            return res.json();
          }
          return response;
        })
      );
      await exportAllResponsesToPDF(responsesWithFields);
    } catch (err) {
      console.error('Error exportando PDF:', err);
    } finally {
      setExporting(false);
    }
  };

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

  const deleteResponse = async (id, nombre) => {
    const result = await Swal.fire({
      title: '¿Eliminar esta respuesta?',
      text: `Se eliminará la respuesta de "${nombre}". Esta acción no se puede deshacer.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d32f2f',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    });
    if (!result.isConfirmed) return;

    try {
      const res = await fetch(`/api/form_responses.php?id=${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      if (res.ok) {
        Swal.fire({ icon: 'success', title: 'Respuesta eliminada', timer: 1500, showConfirmButton: false });
        onRefresh();
      } else {
        const data = await res.json();
        Swal.fire({ icon: 'error', title: 'Error', text: data.error || 'Error al eliminar' });
      }
    } catch (err) {
      console.error(err);
      Swal.fire({ icon: 'error', title: 'Error', text: 'Error de conexión' });
    }
  };

  const formatResponses = (respuestas) => {
    if (!respuestas || typeof respuestas !== 'object') return '';
    return Object.values(respuestas).slice(0, 2).join(' • ');
  };

  return (
    <>
      <div style={{ marginBottom: '2rem' }}>
        {/* Export buttons */}
        {submissions.length > 0 && (
          <div style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <button
              className="button button-secondary"
              onClick={handleExportAllXLS}
              disabled={exporting || loading}
              title="Descargar todas las respuestas como archivo Excel"
            >
              {exporting ? 'Exportando...' : '📊 Exportar Todas (XLS)'}
            </button>
            <button
              className="button button-secondary"
              onClick={handleExportAllPDF}
              disabled={exporting || loading}
              title="Descargar todas las respuestas como archivo PDF"
            >
              {exporting ? 'Exportando...' : '📄 Exportar Todas (PDF)'}
            </button>
          </div>
        )}

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

                <div className="submission-footer" style={{ display: 'flex', gap: '0.75rem' }}>
                  <button
                    className="button button-text"
                    onClick={() => setSelectedSubmission(submission)}
                    style={{ fontSize: '12px' }}
                  >
                    Ver detalle
                  </button>
                  <button
                    className="button button-text"
                    onClick={() => deleteResponse(submission.id, submission.nombre)}
                    style={{ fontSize: '12px', color: '#d32f2f' }}
                  >
                    Eliminar
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
