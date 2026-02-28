import type { Category } from '@/types/category';
import { useDeleteCategory } from '../hooks/useCategories';
import CategoryForm from './CategoryForm';
import { useState } from 'react';

const CategoryCard = ({category}: {category: Category}) => {
  const deleteCategory = useDeleteCategory();
  const [isEditing, setIsEditing] = useState(false);

  return (
    <li key={category.id} className="rounded-lg border border-gray-200 bg-white p-4">
      <h2 className="text-xl font-semibold text-gray-800">{category.name}</h2>
      <p className="mt-1 text-sm text-gray-500">{category.description}</p>
      <button onClick={() => deleteCategory.mutateAsync(category.id)} className="mt-2 bg-red-500 text-white px-2 py-1 rounded text-sm">
        Usuń
      </button>
      <button onClick={() => setIsEditing(true)} className="ml-2 bg-blue-500 text-white px-2 py-1 rounded text-sm">
        Edytuj
      </button>
      {isEditing && <CategoryForm id={category.id} name={category.name} description={category.description} isUpdate onEditSuccess={() => setIsEditing(false)}/>}
    </li>
  )
}

export default CategoryCard
