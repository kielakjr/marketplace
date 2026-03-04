import { useNavigate } from 'react-router';
import { useQueryClient } from '@tanstack/react-query';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { login, register, logoutThunk } from '@/store/slices/authSlice';
import type { LoginPayload, RegisterPayload } from '@/types/user';

export function useAuth() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { user, isAuthenticated, isLoading, isInitialized } = useAppSelector(
    (state) => state.auth
  );

  const handleLogin = async (credentials: LoginPayload, redirectTo: string = '/') => {
    const result = await dispatch(login(credentials));
    if (login.fulfilled.match(result)) {
      queryClient.clear();
      navigate(redirectTo, { replace: true });
    }
    return result;
  };

  const handleRegister = async (payload: RegisterPayload, redirectTo: string = '/') => {
    const result = await dispatch(register(payload));
    if (register.fulfilled.match(result)) {
      queryClient.clear();
      navigate(redirectTo, { replace: true });
    }
    return result;
  };

  const handleLogout = async () => {
    await dispatch(logoutThunk());
    queryClient.clear();
    navigate('/');
  };

  return {
    user,
    isAuthenticated,
    isLoading,
    isInitialized,
    login: handleLogin,
    register: handleRegister,
    logout: handleLogout,
  };
}
