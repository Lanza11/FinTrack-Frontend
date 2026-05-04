import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../store/AuthContext';
import { transaccionService } from '../../services/transaccionService';
import type { MovimientoDTO } from '../../services/transaccionService';
import { Wallet, ArrowUpRight, ArrowDownLeft, Menu, Bell, LayoutDashboard, ReceiptText, PieChart, BarChart3, TrendingUp, TrendingDown, LogOut, Clock, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';

const CATEGORY_COLORS: Record<string, string> = {
  servicios: '#6366f1',
  entretenimiento: '#f59e0b',
  transporte: '#3b82f6',
  alimentacion: '#10b981',
  alimentación: '#10b981',
  salud: '#ef4444',
  deudas: '#8b5cf6',
};

// Pagina principal de administracion financiera
export const Dashboard = () => {
  const { user, logout } = useAuth();
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [summary, setSummary] = useState({ balance: 0, ingresos: 0, gastos: 0, porcentajeGastos: 0, porcentajeAhorro: 0 });
  const [recientes, setRecientes] = useState<MovimientoDTO[]>([]);
  const [gastosCategoria, setGastosCategoria] = useState<Record<string, number>>({});

  const handleLogout = () => {
    logout();
    toast.success('Sesión cerrada correctamente');
  };

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

  useEffect(() => {
    const loadData = async () => {
      // Carga del balance real desde el microservicio
      try {
        const data = await transaccionService.obtenerResumen();
        setSummary({
          balance: data.balance ?? 0,
          ingresos: data.totalIngresos ?? 0,
          gastos: data.totalGastos ?? 0,
          porcentajeGastos: data.porcentajeGastos ?? 0,
          porcentajeAhorro: data.porcentajeAhorro ?? 0,
        });
      } catch { 
        // En caso de error, se mantienen los valores por defecto (0) y se muestra un mensaje
        console.error('Error al cargar el resumen financiero');
       }

      // Carga del historial para calcular distribucion y actividad reciente en el frontend
      try {
        const historial = await transaccionService.obtenerHistorial();

        // Actividad reciente: ultimos 5 movimientos
        setRecientes(historial.slice(0, 5));

        // Distribucion de gastos por categoria (solo mes actual)
        const now = new Date();
        const currentMonth = now.getMonth();
        const currentYear = now.getFullYear();

        const distribucion: Record<string, number> = {};
        historial
          .filter(m => {
            if (m.tipo?.toLowerCase() !== 'egreso') return false;
            if (!m.fecha) return false;
            const d = new Date(m.fecha + 'T12:00:00'); // Evitar problemas de zona horaria
            return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
          })
          .forEach(m => {
            const cat = (m.categoria || 'general').toLowerCase();
            distribucion[cat] = (distribucion[cat] || 0) + (m.monto || 0);
          });
        setGastosCategoria(distribucion);
      } catch { 
        console.error('Error al cargar el historial de transacciones');
      }
    };

    loadData();
  }, []);

  const totalGastosCat = Object.values(gastosCategoria).reduce((a, b) => a + b, 0);

  return (
    <div className="min-h-screen bg-[#fcfcfd] flex font-sans">
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden" onClick={toggleSidebar} />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:sticky top-0 left-0 h-screen w-[280px] bg-white border-r border-slate-200 flex-shrink-0 flex flex-col z-50 transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="flex items-center gap-3 px-8 h-20 border-b border-slate-100">
           <div className="bg-blue-600 p-2 rounded-xl shadow-lg shadow-blue-200">
              <Wallet className="w-6 h-6 text-white" />
           </div>
           <span className="font-black text-2xl tracking-tighter text-slate-900">FinTrack</span>
        </div>
        
        <nav className="flex-1 py-10 px-4 space-y-2">
           <NavItem icon={<LayoutDashboard />} label="Dashboard" active />
           <NavItem icon={<ReceiptText />} label="Transacciones" href="/transactions" />
           <NavItem icon={<PieChart />} label="Presupuestos" disabled />
           <NavItem icon={<BarChart3 />} label="Métricas" disabled />
        </nav>

      </aside>

      <main className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="h-20 flex items-center justify-between px-8 bg-white/80 backdrop-blur-md sticky top-0 border-b border-slate-100 z-30">
          <button onClick={toggleSidebar} className="lg:hidden p-2 text-slate-600 hover:bg-slate-50 rounded-xl">
            <Menu className="w-6 h-6" />
          </button>

          <div className="flex items-center gap-6 ml-auto">
             <div className="h-8 w-px bg-slate-200" />
             <div className="flex items-center gap-3">
                <div className="text-right hidden sm:block">
                   <p className="text-sm font-bold text-slate-900 leading-none">{user?.name || user?.email?.split('@')[0]}</p>
                   <p className="text-xs font-medium text-slate-400 mt-1 uppercase tracking-tighter">{user?.email}</p>
                </div>
                <button onClick={handleLogout} className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center text-slate-500 hover:bg-red-50 hover:text-red-500 transition-all border border-slate-200">
                   <LogOut className="w-5 h-5" />
                </button>
             </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-8 lg:p-10">
          <div className="max-w-[1400px] w-full mx-auto animate-fade-in">
            <div className="mb-10">
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">Hola, {user?.name ? user.name.split(' ')[0] : user?.email?.split('@')[0]} 👋</h2>
              <p className="text-slate-500 font-medium mt-1">Resumen financiero del mes actual.</p>
            </div>

            {/* Tarjetas de estadísticas */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              <StatsCard
                label="Balance Total"
                value={`$${(summary.balance || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
                trend={summary.porcentajeAhorro !== 0 ? `${summary.porcentajeAhorro.toFixed(1)}% de ahorro` : 'Sin datos aún'}
                trendUp={summary.porcentajeAhorro >= 0}
                icon={<Wallet className="w-6 h-6" />}
                color="blue"
              />
              <StatsCard
                label="Ingresos del Mes"
                value={`$${(summary.ingresos || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
                trend={summary.ingresos > 0 ? 'Registrado este mes' : 'Sin ingresos aún'}
                trendUp={true}
                icon={<ArrowUpRight className="w-6 h-6" />}
                color="emerald"
              />
              <StatsCard
                label="Gastos del Mes"
                value={`$${(summary.gastos || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}`}
                trend={summary.porcentajeGastos !== 0 ? `${summary.porcentajeGastos.toFixed(1)}% del ingreso` : 'Sin gastos aún'}
                trendUp={false}
                icon={<ArrowDownLeft className="w-6 h-6" />}
                color="rose"
              />
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
              {/* Distribución de gastos por categoría (calculada en frontend) esperamos que en futuros sprint sea responsabilidad del back */}
              <div className="card-premium p-8">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h4 className="text-lg font-black text-slate-800">Distribución de Gastos</h4>
                    <p className="text-xs text-slate-400 font-medium mt-0.5">Por categoría · Mes actual</p>
                  </div>
                  <PieChart className="w-5 h-5 text-slate-300" />
                </div>
                {totalGastosCat === 0 ? (
                  <div className="flex flex-col items-center justify-center h-48 text-slate-300">
                    <PieChart className="w-12 h-12 mb-3" />
                    <p className="text-sm font-bold text-slate-400">Sin gastos registrados</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {Object.entries(gastosCategoria)
                      .sort(([, a], [, b]) => b - a)
                      .map(([cat, monto]) => {
                        const pct = Math.round((monto / totalGastosCat) * 100);
                        const color = CATEGORY_COLORS[cat] || '#94a3b8';
                        return (
                          <div key={cat} className="space-y-1.5">
                            <div className="flex justify-between items-center">
                              <span className="text-sm font-bold text-slate-700 capitalize">{cat}</span>
                              <span className="text-sm font-black text-slate-900">${monto.toLocaleString(undefined, { minimumFractionDigits: 2 })} <span className="text-slate-400 font-bold text-xs">({pct}%)</span></span>
                            </div>
                            <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                              <div
                                className="h-full rounded-full transition-all duration-700"
                                style={{ width: `${pct}%`, backgroundColor: color }}
                              />
                            </div>
                          </div>
                        );
                      })}
                  </div>
                )}
              </div>

              {/* Actividad reciente ultimos 5 movimientos */}
              <div className="card-premium p-8">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h4 className="text-lg font-black text-slate-800">Actividad Reciente</h4>
                    <p className="text-xs text-slate-400 font-medium mt-0.5">Últimos 5 movimientos</p>
                  </div>
                  <Link to="/transactions" className="flex items-center gap-1 text-xs font-bold text-blue-600 hover:underline">
                    Ver todo <ExternalLink className="w-3 h-3" />
                  </Link>
                </div>
                {recientes.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-48 text-slate-300">
                    <Clock className="w-12 h-12 mb-3" />
                    <p className="text-sm font-bold text-slate-400">Sin movimientos aún</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {recientes.map((m, i) => {
                      const esIngreso = m.tipo?.toLowerCase() === 'ingreso';
                      return (
                        <div key={`${m.id}-${i}`} className="flex items-center gap-4 p-3 rounded-2xl hover:bg-slate-50 transition-colors">
                          <div className={`p-2 rounded-xl flex-shrink-0 ${esIngreso ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                            {esIngreso ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownLeft className="w-4 h-4" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-black text-slate-900 truncate">{m.descripcion || 'Sin descripción'}</p>
                            <p className="text-xs text-slate-400 font-medium">{m.categoria || 'General'}</p>
                          </div>
                          <span className={`text-sm font-black flex-shrink-0 ${esIngreso ? 'text-emerald-600' : 'text-slate-900'}`}>
                            {esIngreso ? '+' : '-'}${(m.monto || 0).toLocaleString(undefined, { minimumFractionDigits: 2 })}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

const NavItem = ({ icon, label, href = '#', active = false, disabled = false }: { icon: React.ReactNode, label: string, href?: string, active?: boolean, disabled?: boolean }) => (
  <a
    href={disabled ? undefined : href}
    className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl font-bold transition-all
      ${active ? 'bg-blue-600 text-white shadow-lg shadow-blue-100' : ''}
      ${disabled ? 'text-slate-300 cursor-not-allowed' : !active ? 'text-slate-400 hover:bg-slate-50 hover:text-slate-900' : ''}
    `}
  >
     {icon}
     <span>{label}</span>
     {disabled && <span className="ml-auto text-[9px] font-black uppercase tracking-widest bg-slate-100 text-slate-400 px-2 py-0.5 rounded-full">Pronto</span>}
  </a>
);

const StatsCard = ({ label, value, icon, trend, trendUp, color }: { label: string, value: string, icon: React.ReactNode, trend: string, trendUp: boolean, color: string }) => {
  const colorMap: Record<string, string> = {
    blue: 'bg-blue-50 text-blue-600',
    emerald: 'bg-emerald-50 text-emerald-600',
    rose: 'bg-rose-50 text-rose-600'
  };

  return (
    <div className="card-premium p-8 group transition-all hover:scale-[1.02]">
      <div className="flex items-start justify-between mb-6">
        <div className={`p-4 rounded-2xl ${colorMap[color]} group-hover:scale-110 transition-transform`}>
          {icon}
        </div>
      </div>
      <div>
        <p className="text-slate-500 text-sm font-bold uppercase tracking-widest">{label}</p>
        <h3 className="text-4xl font-black text-slate-900 italic tracking-tighter mt-2">{value}</h3>
        <p className={`text-xs font-bold mt-4 flex items-center gap-1 ${trendUp ? 'text-emerald-500' : 'text-rose-500'}`}>
           {trendUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
           {trend}
        </p>
      </div>
    </div>
  );
};
