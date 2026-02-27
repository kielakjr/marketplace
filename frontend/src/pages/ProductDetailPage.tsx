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
    <div className="space-y-6">
      <Link to="/products" className="inline-flex items-center text-sm font-medium text-brand-500 hover:text-brand-800">
        ← Wróć do produktów
      </Link>

      <div className="grid gap-8 md:grid-cols-2">
        <div className="aspect-square overflow-hidden rounded-2xl border border-brand-200 bg-cream-50">
          {product.image_url ? (
            <img src={product.image_url} alt={product.name} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-brand-300">
              <svg className="h-24 w-24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-brand-800">{product.name}</h1>
            <p className="mt-3 text-4xl font-bold text-brand-800">
              {formatPrice(product.price)}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Badge variant={product.quantity_available > 0 ? 'success' : 'danger'}>
              {product.quantity_available > 0
                ? `Dostępnych: ${product.quantity_available}`
                : 'Brak w magazynie'}
            </Badge>
          </div>

          {product.description && (
            <div>
              <h2 className="text-sm font-semibold text-brand-800">Opis</h2>
              <p className="mt-2 leading-relaxed text-gray-600">{product.description}</p>
            </div>
          )}

          <Button
            size="lg"
            className="w-full"
            onClick={handleAddToCart}
            disabled={product.quantity_available === 0 || addToCart.isPending}
            isLoading={addToCart.isPending}
          >
            {product.quantity_available === 0 ? 'Brak w magazynie' : 'Dodaj do koszyka'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailPage;
