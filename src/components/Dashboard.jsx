import React, { useState, useEffect } from 'react';
import api from '../api';
import { DollarSign, Package, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalCapital: 0,
    expectedRevenue: 0,
    expectedProfit: 0,
    totalProfit: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await api.get('/api/stats');
      setStats(res.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching stats", error);
      setLoading(false);
    }
  };

  if (loading) return <div>Loading dashboard...</div>;

  const chartData = [
    { name: 'Capital', value: stats.totalCapital },
    { name: 'C.A Prévu', value: stats.expectedRevenue },
    { name: 'Bénéfice Réalisé', value: stats.totalProfit }
  ];

  const StatCard = ({ title, value, icon: Icon, color }) => (
    <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="text-2xl font-bold text-slate-900 mt-1">{value?.toFixed(2)} MAD</p>
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon size={24} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Capital Total (Stock)" 
          value={stats.totalCapital} 
          icon={Package} 
          color="bg-blue-100 text-blue-600" 
        />
        <StatCard 
          title="Chiffre d'Affaires Prévu" 
          value={stats.expectedRevenue} 
          icon={TrendingUp} 
          color="bg-indigo-100 text-indigo-600" 
        />
        <StatCard 
          title="Bénéfice Prévu" 
          value={stats.expectedProfit} 
          icon={DollarSign} 
          color="bg-emerald-100 text-emerald-600" 
        />
        <StatCard 
          title="Bénéfice Réalisé (Vendu)" 
          value={stats.totalProfit} 
          icon={DollarSign} 
          color="bg-purple-100 text-purple-600" 
        />
      </div>

      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm mt-8">
        <h2 className="text-lg font-semibold text-slate-800 mb-6">Aperçu Financier</h2>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} tickFormatter={(value) => `${value} MAD`} />
              <Tooltip cursor={{ fill: '#f1f5f9' }} formatter={(value) => `${value.toFixed(2)} MAD`} />
              <Bar dataKey="value" fill="#6366f1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
