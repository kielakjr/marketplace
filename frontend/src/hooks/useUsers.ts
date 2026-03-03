import { useQuery } from '@tanstack/react-query';
import { usersApi } from '@/api/usersApi';
import type { UsersFilters } from '@/types/user';

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
