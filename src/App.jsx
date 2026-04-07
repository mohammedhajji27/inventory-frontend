import React, { useContext } from 'react';
import { Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { Package, LayoutDashboard, ShoppingCart, PlusCircle, LogOut, UserCircle, Settings as SettingsIcon } from 'lucide-react';
import Dashboard from './components/Dashboard';
import StockList from './components/StockList';
import SoldItems from './components/SoldItems';
import AddProduct from './components/AddProduct';
import Login from './components/Login';
import Settings from './components/Settings';
import Register from './components/Register';
import { AuthContext } from './context/AuthContext';

function App() {
  const location = useLocation();
  const { user, token, logout } = useContext(AuthContext);

  const isActive = (path) => location.pathname === path;

  const NavItem = ({ to, icon: Icon, label }) => (
    <Link
      to={to}
      className={`flex items-center gap-2 px-4 py-2 mt-2 text-sm font-medium rounded-lg ${
        isActive(to)
          ? 'bg-indigo-50 text-indigo-700'
          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
      }`}
    >
      <Icon size={18} />
      {label}
    </Link>
  );

  if (!token) {
    return (
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }

  return (
    <div className="flex h-screen bg-slate-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-200 flex flex-col">
        <div className="flex items-center justify-center h-16 border-b border-slate-200">
          <span className="text-xl font-bold text-indigo-600 flex items-center gap-2">
            <Package /> InventoryPro
          </span>
        </div>
        <nav className="p-4 space-y-1 flex-1">
          <NavItem to="/" icon={LayoutDashboard} label="Tableau de Bord" />
          <NavItem to="/stock" icon={Package} label="Inventaire" />
          <NavItem to="/add" icon={PlusCircle} label="Ajouter" />
          <NavItem to="/sold" icon={ShoppingCart} label="Ventes" />
          <NavItem to="/settings" icon={SettingsIcon} label="Paramètres" />
        </nav>
        <div className="p-4 border-t border-slate-200">
          <div className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-700 mb-2">
             <UserCircle size={18} className="text-indigo-500" />
             {user}
          </div>
          <button 
            onClick={logout}
            className="w-full flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut size={18} />
            Déconnexion
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <header className="h-16 bg-white border-b border-slate-200 flex items-center px-8">
          <h1 className="text-xl font-semibold text-slate-800">
            {location.pathname === '/' && 'Vue d\'ensemble'}
            {location.pathname === '/stock' && 'Inventaire du Stock'}
            {location.pathname === '/add' && 'Ajouter un Produit'}
            {location.pathname === '/sold' && 'Produits Vendus'}
            {location.pathname === '/settings' && 'Paramètres'}
          </h1>
        </header>
        <main className="p-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/stock" element={<StockList />} />
            <Route path="/add" element={<AddProduct />} />
            <Route path="/sold" element={<SoldItems />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}

export default App;
