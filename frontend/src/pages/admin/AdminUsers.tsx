  import { useState } from 'react';
  import { useUsers } from '@/hooks/useUsers';
  import { useDebounce } from '@/hooks/useDebounce';
  import UserCard from '@/components/UserCard';
  import UserEditModal from '@/components/UserEditModal';
  import Spinner from '@/components/ui/Spinner';
  import Button from '@/components/ui/Button';
  import type { User } from '@/types/user';

  const AdminUsers = () => {
    const [query, setQuery] = useState('');
    const [page, setPage] = useState(1);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const debouncedQuery = useDebounce(query, 500);
    const { data: usersData, isLoading, isError } = useUsers({
      page,
      limit: 10,
      username: debouncedQuery,
    });

    const filteredUsers = usersData?.data || [];
    const pagination = usersData?.pagination;

    return (
      <div className="space-y-6">
        <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-brand-800">Użytkownicy</h1>
            <p className="mt-1 text-sm text-gray-600">Szybko wyszukuj konta i zarządzaj rolami.</p>
          </div>
          <div className="flex gap-2">
            <input
              value={query}
              onChange={(e) => { setQuery(e.target.value); setPage(1); }}
              placeholder="Szukaj po nazwie"
              className="w-full rounded-xl border border-brand-200 bg-white px-4 py-2 text-sm text-brand-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-400/40 md:w-72"
            />
            <Button variant="secondary" onClick={() => { setQuery(''); setPage(1); }}>Wyczyść</Button>
          </div>
        </header>

        {isLoading && (
          <div className="flex min-h-[60vh] items-center justify-center">
            <Spinner size="lg" />
          </div>
        )}

        {isError && (
          <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 rounded-2xl border border-red-100 bg-red-50 p-12 text-center">
            <p className="text-base font-semibold text-red-700">Nie udało się załadować użytkowników.</p>
          </div>
        )}

        {!isLoading && !isError && filteredUsers.length === 0 ? (
          <div className="rounded-2xl border border-brand-100 bg-cream-50 p-8 text-center text-sm text-gray-600">
            Brak użytkowników spełniających kryteria wyszukiwania.
          </div>
        ) : (
          <>
            <div className="grid gap-4 lg:grid-cols-2">
              {filteredUsers.map((user) => (
                <UserCard
                  key={user.id}
                  user={user}
                  onEdit={() => setEditingUser(user)}
                />
              ))}
            </div>

            {pagination && pagination.totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 pt-4">
                <Button
                  variant="secondary"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => p - 1)}
                >
                  Poprzednia
                </Button>
                <span className="text-sm text-gray-600">
                  {page} / {pagination.totalPages}
                </span>
                <Button
                  variant="secondary"
                  disabled={page >= pagination.totalPages}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Następna
                </Button>
              </div>
            )}
          </>
        )}

        {editingUser && (
          <UserEditModal
            user={editingUser}
            onClose={() => setEditingUser(null)}
          />
        )}
      </div>
    );
  };

  export default AdminUsers;
