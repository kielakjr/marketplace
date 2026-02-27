import { useState } from 'react';
import { useProducts } from '@/hooks/useProducts';
import ProductCard from '@/components/ProductCard';
import Spinner from '@/components/ui/Spinner';
import Input from '@/components/ui/Input';

const ProductsPage = () => {
  const [search, setSearch] = useState('');

  const { data: products, isLoading, isError } = useProducts({
    search: search || undefined,
  });

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-brand-800">Produkty</h1>

      <div className="space-y-4 rounded-2xl border border-brand-200 bg-white p-6 shadow-sm">
        <Input
          placeholder="Szukaj produktów..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {isLoading && <Spinner size="lg" />}
      {isError && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center text-red-600">
          Nie udało się załadować produktów.
        </div>
      )}
      {products && products.length === 0 && (
        <div className="rounded-xl border border-brand-200 bg-white p-12 text-center text-gray-500">
          Nie znaleziono produktów spełniających kryteria.
        </div>
      )}
      {products && products.length > 0 && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductsPage;
