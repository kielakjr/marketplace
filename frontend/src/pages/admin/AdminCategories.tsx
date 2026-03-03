import { useCategories } from '@/hooks/useCategories';
import CategoryCard from '@/components/CategoryCard';
import CategoryForm from '@/components/CategoryForm';
import Spinner from '@/components/ui/Spinner';

const AdminCategories = () => {
  const { data: categories, isLoading, isError } = useCategories();

  if (isLoading)
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Spinner size="lg" />
      </div>
    );

  if (isError)
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 rounded-2xl border border-red-100 bg-red-50 p-12 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
          <svg className="h-7 w-7 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
        </div>
        <p className="text-base font-semibold text-red-700">Nie udało się załadować kategorii.</p>
      </div>
    );

  return (
    <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px]">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-brand-800">Kategorie</h1>
          <p className="mt-1 text-sm text-gray-500">Zarządzaj kategoriami i utrzymuj porządek w ofercie.</p>
        </div>

        {categories?.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-brand-100 bg-cream-50 p-12 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50 text-brand-400">
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
            </div>
            <p className="text-sm text-gray-500">Brak kategorii. Dodaj pierwszą kategorię po prawej stronie.</p>
          </div>
        ) : (
          <ul className="grid gap-4 md:grid-cols-2">
            {categories?.map((category) => (
              <CategoryCard category={category} key={category.id} />
            ))}
          </ul>
        )}
      </div>

      <aside className="lg:sticky lg:top-8 lg:self-start">
        <div className="overflow-hidden rounded-3xl border border-brand-200 bg-white shadow-md">
          <div className="bg-brand-800 px-6 py-4">
            <p className="text-xs font-semibold uppercase tracking-widest text-brand-300">Panel admina</p>
            <h2 className="mt-1 text-xl font-bold text-white">Nowa kategoria</h2>
          </div>
          <div className="p-6">
            <p className="text-sm text-gray-500">Wprowadź nazwę i opis, aby utworzyć nową kategorię.</p>
            <div className="mt-4">
              <CategoryForm />
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
};

export default AdminCategories;
