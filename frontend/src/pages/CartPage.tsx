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

  if (isLoading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>;
  if (isError) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-8 text-center text-red-600">
        Nie udało się załadować koszyka.
      </div>
    );
  }

  const items = cart?.items ?? [];

  if (items.length === 0) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-brand-800">Koszyk</h1>
        <div className="rounded-2xl border border-brand-200 bg-white p-12 text-center">
          <svg className="mx-auto h-16 w-16 text-brand-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
          </svg>
          <p className="mt-4 text-gray-500">Twój koszyk jest pusty</p>
          <Link to="/products">
            <Button className="mt-6">Przeglądaj produkty</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-brand-800">Koszyk</h1>
        <button
          onClick={() => clearCart.mutate()}
          disabled={clearCart.isPending}
          className="text-sm font-medium text-red-500 transition-colors hover:text-red-700"
        >
          Wyczyść koszyk
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-4 lg:col-span-2">
          {items.map((item) => (
            <CartItem key={item.id} item={item} />
          ))}
        </div>

        <div className="h-fit rounded-2xl border border-brand-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-brand-800">Podsumowanie</h2>
          <div className="mt-4 space-y-3">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Produkty ({items.length})</span>
              <span>{formatPrice(cartTotal)}</span>
            </div>
            <div className="flex justify-between text-sm text-gray-600">
              <span>Dostawa</span>
              <span className="text-green-600">Gratis</span>
            </div>
            <hr className="border-brand-200" />
            <div className="flex justify-between text-lg font-bold text-brand-800">
              <span>Razem</span>
              <span>{formatPrice(cartTotal)}</span>
            </div>
          </div>
          <Link to="/checkout" className="mt-6 block">
            <Button className="w-full" size="lg">
              Przejdź do płatności
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
