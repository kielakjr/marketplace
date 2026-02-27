import type { CartItem as CartItemType } from '@/types/cart';
import { useUpdateCartItem, useRemoveCartItem } from '@/hooks/useCart';
import { formatPrice } from '@/utils/formatPrice';

interface CartItemProps {
  item: CartItemType;
}

const CartItem = ({ item }: CartItemProps) => {
  const updateItem = useUpdateCartItem();
  const removeItem = useRemoveCartItem();

  const product = item.product;
  if (!product) return null;

  return (
    <div className="flex items-center gap-4 rounded-xl border border-brand-200 bg-white p-4">
      <div className="h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-cream-50">
        {product.image_url ? (
          <img src={product.image_url} alt={product.name} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-brand-300 text-xs">
            Brak zdjęcia
          </div>
        )}
      </div>
      <div className="flex-1">
        <h3 className="font-medium text-gray-900">{product.name}</h3>
        <p className="text-sm text-brand-800 font-semibold">{formatPrice(product.price)}</p>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() =>
            updateItem.mutate({
              itemId: item.id,
              data: { quantity: Math.max(1, item.quantity - 1) },
            })
          }
          disabled={updateItem.isPending || item.quantity <= 1}
          className="flex h-8 w-8 items-center justify-center rounded-md border border-brand-200 text-brand-800 transition-colors hover:bg-brand-50 disabled:opacity-50"
        >
          -
        </button>
        <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
        <button
          onClick={() =>
            updateItem.mutate({
              itemId: item.id,
              data: { quantity: item.quantity + 1 },
            })
          }
          disabled={updateItem.isPending}
          className="flex h-8 w-8 items-center justify-center rounded-md border border-brand-200 text-brand-800 transition-colors hover:bg-brand-50 disabled:opacity-50"
        >
          +
        </button>
      </div>
      <p className="w-24 text-right font-semibold text-gray-900">
        {formatPrice(product.price * item.quantity)}
      </p>
      <button
        onClick={() => removeItem.mutate(item.id)}
        disabled={removeItem.isPending}
        className="text-red-400 transition-colors hover:text-red-600 disabled:opacity-50"
        aria-label="Usuń"
      >
        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      </button>
    </div>
  );
};

export default CartItem;
