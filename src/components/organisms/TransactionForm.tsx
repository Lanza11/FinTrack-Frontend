import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { transaccionService } from '../../services/transaccionService';
import { toast } from 'sonner';
import { PlusCircle, ArrowUpRight, ArrowDownLeft, Calendar, DollarSign, Tag, Info, Trash2, Send } from 'lucide-react';
import { Button } from '../atoms/Button';
import { Input } from '../atoms/Input';
import { Label } from '../atoms/Label';
import { useState } from 'react';
import { useForm } from 'react-hook-form';

const CATEGORIAS_EGRESO = [
  { id: 1, nombre: 'Servicios' },
  { id: 2, nombre: 'Entretenimiento' },
  { id: 3, nombre: 'Transporte' },
  { id: 4, nombre: 'Alimentación' },
  { id: 5, nombre: 'Salud' },
  { id: 6, nombre: 'Deudas' },
];

// Esquema de validacion de una fila de egreso
const egresoItemSchema = z.object({
  monto: z.number({ invalid_type_error: 'Requerido' }).min(1, 'Min $1'),
  categoria: z.number({ invalid_type_error: 'Requerido' }),
  descripcion: z.string().min(3, 'Min 3 chars').max(100),
});

// Esquema de validacion de un ingreso unico
const ingresoSchema = z.object({
  monto: z.number().min(200, 'Mínimo $200'),
  fecha: z.string().min(1, 'Requerida'),
});

type EgresoItem = z.infer<typeof egresoItemSchema>;
type IngresoForm = z.infer<typeof ingresoSchema>;

interface TransactionFormProps {
  onSuccess: () => void;
}

// Formulario de registro en modo individual o lote (batch)
export const TransactionForm: React.FC<TransactionFormProps> = ({ onSuccess }) => {
  const [activeTab, setActiveTab] = useState<'ingreso' | 'egreso'>('egreso');
  const [batchRows, setBatchRows] = useState<EgresoItem[]>([
    { monto: 0, categoria: 1, descripcion: '' }
  ]);
  const [batchDate, setBatchDate] = useState(new Date().toLocaleDateString('en-CA'));
  const [batchErrors, setBatchErrors] = useState<Record<number, Partial<Record<keyof EgresoItem, string>>>>({});
  const [isSubmittingBatch, setIsSubmittingBatch] = useState(false);

  const { register: registerIngreso, handleSubmit: handleIngresoSubmit, reset: resetIngreso, formState: { errors: ingresoErrors, isSubmitting: isSubmittingIngreso } } = useForm<IngresoForm>({
    resolver: zodResolver(ingresoSchema),
    defaultValues: { fecha: new Date().toLocaleDateString('en-CA') }
  });

  // Agrega una fila vacía al lote de egresos
  const addRow = () => setBatchRows(prev => [...prev, { monto: 0, categoria: 1, descripcion: '' }]);

  // Elimina la fila del lote en la posicion indicada
  const removeRow = (index: number) => {
    if (batchRows.length <= 1) return;
    setBatchRows(prev => prev.filter((_, i) => i !== index));
    setBatchErrors(prev => {
      const next = { ...prev };
      delete next[index];
      return next;
    });
  };

  const updateRow = (index: number, field: keyof EgresoItem, value: string | number) => {
    setBatchRows(prev => prev.map((row, i) => i === index ? { ...row, [field]: value } : row));
  };

  // Valida y envía todos los egresos del lote de forma secuencial
  const handleBatchSubmit = async () => {
    const newErrors: Record<number, Partial<Record<keyof EgresoItem, string>>> = {};
    let hasErrors = false;

    batchRows.forEach((row, i) => {
      const result = egresoItemSchema.safeParse(row);
      if (!result.success) {
        hasErrors = true;
        const fieldErrors: Partial<Record<keyof EgresoItem, string>> = {};
        result.error.issues.forEach(issue => {
          const field = issue.path[0] as keyof EgresoItem;
          fieldErrors[field] = issue.message;
        });
        newErrors[i] = fieldErrors;
      }
    });

    setBatchErrors(newErrors);
    if (hasErrors) return;

    setIsSubmittingBatch(true);
    let successCount = 0;
    let errorCount = 0;

    for (const row of batchRows) {
      try {
        await transaccionService.registrarEgreso({
          monto: row.monto,
          fecha: batchDate,
          codigoCategoria: Number(row.categoria),
          descripcion: row.descripcion
        });
        successCount++;
      } catch {
        errorCount++;
      }
    }

    setIsSubmittingBatch(false);

    if (successCount > 0) {
      toast.success(`${successCount} egreso(s) registrado(s) con éxito`);
      setBatchRows([{ monto: 0, categoria: 1, descripcion: '' }]);
      setBatchDate(new Date().toLocaleDateString('en-CA'));
      onSuccess();
    }
    if (errorCount > 0) {
      toast.error(`${errorCount} egreso(s) fallaron al registrarse`);
    }
  };

  // Registra un ingreso individual con porcentajes distribuidos igualmente
  const onIngresoSubmit = async (data: IngresoForm) => {
    try {
      await transaccionService.registrarIngreso({
        monto: data.monto,
        fecha: data.fecha,
        porcentajes: { 1: 50, 2: 30, 3: 20 }
      });
      toast.success('Ingreso registrado con éxito');
      resetIngreso({ fecha: new Date().toLocaleDateString('en-CA') });
      onSuccess();
    } catch {
      toast.error('Error al registrar el ingreso');
    }
  };

  return (
    <div className="card-premium overflow-hidden animate-fade-in mb-10 relative">
      <div className="absolute top-0 left-0 w-2 h-full bg-blue-600" />

      <div className="p-8 lg:p-10">
        <div className="mb-8">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight">Nuevo Movimiento</h2>
          <p className="text-slate-500 font-medium">Registra uno o varios movimientos del mismo día</p>
        </div>

        {/* Selector de tipo */}
        <div className="flex bg-slate-100/50 p-1.5 rounded-2xl border border-slate-200/60 max-w-sm mb-8">
           <button
              type="button"
              onClick={() => setActiveTab('egreso')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${activeTab === 'egreso' ? 'bg-white text-rose-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
           >
              <ArrowDownLeft className="w-4 h-4" />
              Gasto / Egreso
           </button>
           <button
              type="button"
              onClick={() => setActiveTab('ingreso')}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${activeTab === 'ingreso' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
           >
              <ArrowUpRight className="w-4 h-4" />
              Ingreso
           </button>
        </div>

        {activeTab === 'egreso' ? (
          /* MODO LOTE: Múltiples egresos en un mismo día */
          <div className="space-y-6">
            {/* Fecha compartida para todos los egresos del lote */}
            <div className="flex items-center gap-4">
              <div className="space-y-1.5 w-full max-w-[220px]">
                <Label className="text-slate-700 font-black text-[11px] uppercase tracking-[0.1em] ml-1">Fecha del día</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="date"
                    value={batchDate}
                    onChange={e => setBatchDate(e.target.value)}
                    className="w-full pl-10 h-11 font-bold rounded-xl border border-slate-200 bg-slate-50/30 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 outline-none transition-all text-sm text-slate-700"
                  />
                </div>
              </div>
              <div className="pt-6 text-xs text-slate-400 font-medium">
                {batchRows.length} egreso(s) · Total: <span className="font-black text-slate-700">
                  ${batchRows.reduce((sum, r) => sum + (Number(r.monto) || 0), 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                </span>
              </div>
            </div>

            {/* Filas de egresos */}
            <div className="space-y-3">
              {batchRows.map((row, i) => (
                <div key={i} className="grid grid-cols-[1fr_1.5fr_1.5fr_auto] gap-3 items-start p-4 bg-slate-50/50 rounded-2xl border border-slate-100">
                  {/* Monto */}
                  <div className="space-y-1">
                    {i === 0 && <Label className="text-slate-400 font-black text-[10px] uppercase tracking-[0.1em] ml-1">Monto</Label>}
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="number"
                        step="0.01"
                        min="1"
                        placeholder="0.00"
                        value={row.monto || ''}
                        onChange={e => updateRow(i, 'monto', parseFloat(e.target.value) || 0)}
                        className={`w-full pl-9 h-11 font-bold rounded-xl border bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 outline-none transition-all text-sm text-slate-700 ${batchErrors[i]?.monto ? 'border-rose-400' : 'border-slate-200'}`}
                      />
                      {batchErrors[i]?.monto && <p className="text-rose-500 text-[10px] font-bold mt-1 ml-1">{batchErrors[i]?.monto}</p>}
                    </div>
                  </div>
                  {/* Categoria */}
                  <div className="space-y-1">
                    {i === 0 && <Label className="text-slate-400 font-black text-[10px] uppercase tracking-[0.1em] ml-1">Categoría</Label>}
                    <div className="relative">
                      <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <select
                        value={row.categoria}
                        onChange={e => updateRow(i, 'categoria', parseInt(e.target.value))}
                        className="w-full pl-9 pr-3 h-11 bg-white border border-slate-200 rounded-xl font-bold text-slate-700 focus:border-blue-500 outline-none transition-all text-sm appearance-none"
                      >
                        {CATEGORIAS_EGRESO.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                      </select>
                    </div>
                  </div>
                  {/* Descripcion */}
                  <div className="space-y-1">
                    {i === 0 && <Label className="text-slate-400 font-black text-[10px] uppercase tracking-[0.1em] ml-1">Descripción</Label>}
                    <div className="relative">
                      <Info className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <input
                        type="text"
                        placeholder="Ej: Almuerzo"
                        value={row.descripcion}
                        onChange={e => updateRow(i, 'descripcion', e.target.value)}
                        className={`w-full pl-9 h-11 font-bold rounded-xl border bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 outline-none transition-all text-sm text-slate-700 ${batchErrors[i]?.descripcion ? 'border-rose-400' : 'border-slate-200'}`}
                      />
                      {batchErrors[i]?.descripcion && <p className="text-rose-500 text-[10px] font-bold mt-1 ml-1">{batchErrors[i]?.descripcion}</p>}
                    </div>
                  </div>
                  {/* Eliminar fila */}
                  <div className={i === 0 ? 'pt-[22px]' : ''}>
                    <button
                      type="button"
                      onClick={() => removeRow(i)}
                      disabled={batchRows.length <= 1}
                      className="w-11 h-11 flex items-center justify-center text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all disabled:opacity-20"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-4 pt-2">
              <button
                type="button"
                onClick={addRow}
                className="flex items-center gap-2 px-4 py-2.5 text-sm font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-xl transition-all border border-blue-100"
              >
                <PlusCircle className="w-4 h-4" />
                Agregar otro gasto
              </button>
              <Button
                type="button"
                disabled={isSubmittingBatch}
                onClick={handleBatchSubmit}
                className="flex-1 h-12 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white font-black text-sm tracking-[0.1em] transition-all flex items-center justify-center gap-3 shadow-xl shadow-slate-200"
              >
                {isSubmittingBatch ? 'ENVIANDO...' : `REGISTRAR ${batchRows.length > 1 ? batchRows.length + ' GASTOS' : 'GASTO'}`}
                {!isSubmittingBatch && <Send className="w-4 h-4" />}
              </Button>
            </div>
          </div>
        ) : (
          /* MODO INDIVIDUAL: Ingreso único */
          <form onSubmit={handleIngresoSubmit(onIngresoSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-slate-700 font-black text-[11px] uppercase tracking-[0.1em] ml-1">Monto del Ingreso</Label>
                <div className="relative group">
                  <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                  <Input
                    {...registerIngreso('monto', { valueAsNumber: true })}
                    type="number"
                    step="0.01"
                    placeholder="200.00"
                    className="pl-12 h-14 text-lg font-black tracking-tight rounded-2xl border-slate-200 bg-slate-50/30 focus:bg-white transition-all"
                    error={ingresoErrors.monto?.message}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label className="text-slate-700 font-black text-[11px] uppercase tracking-[0.1em] ml-1">Fecha de Registro</Label>
                <div className="relative group">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-emerald-500 transition-colors" />
                  <Input
                    {...registerIngreso('fecha')}
                    type="date"
                    className="pl-12 h-14 font-bold rounded-2xl border-slate-200 bg-slate-50/30 focus:bg-white transition-all"
                    error={ingresoErrors.fecha?.message}
                  />
                </div>
              </div>
            </div>
            <p className="text-xs text-slate-400 font-medium ml-1">El ingreso se distribuirá automáticamente en el presupuesto mensual por categoría.</p>
            <Button
              type="submit"
              disabled={isSubmittingIngreso}
              className="w-full h-14 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm tracking-[0.1em] transition-all flex items-center justify-center gap-3 shadow-xl shadow-emerald-100"
            >
              {isSubmittingIngreso ? 'PROCESANDO...' : 'REGISTRAR INGRESO'}
              {!isSubmittingIngreso && <PlusCircle className="w-5 h-5" />}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
};