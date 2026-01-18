import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import toast from 'react-hot-toast';

const AdminRoute = ({ children }) => {
  const { user, isAuthenticated } = useAuthStore();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  if (!user?.is_admin) {
    toast.error('Accès réservé aux administrateurs');
    return <Navigate to="/discover" />;
  }
  
  return children;
};

export default AdminRoute;