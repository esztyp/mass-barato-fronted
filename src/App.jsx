import { useState } from 'react';
import Navbar from './components/Navbar.jsx';
import Dashboard from './components/Dashboard.jsx';
import ProductList from './components/ProductList.jsx';
import MovementHistory from './components/MovementHistory.jsx';

export default function App() {
  const [vista, setVista] = useState('dashboard');

  return (
    <div className="app-shell">
      <Navbar vista={vista} setVista={setVista} />
      <div className="main">
        {vista === 'dashboard' && <Dashboard />}
        {vista === 'productos' && <ProductList />}
        {vista === 'movimientos' && <MovementHistory />}
      </div>
    </div>
  );
}
