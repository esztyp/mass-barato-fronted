import { useEffect, useState } from 'react';
import { api } from '../api.js';

const etiquetas = {
  entrada: { texto: 'Entrada', clase: 'badge-ok' },
  salida: { texto: 'Salida', clase: 'badge-bajo' },
  ajuste: { texto: 'Ajuste', clase: 'badge-agotado' },
};

export default function MovementHistory() {
  const [movimientos, setMovimientos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .listarMovimientos()
      .then(setMovimientos)
      .catch(() => setError('No se pudo conectar con el servidor.'))
      .finally(() => setCargando(false));
  }, []);

  return (
    <div>
      <h1 className="page-title">Historial de movimientos</h1>
      <p className="page-subtitle">Últimas entradas, salidas y ajustes de stock registrados.</p>

      {error && <div className="alert-banner">{error}</div>}

      <div className="panel">
        {cargando ? (
          <p className="empty-state">Cargando historial...</p>
        ) : movimientos.length === 0 ? (
          <p className="empty-state">Aún no se han registrado movimientos.</p>
        ) : (
          <>
            <div
              className="ticket-row header-row"
              style={{ gridTemplateColumns: '150px 1fr 90px 90px 110px 1fr' }}
            >
              <span>Fecha</span>
              <span>Producto</span>
              <span>Tipo</span>
              <span>Cantidad</span>
              <span>Stock resultante</span>
              <span>Motivo</span>
            </div>
            {movimientos.map((m) => (
              <div
                className="ticket-row"
                style={{ gridTemplateColumns: '150px 1fr 90px 90px 110px 1fr' }}
                key={m._id}
              >
                <span className="mono">
                  {new Date(m.createdAt).toLocaleString('es-PE')}
                </span>
                <span>{m.producto?.nombre || 'Producto eliminado'}</span>
                <span className={`badge ${etiquetas[m.tipo].clase}`}>
                  {etiquetas[m.tipo].texto}
                </span>
                <span>{m.cantidad}</span>
                <span>{m.stockResultante}</span>
                <span>{m.motivo || '—'}</span>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
