import { useState, type FormEvent } from 'react';
import { useNavigate } from 'react-router';
import { useQueryClient } from '@tanstack/react-query';

import { useCart, useCartTotal } from '@/hooks/useCart';
import { useCreateOrder } from '@/hooks/useOrders';
import { cartKeys } from '@/hooks/useCart';
import { formatPrice } from '@/utils/formatPrice';

import Spinner from '@/components/ui/Spinner';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';

const CheckoutPage = () => {
  const { data: cart, isLoading } = useCart();
  const cartTotal = useCartTotal();
  const createOrder = useCreateOrder();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [street, setStreet] = useState('');
  const [streetNumber, setStreetNumber] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [error, setError] = useState('');

  const items = cart?.items ?? [];

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');

    if (!street.trim() || !streetNumber.trim() || !city.trim() || !postalCode.trim()) {
      setError('Wszystkie pola adresu są wymagane.');
      return;
    }

    if (items.length === 0) {
      setError('Twój koszyk jest pusty.');
      return;
    }

    try {
      const orderItems = items.map((item) => ({
        product_id: item.product_id,
        quantity: item.quantity,
      }));

      await createOrder.mutateAsync({
        items: orderItems,
        address: {
          street: street.trim(),
          street_number: streetNumber.trim(),
          city: city.trim(),
          postal_code: postalCode.trim(),
        },
      });

      await queryClient.invalidateQueries({ queryKey: cartKeys.all });
      navigate('/dashboard/orders', { replace: true });
    } catch (err) {
      setError('Nie udało się złożyć zamówienia. Spróbuj ponownie.');
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!cart || items.length === 0) {
    return (
      <div className="py-20 text-center">
        <h1 className="text-2xl font-bold text-brand-800">Twój koszyk jest pusty</h1>
        <p className="mt-2 text-gray-500">Dodaj produkty do koszyka, aby móc złożyć zamówienie.</p>
        <Button onClick={() => navigate('/')} className="mt-6">
          Wróć do sklepu
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto max-w-6xl px-4 py-12">
      <h1 className="mb-8 text-center text-4xl font-extrabold tracking-tight text-brand-800">
        Podsumowanie zamówienia
      </h1>

      <div className="flex flex-col gap-8">
        <div className="">
          <Card className="bg-white shadow-lg">
            <h2 className="text-2xl font-bold text-brand-800">Twoje produkty</h2>
            <div className="mt-6 space-y-4">
              {items.map((item) => (
                <div key={item.id} className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-gray-800">{item.product?.name}</p>
                    <p className="text-sm text-gray-500">Ilość: {item.quantity}</p>
                  </div>
                  <span className="font-medium text-gray-900">
                    {formatPrice((item.product?.price ?? 0) * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
            <hr className="my-6 border-brand-200" />
            <div className="flex justify-between text-xl font-bold text-brand-800">
              <span>Łącznie</span>
              <span>{formatPrice(cartTotal)}</span>
            </div>
          </Card>
        </div>

        <div>
          <Card className="bg-white shadow-lg">
            <form onSubmit={handleSubmit} className="space-y-6">
              <h2 className="text-2xl font-bold text-brand-800">Adres dostawy</h2>

              {error && (
                <div className="rounded-lg bg-red-100 p-4 text-sm font-medium text-red-700">
                  {error}
                </div>
              )}

              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <Input
                    type="text"
                    placeholder="Ulica"
                    value={street}
                    onChange={(e) => setStreet(e.target.value)}
                    required
                    className="sm:col-span-2"
                  />
                  <Input
                    type="text"
                    placeholder="Nr"
                    value={streetNumber}
                    onChange={(e) => setStreetNumber(e.target.value)}
                    required
                  />
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                   <Input
                    type="text"
                    placeholder="Kod pocztowy"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    required
                  />
                  <Input
                    type="text"
                    placeholder="Miasto"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    required
                    className="sm:col-span-2"
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full"
                size="lg"
                isLoading={createOrder.isPending}
                disabled={items.length === 0}
              >
                {createOrder.isPending ? 'Składanie zamówienia...' : `Zapłać i zamów — ${formatPrice(cartTotal)}`}
              </Button>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
