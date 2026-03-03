import { useCreateCategory, useUpdateCategory } from '../hooks/useCategories';

interface CategoryFormProps {
  id?: number;
  name?: string;
  description?: string;
  isUpdate?: boolean;
  onEditSuccess?: () => void;
}

const CategoryForm = ({ id, name, description, isUpdate, onEditSuccess }: CategoryFormProps) => {
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();

  const handleAction = async (data: FormData) => {
    const name = data.get('name') as string;
    const description = data.get('description') as string;

    if (isUpdate && id) {
      await updateCategory.mutateAsync({ id, name, description });
      onEditSuccess?.();
    } else {
      await createCategory.mutateAsync({ name, description });
    }
  };

  const isPending = createCategory.isPending || updateCategory.isPending;

  return (
    <form action={handleAction} className="space-y-4">
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-brand-700">Nazwa</label>
        <input
          type="text"
          name="name"
          placeholder="np. Elektronika"
          defaultValue={name}
          required
          className="w-full rounded-xl border border-brand-200 bg-cream-50 px-3 py-2.5 text-sm text-brand-800 placeholder:text-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-300"
        />
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium text-brand-700">Opis</label>
        <textarea
          name="description"
          placeholder="Krótki opis kategorii..."
          defaultValue={description}
          rows={3}
          className="w-full resize-none rounded-xl border border-brand-200 bg-cream-50 px-3 py-2.5 text-sm text-brand-800 placeholder:text-brand-300 focus:outline-none focus:ring-2 focus:ring-brand-300"
        />
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-800 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-brand-700 disabled:opacity-50"
      >
        {isPending ? (
          <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        ) : (
          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isUpdate ? 'M5 13l4 4L19 7' : 'M12 4v16m8-8H4'} />
          </svg>
        )}
        {isUpdate ? 'Zaktualizuj' : 'Dodaj kategorię'}
      </button>
    </form>
  );
};

export default CategoryForm;
