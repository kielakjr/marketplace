import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { usersApi } from '@/api/usersApi';
import type { User, UsersFilters } from '@/types/user';

export const userKeys = {
  all: ['users'] as const,
  detail: (id: string) => [...userKeys.all, id] as const,
  me: ['users', 'me'] as const,
};

export function useUsers(filters?: Partial<UsersFilters>) {
  return useQuery({
    queryKey: [...userKeys.all, filters],
    queryFn: () => usersApi.getAll(filters),
  });
}

export function useUser(id: string) {
  return useQuery({
    queryKey: userKeys.detail(id),
    queryFn: () => usersApi.getById(id),
    enabled: !!id,
  });
}

export function useCurrentUser() {
  return useQuery({
    queryKey: userKeys.me,
    queryFn: () => usersApi.getMe(),
  });
}

export function useUserToggleRole(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => usersApi.toggleRole(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: userKeys.all });
    },
  });
}

export function useUserDelete(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => usersApi.delete(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: userKeys.all });
    },
  });
}

export function useUserUpdate(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Partial<Omit<User, 'id' | 'createdAt' | 'updatedAt'>>) =>
      usersApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: userKeys.all });
    },
  });
}

export function useUserCreate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<User, 'id' | 'createdAt' | 'updatedAt'>) =>
      usersApi.create(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.all });
    },
  });
}
