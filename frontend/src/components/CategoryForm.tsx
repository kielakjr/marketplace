
import { useCreateCategory, useUpdateCategory } from "../hooks/useCategories";
interface CategoryFormProps {
  id?: number,
  name?: string,
  description?: string,
  isUpdate?: boolean,
  onEditSuccess?: () => void,
}

const CategoryForm = ({id, name, description, isUpdate, onEditSuccess} : CategoryFormProps) => {
  const createCategory = useCreateCategory();
  const updateCategory = useUpdateCategory();

  const create = async (data: FormData) => {
    const name = data.get("name") as string;
    const description = data.get("description") as string;
    await createCategory.mutateAsync({ name, description});
  }

  const update = async (data: FormData) => {
    if (!id) {
      return;
    }
    const name = data.get("name") as string;
    const description = data.get("description") as string;
    await updateCategory.mutateAsync({ id, name, description});
    if (onEditSuccess) {
      onEditSuccess();
    }
  }

  return (
    <form action={isUpdate ? update : create}>
      <h1 className="text-2xl font-bold text-brand-800">Dodaj Kategorie</h1>
      <input type="text" name="name" placeholder="Nazwa" className="border p-2 rounded w-full mb-4" defaultValue={name} />
      <textarea name="description" placeholder="Opis" className="border p-2 rounded w-full mb-4" defaultValue={description}></textarea>
      <button type="submit" className="bg-brand-600 text-white px-4 py-2 rounded">
        {isUpdate ? "Zaktualizuj" : "Dodaj"}
      </button>
    </form>
  )
}

export default CategoryForm
