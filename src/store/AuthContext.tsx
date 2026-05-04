import { createContext, useContext, useState, useEffect } from 'react';

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
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // Recupera la sesion persistida al cargar la aplicacion
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('fintrack_user');
      const storedToken = localStorage.getItem('fintrack_token');
      
      // Verificacion robusta para evitar "pantalla blanca" por datos corruptos
      if (storedUser && storedToken && storedUser !== "undefined" && storedToken !== "undefined") {
        setUser(JSON.parse(storedUser));
        setToken(storedToken);
      } else if (storedUser || storedToken) {
        // Si hay datos parciales o corruptos, limpiamos para evitar bugs
        logout();
      }
    } catch (e) {
      console.error("Error cargando sesion persistida:", e);
      logout(); // Limpiar en caso de error de parseo
    }
  }, []);

  // Almacena datos de usuario y token en estado y almacenamiento local
  const login = (userData: User, tokenData: string) => {
    setUser(userData);
    setToken(tokenData);
    localStorage.setItem('fintrack_user', JSON.stringify(userData));
    localStorage.setItem('fintrack_token', tokenData);
  };

  // Limpia el estado y el almacenamiento local al cerrar sesion
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('fintrack_user');
    localStorage.removeItem('fintrack_token');
  };

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
