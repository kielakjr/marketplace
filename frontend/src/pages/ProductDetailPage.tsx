import { useState } from 'react';
import { useParams, Link } from 'react-router';
import { useProduct } from '@/hooks/useProducts';
import { useAddToCart } from '@/hooks/useCart';
import { formatPrice } from '@/utils/formatPrice';
import Spinner from '@/components/ui/Spinner';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import { useAuth } from '@/hooks/useAuth';

const ProductDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const { data: product, isLoading, isError } = useProduct(id!);
  const { isAuthenticated } = useAuth();
  const addToCart = useAddToCart();
  const [selectedImage, setSelectedImage] = useState(0);

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      window.location.href = '/login';
      return;
    }
    if (product) {
      addToCart.mutate({ product_id: product.id, quantity: 1 });
    }
  };

  if (isLoading)
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spinner size="lg" />
      </div>
    );

  if (isError || !product) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 rounded-2xl border border-red-100 bg-red-50 p-12 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
          <svg className="h-7 w-7 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
        </div>
        <div>
          <p className="text-base font-semibold text-red-700">Nie znaleziono produktu</p>
          <p className="mt-1 text-sm text-red-500">Produkt mógł zostać usunięty lub link jest nieprawidłowy.</p>
        </div>
        <Link
          to="/products"
          className="mt-2 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-medium text-brand-700 shadow-sm ring-1 ring-brand-200 transition hover:bg-brand-50"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Wróć do produktów
        </Link>
      </div>
    );
  }

  const inStock = product.quantity_available > 0;
  const createdAt = new Date(product.createdAt).toLocaleDateString('pl-PL', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="space-y-8">
      <nav className="flex items-center gap-2 text-sm">
        <Link to="/products" className="font-medium text-brand-500 transition hover:text-brand-800">
          Produkty
        </Link>
        <span className="text-brand-300">/</span>
        {product.category && (
          <>
            <span className="text-brand-500">{product.category.name}</span>
            <span className="text-brand-300">/</span>
          </>
        )}
        <span className="truncate font-medium text-brand-800">{product.name}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
        <div className="space-y-6">
          <div className="space-y-3">
            <div className="overflow-hidden rounded-3xl border border-brand-100 bg-cream-50 shadow-sm">
              <div className="aspect-4/3 w-full">
                {product.image_urls[selectedImage] ? (
                  <img
                    src={product.image_urls[selectedImage]}
                    alt={product.name}
                    className="h-full w-full object-cover transition duration-500 hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full flex-col items-center justify-center gap-3 text-brand-200">
                    <svg className="h-24 w-24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={0.8} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span className="text-sm font-medium text-brand-300">Brak zdjęcia</span>
                  </div>
                )}
              </div>
            </div>

            {product.image_urls.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-1">
                {product.image_urls.map((url, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setSelectedImage(i)}
                    className={`h-16 w-16 shrink-0 overflow-hidden rounded-xl border-2 transition ${
                      selectedImage === i
                        ? 'border-brand-600'
                        : 'border-brand-100 hover:border-brand-300'
                    }`}
                  >
                    <img src={url} alt={`${product.name} ${i + 1}`} className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-2xl border border-brand-100 bg-white p-6 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <h2 className="text-lg font-semibold text-brand-800">Opis produktu</h2>
              <Badge variant={inStock ? 'success' : 'danger'}>
                {inStock ? `${product.quantity_available} szt. w magazynie` : 'Brak w magazynie'}
              </Badge>
            </div>
            <p className="mt-4 leading-7 text-gray-600">
              {product.description || (
                <span className="italic text-gray-400">Sprzedawca nie dodał jeszcze opisu tego produktu.</span>
              )}
            </p>
          </div>

          {(product.category || product.seller) && (
            <div className="grid gap-4 sm:grid-cols-2">
              {product.category && (
                <div className="rounded-2xl border border-brand-100 bg-white p-5 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs font-medium uppercase tracking-wide text-brand-400">Kategoria</p>
                      <p className="mt-0.5 font-semibold text-brand-800">{product.category.name}</p>
                    </div>
                  </div>
                  {product.category.description && (
                    <p className="mt-3 text-sm leading-relaxed text-gray-500">{product.category.description}</p>
                  )}
                </div>
              )}

              {product.seller && (
                <div className="rounded-2xl border border-brand-100 bg-white p-5 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-600">
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-medium uppercase tracking-wide text-brand-400">Sprzedawca</p>
                      <Link to={`/profile/${product.seller.id}`} className="mt-0.5 truncate font-semibold text-brand-800">
                        {product.seller.username}
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-3">
            {[
              {
                icon: 'M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z',
                title: 'Bezpieczna płatność',
                desc: 'Szyfrowane i sprawdzone metody płatności.',
              },
              {
                icon: 'M13 10V3L4 14h7v7l9-11h-7z',
                title: 'Szybka wysyłka',
                desc: 'Wysyłka w 24h od złożenia zamówienia.',
              },
              {
                icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z',
                title: 'Zwrot 14 dni',
                desc: 'Możliwość zwrotu towaru bez podania przyczyny.',
              },
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
                {product.category?.name ?? 'Produkt'}
              </p>
              <h1 className="mt-1 text-2xl font-bold leading-snug text-white">{product.name}</h1>
            </div>

            <div className="p-6">
              <div className="flex items-end justify-between">
                <p className="text-4xl font-extrabold tracking-tight text-brand-800">
                  {formatPrice(product.price)}
                </p>
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
                    inStock
                      ? 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200'
                      : 'bg-red-50 text-red-600 ring-1 ring-red-200'
                  }`}
                >
                  <span className={`h-1.5 w-1.5 rounded-full ${inStock ? 'bg-emerald-500' : 'bg-red-400'}`} />
                  {inStock ? 'Dostępny' : 'Niedostępny'}
                </span>
              </div>

              <dl className="mt-5 divide-y divide-brand-50 rounded-xl border border-brand-100 bg-cream-50">
                {[
                  { label: 'Dostępność', value: inStock ? `${product.quantity_available} sztuk` : '-' },
                  { label: 'Dostawa', value: '24-48 h' },
                  { label: 'Zwrot', value: '14 dni' },
                  { label: 'Dodano', value: createdAt },
                  ...(product.seller ? [{ label: 'Sprzedawca', value: <Link to={`/profile/${product.seller.id}`}>{product.seller.username}</Link> }] : []),
                ].map(({ label, value }) => (
                  <div key={label} className="flex items-center justify-between px-4 py-2.5 text-sm">
                    <dt className="text-gray-500">{label}</dt>
                    <dd className="font-medium text-brand-800">{value}</dd>
                  </div>
                ))}
              </dl>

              <Button
                size="lg"
                className="mt-5 w-full"
                onClick={handleAddToCart}
                disabled={!inStock || addToCart.isPending}
                isLoading={addToCart.isPending}
              >
                {!inStock ? (
                  'Brak w magazynie'
                ) : (
                  <span className="flex items-center gap-2">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    Dodaj do koszyka
                  </span>
                )}
              </Button>

              <p className="mt-3 text-center text-xs text-gray-400">
                Kupując, akceptujesz{' '}
                <Link to="/terms" className="underline underline-offset-2 hover:text-brand-600">regulamin</Link>
                {' '}oraz{' '}
                <Link to="/returns" className="underline underline-offset-2 hover:text-brand-600">politykę zwrotów</Link>.
              </p>
            </div>
          </div>

          <div className="rounded-2xl border border-brand-100 bg-white p-5 shadow-sm">
            <h3 className="text-sm font-semibold text-brand-800">Dlaczego warto?</h3>
            <ul className="mt-3 space-y-2.5">
              {[
                'Sprawdzony sprzedawca Marketplace',
                'Możliwość śledzenia przesyłki',
                'Obsługa klienta 7 dni w tygodniu',
                'Gwarancja oryginalności produktów',
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm text-gray-600">
                  <svg className="mt-0.5 h-4 w-4 shrink-0 text-brand-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </aside>
      </div>

      <div className="flex flex-col items-start justify-between gap-4 rounded-2xl border border-brand-100 bg-white p-6 shadow-sm sm:flex-row sm:items-center">
        <div>
          <h2 className="text-base font-semibold text-brand-800">Masz pytanie o ten produkt?</h2>
          <p className="mt-1 text-sm text-gray-500">
            Skontaktuj się z naszym wsparciem — odpowiemy najszybciej jak to możliwe.
          </p>
        </div>
        <div className="flex shrink-0 gap-3">
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 rounded-xl bg-brand-800 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition hover:bg-brand-700"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            Napisz do nas
          </Link>
          <Link
            to="/products"
            className="inline-flex items-center gap-2 rounded-xl border border-brand-200 px-4 py-2.5 text-sm font-medium text-brand-700 transition hover:bg-brand-50"
          >
            Zobacz inne produkty
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
