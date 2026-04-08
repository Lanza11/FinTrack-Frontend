import { useState } from 'react';
import { Wallet, Menu, X, Receipt } from 'lucide-react';
import { TransactionForm } from '../organisms/TransactionForm';
import { TransactionTable } from '../organisms/TransactionTable';

export const Transactions = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

  const handleSuccess = () => {
    // Logica de refresh local cuando estemos recibiendo DB.
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar (Atomo/Molécula extraible) */}
      <aside className={`fixed lg:sticky top-0 left-0 h-screen w-[250px] bg-gray-800 text-white flex-shrink-0 flex-col z-50 transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'} flex`}>
        <div className="flex items-center justify-between px-6 border-b border-gray-700 h-16 w-full">
          <div className="flex items-center gap-3">
             <Wallet className="w-6 h-6 text-blue-400" />
             <span className="font-bold text-lg tracking-tight">Fintrack</span>
          </div>
          <button onClick={toggleSidebar} className="lg:hidden text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>
        <nav className="flex-1 py-6 space-y-2 w-full">
           <a href="/" className="flex items-center gap-3 px-6 py-3 text-gray-400 hover:bg-gray-700 hover:text-gray-100 transition-all font-medium">Dashboard</a>
           <a href="/transactions" className="flex items-center gap-3 px-6 py-3 bg-gray-700 border-l-4 border-blue-500 text-gray-50 transition-all font-medium">Transacciones</a>
           <a href="#" className="flex items-center gap-3 px-6 py-3 text-gray-400 hover:bg-gray-700 hover:text-gray-100 transition-all font-medium">Presupuestos</a>
           <a href="#" className="flex items-center gap-3 px-6 py-3 text-gray-400 hover:bg-gray-700 hover:text-gray-100 transition-all font-medium">Reportes</a>
        </nav>
      </aside>

      <main className="flex-1 flex flex-col w-full min-w-0">
        <header className="h-16 flex items-center justify-between px-6 bg-white border-b border-gray-200">
          <div className="flex items-center gap-4 lg:hidden">
            <button onClick={toggleSidebar} className="p-2 -ml-2 text-gray-600 hover:bg-gray-100 rounded-md">
              <Menu className="w-5 h-5" />
            </button>
            <div className="font-medium text-gray-800 flex items-center gap-2">
               <Receipt className="w-4 h-4 text-blue-600" />
               Transacciones
            </div>
          </div>
          <h2 className="text-xl font-bold text-gray-800 hidden lg:flex items-center gap-2">
            <Receipt className="w-6 h-6 text-blue-600" /> 
            Control de Transacciones
          </h2>
        </header>

        <div className="p-4 lg:p-6 pb-20">
          <div className="max-w-[1200px] mx-auto w-full">
             <TransactionForm onSuccess={handleSuccess} />
             <TransactionTable />
          </div>
        </div>
      </main>
    </div>
  );
};