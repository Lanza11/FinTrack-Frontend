import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { Button } from '../atoms/Button';
import { Input } from '../atoms/Input';
import { Label } from '../atoms/Label';
import { Select } from '../atoms/Select';
import { transaccionService } from '../../services/transaccionService';

// Simplified categories based on the requirements
const CATEGORIAS = [
  { id: 1, label: 'Alimentación' },
  { id: 2, label: 'Transporte' },
  { id: 3, label: 'Servicios' },
  { id: 4, label: 'Entretenimiento' },
  { id: 5, label: 'Salud' },
  { id: 6, label: 'Otros' },
];

const transactionSchema = z.object({
  tipo: z.enum(['ingreso', 'egreso']),
  monto: z.number().positive("El monto debe ser mayor a 0"),
  fecha: z.string().min(1, "La fecha es obligatoria"),
  descripcion: z.string().optional(),
  categoria: z.string().optional(),
});

type TransactionFormValues = z.infer<typeof transactionSchema>;

export const TransactionForm = ({ onSuccess }: { onSuccess?: () => void }) => {
  const [loading, setLoading] = useState(false);
  
  const { register, handleSubmit, watch, reset, formState: { errors } } = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      tipo: 'egreso',
      fecha: new Date().toISOString().split('T')[0]
    }
  });

  const tipo = watch('tipo');

  const onSubmit = async (data: TransactionFormValues) => {
    setLoading(true);
    try {
      if (data.tipo === 'ingreso') {
        const payload = {
          monto: data.monto,
          fecha: data.fecha,
          // Mock percentage since we don't have the full percentage UI yet for general budget distribution
          porcentajes: { 1: 50, 2: 20, 3: 30 } 
        };
        await transaccionService.registrarIngreso(payload);
        toast.success("Ingreso registrado correctamente");
      } else {
        const payload = {
          monto: data.monto,
          fecha: data.fecha,
          codigoCategoria: Number(data.categoria || 6),
          descripcion: data.descripcion || 'Sin descripción'
        };
        await transaccionService.registrarEgreso(payload);
        toast.success("Egreso registrado correctamente");
      }
      reset();
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error(error);
      toast.error('Error al registrar la transacción');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 border border-gray-200 rounded-xl shadow-md">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Registrar Transacción</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Tipo de Transacción</Label>
            <Select {...register('tipo')} error={errors.tipo?.message}>
              <option value="egreso">Egreso</option>
              <option value="ingreso">Ingreso</option>
            </Select>
          </div>

          <div>
            <Label>Monto ($)</Label>
            <Input 
              type="number" 
              step="0.01" 
              {...register('monto', { valueAsNumber: true })} 
              placeholder="0.00"
              error={errors.monto?.message}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label>Fecha</Label>
            <Input 
              type="date" 
              {...register('fecha')} 
              error={errors.fecha?.message}
            />
          </div>

          {tipo === 'egreso' && (
            <div>
              <Label>Categoría</Label>
              <Select {...register('categoria')} error={errors.categoria?.message}>
                <option value="">Selecciona...</option>
                {CATEGORIAS.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.label}</option>
                ))}
              </Select>
            </div>
          )}
        </div>

        {tipo === 'egreso' && (
          <div>
            <Label>Descripción</Label>
            <Input 
              {...register('descripcion')} 
              placeholder="Ej. Compra de supermercado"
              error={errors.descripcion?.message}
            />
          </div>
        )}
        
        {tipo === 'ingreso' && (
          <div className="bg-blue-50 text-blue-800 text-sm p-3 rounded-md">
            Nota: Al registrar un ingreso, se generarán y distribuirán los presupuestos mensuales de acuerdo a la configuración predeterminada.
          </div>
        )}

        <div className="pt-2">
          <Button type="submit" disabled={loading} className="w-full">
            {loading ? 'GUARDANDO...' : 'GUARDAR TRANSACCIÓN'}
          </Button>
        </div>
      </form>
    </div>
  );
};