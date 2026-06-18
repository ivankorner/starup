import { useState } from 'react';
import Swal from 'sweetalert2';

const API_URL = '/api';

export default function WorkAreasManager({ token, areas, onClose, onChanged }) {
  const [nombre, setNombre] = useState('');
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const handleCreate = async (e) => {
    e.preventDefault();
    const trimmed = nombre.trim();

    if (!trimmed) return;

    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/work_areas.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ nombre: trimmed }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Error al crear área');
      }

      setNombre('');
      onChanged();
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Error', text: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (area) => {
    const result = await Swal.fire({
      title: '¿Eliminar esta área?',
      text: 'Solo se puede eliminar si no está asignada a usuarios.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d32f2f',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    });

    if (!result.isConfirmed) return;

    setDeletingId(area.id);

    try {
      const res = await fetch(`${API_URL}/work_areas.php?id=${area.id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Error al eliminar área');
      }

      onChanged();
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Error', text: err.message });
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '640px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '20px', fontWeight: '600' }}>Áreas de Trabajo</h2>
          <button className="button button-text" onClick={onClose}>✕</button>
        </div>

        <form onSubmit={handleCreate} style={{ display: 'grid', gap: '1rem', marginBottom: '1.5rem' }}>
          <div className="form-group">
            <label className="form-label required">Nueva área</label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              placeholder="Ej: Innovación"
              disabled={loading}
              required
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button type="submit" className="button button-primary" disabled={loading}>
              {loading ? 'Agregando...' : 'Agregar área'}
            </button>
          </div>
        </form>

        <div style={{ borderTop: '1px solid var(--border)', paddingTop: '1rem' }}>
          <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '0.75rem' }}>Áreas registradas</div>
          {areas.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', fontSize: '14px' }}>No hay áreas cargadas todavía.</p>
          ) : (
            <div style={{ display: 'grid', gap: '0.75rem' }}>
              {areas.map((area) => (
                <div
                  key={area.id}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '1rem',
                    padding: '0.85rem 1rem',
                    border: '1px solid var(--border)',
                    borderRadius: '12px',
                  }}
                >
                  <div>
                    <div style={{ fontWeight: '600', color: 'var(--text-body)' }}>{area.nombre}</div>
                    <div style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
                      {area.activo ? 'Activa' : 'Inactiva'}
                    </div>
                  </div>
                  <button
                    type="button"
                    className="button button-text"
                    style={{ color: '#d32f2f', fontSize: '13px' }}
                    onClick={() => handleDelete(area)}
                    disabled={deletingId === area.id}
                  >
                    {deletingId === area.id ? 'Eliminando...' : 'Eliminar'}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}