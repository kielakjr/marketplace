import { useCategories } from '@/hooks/useCategories';
import CategoryCard from '@/components/CategoryCard';
import CategoryForm from '@/components/CategoryForm';
import Spinner from '@/components/ui/Spinner';

const AdminCategories = () => {
  const { data: categories, isLoading, isError } = useCategories();

  if (isLoading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>;
  if (isError) return <div className="text-center text-red-600">Nie udało się załadować kategorii.</div>;

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-brand-800">Kategorie</h1>
          <p className="mt-1 text-sm text-gray-600">Zarządzaj kategoriami i utrzymuj porządek w ofercie.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <ul>
          {categories?.map((category) => (
            <CategoryCard category={category} key={category.id} />
          ))}
          </ul>
        </div>

        {categories?.length === 0 && (
          <div className="rounded-2xl border border-brand-100 bg-cream-50 p-6 text-sm text-gray-600">
            Brak kategorii. Dodaj pierwszą kategorię po prawej stronie.
          </div>
        )}
      </div>

      <div className="rounded-3xl border border-brand-100 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-brand-800">Nowa kategoria</h2>
        <p className="mt-1 text-sm text-gray-600">Wprowadź nazwę i opis, aby ją utworzyć.</p>
        <div className="mt-4">
          <CategoryForm />
        </div>
      </div>
    </div>
  );
};

export default AdminCategories;
