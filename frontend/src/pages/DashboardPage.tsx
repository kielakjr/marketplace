import { useAppSelector } from '@/store/hooks';
import Card from '@/components/ui/Card';

const DashboardPage = () => {
  const { user } = useAppSelector((state) => state.auth);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-brand-800">
        Witaj, {user?.username}!
      </h1>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card>
          <p className="text-sm text-gray-500">Rola</p>
          <p className="mt-1 text-xl font-bold text-brand-800">{user?.role}</p>
        </Card>
        <Card>
          <p className="text-sm text-gray-500">Konto od</p>
          <p className="mt-1 text-xl font-bold text-brand-800">
            {user?.createdAt
              ? new Date(user.createdAt).toLocaleDateString('pl-PL')
              : '—'}
          </p>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;
