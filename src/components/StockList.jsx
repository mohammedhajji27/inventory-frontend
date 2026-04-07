import React, { useState, useEffect } from 'react';
import api from '../api';
import { Search } from 'lucide-react';

export default function StockList() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await api.get('/api/products');
      setProducts(res.data);
    } catch (error) {
      console.error("Error fetching products", error);
    }
  };

  const markAsSold = async (id) => {
    try {
      const priceInput = window.prompt("Entrez le prix de vente final (MAD) :");
      if (priceInput === null) return; // User cancelled
      
      const sellingPrice = parseFloat(priceInput);
      if (isNaN(sellingPrice) || sellingPrice < 0) {
        alert("Prix invalide.");
        return;
      }

      await api.put(`/api/products/${id}/sell`, { sellingPrice });
      fetchProducts(); // Refresh list
    } catch (error) {
      console.error("Error marking as sold", error);
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-6 border-b border-slate-200 flex justify-between items-center bg-slate-50">
        <h2 className="text-lg font-semibold text-slate-800">Stock Disponible</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Rechercher des produits..." 
            className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm w-64"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-slate-50 text-slate-600 font-medium border-b border-slate-200">
            <tr>
              <th className="px-6 py-4">ID</th>
              <th className="px-6 py-4">Nom</th>
              <th className="px-6 py-4">Qté</th>
              <th className="px-6 py-4">Prix d'Achat</th>
              <th className="px-6 py-4">Statut</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {filteredProducts.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-12 text-center text-slate-500 text-base">
                  <div className="flex flex-col items-center justify-center">
                    <img src="/empty-state.png" alt="Empty Box" className="w-40 h-40 mb-3 object-contain opacity-90" />
                    <p className="font-medium text-slate-600">Aucun produit trouvé en stock.</p>
                  </div>
                </td>
              </tr>
            ) : (
              filteredProducts.map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4 text-slate-500">#{p.id}</td>
                  <td className="px-6 py-4 font-medium text-slate-900">{p.name}</td>
                  <td className="px-6 py-4">{p.quantity}</td>
                  <td className="px-6 py-4">{p.purchasePrice.toFixed(2)} MAD</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-semibold rounded-full">En Stock</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => markAsSold(p.id)}
                      className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-white transition-colors bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      Vendre
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
