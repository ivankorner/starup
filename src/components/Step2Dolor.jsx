import { useState } from 'react';
import ProgressBar from './ProgressBar';

const COMO_RESUELVEN = [
  'Excel / Planillas',
  'Papel y Lápiz',
  'WhatsApp / Correos',
  'Software obsoleto',
  'No lo resolvemos',
  'Otro',
];

const DIFICULTADES = [
  'Pérdida de tiempo',
  'Errores o retrabajo',
  'Información dispersa',
  'Falta de trazabilidad',
  'Mala comunicación',
  'Dependencia manual',
  'Falta de datos para decidir',
];

const URGENCIA_OPTIONS = [
  'Pérdida de dinero/clientes',
  'Crecimiento desorganizado',
  'Exigencia legal/normativa',
  'Oportunidad de mercado',
  'Eficiencia operativa',
];

export default function Step2Dolor({ formData, setFormData, onNext, onPrev }) {
  const [errors, setErrors] = useState({});

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const handleToggleDificultad = (dificultad) => {
    const current = formData.dificultades || [];
    const updated = current.includes(dificultad)
      ? current.filter((d) => d !== dificultad)
      : [...current, dificultad];
    setFormData((prev) => ({ ...prev, dificultades: updated }));
  };

  const handleValidateAndNext = () => {
    const newErrors = {};

    if (!formData.comoResuelven) {
      newErrors.comoResuelven = 'Debés seleccionar una opción';
    }

    if (!formData.urgencia) {
      newErrors.urgencia = 'Debés seleccionar una opción';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onNext();
  };

  return (
    <div className="form-container">
      <ProgressBar step={2} />

      <h1 className="step-title">Entendamos el Dolor</h1>
      <p className="step-subtitle">Ayudanos a dimensionar el impacto del problema.</p>

      <div className="form-group">
        <label className="form-label required">¿Cómo resuelven hoy esta necesidad?</label>
        <div className="chip-group">
          {COMO_RESUELVEN.map((opcion) => (
            <div
              key={opcion}
              className={`chip ${formData.comoResuelven === opcion ? 'selected' : ''}`}
              onClick={() => handleChange('comoResuelven', opcion)}
            >
              {opcion}
            </div>
          ))}
        </div>
        {errors.comoResuelven && (
          <div className="error-message">{errors.comoResuelven}</div>
        )}
      </div>

      <div className="form-group">
        <label className="form-label">
          ¿Cuál es la principal dificultad actual?{' '}
          <span style={{ color: 'var(--text-muted)' }}>(Múltiples opciones)</span>
        </label>
        <div className="chip-group">
          {DIFICULTADES.map((dificultad) => (
            <div
              key={dificultad}
              className={`chip ${(formData.dificultades || []).includes(dificultad) ? 'selected' : ''}`}
              onClick={() => handleToggleDificultad(dificultad)}
            >
              {dificultad}
            </div>
          ))}
        </div>
      </div>

      <div className="form-group">
        <label className="form-label required">
          ¿Por qué este proyecto es importante hoy?
        </label>
        <div className="chip-group">
          {URGENCIA_OPTIONS.map((opcion) => (
            <div
              key={opcion}
              className={`chip ${formData.urgencia === opcion ? 'selected' : ''}`}
              onClick={() => handleChange('urgencia', opcion)}
            >
              {opcion}
            </div>
          ))}
        </div>
        {errors.urgencia && <div className="error-message">{errors.urgencia}</div>}
      </div>

      <div className="button-nav">
        <button className="button button-text" onClick={onPrev}>
          ← Atrás
        </button>
        <button className="button button-primary" onClick={handleValidateAndNext}>
          Siguiente →
        </button>
      </div>
    </div>
  );
}
