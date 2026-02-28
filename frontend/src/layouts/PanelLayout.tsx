import { Outlet, NavLink } from 'react-router';

interface DashboardLayoutProps {
  navItems: { to: string; label: string; end?: boolean }[];
}

const DashboardLayout = ({ navItems }: DashboardLayoutProps) => {
  return (
    <div className="flex flex-col gap-6 md:flex-row">
      <aside className="w-full shrink-0 md:w-64">
        <nav className="rounded-2xl border border-brand-200 bg-white p-4 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-brand-800">Panel</h2>
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  end={item.end}
                  className={({ isActive }) =>
                    `block rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-brand-400/30 text-brand-800'
                        : 'text-gray-600 hover:bg-cream-100 hover:text-brand-800'
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  );
};

export default DashboardLayout;
