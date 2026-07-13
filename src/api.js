const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api';

function headers() {
  const token = localStorage.getItem('mb_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
}

async function manejarRespuesta(res) {
  if (res.status === 401) {
    localStorage.removeItem('mb_token');
    localStorage.removeItem('mb_usuario');
    window.location.reload();
    throw new Error('Sesión expirada, vuelve a iniciar sesión');
  }
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.mensaje || 'Error en la solicitud');
  }
  return data;
}

export const api = {
  // Productos
  listarProductos: () => fetch(`${API_URL}/products`, { headers: headers() }).then(manejarRespuesta),
  obtenerProducto: (id) =>
    fetch(`${API_URL}/products/${id}`, { headers: headers() }).then(manejarRespuesta),
  crearProducto: (producto) =>
    fetch(`${API_URL}/products`, {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify(producto),
    }).then(manejarRespuesta),
  actualizarProducto: (id, producto) =>
    fetch(`${API_URL}/products/${id}`, {
      method: 'PUT',
      headers: headers(),
      body: JSON.stringify(producto),
    }).then(manejarRespuesta),
  eliminarProducto: (id) =>
    fetch(`${API_URL}/products/${id}`, { method: 'DELETE', headers: headers() }).then(
      manejarRespuesta
    ),
  registrarMovimiento: (id, movimiento) =>
    fetch(`${API_URL}/products/${id}/movimiento`, {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify(movimiento),
    }).then(manejarRespuesta),
  obtenerAlertas: () =>
    fetch(`${API_URL}/products/alertas/bajos`, { headers: headers() }).then(manejarRespuesta),

  // Movimientos
  listarMovimientos: () =>
    fetch(`${API_URL}/movements`, { headers: headers() }).then(manejarRespuesta),

  // Usuarios (módulo de roles)
  listarUsuarios: () => fetch(`${API_URL}/auth/usuarios`, { headers: headers() }).then(manejarRespuesta),
  crearUsuario: (usuario) =>
    fetch(`${API_URL}/auth/registrar`, {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify(usuario),
    }).then(manejarRespuesta),
  actualizarUsuario: (id, cambios) =>
    fetch(`${API_URL}/auth/usuarios/${id}`, {
      method: 'PUT',
      headers: headers(),
      body: JSON.stringify(cambios),
    }).then(manejarRespuesta),
  eliminarUsuario: (id) =>
    fetch(`${API_URL}/auth/usuarios/${id}`, { method: 'DELETE', headers: headers() }).then(
      manejarRespuesta
    ),

  // Reportes (descarga de archivos Excel)
  descargarReporteProductos: async () => {
    const res = await fetch(`${API_URL}/reports/productos/excel`, { headers: headers() });
    if (!res.ok) throw new Error('No se pudo generar el reporte');
    return res.blob();
  },
  descargarReporteMovimientos: async () => {
    const res = await fetch(`${API_URL}/reports/movimientos/excel`, { headers: headers() });
    if (!res.ok) throw new Error('No se pudo generar el reporte');
    return res.blob();
  },
};
