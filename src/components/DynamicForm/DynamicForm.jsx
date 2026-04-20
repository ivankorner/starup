import { useState, useEffect } from 'react';
import FieldRenderer from './FieldRenderer';

const API_URL = '/api';

export default function DynamicForm({ formId, onSubmit, onClose }) {
  const [form, setForm] = useState(null);
  const [responses, setResponses] = useState({});
  const [currentStep, setCurrentStep] = useState(0);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Cargar formulario
  useEffect(() => {
    const loadForm = async () => {
      try {
        const res = await fetch(`${API_URL}/forms.php?id=${formId}`);
        if (res.ok) {
          const data = await res.json();
          // Parsear campos numéricos (PHP PDO devuelve strings)
          if (data.fields) {
            data.fields = data.fields.map(f => ({
              ...f,
              id: Number(f.id),
              paso: Number(f.paso),
              orden: Number(f.orden),
              obligatorio: Number(f.obligatorio),
              max_seleccion: f.max_seleccion ? Number(f.max_seleccion) : null,
              max_length: f.max_length ? Number(f.max_length) : null,
            }));
          }
          setForm(data);

          // Inicializar respuestas vacías
          const init = {};
          data.fields.forEach((field) => {
            if (field.tipo === 'titulo') return;
            const isMulti = field.tipo === 'chip-multi' ||
              (field.tipo === 'selector-grid' && field.max_seleccion);
            init[field.id] = isMulti ? [] : '';
          });
          setResponses(init);
          setLoading(false);
        } else {
          setLoading(false);
        }
      } catch (err) {
        console.error('Error cargando formulario:', err);
        setLoading(false);
      }
    };

    if (formId) {
      loadForm();
    }
  }, [formId]);

  // Validar paso actual
  const validateStep = (step) => {
    const fieldsInStep = form.fields.filter((f) => f.paso === step);
    const newErrors = {};

    fieldsInStep.forEach((field) => {
      if (field.tipo === 'titulo') return;
      const value = responses[field.id];

      if (field.obligatorio) {
        const isEmpty =
          !value || (Array.isArray(value) && value.length === 0);

        if (isEmpty) {
          newErrors[field.id] = `${field.label} es obligatorio`;
          return; // No validar más si está vacío
        }
      }

      // Validar email
      if (field.slug === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
          newErrors[field.id] = 'Por favor ingresá un email válido';
        }
      }

      // Validar max_length
      if (field.max_length && typeof value === 'string' && value.length > field.max_length) {
        newErrors[field.id] = `Máximo ${field.max_length} caracteres`;
      }

      // Validar max_seleccion
      if (field.max_seleccion && Array.isArray(value) && value.length > field.max_seleccion) {
        newErrors[field.id] = `Máximo ${field.max_seleccion} selecciones`;
      }
    });

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Cambiar valor de campo
  const handleFieldChange = (fieldId, value) => {
    setResponses((prev) => ({
      ...prev,
      [fieldId]: value,
    }));

    // Limpiar error si existe
    if (errors[fieldId]) {
      setErrors((prev) => ({
        ...prev,
        [fieldId]: null,
      }));
    }
  };

  // Navegar pasos
  const handleNext = () => {
    if (validateStep(currentStep)) {
      const maxStep = Math.max(...form.fields.map((f) => f.paso));
      if (currentStep < maxStep) {
        setCurrentStep(currentStep + 1);
        window.scrollTo(0, 0);
      }
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      window.scrollTo(0, 0);
    }
  };

  // Enviar formulario
  const handleSubmit = async () => {
    if (!validateStep(currentStep)) {
      return;
    }

    setSubmitting(true);

    try {
      // Find nombre/email by slug, or fallback to label pattern
      const findField = (slugs, labelPatterns) => {
        let field = form.fields.find((f) => f.slug && slugs.includes(f.slug.toLowerCase()));
        if (!field) {
          field = form.fields.find((f) =>
            labelPatterns.some((p) => f.label.toLowerCase().includes(p))
          );
        }
        return field;
      };

      const nombreField = findField(['nombre', 'name'], ['nombre', 'name']);
      const emailField = findField(['email', 'correo'], ['email', 'correo']);

      const payload = {
        form_id: formId,
        nombre: nombreField ? responses[nombreField.id] || '' : 'Anónimo',
        email: emailField ? responses[emailField.id] || '' : 'sin-email@formulario.local',
        respuestas: responses,
      };

      const res = await fetch(`${API_URL}/form_responses.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        const data = await res.json();
        onSubmit({
          ...data,
          nombre: payload.nombre,
          email: payload.email,
        });
      } else {
        setErrors({ submit: 'Error al enviar el formulario. Intenta nuevamente.' });
      }
    } catch (err) {
      console.error('Error enviando formulario:', err);
      setErrors({ submit: 'Error al enviar el formulario.' });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="form-container" style={{ textAlign: 'center', padding: '2rem' }}>
        <p style={{ color: 'var(--text-muted)' }}>Cargando formulario...</p>
      </div>
    );
  }

  if (!form) {
    return (
      <div className="form-container" style={{ textAlign: 'center', padding: '2rem' }}>
        <p style={{ color: 'var(--text-muted)' }}>Formulario no encontrado</p>
      </div>
    );
  }

  // Obtener campos del paso actual
  const fieldsInCurrentStep = form.fields
    .filter((f) => f.paso === currentStep)
    .sort((a, b) => a.orden - b.orden);

  const maxStep = Math.max(...form.fields.map((f) => f.paso));
  const progressPercent = ((currentStep + 1) / (maxStep + 1)) * 100;

  return (
    <div className="form-container">
      {/* Título del formulario */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 className="step-title" style={{ fontSize: '28px', marginBottom: '0.5rem' }}>
          {form.titulo}
        </h1>
        {form.cover_image_url && currentStep === 0 && (
          <img
            src={form.cover_image_url}
            alt={form.titulo}
            className="form-cover-image"
            style={{
              width: '100%',
              maxHeight: '280px',
              objectFit: 'cover',
              borderRadius: '12px',
              margin: '0.75rem 0 1rem',
              display: 'block',
            }}
          />
        )}
        {form.descripcion && (
          <p className="step-subtitle" style={{ marginBottom: '1rem' }}>
            {form.descripcion}
          </p>
        )}

        {/* Barra de progreso */}
        <div
          style={{
            height: '6px',
            backgroundColor: 'var(--border)',
            borderRadius: '3px',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              height: '100%',
              width: `${progressPercent}%`,
              backgroundColor: 'var(--primary)',
              transition: 'width 0.3s ease',
            }}
          />
        </div>
        <div style={{ marginTop: '0.5rem', textAlign: 'right', fontSize: '12px', color: 'var(--text-muted)' }}>
          Paso {currentStep + 1} de {maxStep + 1}
        </div>
      </div>

      {/* Campos del paso actual */}
      <div style={{ marginBottom: '2rem' }}>
        {fieldsInCurrentStep.map((field) => (
          <div key={field.id} style={{ marginBottom: '1.5rem' }}>
            <FieldRenderer
              field={field}
              value={responses[field.id]}
              onChange={(val) => handleFieldChange(field.id, val)}
              error={errors[field.id]}
            />
          </div>
        ))}
      </div>

      {/* Error de envío */}
      {errors.submit && (
        <div style={{
          backgroundColor: '#ffebee',
          color: '#d32f2f',
          padding: '1rem',
          borderRadius: '4px',
          marginBottom: '1rem',
        }}>
          {errors.submit}
        </div>
      )}

      {/* Botones de navegación */}
      <div className="button-nav">
        {currentStep > 0 && (
          <button className="button button-text" onClick={handlePrev} disabled={submitting}>
            ← Atrás
          </button>
        )}

        <div style={{ flex: 1 }} />

        {currentStep < maxStep ? (
          <button className="button button-primary" onClick={handleNext} disabled={submitting}>
            Siguiente →
          </button>
        ) : (
          <button
            className="button button-primary"
            onClick={handleSubmit}
            disabled={submitting}
            style={{ opacity: submitting ? 0.6 : 1 }}
          >
            {submitting ? 'Enviando...' : 'Enviar →'}
          </button>
        )}
      </div>
    </div>
  );
}
