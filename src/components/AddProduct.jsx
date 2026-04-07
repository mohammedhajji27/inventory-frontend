import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function AddProduct() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    quantity: '',
    purchasePrice: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('http://localhost:5000/api/products', formData);
      navigate('/stock');
    } catch (error) {
      console.error("Error adding product", error);
      alert("Error adding product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-200 bg-slate-50">
          <h2 className="text-lg font-semibold text-slate-800">Ajouter un nouveau produit à l'inventaire</h2>
          <p className="text-sm text-slate-500 mt-1">Fournissez les détails du produit pour l'ajouter à votre stock récent.</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Nom du produit</label>
            <input 
              type="text" 
              name="name"
              required
              placeholder="ex. iPhone 15 Pro"
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              value={formData.name}
              onChange={handleChange}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Quantité</label>
              <input 
                type="number" 
                name="quantity"
                required
                min="1"
                placeholder="0"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                value={formData.quantity}
                onChange={handleChange}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Prix d'Achat (MAD)</label>
              <input 
                type="number" 
                name="purchasePrice"
                required
                min="0"
                step="0.01"
                placeholder="0.00"
                className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                value={formData.purchasePrice}
                onChange={handleChange}
              />
            </div>

          </div>

          <div className="pt-4 flex justify-end">
            <button 
              type="button"
              onClick={() => navigate('/stock')}
              className="px-6 py-2 mr-4 text-sm font-medium text-slate-700 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Annuler
            </button>
            <button 
              type="submit"
              disabled={loading}
              className="px-6 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
            >
              {loading ? 'Ajout...' : 'Enregistrer le produit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
