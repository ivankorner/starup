import { useState, useEffect } from 'react';
import StepIntro from './components/StepIntro';
import Step1Idea from './components/Step1Idea';
import Step2Dolor from './components/Step2Dolor';
import Step3Madurez from './components/Step3Madurez';
import Step4Vision from './components/Step4Vision';
import Step5Viabilidad from './components/Step5Viabilidad';
import StepDone from './components/StepDone';
import Dashboard from './components/Dashboard';
import UsersList from './components/UsersList';
import LoginScreen from './components/LoginScreen';
import FormBanner from './components/FormBanner';
import { calcularScore, clasificarVeredicto } from './utils/scoring';
import { useAuth } from './hooks/useAuth';
import './styles.css';

const initialFormData = {
  // Intro
  nombre: '',
  email: '',
  nombreProyecto: '',

  // Paso 1
  descripcion: '',
  sector: '',
  tweet: '',

  // Paso 2
  comoResuelven: '',
  dificultades: [],
  urgencia: '',

  // Paso 3
  madurez: '',

  // Paso 4
  dispositivo: '',
  usoDescripcion: '',
  necesidades: [],

  // Paso 5
  timeline: '',
  presupuesto: '',
  budgetScore: 0,
  equipoInterno: '',
  teamScore: 0,
  notasAdicionales: '',

  // Calculados al enviar
  score: 0,
  veredicto: '',
};

export default function App() {
  const auth = useAuth();
  const [step, setStep] = useState('intro');
  const [formData, setFormData] = useState(initialFormData);
  const [submissions, setSubmissions] = useState([]);
  const [selectedSubmissionId, setSelectedSubmissionId] = useState(null);

  // Cargar submissions del localStorage al montar (para desarrollo, fallback)
  useEffect(() => {
    const saved = localStorage.getItem('radar_submissions');
    if (saved) {
      setSubmissions(JSON.parse(saved));
    }
  }, []);

  // Si está cargando auth, mostrar loading
  if (auth.loading) {
    return (
      <div className="app-container">
        <div className="main-content" style={{ justifyContent: 'center', alignItems: 'center' }}>
          <div style={{ textAlign: 'center', color: 'var(--text-muted)' }}>
            <p>Cargando...</p>
          </div>
        </div>
      </div>
    );
  }

  // Si no está autenticado y trata de acceder al dashboard, mostrar login
  if (!auth.isAuthenticated && step !== 'intro' && step !== 'done' && (step >= 1 && step <= 5)) {
    // Usuario está en el formulario público, permite continuar
  } else if (!auth.isAuthenticated && (step.toString().includes('admin') || step === 'admin')) {
    return <LoginScreen onLogin={auth.login} />;
  }

  const handleNext = (stepNumber) => {
    setStep(stepNumber);
    window.scrollTo(0, 0);
  };

  const handlePrev = () => {
    if (step === 1) {
      setStep('intro');
    } else if (typeof step === 'number') {
      setStep(step - 1);
    }
    window.scrollTo(0, 0);
  };

  const handleSubmit = () => {
    const score = calcularScore(formData);
    const veredicto = clasificarVeredicto(score);

    const submission = {
      id: Date.now(),
      date: new Date().toLocaleDateString('es-AR'),
      ...formData,
      score,
      veredicto,
    };

    const updated = [...submissions, submission];
    setSubmissions(updated);
    localStorage.setItem('radar_submissions', JSON.stringify(updated));

    setStep('done');
    window.scrollTo(0, 0);
  };

  const handleRestart = () => {
    setFormData(initialFormData);
    setStep('intro');
    window.scrollTo(0, 0);
  };

  const handleShowAdmin = () => {
    setStep('admin');
    setSelectedSubmissionId(null);
    window.scrollTo(0, 0);
  };

  const handleSelectSubmission = (id) => {
    setSelectedSubmissionId(id);
  };

  const handleBackFromDetail = () => {
    setSelectedSubmissionId(null);
  };

  const selectedSubmission = submissions.find((s) => s.id === selectedSubmissionId);

  return (
    <div className="app-container">
      <header className="header">
        <div className="header-title">
          <span style={{ fontSize: '18px' }}>📡</span>
          Radar de Proyectos
        </div>
        <nav className="header-nav">
          <button
            className={step !== 'admin' && step !== 'done' ? 'active' : ''}
            onClick={() => {
              setStep('intro');
              setFormData(initialFormData);
              window.scrollTo(0, 0);
            }}
          >
            Enviar Iniciativa
          </button>
          <button
            className={step === 'admin' ? 'active' : ''}
            onClick={handleShowAdmin}
          >
            Dashboard
          </button>
          {auth.isAuthenticated && (
            <div className="header-nav-auth">
              {auth.isAdmin && (
                <button onClick={() => setStep('admin-usuarios')}>
                  👥 Usuarios
                </button>
              )}
              <button
                className="header-nav-user"
                title={`${auth.user.nombre} (${auth.user.role})`}
              >
                👤 {auth.user.nombre}
              </button>
              <button
                onClick={() => {
                  auth.logout();
                  setStep('intro');
                  window.scrollTo(0, 0);
                }}
              >
                Salir
              </button>
            </div>
          )}
        </nav>
      </header>

      {(step === 'intro' || (typeof step === 'number' && step >= 1 && step <= 5)) && (
        <FormBanner step={step} />
      )}

      <main className="main-content">
        {step === 'intro' && (
          <StepIntro
            formData={formData}
            setFormData={setFormData}
            onNext={() => handleNext(1)}
          />
        )}

        {step === 1 && (
          <Step1Idea
            formData={formData}
            setFormData={setFormData}
            onNext={() => handleNext(2)}
            onPrev={() => handlePrev()}
          />
        )}

        {step === 2 && (
          <Step2Dolor
            formData={formData}
            setFormData={setFormData}
            onNext={() => handleNext(3)}
            onPrev={() => handlePrev()}
          />
        )}

        {step === 3 && (
          <Step3Madurez
            formData={formData}
            setFormData={setFormData}
            onNext={() => handleNext(4)}
            onPrev={() => handlePrev()}
          />
        )}

        {step === 4 && (
          <Step4Vision
            formData={formData}
            setFormData={setFormData}
            onNext={() => handleNext(5)}
            onPrev={() => handlePrev()}
          />
        )}

        {step === 5 && (
          <Step5Viabilidad
            formData={formData}
            setFormData={setFormData}
            onNext={handleSubmit}
            onPrev={() => handlePrev()}
          />
        )}

        {step === 'done' && <StepDone onRestart={handleRestart} />}

        {step === 'admin' && auth.isAuthenticated && (
          <Dashboard
            user={auth.user}
            token={auth.token}
          />
        )}

        {step === 'admin-usuarios' && auth.isAuthenticated && (
          <div className="dashboard-container">
            <button
              className="button button-text"
              onClick={() => setStep('admin')}
              style={{ marginBottom: '1.5rem' }}
            >
              ← Volver al Dashboard
            </button>
            <UsersList token={auth.token} />
          </div>
        )}
      </main>
    </div>
  );
}
