import { useState, useEffect } from 'react';
import DashboardStats from './DashboardStats';
import SubmissionsTable from './SubmissionsTable';
import FormsList from './FormsList';

const API_URL = '/api';

export default function Dashboard({ user, token }) {
  const [activeTab, setActiveTab] = useState('propuestas');
  const [submissions, setSubmissions] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    startup: 0,
    potencial: 0,
  });
  const [loading, setLoading] = useState(true);

  // Cargar submissions
  useEffect(() => {
    loadSubmissions();
  }, []);

  const loadSubmissions = () => {
    setLoading(true);
    fetch(`${API_URL}/submissions.php`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          throw new Error('Error al cargar submissions');
        }
      })
      .then((data) => {
        setSubmissions(data);

        // Calcular stats
        const total = data.length;
        const startup = data.filter((s) => s.veredicto === 'startup').length;
        const potencial = data.filter((s) => s.veredicto === 'potencial' || s.veredicto === 'no-califica').length;

        setStats({
          total,
          startup,
          potencial,
        });

        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <div>
          <h1 className="dashboard-title">Dashboard</h1>
          <p className="admin-subtitle">Bienvenido, {user.nombre}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="dashboard-tabs">
        <button
          className={`dashboard-tab ${activeTab === 'propuestas' ? 'active' : ''}`}
          onClick={() => setActiveTab('propuestas')}
        >
          Propuestas
        </button>
        {user.role === 'admin' && (
          <button
            className={`dashboard-tab ${activeTab === 'formularios' ? 'active' : ''}`}
            onClick={() => setActiveTab('formularios')}
          >
            Formularios
          </button>
        )}
      </div>

      {/* Tab: Propuestas */}
      {activeTab === 'propuestas' && (
        <div className="dashboard-content">
          <DashboardStats stats={stats} />
          <SubmissionsTable
            submissions={submissions}
            token={token}
            onRefresh={loadSubmissions}
            loading={loading}
          />
        </div>
      )}

      {/* Tab: Formularios (solo admin) */}
      {activeTab === 'formularios' && user.role === 'admin' && (
        <div className="dashboard-content">
          <FormsList token={token} />
        </div>
      )}
    </div>
  );
}
