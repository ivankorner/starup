import { useState, useEffect } from 'react';
import UserModal from './UserModal';
import Swal from 'sweetalert2';

const API_URL = '/api';

export default function UsersList({ token }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = () => {
    setLoading(true);
    fetch(`${API_URL}/users.php`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error('Error cargando usuarios');
      })
      .then((data) => {
        setUsers(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: '¿Eliminar este usuario?',
      text: 'Esta acción no se puede deshacer',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d32f2f',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    });
    if (!result.isConfirmed) return;

    fetch(`${API_URL}/users.php?id=${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
      .then((res) => {
        if (res.ok) {
          Swal.fire({ icon: 'success', title: 'Usuario eliminado', timer: 1500, showConfirmButton: false });
          loadUsers();
        }
      })
      .catch((err) => console.error(err));
  };

  return (
    <>
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '600' }}>Gestión de Usuarios</h2>
          <button className="button button-primary" onClick={() => setShowModal(true)}>
            + Nuevo Usuario
          </button>
        </div>

        {loading ? (
          <p style={{ color: 'var(--text-muted)' }}>Cargando...</p>
        ) : users.length === 0 ? (
          <p style={{ color: 'var(--text-muted)' }}>No hay usuarios</p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid var(--border)' }}>
                  <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', fontSize: '14px' }}>Nombre</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', fontSize: '14px' }}>Email</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', fontSize: '14px' }}>Rol</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', fontSize: '14px' }}>Estado</th>
                  <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', fontSize: '14px' }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} style={{ borderBottom: '1px solid var(--border)' }}>
                    <td style={{ padding: '12px', fontSize: '14px' }}>{user.nombre}</td>
                    <td style={{ padding: '12px', fontSize: '14px', color: 'var(--text-muted)' }}>{user.email}</td>
                    <td style={{ padding: '12px', fontSize: '14px' }}>
                      <span style={{ fontWeight: '600', color: user.role === 'admin' ? 'var(--primary)' : 'var(--text-body)' }}>
                        {user.role}
                      </span>
                    </td>
                    <td style={{ padding: '12px', fontSize: '14px' }}>
                      <span style={{ color: user.activo ? 'var(--green-text)' : 'var(--red-text)' }}>
                        {user.activo ? '✓ Activo' : '✗ Inactivo'}
                      </span>
                    </td>
                    <td style={{ padding: '12px', fontSize: '14px' }}>
                      <button
                        className="button button-text"
                        onClick={() => handleDelete(user.id)}
                        style={{ fontSize: '12px', color: '#d32f2f' }}
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {showModal && (
        <UserModal onClose={() => { setShowModal(false); loadUsers(); }} token={token} />
      )}
    </>
  );
}
