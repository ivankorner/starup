import { useState } from 'react';

const API_URL = '/api';

export default function UserModal({ onClose, token }) {
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('evaluador');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch(`${API_URL}/users.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          nombre,
          email,
          password,
          role,
        }),
      });

      if (res.ok) {
        onClose();
      } else {
        const data = await res.json();
        setError(data.error || 'Error al crear usuario');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '600' }}>Nuevo Usuario</h2>
          <button className="button button-text" onClick={onClose}>
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label required">Nombre</label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label className="form-label required">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label className="form-label required">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mín. 6 caracteres"
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label className="form-label required">Rol</label>
            <select value={role} onChange={(e) => setRole(e.target.value)} disabled={loading}>
              <option value="evaluador">Evaluador (ver propuestas)</option>
              <option value="admin">Administrador (control total)</option>
            </select>
          </div>

          {error && <div className="error-message" style={{ marginBottom: '1rem' }}>{error}</div>}

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
            <button type="button" className="button button-text" onClick={onClose} disabled={loading}>
              Cancelar
            </button>
            <button type="submit" className="button button-primary" disabled={loading}>
              {loading ? 'Creando...' : 'Crear Usuario'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
