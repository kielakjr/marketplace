import { Link } from 'react-router';
import Button from '@/components/ui/Button';

const NotFoundPage = () => {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center text-center">
      <h1 className="text-7xl font-bold text-brand-400">404</h1>
      <h2 className="mt-4 text-2xl font-bold text-brand-800">Strona nie znaleziona</h2>
      <p className="mt-2 text-gray-500">
        Strona, której szukasz, nie istnieje lub została przeniesiona.
      </p>
      <Link to="/" className="mt-6">
        <Button>Wróć na stronę główną</Button>
      </Link>
    </div>
  );
};

export default NotFoundPage;
