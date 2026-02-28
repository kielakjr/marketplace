import { useCategories } from "@/hooks/useCategories"
import CategoryCard from "@/components/CategoryCard";
import CategoryForm from "@/components/CategoryForm";

const AdminCategories = () => {
  const {data: categories, isLoading, isError} = useCategories();

  if (isLoading) return <div>Ładowanie...</div>
  if (isError) return <div>Nie udało się załadować kategorii.</div>
  return (
    <div>
      <h1 className="text-3xl font-bold text-brand-800">Kategorie</h1>
      <ul className="mt-6 space-y-4">
        {categories?.map((category) => (
          <CategoryCard category={category} key={category.id}/>
        ))}
      </ul>
      <div>
        <CategoryForm />
      </div>
    </div>
  )
}

export default AdminCategories
