import { Link } from 'react-router';
import PanelLayout from '@/layouts/PanelLayout';
import Button from '@/components/ui/Button';

const navItems = [
  { to: '/admin', label: 'Przegląd', end: true },
  { to: '/admin/categories', label: 'Kategorie' },
  { to: '/admin/users', label: 'Użytkownicy' },
  { to: '/admin/orders', label: 'Zamówienia' },
];

export const AdminPanelLayout = () => {
  return (
    <PanelLayout
      navItems={navItems}
      title="Panel administratora"
      description="Zarządzaj kluczowymi obszarami marketplace — użytkownikami, kategoriami, zamówieniami i dostępnością."
      action={(
        <Link to="/products">
          <Button variant="secondary">Podgląd marketplace</Button>
        </Link>
      )}
    />
  );
};

export default AdminPanelLayout;
