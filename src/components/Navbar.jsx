import { useAuth } from '../AuthContext.jsx';

export default function Navbar({ vista, setVista }) {
  const { usuario, cerrarSesion } = useAuth();

  const items = [
    { id: 'dashboard', label: 'Panel general' },
    { id: 'productos', label: 'Productos' },
    { id: 'movimientos', label: 'Historial de movimientos' },
    { id: 'reportes', label: 'Reportes' },
    ...(usuario?.rol === 'administrador'
      ? [{ id: 'usuarios', label: 'Usuarios y Roles' }]
      : []),
  ];

  return (
    <div className="sidebar">
      <div className="brand">MASS BARATO</div>
      <span className="brand-tag">CONTROL DE INVENTARIO</span>
      {items.map((item) => (
        <div
          key={item.id}
          className={`nav-item ${vista === item.id ? 'active' : ''}`}
          onClick={() => setVista(item.id)}
        >
          {item.label}
        </div>
      ))}

      <div style={{ flex: 1 }} />

      <div style={{ borderTop: '1px solid rgba(255,255,255,0.15)', paddingTop: 14, marginTop: 14 }}>
        <div style={{ fontSize: '0.82rem', color: '#fff', fontWeight: 600 }}>
          {usuario?.nombre}
        </div>
        <div style={{ fontSize: '0.72rem', color: '#e8a33d', marginBottom: 10 }}>
          {usuario?.rol === 'administrador' ? 'Administrador' : 'Almacenero'}
        </div>
        <div className="nav-item" onClick={cerrarSesion}>
          Cerrar sesión
        </div>
      </div>
    </div>
  );
}
