import { useCategories, useCreateCategory } from "@/hooks/useCategories"

const AdminCategories = () => {
  const {data: categories, isLoading, isError} = useCategories()
  const createCategory = useCreateCategory();

  const create = async (data: FormData) => {
    const name = data.get("name") as string;
    const description = data.get("description") as string;
    await createCategory.mutateAsync({ name, description});
  }

  if (isLoading) return <div>Ładowanie...</div>
  if (isError) return <div>Nie udało się załadować kategorii.</div>
  return (
    <div>
      <h1 className="text-3xl font-bold text-brand-800">Kategorie</h1>
      <ul className="mt-6 space-y-4">
        {categories?.map((category) => (
          <li key={category.id} className="rounded-lg border border-gray-200 bg-white p-4">
            <h2 className="text-xl font-semibold text-gray-800">{category.name}</h2>
            <p className="mt-1 text-sm text-gray-500">{category.description}</p>
          </li>
        ))}
      </ul>
      <div>
        <h2>Dodaj Kategorie</h2>
        <form action={create}>
          <h1 className="text-2xl font-bold text-brand-800">Dodaj Kategorie</h1>
          <input type="text" name="name" placeholder="Nazwa" className="border p-2 rounded w-full mb-4" />
          <textarea name="description" placeholder="Opis" className="border p-2 rounded w-full mb-4"></textarea>
          <button type="submit" className="bg-brand-600 text-white px-4 py-2 rounded">
            Dodaj
          </button>
        </form>
      </div>
    </div>
  )
}

export default AdminCategories
