import { useState } from 'react';

const vacio = {
  codigo: '',
  nombre: '',
  categoria: '',
  stockActual: 0,
  stockMinimo: 5,
  precioCompra: 0,
  precioVenta: 0,
  unidad: 'unidad',
  proveedor: '',
};

export default function ProductForm({ productoInicial, onGuardar, onCerrar }) {
  const [form, setForm] = useState(productoInicial || vacio);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState('');

  const cambiar = (campo, valor) => setForm({ ...form, [campo]: valor });

  const enviar = async (e) => {
    e.preventDefault();
    setGuardando(true);
    setError('');
    try {
      await onGuardar(form);
    } catch (err) {
      setError(err.message);
    } finally {
      setGuardando(false);
    }
  };

  return (
    <div className="modal-backdrop" onClick={onCerrar}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <h3 style={{ marginBottom: 16 }}>
          {productoInicial ? 'Editar producto' : 'Nuevo producto'}
        </h3>
        {error && <div className="alert-banner">{error}</div>}
        <form onSubmit={enviar}>
          <div className="form-grid">
            <div className="form-field">
              <label>Código</label>
              <input
                required
                disabled={!!productoInicial}
                value={form.codigo}
                onChange={(e) => cambiar('codigo', e.target.value)}
              />
            </div>
            <div className="form-field">
              <label>Nombre</label>
              <input
                required
                value={form.nombre}
                onChange={(e) => cambiar('nombre', e.target.value)}
              />
            </div>
            <div className="form-field">
              <label>Categoría</label>
              <input
                value={form.categoria}
                onChange={(e) => cambiar('categoria', e.target.value)}
              />
            </div>
            <div className="form-field">
              <label>Unidad</label>
              <input
                value={form.unidad}
                onChange={(e) => cambiar('unidad', e.target.value)}
              />
            </div>
            {!productoInicial && (
              <div className="form-field">
                <label>Stock inicial</label>
                <input
                  type="number"
                  min="0"
                  value={form.stockActual}
                  onChange={(e) => cambiar('stockActual', Number(e.target.value))}
                />
              </div>
            )}
            <div className="form-field">
              <label>Stock mínimo (alerta)</label>
              <input
                type="number"
                min="0"
                value={form.stockMinimo}
                onChange={(e) => cambiar('stockMinimo', Number(e.target.value))}
              />
            </div>
            <div className="form-field">
              <label>Precio de compra (S/)</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={form.precioCompra}
                onChange={(e) => cambiar('precioCompra', Number(e.target.value))}
              />
            </div>
            <div className="form-field">
              <label>Precio de venta (S/)</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={form.precioVenta}
                onChange={(e) => cambiar('precioVenta', Number(e.target.value))}
              />
            </div>
            <div className="form-field" style={{ gridColumn: 'span 2' }}>
              <label>Proveedor</label>
              <input
                value={form.proveedor}
                onChange={(e) => cambiar('proveedor', e.target.value)}
              />
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8, marginTop: 18 }}>
            <button type="button" className="btn btn-ghost" onClick={onCerrar}>
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary" disabled={guardando}>
              {guardando ? 'Guardando...' : 'Guardar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
