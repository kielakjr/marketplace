import { useState, type FormEvent } from 'react';
import { Link } from 'react-router';
import { usersApi } from '@/api/usersApi';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import axios from 'axios';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      const result = await usersApi.forgotPassword({ email });
      setSuccess(result.message);
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.data?.error) {
        setError(typeof err.response.data.error === 'string'
          ? err.response.data.error
          : 'Wystąpił błąd. Spróbuj ponownie.');
      } else {
        setError('Wystąpił błąd. Spróbuj ponownie.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-brand-800">Resetowanie hasła</h1>
      <p className="mt-2 text-sm text-gray-500">
        Wróć do{' '}
        <Link to="/login" className="font-medium text-brand-500 hover:text-brand-800">
          logowania
        </Link>
      </p>

      {error && (
        <div className="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-600">
          {error}
        </div>
      )}

      {success ? (
        <div className="mt-4 rounded-lg bg-green-50 p-3 text-sm text-green-600">
          {success}
        </div>
      ) : (
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
          <Button type="submit" className="w-full" isLoading={isLoading}>
            Wyślij link do resetu
          </Button>
        </form>
      )}
    </div>
  );
};

export default ForgotPasswordPage;
