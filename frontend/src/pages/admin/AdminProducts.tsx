import { useState } from 'react';
import { useAdminProducts, useDeleteProduct } from '@/hooks/useProducts';
import { useDebounce } from '@/hooks/useDebounce';
import { formatPrice } from '@/utils/formatPrice';
import { Link } from 'react-router';
import Spinner from '@/components/ui/Spinner';
import Button from '@/components/ui/Button';

const AdminProducts = () => {
  const [query, setQuery] = useState('');
  const [page, setPage] = useState(1);
  const debouncedQuery = useDebounce(query, 500);
  const { data, isLoading, isError } = useAdminProducts({
    name: debouncedQuery || undefined,
    page,
    limit: 15,
  });
  const deleteMutation = useDeleteProduct();

  const products = data?.data || [];
  const pagination = data?.pagination;

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-brand-800">Produkty</h1>
          <p className="mt-1 text-sm text-gray-600">Przeglądaj i zarządzaj wszystkimi produktami na platformie.</p>
        </div>
        <input
          value={query}
          onChange={(e) => { setQuery(e.target.value); setPage(1); }}
          placeholder="Szukaj produktów..."
          className="w-full rounded-xl border border-brand-200 bg-white px-4 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-400/40 md:w-72"
        />
      </header>

      {isLoading && (
        <div className="flex min-h-[40vh] items-center justify-center"><Spinner size="lg" /></div>
      )}

      {isError && (
        <div className="rounded-2xl border border-red-100 bg-red-50 p-8 text-center text-sm text-red-700">
          Nie udało się załadować produktów.
        </div>
      )}

      {!isLoading && !isError && (
        <div className="overflow-x-auto rounded-2xl border border-brand-300 bg-white shadow-sm">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-brand-400 bg-cream-50">
              <tr>
                <th className="px-4 py-3 font-medium text-gray-600 bg-brand-300">Nazwa</th>
                <th className="px-4 py-3 font-medium text-gray-600 bg-brand-300">Sprzedawca</th>
                <th className="px-4 py-3 font-medium text-gray-600 bg-brand-300">Cena</th>
                <th className="px-4 py-3 font-medium text-gray-600 bg-brand-300">Ilość</th>
                <th className="px-4 py-3 font-medium text-gray-600 bg-brand-300">Akcje</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-50">
              {products.map((product: any) => (
                <tr key={product.id} className="hover:bg-cream-50/50">
                  <td className="px-4 py-3">
                    <Link to={`/products/${product.id}`} className="font-medium text-brand-800 hover:underline">
                      {product.name}
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-gray-600">
                    {product.seller?.username || '—'}
                  </td>
                  <td className="px-4 py-3 font-medium text-brand-800">
                    {formatPrice(parseFloat(product.price))}
                  </td>
                  <td className="px-4 py-3">
                    <span className={product.quantity_available === 0 ? 'text-red-600 font-medium' : 'text-gray-600'}>
                      {product.quantity_available}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <button
                      onClick={() => {
                        if (confirm('Czy na pewno chcesz usunąć ten produkt?')) {
                          deleteMutation.mutate(product.id);
                        }
                      }}
                      className="rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-100"
                    >
                      Usuń
                    </button>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                    Brak produktów do wyświetlenia.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {pagination && pagination.totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 pt-2">
          <Button variant="secondary" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>
            Poprzednia
          </Button>
          <span className="text-sm text-gray-600">{page} / {pagination.totalPages}</span>
          <Button variant="secondary" disabled={page >= pagination.totalPages} onClick={() => setPage((p) => p + 1)}>
            Następna
          </Button>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;
