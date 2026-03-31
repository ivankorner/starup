import { useState } from 'react';

export default function StepIntro({ formData, setFormData, onNext }) {
  const [errors, setErrors] = useState({});

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleContinue = () => {
    const newErrors = {};

    if (!formData.nombre.trim()) {
      newErrors.nombre = 'El nombre es obligatorio';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'El email es obligatorio';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Por favor ingresá un email válido';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onNext();
  };

  return (
    <div className="form-container">
      <h1 className="step-title">Contanos sobre tu proyecto</h1>
      <p className="step-subtitle">Empecemos con los datos básicos.</p>

      <div className="form-group">
        <label className="form-label required">Nombre completo</label>
        <input
          type="text"
          value={formData.nombre}
          onChange={(e) => handleChange('nombre', e.target.value)}
          placeholder="Tu nombre y apellido"
        />
        {errors.nombre && <div className="error-message">{errors.nombre}</div>}
      </div>

      <div className="form-group">
        <label className="form-label required">Correo electrónico</label>
        <input
          type="email"
          value={formData.email}
          onChange={(e) => handleChange('email', e.target.value)}
          placeholder="tu@email.com"
        />
        {errors.email && <div className="error-message">{errors.email}</div>}
      </div>

      <div className="form-group">
        <label className="form-label">
          Nombre del proyecto <span style={{ color: 'var(--text-muted)' }}>(Opcional)</span>
        </label>
        <input
          type="text"
          value={formData.nombreProyecto}
          onChange={(e) => handleChange('nombreProyecto', e.target.value)}
          placeholder="Ej. AgroTrack, EduFácil..."
        />
      </div>

      <div className="button-nav">
        <div></div>
        <button className="button button-primary" onClick={handleContinue}>
          Comenzar →
        </button>
      </div>
    </div>
  );
}
