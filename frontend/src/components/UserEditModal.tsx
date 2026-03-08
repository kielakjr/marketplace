import { useState, useEffect } from 'react';
  import { useUserUpdate } from '@/hooks/useUsers';
  import type { User } from '@/types/user';
  import Button from '@/components/ui/Button';

  interface Props {
    user: User;
    onClose: () => void;
  }

  export default function UserEditModal({ user, onClose }: Props) {
    const [username, setUsername] = useState(user.username);
    const [email, setEmail] = useState(user.email);
    const [role, setRole] = useState(user.role);
    const updateMutation = useUserUpdate(user.id);

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      updateMutation.mutate(
        { username, email, role },
        { onSuccess: () => onClose() }
      );
    };

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
        <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
          <h2 className="text-lg font-semibold text-brand-800">Edytuj użytkownika</h2>
          <form onSubmit={handleSubmit} className="mt-4 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Nazwa użytkownika</label>
              <input
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="mt-1 w-full rounded-xl border border-brand-200 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400/40"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 w-full rounded-xl border border-brand-200 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400/40"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Rola</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as 'USER' | 'ADMIN')}
                className="mt-1 w-full rounded-xl border border-brand-200 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400/40"
              >
                <option value="USER">USER</option>
                <option value="ADMIN">ADMIN</option>
              </select>
            </div>

            {updateMutation.isError && (
              <p className="text-sm text-red-600">Nie udało się zaktualizować użytkownika.</p>
            )}

            <div className="flex gap-2 pt-2">
              <Button type="submit" disabled={updateMutation.isPending}>
                {updateMutation.isPending ? 'Zapisuję...' : 'Zapisz'}
              </Button>
              <Button variant="secondary" type="button" onClick={onClose}>
                Anuluj
              </Button>
            </div>
          </form>
        </div>
      </div>
    );
  }
