import { useParams, Link } from 'react-router';
import { useSale } from '@/hooks/useOrders';
import { formatPrice } from '@/utils/formatPrice';
import { orderStatusLabels, orderStatusVariant, paymentStatusLabels, deliveryStatusLabels } from '@/utils/orderStatus';
import Spinner from '@/components/ui/Spinner';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';

const SaleDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { data: order, isLoading, isError } = useSale(id!);

  if (isLoading)
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spinner size="lg" />
      </div>
    );

  if (isError || !order) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 rounded-2xl border border-red-100 bg-red-50 p-12 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
          <svg className="h-7 w-7 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
        </div>
        <div>
          <p className="text-base font-semibold text-red-700">Nie znaleziono sprzedaży</p>
          <p className="mt-1 text-sm text-red-500">Sprzedaż mogła zostać usunięta lub link jest nieprawidłowy.</p>
        </div>
        <Link
          to="/dashboard/sales"
          className="mt-2 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-medium text-brand-700 shadow-sm ring-1 ring-brand-200 transition hover:bg-brand-50"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Wróć do sprzedaży
        </Link>
      </div>
    );
  }

  const canShip = order.payment?.status === 'PAID' && order.delivery?.status === 'PREPARING';
  const isPaid = order.payment?.status === 'PAID';

  const createdAt = new Date(order.createdAt).toLocaleString('pl-PL', {
    day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit',
  });
  const updatedAt = new Date(order.updatedAt).toLocaleString('pl-PL', {
    day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit',
  });

  return (
    <div className="space-y-8">
      <nav className="flex items-center gap-2 text-sm">
        <Link to="/dashboard/sales" className="font-medium text-brand-500 transition hover:text-brand-800">
          Sprzedaż
        </Link>
        <span className="text-brand-300">/</span>
        <span className="font-mono text-xs text-brand-800">{order.id}</span>
      </nav>

      {!isPaid && order.status !== 'CANCELLED' && (
        <div className="flex items-center gap-3 rounded-xl border border-yellow-200 bg-yellow-50 px-5 py-3.5 text-sm text-yellow-800">
          <svg className="h-5 w-5 shrink-0 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
          <span>Płatność jeszcze nie została zrealizowana. Nie wysyłaj towaru przed potwierdzeniem wpłaty.</span>
        </div>
      )}

      <div className="overflow-hidden rounded-3xl border border-brand-200 bg-white shadow-md">
        <div className="bg-brand-800 px-6 py-4">
          <p className="text-xs font-semibold uppercase tracking-widest text-brand-300">Szczegóły sprzedaży</p>
          <div className="mt-1 flex flex-wrap items-center justify-between gap-3">
            <h1 className="text-2xl font-bold text-white">Zamówienie</h1>
            <Badge variant={orderStatusVariant[order.status]}>
              {orderStatusLabels[order.status]}
            </Badge>
          </div>
        </div>
        <div className="px-6 py-4">
          <dl className="divide-y divide-brand-50 rounded-xl border border-brand-100 bg-cream-50">
            <div className="flex items-center justify-between px-4 py-2.5 text-sm">
              <dt className="text-gray-500">Numer zamówienia</dt>
              <dd className="font-mono text-xs font-medium text-brand-800">{order.id}</dd>
            </div>
            <div className="flex items-center justify-between px-4 py-2.5 text-sm">
              <dt className="text-gray-500">Data złożenia</dt>
              <dd className="font-medium text-brand-800">{createdAt}</dd>
            </div>
            {order.updatedAt !== order.createdAt && (
              <div className="flex items-center justify-between px-4 py-2.5 text-sm">
                <dt className="text-gray-500">Ostatnia aktualizacja</dt>
                <dd className="font-medium text-brand-800">{updatedAt}</dd>
              </div>
            )}
            <div className="flex items-center justify-between px-4 py-2.5 text-sm">
              <dt className="text-gray-500">Wartość zamówienia</dt>
              <dd className="text-base font-extrabold text-brand-800">{formatPrice(parseFloat(order.total_amount.toString()))}</dd>
            </div>
          </dl>
        </div>
      </div>

      {order.buyer && (
        <div className="overflow-hidden rounded-2xl border border-brand-100 bg-white shadow-sm">
          <div className="flex items-center gap-3 border-b border-brand-100 px-6 py-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-50 text-brand-500">
              <svg className="h-4.5 w-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-brand-800">Dane klienta</h2>
          </div>
          <div className="px-6 py-4">
            <dl className="divide-y divide-brand-50 rounded-xl border border-brand-100 bg-cream-50">
              <div className="flex items-center justify-between px-4 py-2.5 text-sm">
                <dt className="text-gray-500">Nazwa użytkownika</dt>
                <dd className="font-medium text-brand-800">{order.buyer.username}</dd>
              </div>
              <div className="flex items-center justify-between px-4 py-2.5 text-sm">
                <dt className="text-gray-500">E-mail kontaktowy</dt>
                <dd className="font-medium text-brand-800">
                  <a href={`mailto:${order.buyer.email}`} className="hover:underline">
                    {order.buyer.email}
                  </a>
                </dd>
              </div>
            </dl>
            <a
              href={`mailto:${order.buyer.email}`}
              className="mt-4 inline-flex items-center gap-2 rounded-xl border border-brand-200 bg-white px-4 py-2 text-sm font-medium text-brand-700 shadow-sm transition hover:bg-brand-50"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Napisz do klienta
            </a>
          </div>
        </div>
      )}

      <div className="rounded-2xl border border-brand-100 bg-white shadow-sm">
        <div className="border-b border-brand-100 px-6 py-4">
          <h2 className="text-lg font-semibold text-brand-800">Zamówione produkty</h2>
        </div>
        <div className="divide-y divide-brand-50 px-6">
          {order.products.map((product) => (
            <div key={product.id} className="flex items-center gap-4 py-4">
              <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl border border-brand-100 bg-cream-50">
                {product.image_url ? (
                  <img src={product.image_url} alt={product.name} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <svg className="h-5 w-5 text-brand-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold text-brand-800">{product.name}</p>
                <p className="mt-0.5 text-sm text-gray-500">
                  {product.OrderItem.quantity} szt. × {formatPrice(parseFloat(product.OrderItem.price_per_unit.toString()))} / szt.
                </p>
              </div>
              <p className="shrink-0 font-semibold text-brand-800">
                {formatPrice(product.OrderItem.quantity * parseFloat(product.OrderItem.price_per_unit.toString()))}
              </p>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between border-t border-brand-100 px-6 py-4">
          <span className="text-base font-semibold text-brand-800">Łącznie do zapłaty</span>
          <span className="text-xl font-extrabold text-brand-800">
            {formatPrice(parseFloat(order.total_amount.toString()))}
          </span>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {order.payment && (
          <div className="overflow-hidden rounded-2xl border border-brand-100 bg-white shadow-sm">
            <div className="flex items-center gap-3 border-b border-brand-100 px-6 py-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-50 text-brand-500">
                <svg className="h-4.5 w-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <h2 className="text-lg font-semibold text-brand-800">Płatność</h2>
            </div>
            <div className="p-6">
              <dl className="divide-y divide-brand-50 rounded-xl border border-brand-100 bg-cream-50">
                <div className="flex items-center justify-between px-4 py-2.5 text-sm">
                  <dt className="text-gray-500">Status</dt>
                  <dd>
                    <Badge variant={order.payment.status === 'PAID' ? 'success' : order.payment.status === 'REFUNDED' ? 'warning' : 'default'}>
                      {paymentStatusLabels[order.payment.status]}
                    </Badge>
                  </dd>
                </div>
                <div className="flex items-center justify-between px-4 py-2.5 text-sm">
                  <dt className="text-gray-500">Kwota</dt>
                  <dd className="font-semibold text-brand-800">{formatPrice(parseFloat(order.payment.amount.toString()))}</dd>
                </div>
                {order.payment.payment_gateway_id && (
                  <div className="flex items-center justify-between px-4 py-2.5 text-sm">
                    <dt className="text-gray-500">ID transakcji</dt>
                    <dd className="font-mono text-xs font-medium text-brand-800">{order.payment.payment_gateway_id}</dd>
                  </div>
                )}
              </dl>
            </div>
          </div>
        )}

        {order.delivery && (
          <div className="overflow-hidden rounded-2xl border border-brand-100 bg-white shadow-sm">
            <div className="flex items-center gap-3 border-b border-brand-100 px-6 py-4">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-50 text-brand-500">
                <svg className="h-4.5 w-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                </svg>
              </div>
              <h2 className="text-lg font-semibold text-brand-800">Dostawa</h2>
            </div>
            <div className="p-6">
              <dl className="divide-y divide-brand-50 rounded-xl border border-brand-100 bg-cream-50">
                <div className="flex items-center justify-between px-4 py-2.5 text-sm">
                  <dt className="text-gray-500">Status</dt>
                  <dd>
                    <Badge variant={order.delivery.status === 'DELIVERED' ? 'success' : 'info'}>
                      {deliveryStatusLabels[order.delivery.status]}
                    </Badge>
                  </dd>
                </div>
                {order.delivery.tracking_number ? (
                  <div className="flex items-center justify-between px-4 py-2.5 text-sm">
                    <dt className="text-gray-500">Numer śledzenia</dt>
                    <dd className="font-mono text-xs font-medium text-brand-800">{order.delivery.tracking_number}</dd>
                  </div>
                ) : (
                  <div className="flex items-center justify-between px-4 py-2.5 text-sm">
                    <dt className="text-gray-500">Numer śledzenia</dt>
                    <dd className="text-xs italic text-gray-400">Nie przypisano</dd>
                  </div>
                )}
                <div className="flex items-start justify-between px-4 py-2.5 text-sm">
                  <dt className="shrink-0 text-gray-500">Adres wysyłki</dt>
                  <dd className="ml-4 text-right font-medium text-brand-800">
                    {order.delivery.address.street} {order.delivery.address.street_number}<br />
                    {order.delivery.address.postal_code} {order.delivery.address.city}
                  </dd>
                </div>
              </dl>
              {canShip && (
                <Button
                  className="mt-4 w-full"
                  onClick={() => {}}
                  isLoading={false}
                >
                  <span className="flex items-center gap-2">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                    </svg>
                    Oznacz jako wysłane
                  </span>
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SaleDetailPage;
