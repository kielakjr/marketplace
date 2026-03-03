import { Link } from 'react-router';
import { useAppSelector } from '@/store/hooks';
import { useUserProducts } from '@/hooks/useProducts';
import { useOrders } from '@/hooks/useOrders';
import { formatPrice } from '@/utils/formatPrice';
import { orderStatusLabels, orderStatusVariant } from '@/utils/orderStatus';
import Card from '@/components/ui/Card';
import Spinner from '@/components/ui/Spinner';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';

const DashboardPage = () => {
  const { user } = useAppSelector((state) => state.auth);
  const { data: products, isLoading: productsLoading } = useUserProducts(user!.id);
  const { data: orders, isLoading: ordersLoading } = useOrders();

  const isLoading = productsLoading || ordersLoading;
  const latestOrders = orders?.slice(0, 3) ?? [];

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-brand-100 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-bold text-brand-800">Witaj, {user?.username}!</h1>
        <p className="mt-2 text-sm text-gray-600">
          Oto szybki przegląd Twojej aktywności oraz najważniejszych akcji.
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-1 md:grid-cols-3">
          <Card>
            <p className="text-sm text-gray-500">Twoje produkty</p>
            {isLoading ? <Spinner size="sm" /> : <p className="mt-2 text-2xl font-bold text-brand-800">{products?.length ?? 0}</p>}
          </Card>
          <Card>
            <p className="text-sm text-gray-500">Zamówienia</p>
            {isLoading ? <Spinner size="sm" /> : <p className="mt-2 text-2xl font-bold text-brand-800">{orders?.length ?? 0}</p>}
          </Card>
          <Card>
            <p className="text-sm text-gray-500">Konto od</p>
            <p className="mt-2 text-2xl font-bold text-brand-800">
              {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('pl-PL') : '—'}
            </p>
          </Card>
        </div>

        <div className="mt-6 flex flex-wrap gap-3">
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
      </div>

      <Card className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-brand-800">Ostatnie zamówienia</h2>
          <Link to="/dashboard/orders" className="text-sm font-medium text-brand-500 hover:text-brand-800">
            Zobacz wszystkie →
          </Link>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-8"><Spinner size="lg" /></div>
        ) : latestOrders.length === 0 ? (
          <div className="rounded-2xl border border-brand-100 bg-cream-50 p-6 text-sm text-gray-600">
            Brak zamówień do wyświetlenia.
          </div>
        ) : (
          <div className="space-y-3">
            {latestOrders.map((order) => (
              <div key={order.id} className="flex flex-col gap-3 rounded-2xl border border-brand-100 bg-white p-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs text-gray-500">
                    {new Date(order.createdAt).toLocaleDateString('pl-PL', {
                      day: 'numeric', month: 'long', year: 'numeric',
                    })}
                  </p>
                  <p className="mt-1 text-sm text-gray-600">
                    {order.products.length} {order.products.length === 1 ? 'produkt' : 'produktów'}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={orderStatusVariant[order.status]}>
                    {orderStatusLabels[order.status]}
                  </Badge>
                  <span className="text-sm font-semibold text-brand-800">
                    {formatPrice(parseFloat(order.total_amount.toString()))}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>
    </div>
  );
};

export default DashboardPage;
