import { useState, type FormEvent } from 'react';
import { Link, useNavigate, useLocation } from 'react-router';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { login } from '@/store/slices/authSlice';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { isLoading } = useAppSelector((state) => state.auth);

  const from = (location.state as { from?: { pathname: string } })?.from?.pathname || '/';

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    const result = await dispatch(login({ email, password }));
    if (login.fulfilled.match(result)) {
      navigate(from, { replace: true });
    } else {
      setError('Nieprawidłowy email lub hasło');
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-brand-800">Zaloguj się</h1>
      <p className="mt-2 text-sm text-gray-500">
        Nie masz konta?{' '}
        <Link to="/register" className="font-medium text-brand-500 hover:text-brand-800">
          Zarejestruj się
        </Link>
      </p>

      {error && (
        <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <Input
          id="email"
          label="Email"
          type="email"
          placeholder="jan@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          id="password"
          label="Hasło"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Button type="submit" className="w-full" isLoading={isLoading}>
          Zaloguj
        </Button>
      </form>
    </div>
  );
};

export default LoginPage;
