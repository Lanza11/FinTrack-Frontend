export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: `${API_BASE_URL}/auth/login`,
    REGISTER: `${API_BASE_URL}/auth/register`,
  },
  TRANSACTIONS: {
    INGRESO: `${API_BASE_URL}/transacciones/SaveIngreso`,
    EGRESO: `${API_BASE_URL}/transacciones/egreso`,
  },
  CONSULTAS: {
    HISTORIAL: `${API_BASE_URL}/consultas/historial`,
    ULTIMOS: `${API_BASE_URL}/consultas/ultimos`,
    POR_CATEGORIA: `${API_BASE_URL}/consultas/por-categoria`,
  },
  BUDGETS: `${API_BASE_URL}/budgets`,
  REPORTS: `${API_BASE_URL}/reports`,
  BALANCE: `${API_BASE_URL}/balance`,
};