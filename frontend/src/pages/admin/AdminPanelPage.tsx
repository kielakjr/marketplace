import { Link } from 'react-router';
import { useProducts } from '@/hooks/useProducts';
import { useCategories } from '@/hooks/useCategories';
import { useUsers } from '@/hooks/useUsers';
import { useAdminOrders } from '@/hooks/useOrders';
import { useAdminStats } from '@/hooks/useAdmin';
import { formatPrice } from '@/utils/formatPrice';
import { orderStatusLabels, orderStatusVariant } from '@/utils/orderStatus';
import Card from '@/components/ui/Card';
import Spinner from '@/components/ui/Spinner';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';

const AdminPanelPage = () => {
  const { data: usersData, isLoading: usersLoading } = useUsers({ page: 1, limit: 4, sortBy: 'createdAt', sortOrder: 'desc' });
  const { data: orders, isLoading: ordersLoading, error } = useAdminOrders();
  const { data: stats, isLoading: statsLoading } = useAdminStats();

  const isLoading = usersLoading || ordersLoading;

  const latestUsers = usersData?.data ?? [];
  const latestOrders = orders?.slice(0, 4) ?? [];

  return (
    <div className="space-y-6">
      <div className="rounded-3xl border border-brand-100 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-brand-800">Podsumowanie</h2>
        <p className="mt-1 text-sm text-gray-600">
          Bieżący przegląd kluczowych danych marketplace.
        </p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Card className="flex flex-col gap-2">
            <p className="text-xs uppercase tracking-wide text-brand-500">Produkty</p>
            {statsLoading ? <Spinner size="sm" /> : <p className="text-2xl font-bold text-brand-800">{stats?.totalProducts ?? 0}</p>}
            <p className="text-xs text-gray-500">Łącznie w systemie</p>
          </Card>
          <Card className="flex flex-col gap-2">
            <p className="text-xs uppercase tracking-wide text-brand-500">Kategorie</p>
            {statsLoading ? <Spinner size="sm" /> : <p className="text-2xl font-bold text-brand-800">{stats?.totalCategories ?? 0}</p>}
            <p className="text-xs text-gray-500">Zdefiniowane sekcje</p>
          </Card>
          <Card className="flex flex-col gap-2">
            <p className="text-xs uppercase tracking-wide text-brand-500">Użytkownicy</p>
            {statsLoading ? <Spinner size="sm" /> : <p className="text-2xl font-bold text-brand-800">{stats?.totalUsers ?? 0}</p>}
            <p className="text-xs text-gray-500">Zarejestrowane konta</p>
          </Card>
          <Card className="flex flex-col gap-2">
            <p className="text-xs uppercase tracking-wide text-brand-500">Zamówienia</p>
            {statsLoading ? <Spinner size="sm" /> : <p className="text-2xl font-bold text-brand-800">{stats?.totalOrders ?? 0}</p>}
            <p className="text-xs text-gray-500">Łącznie w systemie</p>
          </Card>
        </div>

        {stats && stats.totalBanned > 0 && (
          <div className="mt-3 rounded-xl border border-orange-200 bg-orange-50 px-4 py-2 text-sm text-orange-700">
            Zbanowanych kont: <strong>{stats.totalBanned}</strong>
          </div>
        )}
      </div>

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-600">
          Wystąpił problem z pobraniem zamówień administratora.
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
        <Card className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-brand-800">Ostatnie zamówienia</h3>
            <Link to="/admin/orders" className="text-sm font-medium text-brand-500 hover:text-brand-800">
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

        <Card className="space-y-4">
          <h3 className="text-lg font-semibold text-brand-800">Najnowsi użytkownicy</h3>
          {isLoading ? (
            <div className="flex justify-center py-8"><Spinner size="lg" /></div>
          ) : (
            <div className="space-y-3">
              {latestUsers.map((user) => (
                <div key={user.id} className="flex items-center justify-between rounded-2xl border border-brand-100 bg-white px-4 py-3">
                  <div>
                    <p className="text-sm font-semibold text-brand-800">{user.username}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                  <Badge variant={user.role === 'ADMIN' ? 'success' : 'danger'}>{user.role}</Badge>
                </div>
              ))}
              {latestUsers.length === 0 && (
                <div className="rounded-2xl border border-brand-100 bg-cream-50 p-6 text-sm text-gray-600">
                  Brak użytkowników do wyświetlenia.
                </div>
              )}
            </div>
          )}

          <div className="pt-2">
            <Link to="/admin/users">
              <Button variant="secondary" className="w-full">Zarządzaj użytkownikami</Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default AdminPanelPage;
