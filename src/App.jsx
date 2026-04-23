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
import DynamicForm from './components/DynamicForm/DynamicForm';
import DynamicFormDone from './components/DynamicFormDone';
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
  const [publishedForms, setPublishedForms] = useState([]);
  const [loadingForms, setLoadingForms] = useState(true);
  const [selectedFormId, setSelectedFormId] = useState(null);
  const [dynamicFormResponse, setDynamicFormResponse] = useState(null);
  const [formKey, setFormKey] = useState(0);

  // Detectar #admin en la URL para mostrar login
  useEffect(() => {
    const checkHash = () => {
      if (window.location.hash === '#admin') {
        setStep('admin');
        window.location.hash = '';
      }
    };
    checkHash();
    window.addEventListener('hashchange', checkHash);
    return () => window.removeEventListener('hashchange', checkHash);
  }, []);

  // Cargar formularios publicados
  useEffect(() => {
    const loadPublishedForms = async () => {
      try {
        const res = await fetch('/api/forms.php?estado=publicado');
        if (res.ok) {
          const data = await res.json();
          setPublishedForms(data);
          // Auto-seleccionar si hay exactamente 1
          if (data.length === 1) {
            setSelectedFormId(data[0].id);
          }
        }
      } catch (err) {
        console.error('Error cargando formularios:', err);
      } finally {
        setLoadingForms(false);
      }
    };

    loadPublishedForms();
  }, []);

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
  const publicSteps = ['intro', 'done', 'dynamic-done'];
  const isPublicStep = publicSteps.includes(step) || (typeof step === 'number' && step >= 1 && step <= 5);
  if (!auth.isAuthenticated && !isPublicStep) {
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

  // Handlers para formularios dinámicos
  const handleSelectForm = (formId) => {
    setSelectedFormId(formId);
  };

  const handleDynamicFormSubmit = (response) => {
    setDynamicFormResponse(response);
    setStep('dynamic-done');
    window.scrollTo(0, 0);
  };

  const handleRestartDynamicForm = () => {
    setDynamicFormResponse(null);
    setFormKey((k) => k + 1); // Forzar re-mount del DynamicForm
    // Re-seleccionar si hay un solo formulario, sino mostrar selector
    if (publishedForms.length === 1) {
      setSelectedFormId(publishedForms[0].id);
    } else {
      setSelectedFormId(null);
    }
    setStep('intro');
    window.scrollTo(0, 0);
  };

  const selectedSubmission = submissions.find((s) => s.id === selectedSubmissionId);

  return (
    <div className="app-container">
      <header className="header">
        <div className="header-title">
          <img
            src="/branding/logo-simi.svg"
            alt="SIMI"
            className="brand-mark"
          />
          <div className="brand-copy">
            <span className="brand-kicker">Gestion de Proyectos</span>
            <span className="brand-name">Plataforma SIMI</span>
          </div>
        </div>
        <nav className="header-nav">
          {auth.isAuthenticated && (
            <>
              <button
                className={step !== 'admin' && step !== 'done' && step !== 'dynamic-done' && step !== 'admin-usuarios' ? 'active' : ''}
                onClick={() => {
                  setStep('intro');
                  setFormData(initialFormData);
                  setDynamicFormResponse(null);
                  setFormKey((k) => k + 1);
                  if (publishedForms.length === 1) {
                    setSelectedFormId(publishedForms[0].id);
                  } else {
                    setSelectedFormId(null);
                  }
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
            </>
          )}
        </nav>
      </header>

      {/* FormBanner solo para el flujo legacy de pasos hardcodeados */}
      {(typeof step === 'number' && step >= 1 && step <= 5) && (
        <FormBanner step={step} />
      )}

      <main className="main-content">
        {step === 'intro' && (
          <>
            {loadingForms ? (
              <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem' }}>
                <p>Cargando formularios...</p>
              </div>
            ) : publishedForms.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '3rem 2rem',
                backgroundColor: 'var(--bg-light)',
                borderRadius: '8px',
                maxWidth: '600px',
                margin: '2rem auto'
              }}>
                <h2 style={{ color: 'var(--text-main)', marginBottom: '1rem' }}>No hay formularios disponibles</h2>
                <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
                  Por el momento no hay formularios publicados. Por favor, intenta nuevamente más tarde.
                </p>
              </div>
            ) : selectedFormId ? (
              <DynamicForm
                key={formKey}
                formId={selectedFormId}
                onSubmit={handleDynamicFormSubmit}
              />
            ) : (
              // Selector de formularios (solo si hay 2+, porque 1 se auto-selecciona)
              <div className="form-container">
                <h1 className="step-title">Elige un formulario</h1>
                <p className="step-subtitle">Selecciona cuál deseas completar:</p>

                <div style={{ display: 'grid', gap: '1rem', marginBottom: '2rem' }}>
                  {publishedForms.map((form) => (
                    <button
                      key={form.id}
                      className="form-selector-card"
                      onClick={() => handleSelectForm(form.id)}
                    >
                      <div style={{ fontWeight: '600', color: 'var(--text-main)', marginBottom: '0.5rem', fontSize: '16px' }}>
                        {form.titulo}
                      </div>
                      {form.descripcion && (
                        <div style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
                          {form.descripcion}
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </>
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

        {step === 'dynamic-done' && dynamicFormResponse && (
          <DynamicFormDone
            formTitle={publishedForms.find((f) => f.id === selectedFormId)?.titulo || 'Formulario'}
            nombre={dynamicFormResponse.nombre || ''}
            email={dynamicFormResponse.email || ''}
            onRestart={handleRestartDynamicForm}
          />
        )}

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

      <footer className="site-footer">
        <div className="site-footer-inner">
          <div className="site-footer-copy">
            <p>SIMI · Gestion de proyectos e iniciativas</p>
          </div>
          <div className="site-footer-social">
            {/* LinkedIn */}
            <a href="https://www.linkedin.com/company/silicon-misiones" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
              </svg>
            </a>
            {/* YouTube */}
            <a href="https://www.youtube.com/@siliconmisiones" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
            </a>
            {/* Instagram */}
            <a href="https://www.instagram.com/siliconmisiones" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
              </svg>
            </a>
          </div>
          <img
            className="site-footer-visual"
            src="/branding/footer-simi.svg"
            alt="SIMI footer"
          />
        </div>
      </footer>
    </div>
  );
}
