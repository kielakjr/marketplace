import { useState } from 'react';
import { useProducts, useDeleteProduct } from '@/hooks/useProducts';
import { useAppSelector } from '@/store/hooks';
import { formatPrice } from '@/utils/formatPrice';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Spinner from '@/components/ui/Spinner';
import Badge from '@/components/ui/Badge';
import Modal from '@/components/ui/Modal';
import ProductForm from '@/components/ProductForm';
import type { Product } from '@/types/product';

const MyProductsPage = () => {
  const { user } = useAppSelector((state) => state.auth);
  const { data: products, isLoading } = useProducts();
  const deleteProduct = useDeleteProduct();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const myProducts = products?.filter((p) => p.user_id === user?.id) ?? [];

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setIsFormOpen(true);
  };

  const handleAdd = () => {
    setEditingProduct(null);
    setIsFormOpen(true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditingProduct(null);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Czy na pewno chcesz usunąć ten produkt?')) return;
    setDeletingId(id);
    try {
      await deleteProduct.mutateAsync(id);
    } finally {
      setDeletingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-brand-800">Moje produkty</h1>
        <Button onClick={handleAdd}>
          <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Dodaj produkt
        </Button>
      </div>

      {myProducts.length === 0 ? (
        <Card className="py-12 text-center">
          <svg className="mx-auto h-16 w-16 text-brand-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
          <p className="mt-4 text-gray-500">Nie masz jeszcze żadnych produktów.</p>
          <Button className="mt-4" onClick={handleAdd}>Dodaj pierwszy produkt</Button>
        </Card>
      ) : (
        <div className="space-y-4">
          {myProducts.map((product) => (
            <Card key={product.id} className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-cream-50">
                {product.image_url ? (
                  <img src={product.image_url} alt={product.name} className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-brand-300">
                    <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
              </div>

              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{product.name}</h3>
                <p className="mt-0.5 text-sm text-gray-500 line-clamp-1">{product.description || 'Brak opisu'}</p>
                <div className="mt-2 flex items-center gap-3">
                  <span className="text-lg font-bold text-brand-800">{formatPrice(product.price)}</span>
                  <Badge variant={product.quantity_available > 0 ? 'success' : 'danger'}>
                    {product.quantity_available > 0 ? `${product.quantity_available} szt.` : 'Brak'}
                  </Badge>
                </div>
              </div>

              <div className="flex gap-2 shrink-0">
                <Button variant="secondary" size="sm" onClick={() => handleEdit(product)}>
                  Edytuj
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDelete(product.id)}
                  isLoading={deletingId === product.id}
                >
                  Usuń
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal
        isOpen={isFormOpen}
        onClose={handleFormClose}
        title={editingProduct ? 'Edytuj produkt' : 'Dodaj nowy produkt'}
        className="max-w-2xl"
      >
        <ProductForm product={editingProduct} onSuccess={handleFormClose} />
      </Modal>
    </div>
  );
};

export default MyProductsPage;
