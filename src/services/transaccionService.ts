import { API_ENDPOINTS } from '../config/apiConfig';

/**
 * DTOs para el intercambio de datos con el microservicio de transacciones
 */
export interface IngresoDTO {
  monto: number;
  fecha: string;
  porcentajes: Record<number, number>;
}

export interface EgresoDTO {
  monto: number;
  fecha: string;
  codigoCategoria: number;
  descripcion: string;
}

export interface MovimientoDTO {
  id: number;
  tipo: string;
  monto: number;
  fecha: string;
  categoria: string;
  descripcion: string;
}

/**
 * Obtiene el token de almacenamiento local para incluirlo en las peticiones
 */
const getAuthHeaders = () => {
  const token = localStorage.getItem('fintrack_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
  };
};

/**
 * Servicio central para la gestion de transacciones y consultas financieras
 */
export const transaccionService = {
  // Registra un nuevo ingreso con su distribucion porcentual
  registrarIngreso: async (data: IngresoDTO) => {
    const response = await fetch(API_ENDPOINTS.TRANSACTIONS.INGRESO, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Error al registrar ingreso');
    return response.json();
  },

  // Registra un egreso asociado a una categoria especifica
  registrarEgreso: async (data: EgresoDTO) => {
    const response = await fetch(API_ENDPOINTS.TRANSACTIONS.EGRESO, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Error al registrar egreso');
    try {
      return await response.json();
    } catch {
      return true;
    }
  },

  // Recupera la lista completa de movimientos del usuario
  obtenerHistorial: async (): Promise<MovimientoDTO[]> => {
    const response = await fetch(API_ENDPOINTS.CONSULTAS.HISTORIAL, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Error al obtener el historial');
    return response.json();
  },

  // Recupera el resumen financiero (balance, ingresos y gastos totales)
  obtenerResumen: async () => {
    const response = await fetch(API_ENDPOINTS.BALANCE, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error('Error al obtener el resumen');
    return response.json();
  }
};
