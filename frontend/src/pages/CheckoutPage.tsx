import { useActionState } from 'react';
import { useNavigate } from 'react-router';
import { useQueryClient } from '@tanstack/react-query';

import { useCart, useCartTotal } from '@/hooks/useCart';
import { useCreateOrder } from '@/hooks/useOrders';
import { cartKeys } from '@/hooks/useCart';
import { formatPrice } from '@/utils/formatPrice';

import Spinner from '@/components/ui/Spinner';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

const CheckoutPage = () => {
  const { data: cart, isLoading } = useCart();
  const cartTotal = useCartTotal();
  const createOrder = useCreateOrder();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const items = cart?.items ?? [];

  const checkoutAction = async (_prev: string, formData: FormData) => {
    const street = (formData.get('street') as string).trim();
    const streetNumber = (formData.get('streetNumber') as string).trim();
    const city = (formData.get('city') as string).trim();
    const postalCode = (formData.get('postalCode') as string).trim();

    if (!street || !streetNumber || !city || !postalCode) {
      return 'Wszystkie pola adresu są wymagane.';
    }

    if (items.length === 0) {
      return 'Twój koszyk jest pusty.';
    }

    try {
      await createOrder.mutateAsync({
        items: items.map((item) => ({ product_id: item.product_id, quantity: item.quantity })),
        address: { street, street_number: streetNumber, city, postal_code: postalCode },
      });
      await queryClient.invalidateQueries({ queryKey: cartKeys.all });
      navigate('/dashboard/orders', { replace: true });
      return '';
    } catch {
      return 'Nie udało się złożyć zamówienia. Spróbuj ponownie.';
    }
  };

  const [error, formAction, isPending] = useActionState(checkoutAction, '');

  if (isLoading)
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spinner size="lg" />
      </div>
    );

  if (!cart || items.length === 0) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 rounded-2xl border border-brand-100 bg-white p-12 text-center shadow-sm">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-50">
          <svg className="h-7 w-7 text-brand-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
        <div>
          <p className="text-base font-semibold text-brand-800">Twój koszyk jest pusty</p>
          <p className="mt-1 text-sm text-gray-500">Dodaj produkty do koszyka, aby móc złożyć zamówienie.</p>
        </div>
        <Button onClick={() => navigate('/products')} className="mt-2">
          Przejdź do produktów
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <nav className="flex items-center gap-2 text-sm">
        <button onClick={() => navigate('/products')} className="font-medium text-brand-500 transition hover:text-brand-800">
          Produkty
        </button>
        <span className="text-brand-300">/</span>
        <button onClick={() => navigate('/cart')} className="font-medium text-brand-500 transition hover:text-brand-800">
          Koszyk
        </button>
        <span className="text-brand-300">/</span>
        <span className="font-medium text-brand-800">Zamówienie</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
        <div className="space-y-6">
          <div className="overflow-hidden rounded-3xl border border-brand-200 bg-white shadow-md">
            <div className="bg-brand-800 px-6 py-4">
              <p className="text-xs font-semibold uppercase tracking-widest text-brand-300">Krok 1</p>
              <h2 className="mt-1 text-2xl font-bold text-white">Adres dostawy</h2>
            </div>

            <form action={formAction} className="p-6">
              {error && (
                <div className="mb-5 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                  <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                  </svg>
                  {error}
                </div>
              )}

              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <Input name="street" type="text" placeholder="Ulica" required className="sm:col-span-2" />
                  <Input name="streetNumber" type="text" placeholder="Nr budynku / lok." required />
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <Input name="postalCode" type="text" placeholder="Kod pocztowy" required />
                  <Input name="city" type="text" placeholder="Miasto" required className="sm:col-span-2" />
                </div>
              </div>

              <dl className="mt-6 divide-y divide-brand-50 rounded-xl border border-brand-100 bg-cream-50">
                {[
                  { label: 'Czas dostawy', value: '24–48 h' },
                  { label: 'Kurier', value: 'DPD / InPost' },
                  { label: 'Zwrot', value: '14 dni' },
                ].map(({ label, value }) => (
                  <div key={label} className="flex items-center justify-between px-4 py-2.5 text-sm">
                    <dt className="text-gray-500">{label}</dt>
                    <dd className="font-medium text-brand-800">{value}</dd>
                  </div>
                ))}
              </dl>

              <input type="submit" className="hidden" id="checkout-submit" />
            </form>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {[
              { icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z', title: 'Bezpieczna płatność', desc: 'Szyfrowane połączenie SSL.' },
              { icon: 'M13 10V3L4 14h7v7l9-11h-7z', title: 'Szybka wysyłka', desc: 'Nadanie w 24h od zakupu.' },
              { icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z', title: 'Zwrot 14 dni', desc: 'Bez podania przyczyny.' },
            ].map((item) => (
              <div key={item.title} className="flex gap-4 rounded-2xl border border-brand-100 bg-white p-5 shadow-sm">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-500">
                  <svg className="h-4.5 w-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d={item.icon} />
                  </svg>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-brand-800">{item.title}</h3>
                  <p className="mt-1 text-xs leading-relaxed text-gray-500">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <aside className="space-y-5 lg:sticky lg:top-8 lg:self-start">
          <div className="overflow-hidden rounded-3xl border border-brand-200 bg-white shadow-md">
            <div className="bg-brand-800 px-6 py-4">
              <p className="text-xs font-semibold uppercase tracking-widest text-brand-300">Krok 2</p>
              <h2 className="mt-1 text-2xl font-bold text-white">Twoje produkty</h2>
            </div>

            <div className="p-6">
              <div className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-brand-800">{item.product?.name}</p>
                      <p className="mt-0.5 text-sm text-gray-500">
                        {item.quantity} szt. × {formatPrice(item.product?.price ?? 0)}
                      </p>
                    </div>
                    <span className="shrink-0 font-semibold text-brand-800">
                      {formatPrice((item.product?.price ?? 0) * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="my-5 border-t border-brand-100" />

              <dl className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <dt className="text-gray-500">Produkty ({items.length})</dt>
                  <dd className="font-medium text-brand-800">{formatPrice(cartTotal)}</dd>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <dt className="text-gray-500">Dostawa</dt>
                  <dd className="font-medium text-emerald-600">Bezpłatna</dd>
                </div>
              </dl>

              <div className="my-5 border-t border-brand-100" />

              <div className="flex items-center justify-between">
                <span className="text-base font-semibold text-brand-800">Do zapłaty</span>
                <span className="text-2xl font-extrabold tracking-tight text-brand-800">
                  {formatPrice(cartTotal)}
                </span>
              </div>

              <label htmlFor="checkout-submit" className="mt-5 block">
                <Button
                  type="button"
                  className="w-full"
                  size="lg"
                  isLoading={isPending}
                  disabled={items.length === 0 || isPending}
                  onClick={() => document.getElementById('checkout-submit')?.click()}
                >
                  {isPending ? (
                    'Składanie zamówienia...'
                  ) : (
                    <span className="flex items-center gap-2">
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Zapłać i zamów — {formatPrice(cartTotal)}
                    </span>
                  )}
                </Button>
              </label>

              <p className="mt-3 text-center text-xs text-gray-400">
                Kupując, akceptujesz{' '}
                <button className="underline underline-offset-2 hover:text-brand-600">regulamin</button>
                {' '}oraz{' '}
                <button className="underline underline-offset-2 hover:text-brand-600">politykę zwrotów</button>.
              </p>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default CheckoutPage;
