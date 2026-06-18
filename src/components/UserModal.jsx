import { useEffect, useState } from 'react';

const API_URL = '/api';

export default function UserModal({ onClose, onSaved, onOpenAreasManager, token, user, areas }) {
  const isEditing = !!user;
  const [nombre, setNombre] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [areaId, setAreaId] = useState('');
  const [activo, setActivo] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    setNombre(user?.nombre || '');
    setEmail(user?.email || '');
    setAreaId(user?.area_id ? String(user.area_id) : '');
    setActivo(user ? (user.activo ? 1 : 0) : 1);
    setPassword('');
    setError('');
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const payload = {
      nombre,
      area_id: areaId || null,
    };

    if (isEditing) {
      payload.activo = Number(activo);
      if (password) {
        payload.password = password;
      }
    } else {
      payload.email = email;
      payload.password = password;
      payload.role = 'admin';
    }

    try {
      const res = await fetch(`${API_URL}/users.php${isEditing ? `?id=${user.id}` : ''}`, {
        method: isEditing ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        if (onSaved) onSaved();
        else onClose();
      } else {
        const data = await res.json();
        setError(data.error || (isEditing ? 'Error al guardar usuario' : 'Error al crear usuario'));
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
          <h2 style={{ fontSize: '20px', fontWeight: '600' }}>{isEditing ? 'Editar Usuario' : 'Nuevo Usuario'}</h2>
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
              readOnly={isEditing}
              style={isEditing ? { backgroundColor: 'var(--bg-light)', cursor: 'not-allowed' } : undefined}
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Área de trabajo</label>
            <select
              value={areaId}
              onChange={(e) => setAreaId(e.target.value)}
              disabled={loading}
            >
              <option value="">Sin área</option>
              {areas.map((area) => (
                <option key={area.id} value={area.id}>
                  {area.nombre}
                </option>
              ))}
            </select>
            {areas.length === 0 && onOpenAreasManager && (
              <button
                type="button"
                className="button button-text"
                onClick={onOpenAreasManager}
                style={{ marginTop: '0.5rem', padding: 0, justifyContent: 'flex-start' }}
              >
                No hay áreas cargadas. Administrarlas ahora.
              </button>
            )}
          </div>

          {isEditing && (
            <div className="form-group">
              <label className="form-label">Estado</label>
              <select value={activo} onChange={(e) => setActivo(Number(e.target.value))} disabled={loading}>
                <option value={1}>Activo</option>
                <option value={0}>Inactivo</option>
              </select>
            </div>
          )}

          <div className="form-group">
            <label className={`form-label ${isEditing ? '' : 'required'}`}>Contraseña {isEditing ? '(opcional)' : ''}</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={isEditing ? 'Dejar vacío para no cambiar' : 'Mín. 6 caracteres'}
              required={!isEditing}
              disabled={loading}
            />
          </div>

          {error && <div className="error-message" style={{ marginBottom: '1rem' }}>{error}</div>}

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
            <button type="button" className="button button-text" onClick={onClose} disabled={loading}>
              Cancelar
            </button>
            <button type="submit" className="button button-primary" disabled={loading}>
              {loading ? (isEditing ? 'Guardando...' : 'Creando...') : (isEditing ? 'Guardar Cambios' : 'Crear Usuario')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
