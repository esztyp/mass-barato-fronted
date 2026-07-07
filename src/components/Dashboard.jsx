import { useEffect, useState } from 'react';
import { api } from '../api.js';

export default function Dashboard() {
  const [productos, setProductos] = useState([]);
  const [alertas, setAlertas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  const cargarDatos = async () => {
    try {
      setCargando(true);
      const [listaProductos, listaAlertas] = await Promise.all([
        api.listarProductos(),
        api.obtenerAlertas(),
      ]);
      setProductos(listaProductos);
      setAlertas(listaAlertas);
      setError('');
    } catch (e) {
      setError('No se pudo conectar con el servidor. Verifica la URL de la API.');
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const valorInventario = productos.reduce(
    (acc, p) => acc + p.stockActual * p.precioCompra,
    0
  );

  return (
    <div>
      <h1 className="page-title">Panel general</h1>
      <p className="page-subtitle">Resumen del estado del inventario en tiempo real.</p>

      {error && <div className="alert-banner">{error}</div>}

      {!error && alertas.length > 0 && (
        <div className="alert-banner">
          ⚠ {alertas.length} producto(s) con stock bajo o agotado. Revísalos en la pestaña "Productos".
        </div>
      )}

      <div className="cards-row">
        <div className="stat-card">
          <div className="label">Productos registrados</div>
          <div className="value">{cargando ? '—' : productos.length}</div>
        </div>
        <div className="stat-card">
          <div className="label">Unidades en stock</div>
          <div className="value">
            {cargando ? '—' : productos.reduce((a, p) => a + p.stockActual, 0)}
          </div>
        </div>
        <div className="stat-card">
          <div className="label">Alertas activas</div>
          <div className="value" style={{ color: alertas.length ? '#c0392b' : undefined }}>
            {cargando ? '—' : alertas.length}
          </div>
        </div>
        <div className="stat-card">
          <div className="label">Valor de inventario</div>
          <div className="value mono">
            {cargando ? '—' : `S/ ${valorInventario.toFixed(2)}`}
          </div>
        </div>
      </div>

      <div className="panel">
        <div className="panel-header">
          <h3>Productos con alerta de stock</h3>
        </div>
        {cargando ? (
          <p className="empty-state">Cargando...</p>
        ) : alertas.length === 0 ? (
          <p className="empty-state">No hay alertas de stock por el momento.</p>
        ) : (
          <>
            <div className="ticket-row header-row">
              <span>Código</span>
              <span>Producto</span>
              <span>Categoría</span>
              <span>Stock</span>
              <span>Nivel</span>
              <span>Estado</span>
            </div>
            {alertas.map((p) => (
              <div className="ticket-row" key={p._id}>
                <span className="mono">{p.codigo}</span>
                <span>{p.nombre}</span>
                <span>{p.categoria}</span>
                <span>{p.stockActual} {p.unidad}</span>
                <div className="gauge">
                  <div
                    className="gauge-fill"
                    style={{
                      width: `${Math.min(100, (p.stockActual / (p.stockMinimo || 1)) * 100)}%`,
                      background: p.stockActual <= 0 ? '#c0392b' : '#e8a33d',
                    }}
                  />
                </div>
                <span className={`badge badge-${p.estado}`}>
                  {p.estado === 'agotado' ? 'Agotado' : 'Stock bajo'}
                </span>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
