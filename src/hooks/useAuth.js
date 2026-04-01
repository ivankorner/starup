import { useState, useEffect, useCallback } from 'react';

const API_URL = '/api';

export function useAuth() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Cargar token del localStorage al montar
  useEffect(() => {
    const savedToken = localStorage.getItem('auth_token');
    if (savedToken) {
      setToken(savedToken);
      // Verificar que el token sea válido
      fetchCurrentUser(savedToken);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchCurrentUser = useCallback((authToken) => {
    fetch(`${API_URL}/auth/me.php`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${authToken}`,
      },
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else {
          throw new Error('Token inválido');
        }
      })
      .then((data) => {
        setUser(data.user);
        setLoading(false);
      })
      .catch((err) => {
        // Token expirado o inválido
        localStorage.removeItem('auth_token');
        setToken(null);
        setUser(null);
        setLoading(false);
      });
  }, []);

  const login = useCallback((email, password) => {
    setLoading(true);
    setError(null);

    return fetch(`${API_URL}/auth/login.php`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    })
      .then((res) => {
        if (res.ok) {
          return res.json();
        } else if (res.status === 401) {
          throw new Error('Credenciales inválidas');
        } else {
          throw new Error('Error al iniciar sesión');
        }
      })
      .then((data) => {
        if (data.success && data.token) {
          setToken(data.token);
          setUser(data.user);
          localStorage.setItem('auth_token', data.token);
          setLoading(false);
          return data;
        } else {
          throw new Error('Respuesta inválida del servidor');
        }
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
        throw err;
      });
  }, []);

  const logout = useCallback(() => {
    return fetch(`${API_URL}/auth/logout.php`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    })
      .then(() => {
        setToken(null);
        setUser(null);
        localStorage.removeItem('auth_token');
      })
      .catch((err) => {
        // Logout local aunque falle en servidor
        setToken(null);
        setUser(null);
        localStorage.removeItem('auth_token');
      });
  }, [token]);

  const isAuthenticated = () => {
    return user !== null && token !== null;
  };

  const isAdmin = () => {
    return user && user.role === 'admin';
  };

  return {
    user,
    token,
    loading,
    error,
    login,
    logout,
    isAuthenticated: isAuthenticated(),
    isAdmin: isAdmin(),
  };
}
