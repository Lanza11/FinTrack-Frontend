import { useEffect, useState } from 'react';
import { Pencil, Trash2 } from 'lucide-react';
import { transaccionService } from '../../services/transaccionService';
import type { MovimientoDTO } from '../../services/transaccionService';

export const TransactionTable = () => {
  const [data, setData] = useState<MovimientoDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
  }, []);

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden overflow-x-auto w-full mt-8">
      <div className="p-6 border-b border-gray-200 flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-800">Historial (Recientes)</h2>
        <button onClick={fetchHistorial} className="text-sm text-blue-600 hover:text-blue-800">
          Actualizar
        </button>
      </div>
      {loading ? (
        <div className="p-8 text-center text-gray-500">Cargando transacciones...</div>
      ) : error ? (
        <div className="p-8 text-center text-red-500">{error}</div>
      ) : data.length === 0 ? (
        <div className="p-8 text-center text-gray-500">No hay transacciones registradas.</div>
      ) : (
        <table className="w-full text-left text-sm whitespace-nowrap min-w-[600px]">
          <thead className="bg-gray-50 text-gray-600 uppercase font-semibold text-xs tracking-wider">
            <tr>
              <th className="px-6 py-3">Fecha</th>
              <th className="px-6 py-3">Tipo</th>
              <th className="px-6 py-3">Descripción</th>
              <th className="px-6 py-3">Categoría</th>
              <th className="px-6 py-3 text-right">Monto</th>
              <th className="px-6 py-3 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {data.map((tr) => (
              <tr key={tr.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">{tr.fecha}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-xs font-semibold uppercase tracking-wider ${tr.tipo.toLowerCase() === 'ingreso' ? 'bg-[#dcfce7] text-[#10b981]' : 'bg-[#fee2e2] text-[#ef4444]'}`}>
                    {tr.tipo}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-800 font-medium">{tr.descripcion}</td>
                <td className="px-6 py-4 text-gray-600">{tr.categoria}</td>
                <td className={`px-6 py-4 text-right font-mono font-bold ${tr.tipo.toLowerCase() === 'ingreso' ? 'text-[#10b981]' : 'text-[#ef4444]'}`}>
                  {tr.tipo.toLowerCase() === 'ingreso' ? '+' : '-'}${tr.monto.toFixed(2)}
                </td>
                <td className="px-6 py-4 text-center flex justify-center gap-2">
                  <button className="text-gray-400 hover:text-blue-600 transition-colors p-1" title="Editar">
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button className="text-gray-400 hover:text-red-600 transition-colors p-1" title="Eliminar">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      <div className="p-4 border-t border-gray-200 text-center text-sm font-medium text-gray-500 bg-gray-50 w-full overflow-hidden">
        {data.length} movimientos
      </div>
    </div>
  );
};