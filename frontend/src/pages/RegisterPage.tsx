import { useState, type FormEvent } from 'react';
import { Link, useNavigate } from 'react-router';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { register } from '@/store/slices/authSlice';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isLoading } = useAppSelector((state) => state.auth);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    const result = await dispatch(register({ username, email, password }));
    if (register.fulfilled.match(result)) {
      navigate('/', { replace: true });
    } else {
      setError('Rejestracja nie powiodła się. Spróbuj ponownie.');
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-brand-800">Zarejestruj się</h1>
      <p className="mt-2 text-sm text-gray-500">
        Masz już konto?{' '}
        <Link to="/login" className="font-medium text-brand-500 hover:text-brand-800">
          Zaloguj się
        </Link>
      </p>

      {error && (
        <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <Input
          id="username"
          label="Nazwa użytkownika"
          placeholder="jankowalski"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
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
          minLength={6}
        />
        <Button type="submit" className="w-full" isLoading={isLoading}>
          Zarejestruj
        </Button>
      </form>
    </div>
  );
};

export default RegisterPage;
