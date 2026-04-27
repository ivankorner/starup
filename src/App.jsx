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
            src="/branding/logonuevo.svg"
            alt="SIMI"
            className="brand-mark"
          />
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
        <div className="site-footer-media">
          <img
            className="site-footer-visual"
            src="/branding/footer-simi.png"
            alt="Footer de Silicon Misiones"
          />
          <a
            className="site-footer-social-link site-footer-social-link--instagram"
            href="https://www.instagram.com/siliconmisiones/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Instagram de Silicon Misiones"
          />
          <a
            className="site-footer-social-link site-footer-social-link--linkedin"
            href="https://www.linkedin.com/company/silicon-misiones/posts/?feedView=all"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn de Silicon Misiones"
          />
          <a
            className="site-footer-social-link site-footer-social-link--youtube"
            href="https://www.youtube.com/channel/UCfvqZja9ZO47nmPGAn8-dYw"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="YouTube de Silicon Misiones"
          />
        </div>
      </footer>
    </div>
  );
}
