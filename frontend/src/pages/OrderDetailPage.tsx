import { useParams, Link } from 'react-router';
import { useOrder, useCancelOrder, usePayOrder } from '@/hooks/useOrders';
import { formatPrice } from '@/utils/formatPrice';
import { orderStatusLabels, orderStatusVariant, paymentStatusLabels, deliveryStatusLabels } from '@/utils/orderStatus';
import Spinner from '@/components/ui/Spinner';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';

const OrderDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { data: order, isLoading, isError } = useOrder(id!);
  const cancelOrder = useCancelOrder();
  const payOrder = usePayOrder();

  if (isLoading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>;
  if (isError || !order) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-8 text-center">
        <p className="text-red-600">Nie znaleziono zamówienia.</p>
        <Link to="/dashboard/orders" className="mt-4 inline-block text-sm font-medium text-brand-500">← Wróć</Link>
      </div>
    );
  }

  const canCancel = order.status === 'PENDING' || order.status === 'PROCESSING';
  const canPay = order.payment?.status === 'PENDING' && order.status !== 'CANCELLED';

  return (
    <div className="space-y-6">
      <Link to="/dashboard/orders" className="inline-flex items-center text-sm font-medium text-brand-500 hover:text-brand-800">
        ← Wróć do zamówień
      </Link>

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-brand-800">Zamówienie</h1>
          <p className="mt-1 text-xs text-gray-500 font-mono">{order.id}</p>
        </div>
        <Badge variant={orderStatusVariant[order.status]}>
          {orderStatusLabels[order.status]}
        </Badge>
      </div>

      <Card>
        <h2 className="text-lg font-semibold text-brand-800">Produkty</h2>
        <div className="mt-4 divide-y divide-brand-100">
          {order.products.map((product) => (
            <div key={product.id} className="flex items-center gap-4 py-3">
              <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg bg-cream-50">
                {product.image_url ? (
                  <img src={product.image_url} alt={product.name} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-brand-300 text-xs">—</div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-gray-900 truncate">{product.name}</p>
                <p className="text-xs text-gray-500">
                  {product.OrderItem.quantity} × {formatPrice(parseFloat(product.OrderItem.price_per_unit.toString()))}
                </p>
              </div>
              <p className="font-semibold text-gray-900">
                {formatPrice(product.OrderItem.quantity * parseFloat(product.OrderItem.price_per_unit.toString()))}
              </p>
            </div>
          ))}
        </div>
        <div className="mt-4 flex justify-between border-t border-brand-200 pt-4 text-lg font-bold text-brand-800">
          <span>Razem</span>
          <span>{formatPrice(parseFloat(order.total_amount.toString()))}</span>
        </div>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        {order.payment && (
          <Card>
            <h2 className="text-lg font-semibold text-brand-800">Płatność</h2>
            <div className="mt-3 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Status</span>
                <Badge variant={order.payment.status === 'PAID' ? 'success' : order.payment.status === 'REFUNDED' ? 'warning' : 'default'}>
                  {paymentStatusLabels[order.payment.status]}
                </Badge>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Kwota</span>
                <span className="font-medium">{formatPrice(parseFloat(order.payment.amount.toString()))}</span>
              </div>
            </div>
            {canPay && (
              <Button
                className="mt-4 w-full"
                onClick={() => payOrder.mutate(order.id)}
                isLoading={payOrder.isPending}
              >
                Zapłać teraz
              </Button>
            )}
          </Card>
        )}

        {order.delivery && (
          <Card>
            <h2 className="text-lg font-semibold text-brand-800">Dostawa</h2>
            <div className="mt-3 space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Status</span>
                <Badge variant={order.delivery.status === 'DELIVERED' ? 'success' : 'info'}>
                  {deliveryStatusLabels[order.delivery.status]}
                </Badge>
              </div>
              {order.delivery.tracking_number && (
                <div className="flex justify-between">
                  <span className="text-gray-500">Numer śledzenia</span>
                  <span className="font-mono text-xs">{order.delivery.tracking_number}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-500">Adres</span>
                <span className="text-right max-w-50">{order.delivery.address_details}</span>
              </div>
            </div>
          </Card>
        )}
      </div>

      {canCancel && (
        <div className="flex justify-end">
          <Button
            variant="danger"
            onClick={() => {
              if (window.confirm('Czy na pewno chcesz anulować zamówienie?')) {
                cancelOrder.mutate(order.id);
              }
            }}
            isLoading={cancelOrder.isPending}
          >
            Anuluj zamówienie
          </Button>
        </div>
      )}

      <p className="text-xs text-gray-400 text-right">
        Utworzono: {new Date(order.createdAt).toLocaleString('pl-PL')}
      </p>
    </div>
  );
};

export default OrderDetailPage;
