import { useState, type FormEvent } from 'react';
import { Link, useSearchParams } from 'react-router';
import { usersApi } from '@/api/usersApi';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import axios from 'axios';

type FieldErrors = {
  password?: string;
  general?: string;
};

const ResetPasswordPage = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<FieldErrors>({});
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!token) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-brand-800">Ustaw nowe hasło</h1>
        <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
          Brak tokenu resetowania hasła. Spróbuj ponownie wysłać link.
        </div>
        <p className="mt-4 text-sm text-gray-500">
          <Link to="/forgot-password" className="font-medium text-brand-500 hover:text-brand-800">
            Wyślij ponownie link do resetu
          </Link>
        </p>
      </div>
    );
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrors({});
    setSuccess('');

    if (password !== confirmPassword) {
      setErrors({ password: 'Hasła nie są identyczne' });
      return;
    }

    setIsLoading(true);

    try {
      const result = await usersApi.resetPassword({ token, password });
      setSuccess(result.message);
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.data?.error) {
        const payload = err.response.data.error;

        if (Array.isArray(payload)) {
          const fieldErrors: FieldErrors = {};
          for (const issue of payload) {
            const field = issue.path?.[0];
            if (field === 'password') fieldErrors.password = issue.message;
          }
          if (Object.keys(fieldErrors).length > 0) {
            setErrors(fieldErrors);
            setIsLoading(false);
            return;
          }
        }

        setErrors({
          general: typeof payload === 'string' ? payload : 'Wystąpił błąd. Spróbuj ponownie.',
        });
      } else {
        setErrors({ general: 'Wystąpił błąd. Spróbuj ponownie.' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-brand-800">Ustaw nowe hasło</h1>

      {errors.general && (
        <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
          {errors.general}
        </div>
      )}

      {success ? (
        <div className="mt-4">
          <div className="rounded-lg bg-green-50 p-3 text-sm text-green-600">
            {success}
          </div>
          <p className="mt-4 text-sm text-gray-500">
            <Link to="/login" className="font-medium text-brand-500 hover:text-brand-800">
              Przejdź do logowania
            </Link>
          </p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <Input
            id="password"
            label="Nowe hasło"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password}
            required
          />
          <Input
            id="confirmPassword"
            label="Potwierdź hasło"
            type="password"
            placeholder="••••••••"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <Button type="submit" className="w-full" isLoading={isLoading}>
            Zmień hasło
          </Button>
        </form>
      )}
    </div>
  );
};

export default ResetPasswordPage;
