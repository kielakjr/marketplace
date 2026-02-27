import { Outlet, Navigate } from 'react-router';
import { useAppSelector } from '@/store/hooks';

const AuthLayout = () => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="w-full max-w-md rounded-2xl border border-brand-200 bg-white p-8 shadow-lg">
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
