
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../store/AuthContext';

export const PrivateRoute: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const user = localStorage.getItem('fintrack_user');

  if (!isAuthenticated && !user) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};
