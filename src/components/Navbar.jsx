export default function Navbar({ vista, setVista }) {
  const items = [
    { id: 'dashboard', label: 'Panel general' },
    { id: 'productos', label: 'Productos' },
    { id: 'movimientos', label: 'Historial de movimientos' },
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
    </div>
  );
}
