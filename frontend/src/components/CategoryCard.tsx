import type { Category } from '@/types/category';
import { useDeleteCategory } from '../hooks/useCategories';
import CategoryForm from './CategoryForm';
import { useState } from 'react';

const CategoryCard = ({ category }: { category: Category }) => {
  const deleteCategory = useDeleteCategory();
  const [isEditing, setIsEditing] = useState(false);

  return (
    <li className="overflow-hidden rounded-2xl border border-brand-100 bg-white shadow-sm transition hover:shadow-md">
      {!isEditing ? (
        <>
          <div className="flex items-start justify-between border-b border-brand-50 px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-brand-50 text-brand-500">
                <svg className="h-4.5 w-4.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                </svg>
              </div>
              <h2 className="font-semibold text-brand-800">{category.name}</h2>
            </div>
            <span className="ml-2 shrink-0 rounded-full bg-cream-100 px-2.5 py-0.5 text-xs font-medium text-brand-600 ring-1 ring-brand-200">
              #{category.id}
            </span>
          </div>

          <div className="px-5 py-4">
            <p className="text-sm leading-relaxed text-gray-500">
              {category.description || <span className="italic text-gray-300">Brak opisu.</span>}
            </p>
          </div>

          <div className="flex gap-2 border-t border-brand-50 px-5 py-3">
            <button
              onClick={() => setIsEditing(true)}
              className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-brand-800 px-3 py-2 text-sm font-medium text-white transition hover:bg-brand-700"
            >
              <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Edytuj
            </button>
            <button
              onClick={() => deleteCategory.mutateAsync(category.id)}
              disabled={deleteCategory.isPending}
              className="flex items-center justify-center gap-1.5 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-100 disabled:opacity-50"
            >
              <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              Usuń
            </button>
          </div>
        </>
      ) : (
        <div className="p-5">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm font-semibold text-brand-800">Edytuj kategorię</p>
            <button
              onClick={() => setIsEditing(false)}
              className="flex h-7 w-7 items-center justify-center rounded-lg text-gray-400 transition hover:bg-brand-50 hover:text-brand-700"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <CategoryForm
            id={category.id}
            name={category.name}
            description={category.description}
            isUpdate
            onEditSuccess={() => setIsEditing(false)}
          />
        </div>
      )}
    </li>
  );
};

export default CategoryCard;
