import { Link } from 'react-router';
import { useOrders } from '@/hooks/useOrders';
import { formatPrice } from '@/utils/formatPrice';
import { orderStatusLabels, orderStatusVariant } from '@/utils/orderStatus';
import Spinner from '@/components/ui/Spinner';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';

const OrdersPage = () => {
  const { data: orders, isLoading, isError } = useOrders();

  if (isLoading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>;
  if (isError) return <div className="text-center text-red-600">Nie udało się załadować zamówień.</div>;

  if (!orders || orders.length === 0) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-brand-800">Moje zamówienia</h1>
        <Card className="py-12 text-center">
          <svg className="mx-auto h-16 w-16 text-brand-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <p className="mt-4 text-gray-500">Nie masz jeszcze żadnych zamówień.</p>
          <Link to="/products" className="mt-4 inline-block text-sm font-medium text-brand-500 hover:text-brand-800">
            Przeglądaj produkty →
          </Link>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-brand-800">Moje zamówienia</h1>
        <p className="mt-1 text-sm text-gray-600">Śledź statusy i podsumowania swoich zakupów.</p>
      </div>

      <div className="space-y-4">
        {orders.map((order) => (
          <Link key={order.id} to={`/dashboard/orders/${order.id}`}>
            <Card className="flex flex-col gap-4 transition-all hover:shadow-md hover:border-brand-400 sm:flex-row sm:items-center">
              <div className="flex-1">
                <p className="text-xs text-gray-500">
                  {new Date(order.createdAt).toLocaleDateString('pl-PL', {
                    day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit',
                  })}
                </p>
                <p className="mt-1 text-sm text-gray-600">
                  {order.products.length} {order.products.length === 1 ? 'produkt' : 'produktów'}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <Badge variant={orderStatusVariant[order.status]}>
                  {orderStatusLabels[order.status]}
                </Badge>
                <span className="text-lg font-bold text-brand-800">
                  {formatPrice(parseFloat(order.total_amount.toString()))}
                </span>
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default OrdersPage;
