import { textoVeredicto } from '../utils/scoring';

export default function AdminDetail({ submission, onBack }) {
  const getVerdictClass = (veredicto) => {
    if (veredicto === 'startup') return 'verdict-startup';
    return 'verdict-potencial';
  };

  const getVerdictLabel = (veredicto) => {
    if (veredicto === 'startup') return 'Startup';
    return 'Potencial Startup';
  };

  const renderValue = (value) => {
    if (Array.isArray(value)) {
      return value.length > 0 ? value.join(', ') : '—';
    }
    return value || '—';
  };

  return (
    <div className="detail-container">
      <button className="detail-back" onClick={onBack}>
        ← Volver
      </button>

      <div className="detail-header">
        <div className="detail-head-top">
          <div className="detail-names">
            <div className="detail-name">{submission.nombre}</div>
            <div className="detail-email">{submission.email}</div>
            {submission.nombreProyecto && (
              <div style={{ fontSize: '13px', color: 'var(--text-body)', marginTop: '0.5rem' }}>
                <strong>Proyecto:</strong> {submission.nombreProyecto}
              </div>
            )}
          </div>
          <div className="detail-score-box">
            <div className="detail-score">{submission.score}</div>
            <div className="detail-score-label">Puntaje Total</div>
            <div style={{ marginTop: '0.5rem' }}>
              <div className={`verdict-badge ${getVerdictClass(submission.veredicto)}`}>
                {getVerdictLabel(submission.veredicto)}
              </div>
            </div>
          </div>
        </div>
        <div className="detail-date">Recibida: {submission.date}</div>
        <div className="detail-verdict-text">{textoVeredicto(submission.veredicto)}</div>
      </div>

      <div className="detail-sections">
        <div className="detail-section">
          <div className="detail-section-title">Idea y Contexto</div>
          <div className="detail-row">
            <div className="detail-label">Sector</div>
            <div className="detail-value">
              {submission.sector ? submission.sector : 'No especificado'}
            </div>
          </div>
          <div className="detail-row">
            <div className="detail-label">Descripción</div>
            <div className="detail-value">
              {submission.descripcion ? submission.descripcion : '—'}
            </div>
          </div>
          <div className="detail-row">
            <div className="detail-label">Problema</div>
            <div className="detail-value">
              {submission.tweet ? submission.tweet : '—'}
            </div>
          </div>
        </div>

        <div className="detail-section">
          <div className="detail-section-title">El Dolor</div>
          <div className="detail-row">
            <div className="detail-label">¿Cómo resuelven hoy?</div>
            <div className="detail-value">
              {submission.comoResuelven || submission.como_resuelven ? (submission.comoResuelven || submission.como_resuelven) : '—'}
            </div>
          </div>
          <div className="detail-row">
            <div className="detail-label">Dificultades</div>
            <div className="detail-value">
              {renderValue(submission.dificultades)}
            </div>
          </div>
          <div className="detail-row">
            <div className="detail-label">Urgencia</div>
            <div className="detail-value">
              {submission.urgencia ? submission.urgencia : '—'}
            </div>
          </div>
        </div>

        <div className="detail-section">
          <div className="detail-section-title">Madurez y Visión</div>
          <div className="detail-row">
            <div className="detail-label">Estado Actual</div>
            <div className="detail-value">
              {submission.madurez ? submission.madurez : '—'}
            </div>
          </div>
          <div className="detail-row">
            <div className="detail-label">Dispositivo</div>
            <div className="detail-value">
              {submission.dispositivo ? submission.dispositivo : '—'}
            </div>
          </div>
          <div className="detail-row">
            <div className="detail-label">Descripción de Uso</div>
            <div className="detail-value">
              {submission.usoDescripcion || submission.uso_descripcion ? (submission.usoDescripcion || submission.uso_descripcion) : '—'}
            </div>
          </div>
          <div className="detail-row">
            <div className="detail-label">Necesidades</div>
            <div className="detail-value">
              {renderValue(submission.necesidades)}
            </div>
          </div>
        </div>

        <div className="detail-section">
          <div className="detail-section-title">Viabilidad</div>
          <div className="detail-row">
            <div className="detail-label">Timeline</div>
            <div className="detail-value">
              {submission.timeline ? submission.timeline : '—'}
            </div>
          </div>
          <div className="detail-row">
            <div className="detail-label">Presupuesto</div>
            <div className="detail-value">
              {submission.presupuesto ? submission.presupuesto : '—'}
            </div>
          </div>
          <div className="detail-row">
            <div className="detail-label">Equipo Interno</div>
            <div className="detail-value">
              {submission.equipoInterno || submission.equipo_interno ? (submission.equipoInterno || submission.equipo_interno) : '—'}
            </div>
          </div>
          <div className="detail-row">
            <div className="detail-label">Notas Adicionales</div>
            <div className="detail-value">
              {submission.notasAdicionales || submission.notas ? (submission.notasAdicionales || submission.notas) : '—'}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
