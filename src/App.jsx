import { useState, useEffect } from 'react';
import StepIntro from './components/StepIntro';
import Step1Idea from './components/Step1Idea';
import Step2Dolor from './components/Step2Dolor';
import Step3Madurez from './components/Step3Madurez';
import Step4Vision from './components/Step4Vision';
import Step5Viabilidad from './components/Step5Viabilidad';
import StepDone from './components/StepDone';
import AdminPanel from './components/AdminPanel';
import AdminDetail from './components/AdminDetail';
import { calcularScore, clasificarVeredicto } from './utils/scoring';
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
  const [step, setStep] = useState('intro');
  const [formData, setFormData] = useState(initialFormData);
  const [submissions, setSubmissions] = useState([]);
  const [selectedSubmissionId, setSelectedSubmissionId] = useState(null);

  // Cargar submissions del localStorage al montar
  useEffect(() => {
    const saved = localStorage.getItem('radar_submissions');
    if (saved) {
      setSubmissions(JSON.parse(saved));
    }
  }, []);

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
            Panel evaluador
          </button>
        </nav>
      </header>

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

        {step === 'admin' && (
          <>
            {selectedSubmission ? (
              <AdminDetail
                submission={selectedSubmission}
                onBack={handleBackFromDetail}
              />
            ) : (
              <AdminPanel
                submissions={submissions}
                onSelectSubmission={handleSelectSubmission}
              />
            )}
          </>
        )}
      </main>
    </div>
  );
}
