import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
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

export function useCreateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ name, description}: { name: string, description? : string}) => categoriesApi.create(name, description),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.all })
    }
  });
}

export function useDeleteCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => categoriesApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.all })
    }
  });
}

export function useUpdateCategory() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, name, description}: { id: number, name?: string, description? : string}) => categoriesApi.update(id, name, description),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: categoryKeys.all })
    }
  });
}
