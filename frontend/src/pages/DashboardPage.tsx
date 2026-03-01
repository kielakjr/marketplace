import { useAppSelector } from '@/store/hooks';
import { useProducts } from '@/hooks/useProducts';
import { useOrders } from '@/hooks/useOrders';
import Card from '@/components/ui/Card';
import Spinner from '@/components/ui/Spinner';
import Button from '@/components/ui/Button';
import { Link } from 'react-router';

const DashboardPage = () => {
  const { user } = useAppSelector((state) => state.auth);
  const { data: products, isLoading: productsLoading } = useProducts();
  const { data: orders, isLoading: ordersLoading } = useOrders();

  const myProducts = products?.filter((p) => p.user_id === user?.id) ?? [];
  const isLoading = productsLoading || ordersLoading;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-brand-800">
        Witaj, {user?.username}!
      </h1>

      <div className="grid gap-4 sm:grid-cols-4">
        <Card>
          <p className="text-sm text-gray-500">Rola</p>
          <p className="mt-1 text-xl font-bold text-brand-800">{user?.role}</p>
        </Card>
        <Card>
          <p className="text-sm text-gray-500">Twoje produkty</p>
          {isLoading ? <Spinner size="sm" /> : (
            <p className="mt-1 text-xl font-bold text-brand-800">{myProducts.length}</p>
          )}
        </Card>
        <Card>
          <p className="text-sm text-gray-500">Zamówienia</p>
          {isLoading ? <Spinner size="sm" /> : (
            <p className="mt-1 text-xl font-bold text-brand-800">{orders?.length ?? 0}</p>
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
            <Button variant="secondary">Zarządzaj produktami</Button>
          </Link>
          <Link to="/dashboard/orders">
            <Button variant="secondary">Moje zamówienia</Button>
          </Link>
          <Link to="/products">
            <Button variant="secondary">Przeglądaj marketplace</Button>
          </Link>
        </div>
      </Card>
    </div>
  );
};

export default DashboardPage;
