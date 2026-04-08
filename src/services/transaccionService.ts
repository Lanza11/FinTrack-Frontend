import { API_ENDPOINTS } from '../config/apiConfig';

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

export const transaccionService = {
  registrarIngreso: async (data: IngresoDTO) => {
    const response = await fetch(API_ENDPOINTS.TRANSACTIONS.INGRESO, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Error al registrar ingreso');
    return response.json();
  },

  registrarEgreso: async (data: EgresoDTO) => {
    const response = await fetch(API_ENDPOINTS.TRANSACTIONS.EGRESO, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Error al registrar egreso');
    try {
      return await response.json();
    } catch {
      return true;
    }
  },

  obtenerHistorial: async (): Promise<MovimientoDTO[]> => {
    const response = await fetch(API_ENDPOINTS.CONSULTAS.HISTORIAL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    if (!response.ok) throw new Error('Error al obtener el historial');
    return response.json();
  }
};
