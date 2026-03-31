import { useState } from 'react';
import ProgressBar from './ProgressBar';

const SECTORES = [
  { emoji: '🏥', label: 'Salud' },
  { emoji: '🌾', label: 'Agro' },
  { emoji: '📱', label: 'Educación' },
  { emoji: '🛒', label: 'Comercio' },
  { emoji: '⚙️', label: 'Industria' },
  { emoji: '👥', label: 'Servicios' },
  { emoji: '🏛️', label: 'Gobierno' },
  { emoji: '🌐', label: 'Otro' },
];

export default function Step1Idea({ formData, setFormData, onNext, onPrev }) {
  const [errors, setErrors] = useState({});

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const handleSectorSelect = (sectorLabel) => {
    handleChange('sector', sectorLabel);
  };

  const handleValidateAndNext = () => {
    const newErrors = {};

    if (!formData.sector) {
      newErrors.sector = 'Debés seleccionar un rubro';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onNext();
  };

  return (
    <div className="form-container">
      <ProgressBar step={1} />

      <h1 className="step-title">La Idea</h1>
      <p className="step-subtitle">Contanos de qué se trata el proyecto.</p>

      <div className="form-group">
        <label className="form-label">Breve descripción de la actividad</label>
        <textarea
          value={formData.descripcion}
          onChange={(e) => handleChange('descripcion', e.target.value)}
          placeholder="Breve descripción de la actividad..."
        />
      </div>

      <div className="form-group">
        <label className="form-label required">Rubro o Sector principal</label>
        <div className="selector-grid">
          {SECTORES.map((s) => (
            <div
              key={s.label}
              className={`selector-card ${formData.sector === s.label ? 'selected' : ''}`}
              onClick={() => handleSectorSelect(s.label)}
            >
              <div className="selector-emoji">{s.emoji}</div>
              <div className="selector-label">{s.label}</div>
            </div>
          ))}
        </div>
        {errors.sector && <div className="error-message">{errors.sector}</div>}
      </div>

      <div className="form-group">
        <label className="form-label">El problema en un Tweet</label>
        <p className="form-hint">¿Qué problema principal quieren resolver? Sé breve.</p>
        <textarea
          value={formData.tweet}
          onChange={(e) => handleChange('tweet', e.target.value.slice(0, 280))}
          placeholder="Hoy nuestro mayor problema es que..."
          maxLength="280"
        />
        <div className="char-count">{formData.tweet.length}/280</div>
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
