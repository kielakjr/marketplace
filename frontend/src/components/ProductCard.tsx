import { Link } from 'react-router';
import type { Product } from '@/types/product';
import { useAddToCart } from '@/hooks/useCart';
import { useAppSelector } from '@/store/hooks';
import { formatPrice } from '@/utils/formatPrice';

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const addToCart = useAddToCart();

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      window.location.href = '/login';
      return;
    }
    addToCart.mutate({ product_id: product.id, quantity: 1 });
  };

  return (
    <div className="group overflow-hidden rounded-2xl border border-brand-200 bg-white shadow-sm transition-all hover:shadow-md hover:border-brand-400">
      <Link to={`/products/${product.id}`}>
        <div className="aspect-square overflow-hidden bg-cream-50">
          {product.image_url ? (
            <img
              src={product.image_url}
              alt={product.name}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-brand-300">
              <svg className="h-16 w-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
        </div>
      </Link>
      <div className="p-4">
        <Link to={`/products/${product.id}`}>
          <h3 className="truncate text-sm font-semibold text-gray-900 transition-colors hover:text-brand-800">
            {product.name}
          </h3>
        </Link>
        <p className="mt-1.5 text-lg font-bold text-brand-800">{formatPrice(product.price)}</p>
        <p className="mt-1 text-xs text-gray-500">
          {product.quantity_available > 0
            ? `Dostępnych: ${product.quantity_available}`
            : 'Brak w magazynie'}
        </p>
        <button
          onClick={handleAddToCart}
          disabled={product.quantity_available === 0 || addToCart.isPending}
          className="mt-3 w-full rounded-lg bg-brand-800 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-700 disabled:cursor-not-allowed disabled:bg-gray-300"
        >
          {addToCart.isPending ? 'Dodawanie...' : 'Dodaj do koszyka'}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
