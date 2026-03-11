import { useRef, useState } from 'react';
import { useNavigate, Link } from 'react-router';
import { useQueryClient } from '@tanstack/react-query';
import { Elements } from '@stripe/react-stripe-js';

import { useCarts, useCartTotal, cartKeys } from '@/hooks/useCart';
import { useCreateOrder, useCreatePaymentIntent } from '@/hooks/useOrders';
import { formatPrice } from '@/utils/formatPrice';
import { stripePromise } from '@/utils/stripe';

import Spinner from '@/components/ui/Spinner';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import PaymentForm from '@/components/PaymentForm';

const SELLER_COLORS = [
  { bg: 'bg-brand-800', light: 'bg-brand-50', border: 'border-brand-200', dot: 'bg-brand-500' },
  { bg: 'bg-emerald-800', light: 'bg-emerald-50', border: 'border-emerald-200', dot: 'bg-emerald-500' },
  { bg: 'bg-violet-800', light: 'bg-violet-50', border: 'border-violet-200', dot: 'bg-violet-500' },
  { bg: 'bg-rose-800', light: 'bg-rose-50', border: 'border-rose-200', dot: 'bg-rose-500' },
];

const CheckoutPage = () => {
  const { data: carts, isLoading } = useCarts();
  const cartTotal = useCartTotal();
  const createOrder = useCreateOrder();
  const createPaymentIntent = useCreatePaymentIntent();
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const formRef = useRef<HTMLFormElement>(null);
  const [activeCart, setActiveCart] = useState<number>(0);

  const [step, setStep] = useState<'form' | 'payment'>('form');
  const [paymentIntents, setPaymentIntents] = useState<Array<{ orderId: string; clientSecret: string }>>([]);
  const [error, setError] = useState('');
  const [isPending, setIsPending] = useState(false);

  const allItems = carts?.flatMap((c) => c.items) ?? [];

  const handleProceedToPayment = async () => {
    if (!formRef.current) return;

    const formData = new FormData(formRef.current);
    const street = (formData.get('street') as string)?.trim();
    const streetNumber = (formData.get('streetNumber') as string)?.trim();
    const city = (formData.get('city') as string)?.trim();
    const postalCode = (formData.get('postalCode') as string)?.trim();

    if (!street || !streetNumber || !city || !postalCode) {
      setError('Wszystkie pola adresu są wymagane.');
      return;
    }

    if (allItems.length === 0) {
      setError('Twój koszyk jest pusty.');
      return;
    }

    setError('');
    setIsPending(true);

    try {
      const intents: Array<{ orderId: string; clientSecret: string }> = [];

      for (const cart of carts ?? []) {
        const order = await createOrder.mutateAsync({
          items: cart.items.map((item) => ({ product_id: item.product_id, quantity: item.quantity })),
          address: { street, street_number: streetNumber, city, postal_code: postalCode },
        });

        const { clientSecret } = await createPaymentIntent.mutateAsync(order.id);
        intents.push({ orderId: order.id, clientSecret });
      }

      setPaymentIntents(intents);
      setStep('payment');
    } catch {
      setError('Nie udało się przygotować płatności. Spróbuj ponownie.');
    } finally {
      setIsPending(false);
    }
  };

  const handlePaymentSuccess = async () => {
    await queryClient.invalidateQueries({ queryKey: cartKeys.all });
    navigate('/dashboard/orders', { replace: true });
  };

  const handlePaymentError = (message: string) => {
    setError(message);
  };

  if (isLoading)
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spinner size="lg" />
      </div>
    );

  if (!carts || allItems.length === 0) {
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
        <button onClick={() => navigate('/products')} className="font-medium text-brand-500 transition hover:text-brand-800">Produkty</button>
        <span className="text-brand-300">/</span>
        <button onClick={() => navigate('/cart')} className="font-medium text-brand-500 transition hover:text-brand-800">Koszyk</button>
        <span className="text-brand-300">/</span>
        <span className="font-medium text-brand-800">Zamówienie</span>
      </nav>

      {carts.length > 1 && (
        <div className="flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4">
          <svg className="mt-0.5 h-5 w-5 shrink-0 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
          <div>
            <p className="text-sm font-semibold text-amber-800">Zamówienie od {carts.length} sprzedawców</p>
            <p className="mt-0.5 text-xs text-amber-700">
              Zostanie złożonych {carts.length} osobnych zamówień. Jeden adres dostawy dla wszystkich.
            </p>
          </div>
        </div>
      )}

      <div className="grid gap-8 grid-cols-1 lg:grid-cols-[1fr_400px]">
        <div className="space-y-6">
          <div className="overflow-hidden rounded-3xl border border-brand-200 bg-white shadow-md">
            <div className="bg-brand-800 px-6 py-4">
              <p className="text-xs font-semibold uppercase tracking-widest text-brand-300">Krok 1</p>
              <h2 className="mt-1 text-2xl font-bold text-white">Adres dostawy</h2>
              {carts.length > 1 && (
                <p className="mt-1 text-xs text-brand-300">Wspólny dla wszystkich {carts.length} zamówień</p>
              )}
            </div>

            <form ref={formRef} className="p-6" onSubmit={(e) => e.preventDefault()}>
              {error && step === 'form' && (
                <div className="mb-5 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                  <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                  </svg>
                  {error}
                </div>
              )}
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <Input name="street" type="text" placeholder="Ulica" required className="sm:col-span-2" disabled={step === 'payment'} />
                  <Input name="streetNumber" type="text" placeholder="Nr budynku / lok." required disabled={step === 'payment'} />
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <Input name="postalCode" type="text" placeholder="Kod pocztowy" required disabled={step === 'payment'} />
                  <Input name="city" type="text" placeholder="Miasto" required className="sm:col-span-2" disabled={step === 'payment'} />
                </div>
              </div>

              <dl className="mt-6 divide-y divide-brand-50 rounded-xl border border-brand-100 bg-cream-50">
                {[
                  { label: 'Czas dostawy', value: '24-48 h' },
                  { label: 'Kurier', value: 'DPD / InPost' },
                  { label: 'Zwrot', value: '14 dni' },
                ].map(({ label, value }) => (
                  <div key={label} className="flex items-center justify-between px-4 py-2.5 text-sm">
                    <dt className="text-gray-500">{label}</dt>
                    <dd className="font-medium text-brand-800">{value}</dd>
                  </div>
                ))}
              </dl>
            </form>
          </div>

          <div className="overflow-hidden rounded-3xl border border-brand-200 bg-white shadow-md">
            <div className="bg-brand-800 px-6 py-4">
              <p className="text-xs font-semibold uppercase tracking-widest text-brand-300">Krok 2</p>
              <h2 className="mt-1 text-2xl font-bold text-white">
                {carts.length === 1 ? 'Twoje produkty' : `Zamówienia (${carts.length})`}
              </h2>
            </div>

            {carts.length > 1 && (
              <div className="flex gap-1 border-b border-gray-100 bg-gray-50 px-4 pt-3">
                {carts.map((cart, index) => {
                  const colors = SELLER_COLORS[index % SELLER_COLORS.length];
                  return (
                    <button
                      key={cart.id}
                      onClick={() => setActiveCart(index)}
                      className={`flex items-center gap-2 rounded-t-xl border-b-2 px-4 py-2.5 text-sm font-medium transition ${
                        activeCart === index
                          ? `border-brand-600 text-brand-800`
                          : 'border-transparent text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      <span className={`h-2 w-2 rounded-full ${colors.dot}`} />
                        {cart.seller.username}
                      <span className="rounded-full bg-gray-200 px-1.5 py-0.5 text-xs text-gray-600">
                        {cart.items.length}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}

            <div className="p-6">
              {(() => {
                const cart = carts[activeCart];
                const cartItemTotal = cart.items.reduce(
                  (sum, item) => sum + (item.product?.price ?? 0) * item.quantity,
                  0
                );
                return (
                  <div className="space-y-4">
                    {cart.items.map((item) => (
                      <div key={item.id} className="flex items-start justify-between gap-4">
                        <div className="min-w-0">
                          <p className="truncate font-semibold text-brand-800">{item.product?.name}</p>
                          <p className="mt-0.5 text-sm text-gray-500">
                            {item.quantity} szt. x {formatPrice(item.product?.price ?? 0)}
                          </p>
                        </div>
                        <span className="shrink-0 font-semibold text-brand-800">
                          {formatPrice((item.product?.price ?? 0) * item.quantity)}
                        </span>
                      </div>
                    ))}
                    {carts.length > 1 && (
                      <div className="flex items-center justify-between border-t border-gray-100 pt-4 text-sm">
                        <span className="text-gray-500">Suma tego zamówienia</span>
                        <span className="font-semibold text-brand-800">{formatPrice(cartItemTotal)}</span>
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>
          </div>

          {step === 'payment' && (
            <div className="overflow-hidden rounded-3xl border border-brand-200 bg-white shadow-md">
              <div className="bg-brand-800 px-6 py-4">
                <p className="text-xs font-semibold uppercase tracking-widest text-brand-300">Krok 3</p>
                <h2 className="mt-1 text-2xl font-bold text-white">Płatność</h2>
              </div>

              <div className="p-6">
                {error && (
                  <div className="mb-5 flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                    <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                    </svg>
                    {error}
                  </div>
                )}

                <Elements stripe={stripePromise}>
                  <PaymentForm
                    paymentIntents={paymentIntents}
                    onSuccess={handlePaymentSuccess}
                    onError={handlePaymentError}
                  />
                </Elements>
              </div>
            </div>
          )}

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
              <p className="text-xs font-semibold uppercase tracking-widest text-brand-300">
                Krok {step === 'payment' ? '4' : '3'}
              </p>
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
                          <span className={`inline-block h-2 w-2 rounded-full ${colors.dot}`} />
                          <Link to={`/profile/${cart.seller_id}`} className="text-gray-600">{cart.seller.username}</Link>
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
                    <dt className="text-gray-500">Zamówień</dt>
                    <dd className="font-medium text-amber-600">{carts.length} osobne</dd>
                  </div>
                )}
              </dl>

              <div className="my-5 border-t border-brand-100" />

              <div className="flex items-center justify-between">
                <span className="text-base font-semibold text-brand-800">Do zapłaty</span>
                <span className="text-2xl font-extrabold tracking-tight text-brand-800">
                  {formatPrice(cartTotal)}
                </span>
              </div>

              {step === 'form' && (
                <label className="mt-5 block">
                  <Button
                    type="button"
                    className="w-full"
                    size="lg"
                    isLoading={isPending}
                    disabled={allItems.length === 0 || isPending}
                    onClick={handleProceedToPayment}
                  >
                    {isPending ? (
                      'Przygotowywanie płatności...'
                    ) : (
                      <span className="flex items-center gap-2">
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Przejdź do płatności — {formatPrice(cartTotal)}
                      </span>
                    )}
                  </Button>
                </label>
              )}

              {carts.length > 1 && (
                <p className="mt-2 text-center text-xs text-amber-600">
                  Składasz {carts.length} osobne zamówienia jednocześnie
                </p>
              )}

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
