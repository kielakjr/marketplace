import { useState, type FormEvent } from 'react';
import { Link } from 'react-router';
import { useAppSelector } from '@/store/hooks';
import { useAuth } from '@/hooks/useAuth';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

type FieldErrors = {
  username?: string;
  email?: string;
  password?: string;
  general?: string;
};

const RegisterPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<FieldErrors>({});

  const { register } = useAuth();
  const { isLoading } = useAppSelector((state) => state.auth);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = await register({ username, email, password });

    if ('error' in result) {
      const payload = (result as any).payload;

      if (payload?.error && Array.isArray(payload.error)) {
        const fieldErrors: FieldErrors = {};
        for (const issue of payload.error) {
          const field = issue.path?.[0] as keyof FieldErrors;
          if (field) fieldErrors[field] = issue.message;
        }
        setErrors(fieldErrors);
        return;
      }

      setErrors({ general: 'Rejestracja nie powiodła się. Spróbuj ponownie.' });
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

      {errors.general && (
        <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
          {errors.general}
        </div>
      )}

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <Input
          id="username"
          label="Nazwa użytkownika"
          placeholder="jankowalski"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          error={errors.username}
          required
        />
        <Input
          id="email"
          label="Email"
          type="email"
          placeholder="jan@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
          required
        />
        <Input
          id="password"
          label="Hasło"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
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
