import { useMemo, useState } from 'react';
import { useUsers } from '@/hooks/useUsers';
import UserCard from '@/components/UserCard';
import Spinner from '@/components/ui/Spinner';
import Button from '@/components/ui/Button';

const AdminUsers = () => {
  const { data: users, isLoading, isError } = useUsers();
  const [query, setQuery] = useState('');

  const filteredUsers = useMemo(() => {
    if (!users) return [];
    const lower = query.toLowerCase();
    return users.filter((user) =>
      [user.username, user.email, user.role].some((value) => value.toLowerCase().includes(lower))
    );
  }, [users, query]);

  if (isLoading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>;
  if (isError) return <div className="text-center text-red-600">Nie udało się załadować użytkowników.</div>;

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
            placeholder="Szukaj po nazwie, mailu, roli..."
            className="w-full rounded-xl border border-brand-200 bg-white px-4 py-2 text-sm text-brand-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-400/40 md:w-72"
          />
          <Button variant="secondary" onClick={() => setQuery('')}>Wyczyść</Button>
        </div>
      </header>

      {filteredUsers.length === 0 ? (
        <div className="rounded-2xl border border-brand-100 bg-cream-50 p-8 text-center text-sm text-gray-600">
          Brak użytkowników spełniających kryteria wyszukiwania.
        </div>
      ) : (
        <div className="grid gap-4 lg:grid-cols-2">
          {filteredUsers.map((user) => (
            <UserCard
              key={user.id}
              user={user}
              onChangeRole={() => {}}
              onEdit={() => {}}
              onDelete={() => {}}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminUsers;
