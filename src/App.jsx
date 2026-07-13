import { useState } from 'react';
import { useAuth } from './AuthContext.jsx';
import Navbar from './components/Navbar.jsx';
import Dashboard from './components/Dashboard.jsx';
import ProductList from './components/ProductList.jsx';
import MovementHistory from './components/MovementHistory.jsx';
import Reports from './components/Reports.jsx';
import UserManagement from './components/UserManagement.jsx';
import Login from './components/Login.jsx';

export default function App() {
  const { usuario, cargando } = useAuth();
  const [vista, setVista] = useState('dashboard');

  if (cargando) {
    return (
      <div className="login-shell">
        <p style={{ color: '#5b6472' }}>Cargando...</p>
      </div>
    );
  }

  if (!usuario) {
    return <Login />;
  }

  return (
    <div className="app-shell">
      <Navbar vista={vista} setVista={setVista} />
      <div className="main">
        {vista === 'dashboard' && <Dashboard />}
        {vista === 'productos' && <ProductList />}
        {vista === 'movimientos' && <MovementHistory />}
        {vista === 'reportes' && <Reports />}
        {vista === 'usuarios' && <UserManagement />}
      </div>
    </div>
  );
}
