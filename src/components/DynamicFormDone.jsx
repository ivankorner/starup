export default function DynamicFormDone({ formTitle, nombre, email, onRestart }) {
  return (
    <div className="form-container dynamic-form-done">
      <div className="dynamic-form-done__header">
        <div className="dynamic-form-done__icon" aria-hidden="true">
          <svg viewBox="0 0 64 64" className="dynamic-form-done__icon-svg">
            <circle cx="32" cy="32" r="32" />
            <path d="M21 33.5L29 41.5L44 22.5" />
          </svg>
        </div>

        <h1 className="step-title dynamic-form-done__title">
          ¡Gracias {nombre}!
        </h1>
        <p className="step-subtitle dynamic-form-done__subtitle">
          Tu respuesta al formulario "{formTitle}" fue recibida correctamente.
        </p>

        {email && (
          <p className="dynamic-form-done__email">
            Te enviaremos actualizaciones a <strong>{email}</strong>
          </p>
        )}

        <div className="dynamic-form-done__notice">
          <p className="dynamic-form-done__notice-text">
            Nos pondremos en contacto pronto para más detalles.
          </p>
        </div>
      </div>

      <div className="button-nav dynamic-form-done__actions">
        <button className="button button-primary" onClick={onRestart}>
          Enviar otra respuesta
        </button>
        <a href="/" className="button button-text dynamic-form-done__link">
          Volver al inicio
        </a>
      </div>
    </div>
  );
}
