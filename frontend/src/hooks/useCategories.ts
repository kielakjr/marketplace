import { useQuery } from '@tanstack/react-query';
import { categoriesApi } from '@/api/categoriesApi';

export const categoryKeys = {
  all: ['categories'] as const,
  detail: (id: number) => [...categoryKeys.all, id] as const,
};

export function useCategories() {
  return useQuery({
    queryKey: categoryKeys.all,
    queryFn: categoriesApi.getAll,
    staleTime: 1000 * 60 * 10,
  });
}
