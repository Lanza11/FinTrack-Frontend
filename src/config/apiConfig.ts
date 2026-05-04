// Configuracion de URLs base extraidas de variables de entorno para facilitar el despliegue
const API_AUTH_BASE = import.meta.env.VITE_API_AUTH_URL || 'http://localhost:8081/api';
const API_MAIN_BASE = import.meta.env.VITE_API_MAIN_URL || 'http://localhost:8080/api';

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: `${API_AUTH_BASE}/auth/login`,
    REGISTER: `${API_AUTH_BASE}/auth/register`,
  },
  TRANSACTIONS: {
    INGRESO: `${API_MAIN_BASE}/transacciones/SaveIngreso`,
    EGRESO: `${API_MAIN_BASE}/transacciones/egreso`,
  },
  CONSULTAS: {
    HISTORIAL: `${API_MAIN_BASE}/consultas/historial`,
    ULTIMOS: `${API_MAIN_BASE}/consultas/ultimos`,
    POR_CATEGORIA: `${API_MAIN_BASE}/consultas/por-categoria`,
  },
  BUDGETS: `${API_MAIN_BASE}/budgets`,
  REPORTS: `${API_MAIN_BASE}/reports`,
  BALANCE: `${API_MAIN_BASE}/consultas/balance`,
};