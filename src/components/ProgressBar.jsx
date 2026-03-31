export default function ProgressBar({ step }) {
  const progress = (step / 5) * 100;

  return (
    <div className="progress-bar-container">
      <div className="progress-icon">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <circle cx="12" cy="12" r="10" />
          <circle cx="12" cy="12" r="6" />
          <circle cx="12" cy="12" r="2" />
        </svg>
      </div>
      <span className="progress-label">Radar de Proyectos</span>
      <div className="progress-bar">
        <div className="progress-fill" style={{ width: `${progress}%` }} />
      </div>
      <span className="progress-step">Paso {step}/5</span>
    </div>
  );
}
