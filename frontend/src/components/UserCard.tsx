import type { User } from "@/types/user";

interface Props {
  user: User;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onChangeRole: (id: string) => void;
}

export default function UserCard({ user, onEdit, onDelete, onChangeRole }: Props) {
  const isAdmin = user.role === "ADMIN";

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 border border-brand-100 hover:shadow-lg transition">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-brand-500 text-white flex items-center justify-center font-bold text-lg">
            {user.username.charAt(0).toUpperCase()}
          </div>

          <div>
            <h3 className="text-lg font-semibold text-brand-900">
              {user.username}
            </h3>
            <p className="text-sm text-gray-500">{user.email}</p>
          </div>
        </div>

        <span
          className={`px-3 py-1 text-xs font-semibold rounded-full ${
            isAdmin
              ? "bg-brand-500 text-white"
              : "bg-cream-200 text-brand-800"
          }`}
        >
          {user.role}
        </span>
      </div>

      <div className="text-sm text-gray-600 space-y-1 mb-4">
        <p>
          <span className="font-medium">ID:</span> {user.id.slice(0, 8)}...
        </p>
        <p>
          <span className="font-medium">Created:</span>{" "}
          {new Date(user.createdAt).toLocaleDateString()}
        </p>
        <p>
          <span className="font-medium">Updated:</span>{" "}
          {new Date(user.updatedAt).toLocaleDateString()}
        </p>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => onEdit(user.id)}
          className="px-4 py-2 text-sm rounded-lg bg-brand-500 text-white hover:bg-brand-600 transition"
        >
          Edit
        </button>

        <button
          onClick={() => onChangeRole(user.id)}
          className="px-4 py-2 text-sm rounded-lg bg-cream-200 text-brand-800 hover:bg-cream-300 transition"
        >
          Change Role
        </button>

        <button
          onClick={() => onDelete(user.id)}
          className="px-4 py-2 text-sm rounded-lg bg-red-500 text-white hover:bg-red-600 transition"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
