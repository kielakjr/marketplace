import { useState } from 'react';
import { useProducts } from '@/hooks/useProducts';
import ProductCard from '@/components/ProductCard';
import Spinner from '@/components/ui/Spinner';
import Input from '@/components/ui/Input';

const ProductsPage = () => {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [minPrice, setMinPrice] = useState<number | undefined>();
  const [maxPrice, setMaxPrice] = useState<number | undefined>();
  const [sortBy, setSortBy] = useState<'price' | 'createdAt' | undefined>(undefined);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | undefined>(undefined);

  const { data: products, isLoading, isError } = useProducts({
    name: search || undefined,
    minPrice,
    maxPrice,
    sortBy,
    sortOrder,
  });

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-brand-800">Produkty</h1>

      <div className="space-y-4 rounded-2xl border border-brand-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap gap-4">
          <Input
            placeholder="Szukaj produktów..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            className="border rounded px-3 py-2"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">Wszystkie kategorie</option>
            <option value="electronics">Elektronika</option>
            <option value="clothing">Odzież</option>
            <option value="books">Książki</option>
          </select>

          <Input
            type="number"
            placeholder="Min cena"
            value={minPrice ?? ''}
            onChange={(e) => setMinPrice(e.target.value ? Number(e.target.value) : undefined)}
          />

          <Input
            type="number"
            placeholder="Max cena"
            value={maxPrice ?? ''}
            onChange={(e) => setMaxPrice(e.target.value ? Number(e.target.value) : undefined)}
          />

          <select
            className="border rounded px-3 py-2"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
          >
            <option value="asc">Cena rosnąco</option>
            <option value="desc">Cena malejąco</option>
          </select>
        </div>
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
