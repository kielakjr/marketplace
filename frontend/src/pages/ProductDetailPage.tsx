import { useParams, Link } from 'react-router';
import { useProduct } from '@/hooks/useProducts';
import { useAddToCart } from '@/hooks/useCart';
import { useAppSelector } from '@/store/hooks';
import { formatPrice } from '@/utils/formatPrice';
import Spinner from '@/components/ui/Spinner';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';

const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { data: product, isLoading, isError } = useProduct(id!);
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const addToCart = useAddToCart();

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      window.location.href = '/login';
      return;
    }
    if (product) {
      addToCart.mutate({ product_id: product.id, quantity: 1 });
    }
  };

  if (isLoading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>;

  if (isError || !product) {
    return (
      <div className="rounded-xl border border-red-200 bg-red-50 p-8 text-center">
        <p className="text-red-600">Nie znaleziono produktu.</p>
        <Link to="/products" className="mt-4 inline-block text-sm font-medium text-brand-800 hover:text-brand-600">
          ← Wróć do produktów
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <div className="flex items-center gap-3 text-sm text-brand-500">
        <Link to="/products" className="font-medium hover:text-brand-800">
          Produkty
        </Link>
        <span className="text-brand-300">/</span>
        <span className="text-brand-800">{product.name}</span>
      </div>

      <section className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_420px]">
        <div className="space-y-8">
          <div className="overflow-hidden rounded-3xl border border-brand-200 bg-cream-50">
            <div className="aspect-square w-full">
              {product.image_url ? (
                <img src={product.image_url} alt={product.name} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-brand-300">
                  <svg className="h-28 w-28" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-brand-100 bg-white p-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-brand-800">Opis produktu</h2>
              <Badge variant={product.quantity_available > 0 ? 'success' : 'danger'}>
                {product.quantity_available > 0
                  ? `Dostępnych: ${product.quantity_available}`
                  : 'Brak w magazynie'}
              </Badge>
            </div>
            <p className="mt-3 leading-relaxed text-gray-600">
              {product.description || 'Brak opisu produktu. Sprzedawca nie dodał jeszcze szczegółów.'}
            </p>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {[
              { title: 'Bezpieczna płatność', desc: 'Szyfrowane i sprawdzone metody płatności.' },
              { title: 'Szybka wysyłka', desc: 'Wysyłka w 24h od zakupu.' },
              { title: 'Wsparcie', desc: 'Pomoc w razie problemów z zamówieniem.' },
            ].map((item) => (
              <div key={item.title} className="rounded-2xl border border-brand-100 bg-white p-5">
                <h3 className="text-sm font-semibold text-brand-800">{item.title}</h3>
                <p className="mt-2 text-sm text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <aside className="space-y-6 lg:sticky lg:top-8 lg:self-start">
          <div className="rounded-3xl border border-brand-200 bg-white p-6 shadow-sm">
            <div className="space-y-2">
              <p className="text-sm font-semibold uppercase tracking-wide text-brand-500">Oferta</p>
              <h1 className="text-3xl font-bold text-brand-800">{product.name}</h1>
              <p className="text-4xl font-bold text-brand-800">{formatPrice(product.price)}</p>
            </div>

            <div className="mt-6 space-y-3 rounded-2xl border border-brand-100 bg-cream-50 p-4 text-sm text-gray-600">
              <div className="flex items-center justify-between">
                <span>Stan</span>
                <span className="font-medium text-brand-800">
                  {product.quantity_available > 0 ? 'Dostępny' : 'Niedostępny'}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Dostawa</span>
                <span className="font-medium text-brand-800">24-48h</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Zwrot</span>
                <span className="font-medium text-brand-800">14 dni</span>
              </div>
            </div>

            <Button
              size="lg"
              className="mt-6 w-full"
              onClick={handleAddToCart}
              disabled={product.quantity_available === 0 || addToCart.isPending}
              isLoading={addToCart.isPending}
            >
              {product.quantity_available === 0 ? 'Brak w magazynie' : 'Dodaj do koszyka'}
            </Button>

            <div className="mt-4 text-xs text-gray-500">
              Kupując, akceptujesz regulamin oraz politykę zwrotów.
            </div>
          </div>

          <div className="rounded-2xl border border-brand-100 bg-white p-6">
            <h3 className="text-sm font-semibold text-brand-800">Dlaczego warto?</h3>
            <ul className="mt-3 space-y-2 text-sm text-gray-600">
              <li className="flex gap-2">
                <span className="text-brand-500">•</span>
                Sprawdzony sprzedawca Marketplace
              </li>
              <li className="flex gap-2">
                <span className="text-brand-500">•</span>
                Możliwość śledzenia przesyłki
              </li>
              <li className="flex gap-2">
                <span className="text-brand-500">•</span>
                Obsługa klienta 7 dni w tygodniu
              </li>
            </ul>
          </div>
        </aside>
      </section>

      <div className="rounded-3xl border border-brand-100 bg-white p-8">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-brand-800">Masz pytanie o produkt?</h2>
            <p className="mt-2 text-sm text-gray-600">
              Skontaktuj się z naszym wsparciem – odpowiemy najszybciej jak to możliwe.
            </p>
          </div>
          <Link
            to="/products"
            className="inline-flex items-center justify-center rounded-xl border border-brand-200 px-5 py-3 text-sm font-medium text-brand-700 transition hover:bg-brand-50"
          >
            Zobacz inne produkty
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
