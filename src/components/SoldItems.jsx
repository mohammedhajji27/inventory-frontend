import React, { useState, useEffect } from 'react';
import api from '../api';

export default function SoldItems() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchSoldProducts();
  }, []);

  const fetchSoldProducts = async () => {
    try {
      const res = await api.get('/api/products/sold');
      setProducts(res.data);
    } catch (error) {
      console.error("Error fetching sold products", error);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-6 border-b border-slate-200 bg-slate-50">
        <h2 className="text-lg font-semibold text-slate-800">Historique des ventes</h2>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm whitespace-nowrap">
          <thead className="bg-slate-50 text-slate-600 font-medium border-b border-slate-200">
            <tr>
              <th className="px-6 py-4">ID</th>
              <th className="px-6 py-4">Nom</th>
              <th className="px-6 py-4">Qté</th>
              <th className="px-6 py-4">Prix d'Achat</th>
              <th className="px-6 py-4">Prix de Vente</th>
              <th className="px-6 py-4 text-emerald-600 font-semibold">Bénéfice Réalisé</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {products.length === 0 ? (
              <tr>
                <td colSpan="6" className="px-6 py-12 text-center text-slate-500 text-base">
                  <div className="flex flex-col items-center justify-center">
                    <img src="/empty-state.png" alt="Empty Box" className="w-40 h-40 mb-3 object-contain opacity-90" />
                    <p className="font-medium text-slate-600">Aucun produit n'a encore été vendu.</p>
                  </div>
                </td>
              </tr>
            ) : (
              products.map((p) => {
                const profit = (p.sellingPrice - p.purchasePrice) * p.quantity;
                return (
                  <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 text-slate-500">#{p.id}</td>
                    <td className="px-6 py-4 font-medium text-slate-900">{p.name}</td>
                    <td className="px-6 py-4">{p.quantity}</td>
                    <td className="px-6 py-4">{p.purchasePrice.toFixed(2)} MAD</td>
                    <td className="px-6 py-4">{p.sellingPrice.toFixed(2)} MAD</td>
                    <td className="px-6 py-4 font-semibold text-emerald-600">
                      +{profit.toFixed(2)} MAD
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
