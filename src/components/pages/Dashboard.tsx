
import { useState } from 'react';
import { useAuth } from '../../store/AuthContext';
import { Wallet, TrendingUp, TrendingDown, LogOut, Menu, X } from 'lucide-react';
import { toast } from 'sonner';

export const Dashboard = () => {
  const { user, logout } = useAuth();
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success('Sesión cerrada correctamente');
  };

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:sticky top-0 left-0 h-screen w-[250px] bg-gray-800 text-white flex-shrink-0 flex-col z-50 transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} flex`}>
        <div className="flex items-center justify-between px-6 border-b border-gray-700 h-16">
          <div className="flex items-center gap-3">
             <Wallet className="w-6 h-6 text-blue-400" />
             <span className="font-bold text-lg tracking-tight">Fintrack</span>
          </div>
          <button onClick={toggleSidebar} className="lg:hidden text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>
        <nav className="flex-1 py-6 space-y-2">
           <a href="#" className="flex items-center gap-3 px-6 py-3 bg-gray-700 border-l-4 border-blue-500 text-gray-50 transition-all font-medium">Dashboard</a>
           <a href="/transactions" className="flex items-center gap-3 px-6 py-3 text-gray-400 hover:bg-gray-700 hover:text-gray-100 transition-all font-medium">Transacciones</a>
           <a href="#" className="flex items-center gap-3 px-6 py-3 text-gray-400 hover:bg-gray-700 hover:text-gray-100 transition-all font-medium">Presupuestos</a>
           <a href="#" className="flex items-center gap-3 px-6 py-3 text-gray-400 hover:bg-gray-700 hover:text-gray-100 transition-all font-medium">Reportes</a>
        </nav>
      </aside>

      <main className="flex-1 flex flex-col w-full min-w-0">
        {/* Header content */}
        <header className="h-16 flex items-center justify-between px-6 bg-white border-b border-gray-200">
          <div className="flex items-center gap-4 lg:hidden">
            <button onClick={toggleSidebar} className="p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-md">
              <Menu className="w-5 h-5" />
            </button>
            <div className="font-medium text-gray-800">Fintrack</div>
          </div>
          <h2 className="text-xl font-bold text-gray-800 hidden lg:block">Hola, {user?.name || 'Usuario'} 👋</h2>
          <div className="flex items-center gap-4">
             <span className="text-gray-600 text-sm font-medium">{user?.email}</span>
             <button onClick={handleLogout} className="p-2 text-gray-500 hover:bg-red-50 hover:text-red-600 rounded-md transition-all" title="Cerrar sesión">
                <LogOut className="w-5 h-5" />
             </button>
          </div>
        </header>

        {/* Content area */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white p-6 border border-gray-200 rounded-xl shadow-sm hover:-translate-y-[2px] hover:shadow-md transition-all cursor-default">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium uppercase tracking-wider">Balance Total</p>
                  <h3 className="text-3xl font-bold tracking-tight text-gray-800 mt-2">$3,089.20</h3>
                </div>
                <div className="bg-blue-100 p-3 rounded-full">
                   <Wallet className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 border border-gray-200 rounded-xl shadow-sm hover:-translate-y-[2px] hover:shadow-md transition-all cursor-default">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium uppercase tracking-wider">Ingresos (Mes)</p>
                  <h3 className="text-3xl font-bold tracking-tight text-[#10b981] mt-2">$5,240.00</h3>
                </div>
                <div className="bg-[#dcfce7] p-3 rounded-full">
                   <TrendingUp className="w-6 h-6 text-[#10b981]" />
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 border border-gray-200 rounded-xl shadow-sm hover:-translate-y-[2px] hover:shadow-md transition-all cursor-default">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium uppercase tracking-wider">Gastos (Mes)</p>
                  <h3 className="text-3xl font-bold tracking-tight text-[#ef4444] mt-2">$2,150.80</h3>
                </div>
                <div className="bg-[#fee2e2] p-3 rounded-full">
                   <TrendingDown className="w-6 h-6 text-[#ef4444]" />
                </div>
              </div>
            </div>
          </div>
          
          {/* Main content body below */}
          <div className="bg-white border-dashed border-2 border-gray-200 p-12 rounded-xl text-center">
             <p className="text-gray-500 font-medium">Contenido Central de Transacciones (Proximamente Fase 4)</p>
          </div>
        </div>
      </main>
    </div>
  );
};
