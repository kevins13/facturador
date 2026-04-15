import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Eye, FileText } from 'lucide-react';
import { format } from 'date-fns';
import api from '../../../utils/api';

const InvoicesList = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInvoices();
  }, []);

  const fetchInvoices = async () => {
    try {
      const res = await api.get('/invoices');
      setInvoices(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (id) => {
    try {
      const res = await api.get(`/invoices/${id}/pdf`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `factura-${id}.pdf`);
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) return <div>Cargando facturas...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Facturas</h2>
        <Link to="/invoices/new" className="btn-primary flex items-center gap-2">
          <Plus size={18} />
          Nueva Factura
        </Link>
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 text-slate-500 text-sm">
              <th className="py-4 px-6 font-medium">Nro.</th>
              <th className="py-4 px-6 font-medium">Cliente</th>
              <th className="py-4 px-6 font-medium">Fecha</th>
              <th className="py-4 px-6 font-medium">Total</th>
              <th className="py-4 px-6 font-medium">Estado</th>
              <th className="py-4 px-6 font-medium text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {invoices.length === 0 ? (
              <tr>
                <td colSpan="6" className="py-6 text-center text-slate-500">No hay facturas registradas.</td>
              </tr>
            ) : (
              invoices.map(inv => (
                <tr key={inv.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                  <td className="py-4 px-6 font-medium text-slate-900">#{inv.id.toString().padStart(6, '0')}</td>
                  <td className="py-4 px-6 text-slate-600">{inv.client.name}</td>
                  <td className="py-4 px-6 text-slate-600">{format(new Date(inv.date), 'dd/MM/yyyy')}</td>
                  <td className="py-4 px-6 font-medium text-slate-900">${inv.total.toFixed(2)}</td>
                  <td className="py-4 px-6">
                    <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                      inv.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      {inv.status === 'paid' ? 'Pagada' : 'Pendiente'}
                    </span>
                  </td>
                  <td className="py-4 px-6 flex justify-end space-x-3">
                    <Link to={`/invoices/${inv.id}`} className="text-slate-400 hover:text-primary-600 transition-colors">
                      <Eye size={18} />
                    </Link>
                    <button onClick={() => handleDownload(inv.id)} className="text-slate-400 hover:text-primary-600 transition-colors">
                      <FileText size={18} />
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
};

export default InvoicesList;
