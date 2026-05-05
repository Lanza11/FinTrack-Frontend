import { createContext, useContext, useState, useCallback } from 'react';

type User = {
  id: string | number;
  name?: string;
  email: string;
};

type AuthContextType = {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (userData: User, token: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Proveedor de autenticacion que gestiona el estado global del usuario y el token JWT
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Inicialización perezosa para evitar renders en cascada y cumplir con reglas estrictas de Lint
  const [user, setUser] = useState<User | null>(() => {
    const u = localStorage.getItem('fintrack_user');
    const t = localStorage.getItem('fintrack_token');
    if (u && t && u !== "undefined" && t !== "undefined") {
      try { return JSON.parse(u); } catch { return null; }
    }
    return null;
  });

  const [token, setToken] = useState<string | null>(() => {
    const u = localStorage.getItem('fintrack_user');
    const t = localStorage.getItem('fintrack_token');
    if (u && t && u !== "undefined" && t !== "undefined") {
      return t;
    }
    // Limpieza preventiva si los datos están incompletos
    if (u || t) {
      localStorage.removeItem('fintrack_user');
      localStorage.removeItem('fintrack_token');
    }
    return null;
  });

  // Limpia el estado y el almacenamiento local al cerrar sesion
  const logout = useCallback(() => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('fintrack_user');
    localStorage.removeItem('fintrack_token');
  }, []);

  // Almacena datos de usuario y token en estado y almacenamiento local
  const login = useCallback((userData: User, tokenData: string) => {
    setUser(userData);
    setToken(tokenData);
    localStorage.setItem('fintrack_user', JSON.stringify(userData));
    localStorage.setItem('fintrack_token', tokenData);
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
