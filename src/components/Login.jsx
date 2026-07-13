import { useState } from 'react';
import { useAuth } from '../AuthContext.jsx';

export default function Login() {
  const { iniciarSesion } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [cargando, setCargando] = useState(false);

  const enviar = async (e) => {
    e.preventDefault();
    setError('');
    setCargando(true);
    try {
      await iniciarSesion(username, password);
    } catch (err) {
      setError(err.message);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="login-shell">
      <div className="login-card">
        <div className="brand" style={{ marginBottom: 2 }}>
          MASS BARATO
        </div>
        <span className="brand-tag" style={{ color: '#c9821f' }}>
          CONTROL DE INVENTARIO
        </span>

        <h2 style={{ margin: '20px 0 6px', fontSize: '1.2rem' }}>Iniciar sesión</h2>
        <p className="page-subtitle" style={{ marginBottom: 20 }}>
          Ingresa tus credenciales para acceder al sistema.
        </p>

        {error && <div className="alert-banner">{error}</div>}

        <form onSubmit={enviar}>
          <div className="form-field" style={{ marginBottom: 14 }}>
            <label>Usuario</label>
            <input
              required
              autoFocus
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="admin"
            />
          </div>
          <div className="form-field" style={{ marginBottom: 20 }}>
            <label>Contraseña</label>
            <input
              required
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
          </div>
          <button className="btn btn-primary" style={{ width: '100%' }} disabled={cargando}>
            {cargando ? 'Ingresando...' : 'Ingresar'}
          </button>
        </form>
      </div>
    </div>
  );
}
