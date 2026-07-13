import { useState } from 'react';
import { api } from '../api.js';

function descargarBlob(blob, nombreArchivo) {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = nombreArchivo;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
}

export default function Reports() {
  const [generando, setGenerando] = useState('');
  const [error, setError] = useState('');

  const exportarProductos = async () => {
    setError('');
    setGenerando('productos');
    try {
      const blob = await api.descargarReporteProductos();
      descargarBlob(blob, `inventario_mass_barato_${Date.now()}.xlsx`);
    } catch (e) {
      setError(e.message);
    } finally {
      setGenerando('');
    }
  };

  const exportarMovimientos = async () => {
    setError('');
    setGenerando('movimientos');
    try {
      const blob = await api.descargarReporteMovimientos();
      descargarBlob(blob, `movimientos_mass_barato_${Date.now()}.xlsx`);
    } catch (e) {
      setError(e.message);
    } finally {
      setGenerando('');
    }
  };

  return (
    <div>
      <h1 className="page-title">Reportes</h1>
      <p className="page-subtitle">Exporta la información de tu negocio en formato Excel.</p>

      {error && <div className="alert-banner">{error}</div>}

      <div className="cards-row" style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}>
        <div className="panel" style={{ marginBottom: 0 }}>
          <h3 style={{ marginBottom: 6 }}>Reporte de Inventario</h3>
          <p className="page-subtitle" style={{ marginBottom: 16 }}>
            Incluye código, stock actual, precios, valor total del inventario y estado de cada
            producto.
          </p>
          <button
            className="btn btn-primary"
            onClick={exportarProductos}
            disabled={generando === 'productos'}
          >
            {generando === 'productos' ? 'Generando...' : 'Descargar Excel'}
          </button>
        </div>

        <div className="panel" style={{ marginBottom: 0 }}>
          <h3 style={{ marginBottom: 6 }}>Reporte de Movimientos</h3>
          <p className="page-subtitle" style={{ marginBottom: 16 }}>
            Historial completo de entradas, salidas y ajustes de stock (hasta 1000 registros).
          </p>
          <button
            className="btn btn-primary"
            onClick={exportarMovimientos}
            disabled={generando === 'movimientos'}
          >
            {generando === 'movimientos' ? 'Generando...' : 'Descargar Excel'}
          </button>
        </div>
      </div>
    </div>
  );
}
