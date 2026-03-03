import { Link } from 'react-router';
import { useCart, useCartTotal, useClearCart } from '@/hooks/useCart';
import CartItem from '@/components/CartItem';
import Spinner from '@/components/ui/Spinner';
import Button from '@/components/ui/Button';
import { formatPrice } from '@/utils/formatPrice';

const CartPage = () => {
  const { data: cart, isLoading, isError } = useCart();
  const cartTotal = useCartTotal();
  const clearCart = useClearCart();

  if (isLoading)
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spinner size="lg" />
      </div>
    );

  if (isError) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 rounded-2xl border border-red-100 bg-red-50 p-12 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
          <svg className="h-7 w-7 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
        </div>
        <div>
          <p className="text-base font-semibold text-red-700">Błąd ładowania koszyka</p>
          <p className="mt-1 text-sm text-red-500">Nie udało się pobrać zawartości koszyka. Spróbuj odświeżyć stronę.</p>
        </div>
      </div>
    );
  }

  const items = cart?.items ?? [];

  if (items.length === 0) {
    return (
      <div className="flex min-h-[30vh] flex-col items-center justify-center gap-4 rounded-2xl border border-brand-100 bg-white p-12 text-center shadow-sm">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-50">
          <svg className="h-7 w-7 text-brand-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
        <div>
          <p className="text-base font-semibold text-brand-800">Twój koszyk jest pusty</p>
          <p className="mt-1 text-sm text-gray-500">Dodaj produkty, aby móc złożyć zamówienie.</p>
        </div>
        <Link to="/products">
          <Button className="mt-2">Przeglądaj produkty</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-brand-800">Koszyk</h1>
          <p className="mt-1 text-sm text-gray-500">{items.length} {items.length === 1 ? 'produkt' : items.length < 5 ? 'produkty' : 'produktów'}</p>
        </div>
        <button
          onClick={() => clearCart.mutate()}
          disabled={clearCart.isPending}
          className="inline-flex items-center gap-1.5 rounded-xl border border-red-200 px-3 py-2 text-sm font-medium text-red-500 transition hover:bg-red-50 hover:text-red-700 disabled:opacity-50"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          Wyczyść koszyk
        </button>
      </div>

      <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
        <div className="space-y-4">
          {items.map((item) => (
            <CartItem key={item.id} item={item} />
          ))}
        </div>

        <aside className="space-y-5 lg:sticky lg:top-8 lg:self-start">
          <div className="overflow-hidden rounded-3xl border border-brand-200 bg-white shadow-md">
            <div className="bg-brand-800 px-6 py-4">
              <p className="text-xs font-semibold uppercase tracking-widest text-brand-300">Zamówienie</p>
              <h2 className="mt-1 text-2xl font-bold text-white">Podsumowanie</h2>
            </div>

            <div className="p-6">
              <dl className="divide-y divide-brand-50 rounded-xl border border-brand-100 bg-cream-50">
                <div className="flex items-center justify-between px-4 py-2.5 text-sm">
                  <dt className="text-gray-500">Produkty ({items.length})</dt>
                  <dd className="font-medium text-brand-800">{formatPrice(cartTotal)}</dd>
                </div>
                <div className="flex items-center justify-between px-4 py-2.5 text-sm">
                  <dt className="text-gray-500">Dostawa</dt>
                  <dd className="font-medium text-emerald-600">Bezpłatna</dd>
                </div>
                <div className="flex items-center justify-between px-4 py-2.5 text-sm">
                  <dt className="text-gray-500">Czas dostawy</dt>
                  <dd className="font-medium text-brand-800">24–48 h</dd>
                </div>
              </dl>

              <div className="mt-5 flex items-center justify-between">
                <span className="text-base font-semibold text-brand-800">Do zapłaty</span>
                <span className="text-2xl font-extrabold tracking-tight text-brand-800">
                  {formatPrice(cartTotal)}
                </span>
              </div>

              <Link to="/checkout" className="mt-5 block">
                <Button className="w-full" size="lg">
                  <span className="flex items-center gap-2">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                    </svg>
                    Przejdź do płatności
                  </span>
                </Button>
              </Link>

              <div className="mt-4 flex justify-center gap-4">
                {[
                  'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
                  'M13 10V3L4 14h7v7l9-11h-7z',
                  'M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z',
                ].map((icon, i) => (
                  <div key={i} className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-50 text-brand-400">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={icon} />
                    </svg>
                  </div>
                ))}
              </div>

              <p className="mt-3 text-center text-xs text-gray-400">
                Bezpieczne zakupy · Szyfrowane połączenie · Zwrot 14 dni
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-brand-100 bg-white p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-brand-800">Masz kod rabatowy?</h3>
            <div className="mt-3 flex gap-2">
              <input
                type="text"
                placeholder="Wpisz kod..."
                className="w-full rounded-xl border border-brand-200 bg-cream-50 px-3 py-2 text-sm text-brand-800 placeholder:text-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-300"
              />
              <button className="shrink-0 rounded-xl border border-brand-200 px-4 py-2 text-sm font-medium text-brand-700 transition hover:bg-brand-50">
                Zastosuj
              </button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default CartPage;
