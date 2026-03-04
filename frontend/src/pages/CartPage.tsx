import { Link } from 'react-router';
import { useCarts, useCartTotal, useClearCart } from '@/hooks/useCart';
import CartItem from '@/components/CartItem';
import Spinner from '@/components/ui/Spinner';
import Button from '@/components/ui/Button';
import { formatPrice } from '@/utils/formatPrice';

const SELLER_COLORS = [
  { bg: 'bg-brand-800', badge: 'bg-brand-100 text-brand-700', border: 'border-brand-200' },
  { bg: 'bg-emerald-800', badge: 'bg-emerald-100 text-emerald-700', border: 'border-emerald-200' },
  { bg: 'bg-violet-800', badge: 'bg-violet-100 text-violet-700', border: 'border-violet-200' },
  { bg: 'bg-rose-800', badge: 'bg-rose-100 text-rose-700', border: 'border-rose-200' },
];

const CartPage = () => {
  const { data: carts, isLoading, isError } = useCarts();
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

  const allItems = carts?.flatMap((c) => c.items) ?? [];

  if (!carts || carts.length === 0 || allItems.length === 0) {
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
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-brand-800">Koszyk</h1>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span className="text-sm text-gray-500">{allItems.length} {allItems.length === 1 ? 'produkt' : allItems.length < 5 ? 'produkty' : 'produktów'}</span>
            {carts.length > 1 && (
              <>
                <span className="text-gray-300">·</span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-200 bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-700">
                  <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {carts.length} osobne zamówienia od różnych sprzedawców
                </span>
              </>
            )}
          </div>
        </div>
      </div>

      {carts.length > 1 && (
        <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4">
          <svg className="mt-0.5 h-5 w-5 shrink-0 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
          <div>
            <p className="text-sm font-semibold text-amber-800">Masz produkty od {carts.length} różnych sprzedawców</p>
            <p className="mt-0.5 text-xs text-amber-700">Każde zamówienie zostanie złożone osobno i może być dostarczone w innym terminie.</p>
          </div>
        </div>
      )}

      <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
        <div className="space-y-6">
          {carts.map((cart, index) => {
            const colors = SELLER_COLORS[index % SELLER_COLORS.length];
            const cartItemTotal = cart.items.reduce(
              (sum, item) => sum + (item.product?.price ?? 0) * item.quantity,
              0
            );
            const cartItemCount = cart.items.reduce((sum, item) => sum + item.quantity, 0);

            return (
              <div key={cart.id} className={`overflow-hidden rounded-3xl border ${colors.border} bg-white shadow-md`}>
                <div className={`${colors.bg} px-6 py-4`}>
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/15">
                        <svg className="h-4.5 w-4.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                        </svg>
                      </div>
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-widest text-white/60">Sprzedawca</p>
                        <p className="font-semibold text-white">{cart.seller.username ?? `Sprzedawca #${index + 1}`}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-white">
                        {cartItemCount} szt. · {formatPrice(cartItemTotal)}
                      </span>
                      <button
                        onClick={() => clearCart.mutate(cart.seller_id)}
                        disabled={clearCart.isPending}
                        className="inline-flex items-center gap-1 rounded-xl bg-white/10 px-2.5 py-1.5 text-xs font-medium text-white/80 transition hover:bg-white/20 disabled:opacity-50"
                        title="Wyczyść koszyk tego sprzedawcy"
                      >
                        <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Wyczyść
                      </button>
                    </div>
                  </div>
                </div>

                <div className="divide-y divide-gray-50 p-4">
                  {cart.items.map((item) => (
                    <div key={item.id} className="py-2 first:pt-0 last:pb-0">
                      <CartItem item={item} />
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between border-t border-gray-100 bg-gray-50 px-6 py-3">
                  <span className="text-sm text-gray-500">Suma częściowa</span>
                  <span className="font-semibold text-brand-800">{formatPrice(cartItemTotal)}</span>
                </div>
              </div>
            );
          })}
        </div>

        <aside className="space-y-5 lg:sticky lg:top-8 lg:self-start">
          <div className="overflow-hidden rounded-3xl border border-brand-200 bg-white shadow-md">
            <div className="bg-brand-800 px-6 py-4">
              <p className="text-xs font-semibold uppercase tracking-widest text-brand-300">Zamówienie</p>
              <h2 className="mt-1 text-2xl font-bold text-white">Podsumowanie</h2>
            </div>

            <div className="p-6">
              {carts.length > 1 && (
                <div className="mb-5 space-y-2">
                  {carts.map((cart, index) => {
                    const colors = SELLER_COLORS[index % SELLER_COLORS.length];
                    const total = cart.items.reduce(
                      (sum, item) => sum + (item.product?.price ?? 0) * item.quantity,
                      0
                    );
                    return (
                      <div key={cart.id} className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <span className={`inline-block h-2 w-2 rounded-full ${colors.bg}`} />
                          <span className="text-gray-600">{cart.seller.username ?? `Sprzedawca #${index + 1}`}</span>
                        </div>
                        <span className="font-medium text-brand-800">{formatPrice(total)}</span>
                      </div>
                    );
                  })}
                  <div className="my-3 border-t border-brand-100" />
                </div>
              )}

              <dl className="divide-y divide-brand-50 rounded-xl border border-brand-100 bg-cream-50">
                <div className="flex items-center justify-between px-4 py-2.5 text-sm">
                  <dt className="text-gray-500">Produkty ({allItems.length})</dt>
                  <dd className="font-medium text-brand-800">{formatPrice(cartTotal)}</dd>
                </div>
                <div className="flex items-center justify-between px-4 py-2.5 text-sm">
                  <dt className="text-gray-500">Dostawa</dt>
                  <dd className="font-medium text-emerald-600">Bezpłatna</dd>
                </div>
                {carts.length > 1 && (
                  <div className="flex items-center justify-between px-4 py-2.5 text-sm">
                    <dt className="text-gray-500">Liczba zamówień</dt>
                    <dd className="font-medium text-amber-600">{carts.length} osobne</dd>
                  </div>
                )}
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
