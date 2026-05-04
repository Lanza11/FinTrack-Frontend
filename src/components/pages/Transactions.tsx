import { useState, useCallback } from 'react';
import { useAuth } from '../../store/AuthContext';
import { Wallet, Menu, Receipt, LayoutDashboard, ReceiptText, PieChart, BarChart3, LogOut } from 'lucide-react';
import { TransactionForm } from '../organisms/TransactionForm';
import { TransactionTable } from '../organisms/TransactionTable';
import { toast } from 'sonner';

// Pagina para el control detallado de ingresos y egresos
export const Transactions = () => {
  const { user, logout } = useAuth();
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleLogout = () => {
    logout();
    toast.success('Sesión cerrada correctamente');
  };

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

  // Incrementa la clave para que la tabla se recargue sin reload completo
  const handleSuccess = useCallback(() => {
    setRefreshKey(k => k + 1);
  }, []);

  return (
    <div className="min-h-screen bg-[#fcfcfd] flex font-sans">
      {/* Overlay movil */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden" onClick={toggleSidebar} />
      )}

      {/* Sidebar compartido con Dashboard */}
      <aside className={`fixed lg:sticky top-0 left-0 h-screen w-[280px] bg-white border-r border-slate-200 flex-shrink-0 flex flex-col z-50 transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="flex items-center gap-3 px-8 h-20 border-b border-slate-100">
           <div className="bg-blue-600 p-2 rounded-xl shadow-lg shadow-blue-200">
              <Wallet className="w-6 h-6 text-white" />
           </div>
           <span className="font-black text-2xl tracking-tighter text-slate-900">FinTrack</span>
        </div>
        
        <nav className="flex-1 py-10 px-4 space-y-2">
           <NavItem icon={<LayoutDashboard />} label="Dashboard" href="/" />
           <NavItem icon={<ReceiptText />} label="Transacciones" active />
           <NavItem icon={<PieChart />} label="Presupuestos" disabled />
           <NavItem icon={<BarChart3 />} label="Métricas" disabled />
        </nav>

      </aside>

      <main className="flex-1 flex flex-col min-w-0">
        {/* Header compartido con Dashboard */}
        <header className="h-20 flex items-center justify-between px-8 bg-white/80 backdrop-blur-md sticky top-0 border-b border-slate-100 z-30">
          <button onClick={toggleSidebar} className="lg:hidden p-2 text-slate-600 hover:bg-slate-50 rounded-xl">
            <Menu className="w-6 h-6" />
          </button>
          
          <div className="flex items-center gap-2 font-bold text-slate-800">
             <Receipt className="w-5 h-5 text-blue-600" />
             <span>Gestión de Transacciones</span>
          </div>

          <div className="flex items-center gap-6">
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

        <div className="p-8 lg:p-10 max-w-[1200px] w-full mx-auto animate-fade-in">
           <div className="mb-10">
              <h2 className="text-3xl font-black text-slate-900 tracking-tight">Control Panel</h2>
              <p className="text-slate-500 font-medium mt-1">Registra nuevos movimientos y consulta el historial histórico.</p>
           </div>

           <div className="space-y-12">
              <TransactionForm onSuccess={handleSuccess} />
              <TransactionTable refreshKey={refreshKey} />
           </div>
        </div>
      </main>
    </div>
  );
};

// Subcomponente de navegacion (con soporte de disabled para rutas no disponibles)
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