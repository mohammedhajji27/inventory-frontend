import React, { useState, useContext } from 'react';
import api from '../api';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { Package } from 'lucide-react';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/api/auth/register', { username, password });

      login(res.data.token, res.data.username);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.error || "Erreur lors de l'inscription");
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 text-slate-900 font-sans">
      <div className="hidden lg:flex w-1/2 bg-violet-100 relative items-center justify-center overflow-hidden">
        <img src="/login-bg.png" alt="Modern Inventory" className="absolute inset-0 w-full h-full object-cover mix-blend-multiply opacity-50" />
        <div className="relative z-10 p-12 bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/60 mx-12 text-center transform hover:scale-105 transition-transform duration-500">
          <Package className="w-16 h-16 text-violet-600 mx-auto mb-4" />
          <h1 className="text-4xl font-extrabold text-violet-900 mb-3 tracking-tight">InventoryPro</h1>
          <p className="text-lg text-violet-800 font-medium">Inscrivez-vous pour organiser et booster vos ventes !</p>
        </div>
      </div>
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md space-y-6">
          <div className="flex flex-col items-center justify-center mb-8 lg:hidden">
            <div className="p-3 bg-violet-50 rounded-full mb-4 shadow-inner">
              <Package className="w-8 h-8 text-violet-600" />
            </div>
            <h2 className="text-3xl font-bold text-slate-800">InventoryPro</h2>
          </div>
          
          <div>
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">C'est parti ! 🚀</h2>
            <p className="text-slate-500 mt-2">Créez votre compte pour commencer.</p>
          </div>
          
          {error && <div className="p-4 bg-red-50 text-red-600 font-medium rounded-xl border border-red-100 flex items-center gap-2"><span className="text-xl">⚠️</span> {error}</div>}
          
          <form onSubmit={handleRegister} className="space-y-5 mt-8">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Nom d'utilisateur</label>
              <input
                type="text"
                required
                placeholder="Choisissez un pseudo"
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-violet-100 focus:border-violet-500 outline-none transition-all shadow-sm"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1.5">Mot de passe</label>
              <input
                type="password"
                required
                placeholder="Votre mot de passe secret"
                className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-violet-100 focus:border-violet-500 outline-none transition-all shadow-sm"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button
              type="submit"
              className="w-full py-3.5 px-4 bg-gradient-to-r from-violet-600 to-indigo-600 text-white rounded-xl hover:from-violet-700 hover:to-indigo-700 focus:ring-4 focus:ring-violet-200 transition-all font-bold text-lg shadow-lg shadow-violet-200"
            >
              Créer mon compte
            </button>
          </form>
          <p className="text-center text-slate-600 mt-8 font-medium">
            Déjà inscrit ? <Link to="/login" className="text-violet-600 hover:text-violet-800 transition-colors hover:underline">Me connecter</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
