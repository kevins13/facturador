import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Edit, Trash2 } from 'lucide-react';
import api from '../../../utils/api';

const ClientsList = () => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const res = await api.get('/clients');
      setClients(res.data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar este cliente?')) {
      try {
        await api.delete(`/clients/${id}`);
        fetchClients();
      } catch (error) {
        alert('Error al eliminar cliente');
      }
    }
  };

  if (loading) return <div>Cargando clientes...</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Clientes</h2>
        <Link to="/clients/new" className="btn-primary flex items-center gap-2">
          <Plus size={18} />
          Nuevo Cliente
        </Link>
      </div>

      <div className="card overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-200 text-slate-500 text-sm">
              <th className="py-4 px-6 font-medium">Nombre</th>
              <th className="py-4 px-6 font-medium">Email</th>
              <th className="py-4 px-6 font-medium">CUIT</th>
              <th className="py-4 px-6 font-medium text-right">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {clients.length === 0 ? (
              <tr>
                <td colSpan="4" className="py-6 text-center text-slate-500">No hay clientes registrados.</td>
              </tr>
            ) : (
              clients.map(client => (
                <tr key={client.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                  <td className="py-4 px-6 font-medium text-slate-900">{client.name}</td>
                  <td className="py-4 px-6 text-slate-600">{client.email}</td>
                  <td className="py-4 px-6 text-slate-600">{client.cuit}</td>
                  <td className="py-4 px-6 flex justify-end space-x-3">
                    <Link to={`/clients/edit/${client.id}`} className="text-slate-400 hover:text-primary-600 transition-colors">
                      <Edit size={18} />
                    </Link>
                    <button onClick={() => handleDelete(client.id)} className="text-slate-400 hover:text-red-600 transition-colors">
                      <Trash2 size={18} />
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

export default ClientsList;
