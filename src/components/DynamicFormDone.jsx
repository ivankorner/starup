export default function DynamicFormDone({ formTitle, nombre, email, onRestart }) {
  return (
    <div className="form-container" style={{ textAlign: 'center' }}>
      <div style={{ marginBottom: '2rem' }}>
        <div
          style={{
            width: '60px',
            height: '60px',
            backgroundColor: 'var(--primary)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '32px',
            margin: '0 auto 1rem',
          }}
        >
          ✓
        </div>

        <h1 className="step-title" style={{ marginBottom: '0.5rem' }}>
          ¡Gracias {nombre}!
        </h1>
        <p className="step-subtitle" style={{ marginBottom: '1.5rem' }}>
          Tu respuesta al formulario "{formTitle}" fue recibida correctamente.
        </p>

        {email && (
          <p style={{ fontSize: '14px', color: 'var(--text-muted)', marginBottom: '1rem' }}>
            Te enviaremos actualizaciones a <strong>{email}</strong>
          </p>
        )}

        <div
          style={{
            backgroundColor: 'var(--primary-light)',
            padding: '1.5rem',
            borderRadius: '8px',
            marginBottom: '2rem',
          }}
        >
          <p style={{ fontSize: '14px', color: 'var(--primary)', marginBottom: 0 }}>
            Nos pondremos en contacto pronto para más detalles.
          </p>
        </div>
      </div>

      <div className="button-nav" style={{ justifyContent: 'center', gap: '1rem' }}>
        <button className="button button-primary" onClick={onRestart}>
          Enviar otra respuesta
        </button>
        <a href="/" className="button button-text" style={{ textDecoration: 'none' }}>
          Volver al inicio
        </a>
      </div>
    </div>
  );
}
