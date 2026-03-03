import { useState } from 'react';
import { useUsers } from '@/hooks/useUsers';
import { useDebounce } from '@/hooks/useDebounce';
import UserCard from '@/components/UserCard';
import Spinner from '@/components/ui/Spinner';
import Button from '@/components/ui/Button';

const AdminUsers = () => {
  const [query, setQuery] = useState('');
  const debouncedQuery = useDebounce(query, 500);
  const { data: usersData, isLoading, isError } = useUsers({ page: 1, limit: 4, username: debouncedQuery });

  const filteredUsers = usersData?.data || [];

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
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Szukaj po nazwie"
            className="w-full rounded-xl border border-brand-200 bg-white px-4 py-2 text-sm text-brand-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-400/40 md:w-72"
          />
          <Button variant="secondary" onClick={() => setQuery('')}>Wyczyść</Button>
        </div>
      </header>

      {isLoading && (
        <div className="flex min-h-[60vh] items-center justify-center">
          <Spinner size="lg" />
        </div>
      )}

      {isError && (
        <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 rounded-2xl border border-red-100 bg-red-50 p-12 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
            <svg className="h-7 w-7 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
            </svg>
          </div>
          <p className="text-base font-semibold text-red-700">Nie udało się załadować użytkowników.</p>
        </div>
      )}

      {!isLoading && !isError && filteredUsers.length === 0 ? (
        <div className="rounded-2xl border border-brand-100 bg-cream-50 p-8 text-center text-sm text-gray-600">
          Brak użytkowników spełniających kryteria wyszukiwania.
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {filteredUsers.map((user) => (
            <UserCard
              key={user.id}
              user={user}
              onEdit={() => {}}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
