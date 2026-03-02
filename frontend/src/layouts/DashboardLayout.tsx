import { Link } from 'react-router';
import PanelLayout from '@/layouts/PanelLayout';
import Button from '@/components/ui/Button';

const navItems = [
  { to: '/dashboard', label: 'Przegląd', end: true },
  { to: '/dashboard/my-products', label: 'Moje produkty' },
  { to: '/dashboard/orders', label: 'Zamówienia' },
];

export const DashboardLayout = () => {
  return (
    <PanelLayout
      navItems={navItems}
      title="Panel użytkownika"
      description="Zarządzaj swoim kontem, produktami oraz zamówieniami w jednym miejscu."
      action={(
        <>
          <Link to="/dashboard/my-products">
            <Button>Dodaj produkt</Button>
          </Link>
          <Link to="/products">
            <Button variant="secondary">Przeglądaj produkty</Button>
          </Link>
        </>
      )}
    />
  );
};

export default DashboardLayout;
