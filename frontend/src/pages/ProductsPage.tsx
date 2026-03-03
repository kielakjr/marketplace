import { useState } from 'react';
import { useProducts } from '@/hooks/useProducts';
import { useCategories } from '@/hooks/useCategories';
import { useDebounce } from '@/hooks/useDebounce';
import ProductCard from '@/components/ProductCard';
import Spinner from '@/components/ui/Spinner';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';

const ProductsPage = () => {
  const [search, setSearch] = useState('');
  const [categoryId, setCategoryId] = useState<number | undefined>(undefined);
  const [minPrice, setMinPrice] = useState<number | undefined>();
  const [maxPrice, setMaxPrice] = useState<number | undefined>();
  const [sortBy, setSortBy] = useState<'price' | 'createdAt' | undefined>(undefined);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [showFilters, setShowFilters] = useState(false);

  const debouncedSearch = useDebounce(search, 500);
  const debouncedMinPrice = useDebounce(minPrice, 500);
  const debouncedMaxPrice = useDebounce(maxPrice, 500);

  const { data: productsData, isLoading, isError } = useProducts({
    name: debouncedSearch || undefined,
    categoryId,
    minPrice: debouncedMinPrice,
    maxPrice: debouncedMaxPrice,
    sortBy,
    sortOrder,
  });

  const products = productsData?.data || [];

  const { data: categories, isLoading: isCategoriesLoading, isError: isCategoriesError } = useCategories();

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-3xl font-bold text-brand-800">Produkty</h1>
      </div>

      <div className="space-y-4 rounded-2xl border border-brand-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap gap-4">
          <div className="flex-1 min-w-60">
            <Input
              placeholder="Szukaj produktów..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <div className="flex items-center justify-center gap-2 w-30">
            <button
              type="button"
              onClick={() => setShowFilters((prev) => !prev)}
              className="rounded-xl border border-brand-200 bg-brand-50 px-4 py-2 text-sm font-medium text-brand-800 transition hover:bg-brand-100 w-full"
            >
              {showFilters ? 'Zwiń filtry' : 'Rozwiń filtry'}
            </button>
          </div>
        </div>

        {showFilters && (
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex gap-2">
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
            </div>

            <div className="flex items-center gap-2">
              {isCategoriesLoading && <Spinner size="sm" />}
              {isCategoriesError && (
                <div className="text-sm text-red-600">Nie udało się załadować kategorii</div>
              )}
              {!isCategoriesLoading && !isCategoriesError && (
                <Select
                  placeholder="Kategoria"
                  value={categoryId ?? ''}
                  onChange={(e) => setCategoryId(e.target.value ? Number(e.target.value) : undefined)}
                  disabled={isCategoriesLoading || isCategoriesError}
                  options={[
                    { value: '', label: 'Wszystkie kategorie' },
                    ...(categories?.map((cat) => ({ value: cat.id, label: cat.name })) || []),
                  ]}
                />
              )}
            </div>

            <Select
              placeholder="Sortuj według"
              value={sortBy ?? ''}
              onChange={(e) => setSortBy(e.target.value ? (e.target.value as 'price' | 'createdAt') : undefined)}
              options={[
                { value: '', label: 'Brak sortowania' },
                { value: 'price', label: 'Cena' },
                { value: 'createdAt', label: 'Data dodania' },
              ]}
            />

            <Select
              placeholder="Kierunek sortowania"
              value={sortBy ? sortOrder : ''}
              onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
              options={[
                { value: 'asc', label: 'Rosnąco' },
                { value: 'desc', label: 'Malejąco' },
              ]}
              disabled={!sortBy}
            />
          </div>
        )}
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
