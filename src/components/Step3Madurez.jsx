import { useState } from 'react';
import ProgressBar from './ProgressBar';

const MADUREZ_OPTIONS = [
  {
    id: 'idea',
    title: 'Idea inicial',
    desc: 'Recién empezamos a charlarlo.',
  },
  {
    id: 'problema',
    title: 'Problema identificado, sin propuesta definida',
    desc: 'Sabemos qué duele, pero no cómo solucionarlo.',
  },
  {
    id: 'propuesta',
    title: 'Propuesta preliminar definida',
    desc: 'Tenemos un boceto o idea de cómo debería ser.',
  },
  {
    id: 'piloto',
    title: 'Ya existe prueba o piloto',
    desc: 'Armamos algo básico (ej. en Excel) que funciona.',
  },
  {
    id: 'parcial',
    title: 'Ya existe una solución parcial a mejorar',
    desc: 'Tenemos un sistema pero quedó obsoleto o chico.',
  },
];

export default function Step3Madurez({ formData, setFormData, onNext, onPrev }) {
  const [errors, setErrors] = useState({});

  const handleSelectMadurez = (madurezId) => {
    setFormData((prev) => ({ ...prev, madurez: madurezId }));
    if (errors.madurez) {
      setErrors((prev) => ({ ...prev, madurez: null }));
    }
  };

  const handleValidateAndNext = () => {
    const newErrors = {};

    if (!formData.madurez) {
      newErrors.madurez = 'Debés seleccionar un estado';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onNext();
  };

  return (
    <div className="form-container">
      <ProgressBar step={3} />

      <h1 className="step-title">Madurez del Proyecto</h1>
      <p className="step-subtitle">¿En qué etapa de desarrollo se encuentra la idea?</p>

      <div className="form-group">
        <label className="form-label required">Estado actual de la iniciativa</label>
        <div className="timeline-list">
          {MADUREZ_OPTIONS.map((option) => (
            <div
              key={option.id}
              className={`timeline-item ${formData.madurez === option.id ? 'selected' : ''}`}
              onClick={() => handleSelectMadurez(option.id)}
            >
              <div className="timeline-radio" />
              <div className="timeline-content">
                <div className="timeline-title">{option.title}</div>
                <div className="timeline-desc">{option.desc}</div>
              </div>
            </div>
          ))}
        </div>
        {errors.madurez && <div className="error-message">{errors.madurez}</div>}
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
