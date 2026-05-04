import { useEffect, useState, useMemo } from 'react';
import { Pencil, Trash2, ArrowDownLeft, ArrowUpRight, Filter, Download, X } from 'lucide-react';
import { transaccionService } from '../../services/transaccionService';
import type { MovimientoDTO } from '../../services/transaccionService';

const CATEGORIAS = ['Todas', 'Servicios', 'Entretenimiento', 'Transporte', 'Alimentacion', 'Salud', 'Deudas'];

// Componente de tabla con filtrado y exportacion CSV
export const TransactionTable = ({ refreshKey = 0 }: { refreshKey?: number }) => {
  const [data, setData] = useState<MovimientoDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<'todos' | 'ingreso' | 'egreso'>('todos');
  const [filterCategory, setFilterCategory] = useState('Todas');
  const [showFilters, setShowFilters] = useState(false);

  const fetchHistorial = async () => {
    try {
      setLoading(true);
      const historial = await transaccionService.obtenerHistorial();
      setData(historial);
      setError(null);
    } catch (err) {
      setError('Error al obtener el historial');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistorial();
  }, [refreshKey]);

  // Filtra los datos segun los criterios seleccionados
  const filteredData = useMemo(() => {
    return data.filter(tr => {
      const matchType = filterType === 'todos' || tr.tipo?.toLowerCase() === filterType;
      const matchCat = filterCategory === 'Todas' || (tr.categoria || '').toLowerCase() === filterCategory.toLowerCase();
      return matchType && matchCat;
    });
  }, [data, filterType, filterCategory]);

  // Exporta los movimientos filtrados como archivo CSV
  const handleExport = () => {
    if (filteredData.length === 0) return;
    const header = ['ID', 'Tipo', 'Descripcion', 'Categoria', 'Monto', 'Fecha'];
    const rows = filteredData.map(tr => [
      tr.id ?? '',
      tr.tipo ?? '',
      `"${(tr.descripcion ?? '').replace(/"/g, '""')}"`,
      tr.categoria ?? '',
      tr.monto ?? 0,
      tr.fecha ?? ''
    ]);
    const csv = [header, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fintrack_movimientos_${new Date().toLocaleDateString('en-CA')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="card-premium overflow-hidden animate-fade-in">
      {/* Header con acciones */}
      <div className="p-8 border-b border-slate-100 flex flex-wrap justify-between items-center gap-4 bg-white">
        <div>
          <h2 className="text-xl font-black text-slate-900 tracking-tight">Actividad Reciente</h2>
          <p className="text-sm font-medium text-slate-400 mt-0.5">
            {filteredData.length} de {data.length} movimientos
          </p>
        </div>
        <div className="flex items-center gap-3">
           <button
             onClick={() => setShowFilters(!showFilters)}
             className={`flex items-center gap-2 px-4 py-2 text-sm font-bold rounded-xl hover:bg-slate-100 transition-colors border ${showFilters ? 'bg-blue-50 text-blue-600 border-blue-200' : 'text-slate-600 bg-slate-50 border-slate-200'}`}
           >
              <Filter className="w-4 h-4" />
              Filtrar
              {(filterType !== 'todos' || filterCategory !== 'Todas') && (
                <span className="w-2 h-2 bg-blue-600 rounded-full" />
              )}
           </button>
           <button
             onClick={handleExport}
             disabled={filteredData.length === 0}
             className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-white bg-slate-900 rounded-xl hover:bg-slate-800 transition-all shadow-lg shadow-slate-100 disabled:opacity-40 disabled:cursor-not-allowed"
           >
              <Download className="w-4 h-4" />
              Exportar CSV
           </button>
        </div>
      </div>

      {/* Panel de filtros (desplegable) */}
      {showFilters && (
        <div className="px-8 py-5 bg-slate-50/60 border-b border-slate-100 flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Tipo:</span>
            {(['todos', 'ingreso', 'egreso'] as const).map(t => (
              <button
                key={t}
                onClick={() => setFilterType(t)}
                className={`px-3 py-1.5 rounded-lg text-xs font-black uppercase transition-all ${filterType === t ? 'bg-slate-900 text-white' : 'bg-white text-slate-500 border border-slate-200 hover:border-slate-400'}`}
              >
                {t === 'todos' ? 'Todos' : t === 'ingreso' ? 'Ingresos' : 'Egresos'}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Categoría:</span>
            <select
              value={filterCategory}
              onChange={e => setFilterCategory(e.target.value)}
              className="px-3 py-1.5 rounded-lg text-xs font-bold border border-slate-200 bg-white text-slate-700 outline-none focus:border-blue-400"
            >
              {CATEGORIAS.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          {(filterType !== 'todos' || filterCategory !== 'Todas') && (
            <button
              onClick={() => { setFilterType('todos'); setFilterCategory('Todas'); }}
              className="flex items-center gap-1 text-xs font-bold text-rose-500 hover:text-rose-700 transition-colors"
            >
              <X className="w-3 h-3" /> Limpiar filtros
            </button>
          )}
        </div>
      )}

      {loading ? (
        <div className="p-20 text-center">
           <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4" />
           <p className="text-slate-400 font-bold tracking-widest text-xs uppercase">Sincronizando datos...</p>
        </div>
      ) : error && data.length === 0 ? (
        <div className="p-20 text-center text-rose-500 font-medium">{error}</div>
      ) : filteredData.length === 0 ? (
        <div className="p-20 text-center text-slate-400 font-medium">No hay movimientos que coincidan con los filtros.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap min-w-[800px]">
            <thead className="bg-slate-50/50 text-slate-400 uppercase font-black text-[10px] tracking-[0.15em] border-b border-slate-100">
              <tr>
                <th className="px-8 py-5">Movimiento</th>
                <th className="px-8 py-5">Categoría</th>
                <th className="px-8 py-5 text-right">Monto</th>
                <th className="px-8 py-5 text-center">Fecha</th>
                <th className="px-8 py-5 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredData.map((tr, index) => {
                const safeTipo = tr.tipo?.toLowerCase() || 'egreso';
                const safeMonto = typeof tr.monto === 'number' ? tr.monto : 0;
                // Clave unica combinando id + indice para evitar colisiones cuando hay ids duplicados o nulos
                const rowKey = tr.id != null ? `${tr.id}-${index}` : `row-${index}`;
                let safeDateLabel = 'Sin fecha';
                try {
                  if (tr.fecha) {
                    const dateObj = new Date(tr.fecha + 'T12:00:00');
                    if (!isNaN(dateObj.getTime())) {
                      safeDateLabel = dateObj.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' });
                    }
                  }
                } catch (e) { /* ignorar */ }

                return (
                  <tr key={rowKey} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-4">
                         <div className={`p-2.5 rounded-xl ${safeTipo === 'ingreso' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                            {safeTipo === 'ingreso' ? <ArrowUpRight className="w-5 h-5" /> : <ArrowDownLeft className="w-5 h-5" />}
                         </div>
                         <div>
                            <p className="text-slate-900 font-black tracking-tight">{tr.descripcion || 'Sin descripción'}</p>
                            <p className="text-slate-400 text-xs font-bold uppercase tracking-tighter mt-0.5">{tr.tipo || 'Desconocido'}</p>
                         </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className="px-3 py-1.5 bg-slate-100 text-slate-600 rounded-lg text-xs font-black uppercase tracking-wider">
                        {tr.categoria || 'General'}
                      </span>
                    </td>
                    <td className={`px-8 py-5 text-right font-black text-lg tracking-tighter ${safeTipo === 'ingreso' ? 'text-emerald-600' : 'text-slate-900'}`}>
                      {safeTipo === 'ingreso' ? '+' : '-'}${safeMonto.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </td>
                    <td className="px-8 py-5 text-center text-slate-500 font-bold tabular-nums">
                      {safeDateLabel}
                    </td>
                    <td className="px-8 py-5 text-center">
                      <div className="flex justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="w-9 h-9 flex items-center justify-center text-slate-400 hover:bg-white hover:text-blue-600 hover:shadow-sm rounded-xl transition-all border border-transparent hover:border-slate-200">
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button className="w-9 h-9 flex items-center justify-center text-slate-400 hover:bg-white hover:text-rose-600 hover:shadow-sm rounded-xl transition-all border border-transparent hover:border-slate-200">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
      <div className="p-6 border-t border-slate-50 text-center text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] bg-slate-50/30">
        Mostrando {filteredData.length} de {data.length} registros
      </div>
    </div>
  );
};