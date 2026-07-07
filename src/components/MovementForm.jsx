import { useState } from 'react';

export default function MovementForm({ producto, onGuardar, onCerrar }) {
  const [tipo, setTipo] = useState('entrada');
  const [cantidad, setCantidad] = useState(1);
  const [motivo, setMotivo] = useState('');
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState('');

  const enviar = async (e) => {
    e.preventDefault();
    setGuardando(true);
    setError('');
    try {
      await onGuardar({ tipo, cantidad: Number(cantidad), motivo });
    } catch (err) {
      setError(err.message);
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onCerrar}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h3 style={{ marginBottom: 4 }}>Registrar movimiento</h3>
        <p className="page-subtitle" style={{ marginBottom: 16 }}>
          {producto.nombre} · stock actual: {producto.stockActual} {producto.unidad}
        </p>
        {error && <div className="alert-banner">{error}</div>}
        <form onSubmit={enviar}>
          <div className="form-field" style={{ marginBottom: 12 }}>
            <label>Tipo de movimiento</label>
            <select value={tipo} onChange={(e) => setTipo(e.target.value)}>
              <option value="entrada">Entrada (compra / reposición)</option>
              <option value="salida">Salida (venta)</option>
              <option value="ajuste">Ajuste manual (fijar stock exacto)</option>
            </select>
          </div>
          <div className="form-field" style={{ marginBottom: 12 }}>
            <label>{tipo === 'ajuste' ? 'Nuevo stock exacto' : 'Cantidad'}</label>
            <input
              type="number"
              min="0"
              required
              value={cantidad}
              onChange={(e) => setCantidad(e.target.value)}
            />
          </div>
          <div className="form-field">
            <label>Motivo (opcional)</label>
            <input value={motivo} onChange={(e) => setMotivo(e.target.value)} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 18 }}>
            <button type="button" className="btn btn-ghost" onClick={onCerrar}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary" disabled={guardando}>
              {guardando ? 'Guardando...' : 'Confirmar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
