import { useMemo, useState, useEffect, use } from 'react';
import { useUserProducts, useDeleteProduct } from '@/hooks/useProducts';
import { useAppSelector } from '@/store/hooks';
import { formatPrice } from '@/utils/formatPrice';
import Button from '@/components/ui/Button';
import Card from '@/components/ui/Card';
import Spinner from '@/components/ui/Spinner';
import Badge from '@/components/ui/Badge';
import Modal from '@/components/ui/Modal';
import ProductForm from '@/components/ProductForm';
import type { Product } from '@/types/product';
import Pagination from '@/components/Pagination';

const MyProductsPage = () => {
  const [page, setPage] = useState(1);
  const { user } = useAppSelector((state) => state.auth);
  const { data: products, isLoading } = useUserProducts(user!.id, {
    limit: 3,
    page
  });
  const deleteProduct = useDeleteProduct();

  const myProducts = products?.data

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const [stockFilter, setStockFilter] = useState<'all' | 'in' | 'out'>('all');

  useEffect(() => {
    setPage(1);
  }, [query, stockFilter]);

  const filteredProducts = useMemo(() => {
    if (!myProducts) return [];
    const lower = query.toLowerCase();
    return myProducts.filter((product) => {
      const matchesQuery = [product.name, product.description ?? '']
        .some((value) => value.toLowerCase().includes(lower));
      const matchesStock =
        stockFilter === 'all' ||
        (stockFilter === 'in' && product.quantity_available > 0) ||
        (stockFilter === 'out' && product.quantity_available === 0);

      return matchesQuery && matchesStock;
    });
  }, [myProducts, query, stockFilter]);

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
      <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-brand-800">Moje produkty</h1>
          <p className="mt-1 text-sm text-gray-600">Dodawaj, edytuj i kontroluj dostępność swoich ofert.</p>
        </div>
        <Button onClick={handleAdd}>
          <svg className="mr-2 h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Dodaj produkt
        </Button>
      </header>

      <div className="flex flex-col gap-3 rounded-2xl border border-brand-100 bg-white p-4 shadow-sm md:flex-row md:items-center md:justify-between">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Szukaj po nazwie lub opisie..."
          className="w-full rounded-xl border border-brand-200 bg-white px-4 py-2 text-sm text-brand-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-400/40 md:max-w-md"
        />
        <div className="flex gap-2">
          {[
            { value: 'all', label: 'Wszystkie' },
            { value: 'in', label: 'Dostępne' },
            { value: 'out', label: 'Brak w magazynie' },
          ].map((filter) => (
            <button
              key={filter.value}
              onClick={() => setStockFilter(filter.value as 'all' | 'in' | 'out')}
              className={`rounded-xl px-4 py-2 text-xs font-semibold transition ${
                stockFilter === filter.value
                  ? 'bg-brand-800 text-white'
                  : 'bg-cream-100 text-brand-800 hover:bg-cream-200'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <Card className="py-12 text-center">
          <svg className="mx-auto h-16 w-16 text-brand-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
          <p className="mt-4 text-gray-500">Nie masz jeszcze żadnych produktów.</p>
          <Button className="mt-4" onClick={handleAdd}>Dodaj pierwszy produkt</Button>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredProducts.map((product) => (
            <Card key={product.id} className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-cream-50">
                {product.image_urls[0] ? (
                  <img src={product.image_urls[0]} alt={product.name} className="h-full w-full object-cover" />
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
          <Pagination totalPages={products!.pagination.totalPages} onPageChange={newpage => setPage(newpage)} currentPage={page}/>
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
