import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
import { Plus, Trash2 } from 'lucide-react';
import api from '../../../utils/api';

const InvoiceForm = () => {
  const navigate = useNavigate();
  const [clients, setClients] = useState([]);
  const { register, control, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm({
    defaultValues: {
      items: [{ description: '', quantity: 1, price: 0 }]
    }
  });

  const { fields, append, remove } = useFieldArray({ control, name: 'items' });
  const watchItems = watch('items');

  const totalAmount = watchItems.reduce((acc, curr) => {
    return acc + (parseFloat(curr.quantity || 0) * parseFloat(curr.price || 0));
  }, 0);

  useEffect(() => {
    api.get('/clients').then(res => setClients(res.data));
  }, []);

  const onSubmit = async (data) => {
    try {
      await api.post('/invoices', data);
      navigate('/invoices');
    } catch (error) {
      alert('Error al crear la factura');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Nueva Factura</h2>
        <button onClick={() => navigate('/invoices')} className="btn-secondary">Cancelar</button>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="card">
          <h3 className="text-lg font-medium text-slate-800 mb-4">Datos Generales</h3>
          <div className="w-full md:w-1/2">
            <label className="block text-sm font-medium text-slate-700 mb-1">Cliente</label>
            <select 
              {...register('clientId', { required: 'Debe seleccionar un cliente' })}
              className="input-field"
            >
              <option value="">Seleccione un cliente...</option>
              {clients.map(c => (
                <option key={c.id} value={c.id}>{c.name} - {c.cuit}</option>
              ))}
            </select>
            {errors.clientId && <span className="text-red-500 text-xs">{errors.clientId.message}</span>}
          </div>
        </div>

        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium text-slate-800">Items (Detalle de Factura)</h3>
            <button 
              type="button" 
              onClick={() => append({ description: '', quantity: 1, price: 0 })}
              className="btn-secondary text-sm flex items-center gap-1 py-1.5"
            >
              <Plus size={16} /> Agregar Item
            </button>
          </div>

          <div className="space-y-4 text-sm font-medium text-slate-500 border-b border-slate-200 pb-2 hidden md:flex">
            <div className="w-1/2">Descripción</div>
            <div className="w-1/6 text-right">Cant.</div>
            <div className="w-1/6 text-right">Precio ($)</div>
            <div className="w-[10%] text-right">Subtotal</div>
            <div className="w-[6%]"></div>
          </div>

          {fields.map((field, index) => {
            const currentItem = watchItems[index] || {};
            const itemSubtotal = (parseFloat(currentItem.quantity || 0) * parseFloat(currentItem.price || 0));
            return (
              <div key={field.id} className="flex flex-col md:flex-row items-end md:items-center gap-4 py-2 border-b border-slate-50 md:border-none">
                <div className="w-full md:w-1/2">
                  <label className="md:hidden block text-xs text-slate-500 mb-1">Descripción</label>
                  <input
                    {...register(`items.${index}.description`, { required: true })}
                    className="input-field py-1.5"
                    placeholder="Descripción del servicio o producto"
                  />
                </div>
                <div className="w-1/3 md:w-1/6">
                  <label className="md:hidden block text-xs text-slate-500 mb-1">Cantidad</label>
                  <input
                    type="number" min="1" step="0.01"
                    {...register(`items.${index}.quantity`, { required: true, min: 1 })}
                    className="input-field py-1.5 text-right"
                  />
                </div>
                <div className="w-1/3 md:w-1/6">
                  <label className="md:hidden block text-xs text-slate-500 mb-1">Precio Unitario</label>
                  <input
                    type="number" min="0" step="0.01"
                    {...register(`items.${index}.price`, { required: true, min: 0 })}
                    className="input-field py-1.5 text-right"
                  />
                </div>
                <div className="w-1/3 md:w-[10%] text-right font-medium text-slate-700 py-2">
                  ${itemSubtotal.toFixed(2)}
                </div>
                <div className="w-full md:w-[6%] flex justify-end">
                  <button 
                    type="button" 
                    onClick={() => remove(index)}
                    className="text-slate-400 hover:text-red-500 transition-colors p-2"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            );
          })}

          <div className="mt-6 pt-4 border-t border-slate-200 flex justify-end">
            <div className="w-64">
              <div className="flex justify-between items-center text-lg font-bold text-slate-800">
                <span>TOTAL:</span>
                <span>${totalAmount.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button type="submit" disabled={isSubmitting || fields.length === 0} className="btn-primary">
            {isSubmitting ? 'Guardando...' : 'Emitir Factura'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default InvoiceForm;
