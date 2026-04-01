import { useState, useEffect } from 'react';

const API_URL = '/api';

export default function FormsList({ token }) {
  const [forms, setForms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadForms();
  }, []);

  const loadForms = () => {
    setLoading(true);
    fetch(`${API_URL}/forms.php`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error('Error cargando formularios');
      })
      .then((data) => {
        setForms(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '1.5rem' }}>
          Gestión de Formularios
        </h2>

        {loading ? (
          <p style={{ color: 'var(--text-muted)' }}>Cargando...</p>
        ) : forms.length === 0 ? (
          <p style={{ color: 'var(--text-muted)' }}>No hay formularios</p>
        ) : (
          <div className="submissions-list">
            {forms.map((form) => (
              <div key={form.id} className="submission-card">
                <div style={{ marginBottom: '0.5rem' }}>
                  <div className="submission-name">{form.titulo}</div>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                    {form.descripcion}
                  </p>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span
                    style={{
                      fontSize: '12px',
                      fontWeight: '600',
                      color: form.estado === 'publicado' ? 'var(--green-text)' : 'var(--amber-text)',
                    }}
                  >
                    {form.estado === 'publicado' ? '✓ Publicado' : form.estado === 'borrador' ? '✎ Borrador' : '✕ Archivado'}
                  </span>
                  <button className="button button-text" style={{ fontSize: '12px' }}>
                    Editar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div style={{ padding: '1rem', background: 'var(--primary-light)', borderRadius: '8px', borderLeft: '4px solid var(--primary)' }}>
        <p style={{ fontSize: '13px', color: 'var(--text-body)' }}>
          💡 <strong>Nota:</strong> El editor de formularios está en desarrollo. Por ahora puedes ver los formularios existentes.
        </p>
      </div>
    </div>
  );
}
