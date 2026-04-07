import React, { useState, useEffect } from 'react';
import api from '../api';
import { FileDown } from 'lucide-react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

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

  const generatePDF = () => {
    const doc = new jsPDF();
    doc.text("Rapport des Ventes - InventoryPro", 14, 15);
    
    const tableColumn = ["ID", "Nom", "Quantite", "Prix d'Achat", "Prix de Vente", "Benefice (MAD)"];
    const tableRows = [];

    let totalBenef = 0;

    products.forEach(p => {
      const profit = (p.sellingPrice - p.purchasePrice) * p.quantity;
      totalBenef += profit;
      const productData = [
        "#" + p.id,
        p.name,
        p.quantity,
        p.purchasePrice.toFixed(2),
        p.sellingPrice.toFixed(2),
        "+" + profit.toFixed(2)
      ];
      tableRows.push(productData);
    });

    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 25,
      theme: 'grid',
      styles: { fontSize: 9 },
      headStyles: { fillColor: [79, 70, 229] } // Indigo-600
    });

    doc.setFontSize(11);
    doc.text(`Benefice Total Realise : ${totalBenef.toFixed(2)} MAD`, 14, doc.autoTable.previous.finalY + 15);

    doc.save(`rapport_ventes_${new Date().toISOString().split('T')[0]}.pdf`);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="p-6 border-b border-slate-200 bg-slate-50 flex justify-between items-center">
        <h2 className="text-lg font-semibold text-slate-800">Historique des ventes</h2>
        <button 
          onClick={generatePDF}
          disabled={products.length === 0}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-50 text-indigo-700 font-medium rounded-lg hover:bg-indigo-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <FileDown size={18} />
          <span>Exporter un PDF</span>
        </button>
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
