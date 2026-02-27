import { useAppSelector } from '@/store/hooks';
import { useProducts } from '@/hooks/useProducts';
import Card from '@/components/ui/Card';
import Spinner from '@/components/ui/Spinner';
import { Link } from 'react-router';
import Button from '@/components/ui/Button';

const DashboardPage = () => {
  const { user } = useAppSelector((state) => state.auth);
  const { data: products, isLoading } = useProducts();

  const myProducts = products?.filter((p) => p.user_id === user?.id) ?? [];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-brand-800">
        Witaj, {user?.username}!
      </h1>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <p className="text-sm text-gray-500">Rola</p>
          <p className="mt-1 text-xl font-bold text-brand-800">{user?.role}</p>
        </Card>
        <Card>
          <p className="text-sm text-gray-500">Twoje produkty</p>
          {isLoading ? (
            <Spinner size="sm" />
          ) : (
            <p className="mt-1 text-xl font-bold text-brand-800">{myProducts.length}</p>
          )}
        </Card>
        <Card>
          <p className="text-sm text-gray-500">Konto od</p>
          <p className="mt-1 text-xl font-bold text-brand-800">
            {user?.createdAt
              ? new Date(user.createdAt).toLocaleDateString('pl-PL')
              : '—'}
          </p>
        </Card>
      </div>

      <Card>
        <h2 className="text-lg font-semibold text-brand-800">Szybkie akcje</h2>
        <div className="mt-4 flex flex-wrap gap-3">
          <Link to="/dashboard/my-products">
            <Button variant="secondary">
              <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              Zarządzaj produktami
            </Button>
          </Link>
          <Link to="/products">
            <Button variant="secondary">
              <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Przeglądaj marketplace
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default DashboardPage;
