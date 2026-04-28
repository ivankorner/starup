import { useState, useEffect } from 'react';
import ResponsesTable from './ResponsesTable';
import FormsList from './FormsList';

const API_URL = '/api';

export default function Dashboard({ user, token }) {
  const [activeTab, setActiveTab] = useState('respuestas');
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Cargar respuestas
  useEffect(() => {
    loadSubmissions();
  }, []);

  const loadSubmissions = () => {
    setLoading(true);
    fetch(`${API_URL}/form_responses.php`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          throw new Error('Error al cargar respuestas');
        }
      })
      .then((data) => {
        setSubmissions(data);
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
          className={`dashboard-tab ${activeTab === 'respuestas' ? 'active' : ''}`}
          onClick={() => setActiveTab('respuestas')}
        >
          Respuestas
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

      {/* Tab: Respuestas */}
      {activeTab === 'respuestas' && (
        <div className="dashboard-content">
          <ResponsesTable
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
