import { Navigate, Outlet, useLocation } from 'react-router';
import { useAppSelector } from '@/store/hooks';
import Spinner from '@/components/ui/Spinner';

const ProtectedRoute = () => {
  const { isAuthenticated, isInitialized, isLoading } = useAppSelector((state) => state.auth);
  const location = useLocation();

  if (!isInitialized || isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
