const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

async function manejarRespuesta(res) {
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.mensaje || 'Error en la solicitud');
  }
  return data;
}

export const api = {
  // Productos
  listarProductos: () => fetch(`${API_URL}/products`).then(manejarRespuesta),
  obtenerProducto: (id) => fetch(`${API_URL}/products/${id}`).then(manejarRespuesta),
  crearProducto: (producto) =>
    fetch(`${API_URL}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(producto),
    }).then(manejarRespuesta),
  actualizarProducto: (id, producto) =>
    fetch(`${API_URL}/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(producto),
    }).then(manejarRespuesta),
  eliminarProducto: (id) =>
    fetch(`${API_URL}/products/${id}`, { method: 'DELETE' }).then(manejarRespuesta),
  registrarMovimiento: (id, movimiento) =>
    fetch(`${API_URL}/products/${id}/movimiento`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(movimiento),
    }).then(manejarRespuesta),
  obtenerAlertas: () => fetch(`${API_URL}/products/alertas/bajos`).then(manejarRespuesta),

  // Movimientos
  listarMovimientos: () => fetch(`${API_URL}/movements`).then(manejarRespuesta),
};
