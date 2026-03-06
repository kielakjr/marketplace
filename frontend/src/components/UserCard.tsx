import type { User } from '@/types/user';
import { useUserToggleRole, useUserDelete } from '@/hooks/useUsers';
import Avatar from '@/components/ui/Avatar';
import { Link } from 'react-router';

interface Props {
  user: User;
  onEdit: (id: string) => void;
}

export default function UserCard({ user, onEdit }: Props) {
  const toggleRoleMutation = useUserToggleRole(user.id);
  const deleteMutation = useUserDelete(user.id);
  const isAdmin = user.role === 'ADMIN';

  const createdAt = new Date(user.createdAt).toLocaleDateString('pl-PL', {
    day: 'numeric', month: 'long', year: 'numeric',
  });
  const updatedAt = new Date(user.updatedAt).toLocaleDateString('pl-PL', {
    day: 'numeric', month: 'long', year: 'numeric',
  });

  return (
    <div className="overflow-hidden rounded-2xl border border-brand-100 bg-white shadow-sm transition hover:shadow-md">
      <div className="flex items-center justify-between border-b border-brand-50 px-5 py-4">
        <div className="flex items-center gap-3">
          <Avatar username={user.username} size={12} />
          <div className="min-w-0">
            <Link to={`/profile/${user.id}`} className="truncate font-semibold text-brand-800">{user.username}</Link>
            <p className="truncate text-sm text-gray-500">{user.email}</p>
          </div>
        </div>
        <span className={`ml-3 shrink-0 rounded-full px-3 py-1 text-xs font-semibold ring-1 ${
          isAdmin
            ? 'bg-brand-800 text-white ring-brand-700'
            : 'bg-cream-100 text-brand-700 ring-brand-200'
        }`}>
          {user.role}
        </span>
      </div>

      <dl className="divide-y divide-brand-50 bg-cream-50 px-5">
        <div className="flex items-center justify-between py-2.5 text-sm">
          <dt className="text-gray-500">ID</dt>
          <dd className="font-mono text-xs font-medium text-brand-800">{user.id.slice(0, 8)}…</dd>
        </div>
        <div className="flex items-center justify-between py-2.5 text-sm">
          <dt className="text-gray-500">Utworzono</dt>
          <dd className="font-medium text-brand-800">{createdAt}</dd>
        </div>
        <div className="flex items-center justify-between py-2.5 text-sm">
          <dt className="text-gray-500">Zaktualizowano</dt>
          <dd className="font-medium text-brand-800">{updatedAt}</dd>
        </div>
      </dl>

      <div className="flex gap-2 px-5 py-4">
        <button
          onClick={() => onEdit(user.id)}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-brand-800 px-3 py-2 text-sm font-medium text-white transition hover:bg-brand-700"
        >
          <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
          Edytuj
        </button>
        <button
          onClick={() => toggleRoleMutation.mutate()}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-brand-200 bg-white px-3 py-2 text-sm font-medium text-brand-700 transition hover:bg-brand-50"
        >
          <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
          </svg>
          Rola
        </button>
        <button
          onClick={() => deleteMutation.mutate()}
          className="flex items-center justify-center gap-1.5 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-100"
        >
          <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          Usuń
        </button>
      </div>
    </div>
  );
}
