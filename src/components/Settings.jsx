import React, { useState, useContext, useEffect } from 'react';
import api from '../api';
import { ShieldAlert, CheckCircle2, User, KeyRound } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

export default function Settings() {
  const { user, logout, token } = useContext(AuthContext);
  
  const [formData, setFormData] = useState({
    newUsername: '',
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  });
  
  const [status, setStatus] = useState({ type: null, message: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData(prev => ({ ...prev, newUsername: user }));
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: null, message: '' });

    if (!formData.currentPassword) {
      return setStatus({ type: 'error', message: 'Le mot de passe actuel est requis.' });
    }

    if (formData.newPassword && formData.newPassword !== formData.confirmNewPassword) {
      return setStatus({ type: 'error', message: 'Les nouveaux mots de passe ne correspondent pas.' });
    }

    setLoading(true);

    try {
      // Setup payload matching backend fields
      const payload = {
        currentPassword: formData.currentPassword
      };
      
      if (formData.newUsername && formData.newUsername !== user) {
        payload.newUsername = formData.newUsername;
      }
      
      if (formData.newPassword) {
        payload.newPassword = formData.newPassword;
      }

      await api.put('/api/auth/profile', payload);

      setStatus({ type: 'success', message: 'Profil mis à jour ! Déconnexion en cours...' });
      
      // Auto-logout after 2 seconds so the user logs in with new credentials
      setTimeout(() => {
        logout();
      }, 2000);
      
    } catch (error) {
      setStatus({ 
        type: 'error', 
        message: error.response?.data?.error || 'Une erreur est survenue.' 
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-200 bg-slate-50 flex items-center gap-3">
          <div className="p-2 bg-indigo-100 rounded-lg">
            <User className="text-indigo-600 w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-800">Paramètres du profil</h2>
            <p className="text-sm text-slate-500">Mettez à jour vos informations de connexion</p>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          
          {status.message && (
            <div className={`p-4 rounded-xl border flex items-center gap-3 ${
              status.type === 'error' ? 'bg-red-50 border-red-200 text-red-700' : 'bg-emerald-50 border-emerald-200 text-emerald-700'
            }`}>
              {status.type === 'error' ? <ShieldAlert className="w-5 h-5" /> : <CheckCircle2 className="w-5 h-5" />}
              <span className="font-medium">{status.message}</span>
            </div>
          )}

          <div className="space-y-4">
            <h3 className="text-sm font-bold tracking-wider text-slate-400 uppercase">Informations de base</h3>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Nom d'utilisateur</label>
              <input 
                type="text" 
                name="newUsername"
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                value={formData.newUsername}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="border-t border-slate-100 my-6 pt-6 space-y-4">
            <h3 className="text-sm font-bold tracking-wider text-slate-400 uppercase flex items-center gap-2">
              <KeyRound className="w-4 h-4" />
              Sécurité
            </h3>
            
            <div className="pt-2">
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Mot de passe actuel <span className="text-red-500">*</span>
              </label>
              <input 
                type="password" 
                name="currentPassword"
                placeholder="Obligatoire pour sauvegarder les changements"
                required
                className="w-full px-4 py-2.5 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                value={formData.currentPassword}
                onChange={handleChange}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Nouveau mot de passe</label>
                <input 
                  type="password" 
                  name="newPassword"
                  placeholder="Optionnel"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  value={formData.newPassword}
                  onChange={handleChange}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Confirmer le mot de passe</label>
                <input 
                  type="password" 
                  name="confirmNewPassword"
                  placeholder="Optionnel"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                  value={formData.confirmNewPassword}
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>

          <div className="bg-blue-50 text-blue-800 p-4 rounded-xl text-sm leading-relaxed border border-blue-100">
            <strong>Note :</strong> Toute modification de vos identifiants entraînera une déconnexion automatique de votre session actuelle. Vous devrez vous reconnecter avec vos nouvelles informations.
          </div>

          <div className="pt-4 flex justify-end">
            <button 
              type="submit"
              disabled={loading || !formData.currentPassword}
              className="px-6 py-2.5 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-4 focus:ring-indigo-100 disabled:opacity-50 transition-all font-semibold"
            >
              {loading ? 'Enregistrement...' : 'Sauvegarder les modifications'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
