import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import api from '../../../utils/api';

const ClientForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);
  
  const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm();

  useEffect(() => {
    if (isEdit) {
      api.get(`/clients/${id}`).then(res => {
        const fields = ['name', 'email', 'phone', 'address', 'cuit'];
        fields.forEach(field => setValue(field, res.data[field]));
      });
    }
  }, [id, isEdit, setValue]);

  const onSubmit = async (data) => {
    try {
      if (isEdit) {
        await api.put(`/clients/${id}`, data);
      } else {
        await api.post('/clients', data);
      }
      navigate('/clients');
    } catch (error) {
      alert('Error al guardar el cliente');
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">
          {isEdit ? 'Editar Cliente' : 'Nuevo Cliente'}
        </h2>
        <button onClick={() => navigate('/clients')} className="btn-secondary">Cancelar</button>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Nombre / Razón Social</label>
              <input 
                {...register('name', { required: 'Requerido' })}
                className="input-field" 
              />
              {errors.name && <span className="text-red-500 text-xs">{errors.name.message}</span>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
              <input 
                type="email"
                {...register('email', { required: 'Requerido' })}
                className="input-field" 
              />
              {errors.email && <span className="text-red-500 text-xs">{errors.email.message}</span>}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">CUIT</label>
              <input 
                {...register('cuit', { required: 'Requerido' })}
                className="input-field" 
              />
              {errors.cuit && <span className="text-red-500 text-xs">{errors.cuit.message}</span>}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Teléfono</label>
              <input 
                {...register('phone', { required: 'Requerido' })}
                className="input-field" 
              />
              {errors.phone && <span className="text-red-500 text-xs">{errors.phone.message}</span>}
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-slate-700 mb-1">Dirección</label>
              <input 
                {...register('address', { required: 'Requerido' })}
                className="input-field" 
              />
              {errors.address && <span className="text-red-500 text-xs">{errors.address.message}</span>}
            </div>
          </div>

          <div className="flex justify-end">
            <button type="submit" disabled={isSubmitting} className="btn-primary">
              {isSubmitting ? 'Guardando...' : 'Guardar Cliente'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ClientForm;
