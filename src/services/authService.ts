import { API_ENDPOINTS } from '../config/apiConfig';

/**
 * Interfaces para el manejo de credenciales y respuesta de autenticacion
 */
export interface LoginCredentials {
  email: string;
  password?: string;
}

export interface RegisterData {
  email: string;
  password?: string;
}

// Interfaz que mapea exactamente lo que devuelve el microservicio de Autenticación
export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  userId: number;
  roles: string[];
}

/**
 * Servicio encargado de la comunicacion con el microservicio de autenticacion
 */
export const authService = {
  // Envia credenciales para inicio de sesion y retorna tokens
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await fetch(API_ENDPOINTS.AUTH.LOGIN, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) throw new Error('Error en la autenticación');
    return response.json();
  },

  // Registra un nuevo usuario en el sistema
  register: async (data: RegisterData): Promise<any> => {
    const response = await fetch(API_ENDPOINTS.AUTH.REGISTER, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (!response.ok) throw new Error('Error al registrar usuario');
    return response.json();
  },
};
