import { useEffect, useState } from 'react';
import { api } from '../api.js';
import { useAuth } from '../AuthContext.jsx';

const vacio = { username: '', nombre: '', password: '', rol: 'almacenero' };

export default function UserManagement() {
  const { usuario: usuarioActual } = useAuth();
  const [usuarios, setUsuarios] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [mostrarForm, setMostrarForm] = useState(false);
  const [form, setForm] = useState(vacio);
  const [guardando, setGuardando] = useState(false);

  const cargar = async () => {
    try {
      setCargando(true);
      const data = await api.listarUsuarios();
      setUsuarios(data);
      setError('');
    } catch (e) {
      setError(e.message || 'No se pudo cargar la lista de usuarios.');
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargar();
  }, []);

  const crear = async (e) => {
    e.preventDefault();
    setGuardando(true);
    setError('');
    try {
      await api.crearUsuario(form);
      setForm(vacio);
      setMostrarForm(false);
      cargar();
    } catch (err) {
      setError(err.message);
    } finally {
      setGuardando(false);
    }
  };

  const cambiarRol = async (id, rol) => {
    await api.actualizarUsuario(id, { rol });
    cargar();
  };

  const alternarActivo = async (u) => {
    await api.actualizarUsuario(u._id, { activo: !u.activo });
    cargar();
  };

  const eliminar = async (id) => {
    if (!confirm('¿Eliminar este usuario?')) return;
    try {
      await api.eliminarUsuario(id);
      cargar();
    } catch (err) {
      alert(err.message);
    }
  };

  if (usuarioActual?.rol !== 'administrador') {
    return (
      <div>
        <h1 className="page-title">Usuarios y Roles</h1>
        <p className="page-subtitle">Solo un administrador puede gestionar usuarios.</p>
        <div className="alert-banner">No tienes permisos para ver esta sección.</div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="page-title">Usuarios y Roles</h1>
      <p className="page-subtitle">
        Administra quién puede acceder al sistema y con qué nivel de permisos.
      </p>

      {error && <div className="alert-banner">{error}</div>}

      <div className="panel">
        <div className="panel-header">
          <h3>Usuarios registrados</h3>
          <button className="btn btn-primary" onClick={() => setMostrarForm(true)}>
            + Nuevo usuario
          </button>
        </div>

        {cargando ? (
          <p className="empty-state">Cargando...</p>
        ) : usuarios.length === 0 ? (
          <p className="empty-state">No hay usuarios registrados.</p>
        ) : (
          <>
            <div
              className="ticket-row header-row"
              style={{ gridTemplateColumns: '1fr 1fr 150px 90px 140px' }}
            >
              <span>Usuario</span>
              <span>Nombre</span>
              <span>Rol</span>
              <span>Activo</span>
              <span>Acciones</span>
            </div>
            {usuarios.map((u) => (
              <div
                className="ticket-row"
                style={{ gridTemplateColumns: '1fr 1fr 150px 90px 140px' }}
                key={u._id}
              >
                <span className="mono">{u.username}</span>
                <span>{u.nombre}</span>
                <select value={u.rol} onChange={(e) => cambiarRol(u._id, e.target.value)}>
                  <option value="administrador">Administrador</option>
                  <option value="almacenero">Almacenero</option>
                </select>
                <span className={`badge ${u.activo ? 'badge-ok' : 'badge-agotado'}`}>
                  {u.activo ? 'Sí' : 'No'}
                </span>
                <span style={{ display: 'flex', gap: 8 }}>
                  <button className="icon-btn" onClick={() => alternarActivo(u)}>
                    {u.activo ? 'Desactivar' : 'Activar'}
                  </button>
                  <button className="icon-btn" onClick={() => eliminar(u._id)}>
                    Eliminar
                  </button>
                </span>
              </div>
            ))}
          </>
        )}
      </div>

      {mostrarForm && (
        <div className="modal-backdrop" onClick={() => setMostrarForm(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <h3 style={{ marginBottom: 16 }}>Nuevo usuario</h3>
            <form onSubmit={crear}>
              <div className="form-field" style={{ marginBottom: 12 }}>
                <label>Nombre de usuario (para iniciar sesión)</label>
                <input
                  required
                  value={form.username}
                  onChange={(e) => setForm({ ...form, username: e.target.value })}
                />
              </div>
              <div className="form-field" style={{ marginBottom: 12 }}>
                <label>Nombre completo</label>
                <input
                  required
                  value={form.nombre}
                  onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                />
              </div>
              <div className="form-field" style={{ marginBottom: 12 }}>
                <label>Contraseña temporal</label>
                <input
                  required
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                />
              </div>
              <div className="form-field">
                <label>Rol</label>
                <select
                  value={form.rol}
                  onChange={(e) => setForm({ ...form, rol: e.target.value })}
                >
                  <option value="administrador">Administrador</option>
                  <option value="almacenero">Almacenero</option>
                </select>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 18 }}>
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => setMostrarForm(false)}
                >
                  Cancelar
                </button>
                <button type="submit" className="btn btn-primary" disabled={guardando}>
                  {guardando ? 'Guardando...' : 'Crear usuario'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
