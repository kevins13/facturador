import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, FileText, DollarSign, TrendingUp } from 'lucide-react';
import api from '../utils/api';

const Dashboard = () => {
  const [stats, setStats] = useState({ clients: 0, invoices: 0, revenue: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [clientsRes, invoicesRes] = await Promise.all([
          api.get('/clients'),
          api.get('/invoices')
        ]);
        
        const clientsCount = clientsRes.data.length;
        const invoicesCount = invoicesRes.data.length;
        const totalRevenue = invoicesRes.data
          .filter(inv => inv.status === 'paid')
          .reduce((acc, curr) => acc + curr.total, 0);

        setStats({ clients: clientsCount, invoices: invoicesCount, revenue: totalRevenue });
      } catch (error) {
        console.error('Error fetching stats', error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) return <div>Cargando dashboard...</div>;

  const statCards = [
    { title: 'Total Clientes', value: stats.clients, icon: Users, color: 'text-blue-500', bg: 'bg-blue-50' },
    { title: 'Facturas Emitidas', value: stats.invoices, icon: FileText, color: 'text-purple-500', bg: 'bg-purple-50' },
    { title: 'Ingresos Registrados', value: `$${stats.revenue.toFixed(2)}`, icon: DollarSign, color: 'text-green-500', bg: 'bg-green-50' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Resumen General</h2>
        <div className="space-x-3">
          <Link to="/clients/new" className="btn-secondary">Nuevo Cliente</Link>
          <Link to="/invoices/new" className="btn-primary">Nueva Factura</Link>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {statCards.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div key={idx} className="card flex items-center p-6 space-x-4">
              <div className={`p-4 rounded-full ${stat.bg} ${stat.color}`}>
                <Icon size={24} />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">{stat.title}</p>
                <h4 className="text-2xl font-bold text-slate-900">{stat.value}</h4>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Dashboard;
