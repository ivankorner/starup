export default function StepDone({ onRestart }) {
  return (
    <div className="confirmation-container">
      <div className="confirmation-icon">✓</div>
      <h1 className="confirmation-title">¡Recibimos tu iniciativa!</h1>
      <p className="confirmation-desc">
        Gracias por tu tiempo. Nuestro equipo evaluará esta información para entender el
        grado de madurez y prioridad de tu proyecto.
      </p>

      <div className="confirmation-box">
        <div className="confirmation-box-title">Próximos pasos:</div>
        <ul>
          <li>Un analista revisará este Triage y te contactará a la brevedad.</li>
          <li>
            Si el proyecto avanza, te invitaremos a una reunión de descubrimiento (Fase 2)
            para profundizar.
          </li>
          <li>Nos contactaremos al correo o teléfono registrado.</li>
        </ul>
      </div>

      <button className="button button-text" onClick={onRestart}>
        Enviar otra iniciativa
      </button>
    </div>
  );
}
