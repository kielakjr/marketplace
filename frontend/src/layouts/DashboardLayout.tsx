import PanelLayout from '@/layouts/PanelLayout';

const navItems = [
  { to: '/dashboard', label: 'Przegląd', end: true },
  { to: '/dashboard/my-products', label: 'Moje produkty' },
  { to: '/dashboard/orders', label: 'Zamówienia' },
];

export const DashboardLayout = () => {
  return <PanelLayout navItems={navItems} />;
};

export default DashboardLayout;
