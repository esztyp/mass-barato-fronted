import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('mb_token') || '');
  const [usuario, setUsuario] = useState(() => {
    const guardado = localStorage.getItem('mb_usuario');
    return guardado ? JSON.parse(guardado) : null;
  });
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    // Valida que el token siga siendo válido al recargar la página
    const validar = async () => {
      if (!token) {
        setCargando(false);
        return;
      }
      try {
        const res = await fetch(`${API_URL}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error();
        const data = await res.json();
        setUsuario(data);
        localStorage.setItem('mb_usuario', JSON.stringify(data));
      } catch {
        cerrarSesion();
      } finally {
        setCargando(false);
      }
    };
    validar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const iniciarSesion = async (username, password) => {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.mensaje || 'Error al iniciar sesión');

    setToken(data.token);
    setUsuario(data.usuario);
    localStorage.setItem('mb_token', data.token);
    localStorage.setItem('mb_usuario', JSON.stringify(data.usuario));
  };

  const cerrarSesion = () => {
    setToken('');
    setUsuario(null);
    localStorage.removeItem('mb_token');
    localStorage.removeItem('mb_usuario');
  };

  return (
    <AuthContext.Provider
      value={{ token, usuario, cargando, iniciarSesion, cerrarSesion }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
