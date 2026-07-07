import { useEffect, useState } from 'react';
import { api } from '../api.js';
import ProductForm from './ProductForm.jsx';
import MovementForm from './MovementForm.jsx';

export default function ProductList() {
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');
  const [busqueda, setBusqueda] = useState('');
  const [mostrarForm, setMostrarForm] = useState(false);
  const [productoEditar, setProductoEditar] = useState(null);
  const [productoMovimiento, setProductoMovimiento] = useState(null);

  const cargar = async () => {
    try {
      setCargando(true);
      const data = await api.listarProductos();
      setProductos(data);
      setError('');
    } catch (e) {
      setError('No se pudo conectar con el servidor.');
    } finally {
      setCargando(false);
    }
  };

  useEffect(() => {
    cargar();
  }, []);

  const guardarProducto = async (form) => {
    if (productoEditar) {
      await api.actualizarProducto(productoEditar._id, form);
    } else {
      await api.crearProducto(form);
    }
    setMostrarForm(false);
    setProductoEditar(null);
    cargar();
  };

  const eliminar = async (id) => {
    if (!confirm('¿Eliminar este producto y su historial?')) return;
    await api.eliminarProducto(id);
    cargar();
  };

  const guardarMovimiento = async (datos) => {
    await api.registrarMovimiento(productoMovimiento._id, datos);
    setProductoMovimiento(null);
    cargar();
  };

  const filtrados = productos.filter(
    (p) =>
      p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      p.codigo.toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <div>
      <h1 className="page-title">Productos</h1>
      <p className="page-subtitle">Gestiona tu catálogo y controla el stock disponible.</p>

      {error && <div className="alert-banner">{error}</div>}

      <div className="panel">
        <div className="panel-header">
          <input
            style={{ maxWidth: 260 }}
            placeholder="Buscar por nombre o código..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
          <button
            className="btn btn-primary"
            onClick={() => {
              setProductoEditar(null);
              setMostrarForm(true);
            }}
          >
            + Nuevo producto
          </button>
        </div>

        {cargando ? (
          <p className="empty-state">Cargando productos...</p>
        ) : filtrados.length === 0 ? (
          <p className="empty-state">No hay productos registrados todavía.</p>
        ) : (
          <>
            <div className="ticket-row header-row">
              <span>Código</span>
              <span>Producto</span>
              <span>Categoría</span>
              <span>Stock</span>
              <span>Estado</span>
              <span>Acciones</span>
            </div>
            {filtrados.map((p) => (
              <div className="ticket-row" key={p._id}>
                <span className="mono">{p.codigo}</span>
                <span>{p.nombre}</span>
                <span>{p.categoria}</span>
                <span>{p.stockActual} {p.unidad}</span>
                <span className={`badge badge-${p.estado}`}>
                  {p.estado === 'ok' ? 'Normal' : p.estado === 'bajo' ? 'Stock bajo' : 'Agotado'}
                </span>
                <span style={{ display: 'flex', gap: 8 }}>
                  <button className="icon-btn" onClick={() => setProductoMovimiento(p)}>
                    Movimiento
                  </button>
                  <button
                    className="icon-btn"
                    onClick={() => {
                      setProductoEditar(p);
                      setMostrarForm(true);
                    }}
                  >
                    Editar
                  </button>
                  <button className="icon-btn" onClick={() => eliminar(p._id)}>
                    Eliminar
                  </button>
                </span>
              </div>
            ))}
          </>
        )}
      </div>

      {mostrarForm && (
        <ProductForm
          productoInicial={productoEditar}
          onGuardar={guardarProducto}
          onCerrar={() => {
            setMostrarForm(false);
            setProductoEditar(null);
          }}
        />
      )}

      {productoMovimiento && (
        <MovementForm
          producto={productoMovimiento}
          onGuardar={guardarMovimiento}
          onCerrar={() => setProductoMovimiento(null)}
        />
      )}
    </div>
  );
}
