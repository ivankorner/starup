import { useState } from 'react';
import ProgressBar from './ProgressBar';

const TIMELINE_OPTIONS = [
  'Menos de 3 meses',
  'Entre 3 y 6 meses',
  'Entre 6 y 12 meses',
  'Más de 12 meses',
  'Sin fecha definida',
];

const PRESUPUESTO_OPTIONS = [
  { label: 'Sí, confirmado', score: 3 },
  { label: 'Posible, no confirmado', score: 2 },
  { label: 'No, requerimos apoyo / financiamiento', score: 1 },
  { label: 'No lo sabemos', score: 0 },
];

const EQUIPO_OPTIONS = [
  { label: 'Sí, equipo asignado', score: 3 },
  { label: 'Sí, parcialmente', score: 2 },
  { label: 'No', score: 1 },
  { label: 'No lo sabemos', score: 0 },
];

export default function Step5Viabilidad({ formData, setFormData, onNext, onPrev }) {
  const [errors, setErrors] = useState({});

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const handlePresupuestoSelect = (option) => {
    setFormData((prev) => ({
      ...prev,
      presupuesto: option.label,
      budgetScore: option.score,
    }));
    if (errors.presupuesto) {
      setErrors((prev) => ({ ...prev, presupuesto: null }));
    }
  };

  const handleEquipoSelect = (option) => {
    setFormData((prev) => ({
      ...prev,
      equipoInterno: option.label,
      teamScore: option.score,
    }));
    if (errors.equipoInterno) {
      setErrors((prev) => ({ ...prev, equipoInterno: null }));
    }
  };

  const handleValidateAndNext = () => {
    const newErrors = {};

    if (!formData.timeline) {
      newErrors.timeline = 'Debés seleccionar un timeline';
    }

    if (!formData.presupuesto) {
      newErrors.presupuesto = 'Debés seleccionar una opción';
    }

    if (!formData.equipoInterno) {
      newErrors.equipoInterno = 'Debés seleccionar una opción';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onNext();
  };

  return (
    <div className="form-container">
      <ProgressBar step={5} />

      <h1 className="step-title">Viabilidad y Cierre</h1>
      <p className="step-subtitle">Para terminar, hablemos de tiempos y recursos.</p>

      <div className="form-group">
        <label className="form-label required">
          ¿Para cuándo les gustaría contar con una primera solución?
        </label>
        <div className="chip-group">
          {TIMELINE_OPTIONS.map((opcion) => (
            <div
              key={opcion}
              className={`chip ${formData.timeline === opcion ? 'selected' : ''}`}
              onClick={() => handleChange('timeline', opcion)}
            >
              {opcion}
            </div>
          ))}
        </div>
        {errors.timeline && <div className="error-message">{errors.timeline}</div>}
      </div>

      <div className="two-cols">
        <div className="col">
          <label className="form-label required">
            ¿Cuentan con presupuesto o financiamiento?
          </label>
          <div className="radio-boxes">
            {PRESUPUESTO_OPTIONS.map((option) => (
              <div
                key={option.label}
                className={`radio-box ${formData.presupuesto === option.label ? 'selected' : ''}`}
                onClick={() => handlePresupuestoSelect(option)}
              >
                <div className="radio-circle" />
                <div className="radio-text">{option.label}</div>
              </div>
            ))}
          </div>
          {errors.presupuesto && (
            <div className="error-message">{errors.presupuesto}</div>
          )}
        </div>

        <div className="col">
          <label className="form-label required">
            ¿Cuentan con personas internas que acompañen el proyecto?
          </label>
          <div className="radio-boxes">
            {EQUIPO_OPTIONS.map((option) => (
              <div
                key={option.label}
                className={`radio-box ${formData.equipoInterno === option.label ? 'selected' : ''}`}
                onClick={() => handleEquipoSelect(option)}
              >
                <div className="radio-circle" />
                <div className="radio-text">{option.label}</div>
              </div>
            ))}
          </div>
          {errors.equipoInterno && (
            <div className="error-message">{errors.equipoInterno}</div>
          )}
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">
          ¿Algo más que quieran agregar?{' '}
          <span style={{ color: 'var(--text-muted)' }}>(Opcional)</span>
        </label>
        <textarea
          value={formData.notasAdicionales}
          onChange={(e) => handleChange('notasAdicionales', e.target.value)}
          placeholder="Contexto adicional, restricciones, socios..."
        />
      </div>

      <div className="button-nav">
        <button className="button button-text" onClick={onPrev}>
          ← Atrás
        </button>
        <button className="button button-primary" onClick={handleValidateAndNext}>
          Enviar Proyecto →
        </button>
      </div>
    </div>
  );
}
