import PanelLayout from '@/layouts/PanelLayout';

const navItems = [
  { to: '/admin', label: 'Przegląd', end: true },
  { to: '/admin/categories', label: 'Kategorie' },
  { to: '/admin/users', label: 'Użytkownicy' },
];

export const AdminPanelLayout = () => {
  return <PanelLayout navItems={navItems} />;
};

export default AdminPanelLayout;
