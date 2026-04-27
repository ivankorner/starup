import { useState } from 'react';

export default function LoginScreen({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await onLogin(email, password);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-header">
          <img src="/branding/logonuevo.svg" alt="SIMI" style={{ height: '60px', marginBottom: '1rem', display: 'block', margin: '0 auto 1rem' }} />
          <h1>Radar de Proyectos</h1>
          <p className="login-subtitle">Panel del Evaluador</p>
        </div>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label className="form-label required">Correo electrónico</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
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
              placeholder="••••••"
              required
              disabled={loading}
            />
          </div>

          {error && <div className="error-message" style={{ marginBottom: '1rem' }}>{error}</div>}

          <button
            type="submit"
            className="button button-primary"
            style={{ width: '100%' }}
            disabled={loading}
          >
            {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>
        </form>

      </div>
    </div>
  );
}
