import { useState } from 'react';
import ProgressBar from './ProgressBar';

const DISPOSITIVOS = [
  { emoji: '📱', label: 'Celular o Tablet' },
  { emoji: '💻', label: 'Computadora' },
  { emoji: '🔄', label: 'Desde ambos' },
];

const NECESIDADES = [
  { emoji: '📋', label: 'Registrar información' },
  { emoji: '📄', label: 'Consultar información' },
  { emoji: '⚡', label: 'Automatizar acciones' },
  { emoji: '🔔', label: 'Comunicar o alertar' },
  { emoji: '📊', label: 'Analizar y decidir' },
  { emoji: '🤝', label: 'Conectar con clientes' },
];

export default function Step4Vision({ formData, setFormData, onNext, onPrev }) {
  const [errors, setErrors] = useState({});

  const handleSelectDispositivo = (label) => {
    setFormData((prev) => ({ ...prev, dispositivo: label }));
    if (errors.dispositivo) {
      setErrors((prev) => ({ ...prev, dispositivo: null }));
    }
  };

  const handleToggleNecesidad = (necesidadLabel) => {
    const current = formData.necesidades || [];
    if (current.includes(necesidadLabel)) {
      const updated = current.filter((n) => n !== necesidadLabel);
      setFormData((prev) => ({ ...prev, necesidades: updated }));
    } else if (current.length < 3) {
      const updated = [...current, necesidadLabel];
      setFormData((prev) => ({ ...prev, necesidades: updated }));
    }
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleValidateAndNext = () => {
    const newErrors = {};

    if (!formData.dispositivo) {
      newErrors.dispositivo = 'Debés seleccionar un dispositivo';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onNext();
  };

  const selectedCount = (formData.necesidades || []).length;
  const canSelect = selectedCount < 3;

  return (
    <div className="form-container">
      <ProgressBar step={4} />

      <h1 className="step-title">Visión Preliminar</h1>
      <p className="step-subtitle">
        Cómo imaginan usar la solución en el día a día.
      </p>

      <div className="form-group">
        <label className="form-label required">
          Si el proyecto avanzara, ¿cómo imaginan el uso práctico?
        </label>
        <div className="selector-grid">
          {DISPOSITIVOS.map((d) => (
            <div
              key={d.label}
              className={`selector-card ${formData.dispositivo === d.label ? 'selected' : ''}`}
              onClick={() => handleSelectDispositivo(d.label)}
            >
              <div className="selector-emoji">{d.emoji}</div>
              <div className="selector-label">{d.label}</div>
            </div>
          ))}
        </div>
        {errors.dispositivo && (
          <div className="error-message">{errors.dispositivo}</div>
        )}
      </div>

      <div className="form-group">
        <label className="form-label">
          ¿Cómo necesitarían usar esta solución?{' '}
          <span style={{ color: 'var(--text-muted)' }}>(Opcional)</span>
        </label>
        <textarea
          value={formData.usoDescripcion}
          onChange={(e) => handleChange('usoDescripcion', e.target.value)}
          placeholder="Ej. Queremos que el operario en campo escanee un QR..."
        />
      </div>

      <div className="form-group">
        <label className="form-label">
          Necesidad principal que debería cubrir{' '}
          <span style={{ color: 'var(--text-muted)' }}>(Elegí hasta 3)</span>
        </label>
        <div className="selector-grid">
          {NECESIDADES.map((n) => {
            const isSelected = (formData.necesidades || []).includes(n.label);
            const isDisabled = !isSelected && !canSelect;
            return (
              <div
                key={n.label}
                className={`selector-card ${isSelected ? 'selected' : ''} ${isDisabled ? 'disabled' : ''}`}
                onClick={() => !isDisabled && handleToggleNecesidad(n.label)}
                style={isDisabled ? { opacity: 0.4, cursor: 'not-allowed' } : {}}
              >
                <div className="selector-emoji">{n.emoji}</div>
                <div className="selector-label">{n.label}</div>
              </div>
            );
          })}
        </div>
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
