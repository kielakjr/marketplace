import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router';
import { useCart, useCartTotal } from '@/hooks/useCart';
import { useCreateOrder } from '@/hooks/useOrders';
import { cartKeys } from '@/hooks/useCart';
import { useQueryClient } from '@tanstack/react-query';
import { formatPrice } from '@/utils/formatPrice';
import Spinner from '@/components/ui/Spinner';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Textarea from '@/components/ui/Textarea';

const CheckoutPage = () => {
  const { data: cart, isLoading } = useCart();
  const cartTotal = useCartTotal();
  const createOrder = useCreateOrder();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [address, setAddress] = useState('');
  const [error, setError] = useState('');

  const items = cart?.items ?? [];

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!address.trim() || address.trim().length < 5) {
      setError('Podaj pełny adres dostawy (min. 5 znaków)');
      return;
    }
    if (items.length === 0) return;

    try {
      const orderItems = items.map((item) => ({
        product_id: item.product_id,
        quantity: item.quantity,
      }));

      await createOrder.mutateAsync({
        items: orderItems,
        address_details: address.trim(),
      });

      queryClient.invalidateQueries({ queryKey: cartKeys.all });
      navigate('/dashboard/orders', { replace: true });
    } catch {
      setError('Nie udało się złożyć zamówienia. Spróbuj ponownie.');
    }
  };

  if (isLoading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>;

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl text-center py-20">
        <p className="text-gray-500">Twój koszyk jest pusty.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <h1 className="text-3xl font-bold text-brand-800">Złóż zamówienie</h1>

      <Card>
        <h2 className="text-lg font-semibold text-brand-800">Produkty</h2>
        <div className="mt-4 space-y-3">
          {items.map((item) => (
            <div key={item.id} className="flex justify-between text-sm">
              <span className="text-gray-700">
                {item.product?.name} × {item.quantity}
              </span>
              <span className="font-medium text-gray-900">
                {formatPrice((item.product?.price ?? 0) * item.quantity)}
              </span>
            </div>
          ))}
          <hr className="border-brand-200" />
          <div className="flex justify-between text-lg font-bold text-brand-800">
            <span>Razem</span>
            <span>{formatPrice(cartTotal)}</span>
          </div>
        </div>
      </Card>

      <Card>
        <form onSubmit={handleSubmit} className="space-y-4">
          <h2 className="text-lg font-semibold text-brand-800">Adres dostawy</h2>

          {error && (
            <div className="rounded-lg bg-red-50 p-3 text-sm text-red-600">{error}</div>
          )}

          <Textarea
            id="address"
            label="Pełny adres"
            placeholder="ul. Przykładowa 1, 00-001 Warszawa"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
            rows={3}
          />

          <Button type="submit" className="w-full" size="lg" isLoading={createOrder.isPending}>
            Złóż zamówienie — {formatPrice(cartTotal)}
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default CheckoutPage;
