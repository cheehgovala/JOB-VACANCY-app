import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function SubscriptionGuard({ children }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!user.hasActiveSubscription) {
    return <Navigate to="/subscription" replace />;
  }

  return children ? children : <Outlet />;
}
