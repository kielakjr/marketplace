import { Link } from 'react-router';
import { useAdminOrders } from '@/hooks/useOrders';
import { formatPrice } from '@/utils/formatPrice';
import { orderStatusLabels, orderStatusVariant } from '@/utils/orderStatus';
import Spinner from '@/components/ui/Spinner';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';

const AdminOrders = () => {
  const { data: orders, isLoading, error } = useAdminOrders();

  if (isLoading) {
    return <div className="flex justify-center py-20"><Spinner size="lg" /></div>;
  }

  if (error) {
    return <div className="text-center text-red-600">Wystąpił błąd podczas ładowania zamówień.</div>;
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-brand-800">Zamówienia</h1>
        <Card className="py-12 text-center">
          <p className="text-gray-500">Brak zamówień do wyświetlenia.</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-brand-800">Zamówienia</h1>
        <p className="mt-1 text-sm text-gray-600">Monitoruj realizację i statusy zamówień.</p>
      </div>

      <div className="space-y-4">
        {orders.map((order) => (
          <Card key={order.id} className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs text-gray-500">
                {new Date(order.createdAt).toLocaleDateString('pl-PL', {
                  day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit',
                })}
              </p>
              <p className="mt-1 text-sm text-gray-600">
                {order.products.length} {order.products.length === 1 ? 'produkt' : 'produktów'}
              </p>
              {order.buyer && (
                <p className="mt-0.5 text-xs text-gray-400">
                  Kupujący: <span className="font-medium text-brand-700">{order.buyer.username}</span>
                  {order.seller && (
                    <> · Sprzedający: <span className="font-medium text-brand-700">{order.seller.username}</span></>
                  )}
                </p>
              )}
            </div>
            <div className="flex items-center gap-4">
              <Badge variant={orderStatusVariant[order.status]}>
                {orderStatusLabels[order.status]}
              </Badge>
              <span className="text-lg font-bold text-brand-800">
                {formatPrice(parseFloat(order.total_amount.toString()))}
              </span>
              <Link
                to={`/admin/orders/${order.id}`}
                className="text-sm font-medium text-brand-500 hover:text-brand-800"
              >
                Szczegóły →
              </Link>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AdminOrders;
