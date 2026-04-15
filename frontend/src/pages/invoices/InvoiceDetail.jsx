import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, CheckCircle, Search, Download } from 'lucide-react';
import { format } from 'date-fns';
import api from '../../../utils/api';

const InvoiceDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInvoice();
  }, [id]);

  const fetchInvoice = async () => {
    try {
      const res = await api.get(`/invoices/${id}`);
      setInvoice(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const markAsPaid = async () => {
    try {
      await api.put(`/invoices/${id}/pay`);
      fetchInvoice();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDownload = async () => {
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

  if (loading) return <div>Cargando detalle...</div>;
  if (!invoice) return <div>Factura no encontrada</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Actions */}
      <div className="flex justify-between items-center">
        <button onClick={() => navigate('/invoices')} className="text-slate-500 hover:text-slate-800 flex items-center gap-1 font-medium transition-colors">
          <ArrowLeft size={18} /> Volver
        </button>
        <div className="flex gap-3">
          {invoice.status === 'pending' && (
            <button onClick={markAsPaid} className="btn-secondary flex items-center gap-2 !text-green-600 !border-green-200 hover:!bg-green-50">
              <CheckCircle size={18} /> Marcar Pagada
            </button>
          )}
          <button onClick={handleDownload} className="btn-primary flex items-center gap-2">
            <Download size={18} /> Descargar PDF
          </button>
        </div>
      </div>

      {/* Document View */}
      <div className="card !p-12 shadow-md">
        <div className="flex justify-between items-start border-b border-slate-200 pb-8 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 tracking-tight">AuraLink</h1>
            <p className="text-sm text-slate-500 mt-1">Soluciones Tecnológicas</p>
          </div>
          <div className="text-right">
            <h2 className="text-xl font-bold text-slate-700">FACTURA</h2>
            <p className="text-slate-600 mt-1">#{invoice.id.toString().padStart(6, '0')}</p>
            <p className="text-sm text-slate-500 mt-1">Vencimiento: {format(new Date(invoice.date), 'dd/MM/yyyy')}</p>
            <div className="mt-2 text-right">
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                invoice.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
              }`}>
                {invoice.status === 'paid' ? 'PAGADA' : 'PENDIENTE'}
              </span>
            </div>
          </div>
        </div>

        <div className="mb-10">
          <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2">Facturar A:</h3>
          <p className="text-lg font-bold text-slate-800">{invoice.client.name}</p>
          <p className="text-slate-600">{invoice.client.address}</p>
          <p className="text-slate-600">CUIT: {invoice.client.cuit}</p>
          <p className="text-slate-600">{invoice.client.email} | {invoice.client.phone}</p>
        </div>

        <table className="w-full text-left mb-8">
          <thead>
            <tr className="border-b-2 border-slate-800 text-slate-800">
              <th className="py-3 font-semibold">Descripción</th>
              <th className="py-3 font-semibold text-right w-24">Cant.</th>
              <th className="py-3 font-semibold text-right w-32">Precio</th>
              <th className="py-3 font-semibold text-right w-32">Importe</th>
            </tr>
          </thead>
          <tbody>
            {invoice.items.map((item, idx) => (
              <tr key={idx} className="border-b border-slate-200">
                <td className="py-4 text-slate-700">{item.description}</td>
                <td className="py-4 text-slate-700 text-right">{item.quantity}</td>
                <td className="py-4 text-slate-700 text-right">${item.price.toFixed(2)}</td>
                <td className="py-4 text-slate-800 font-medium text-right">${item.subtotal.toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="flex justify-end pt-4">
          <div className="w-64">
            <div className="flex justify-between items-center text-xl font-bold text-slate-900 border-t-2 border-slate-800 pt-3">
              <span>TOTAL</span>
              <span>${invoice.total.toFixed(2)}</span>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  );
};

export default InvoiceDetail;
