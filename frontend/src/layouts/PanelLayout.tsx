import { Outlet, NavLink } from 'react-router';
import type { ReactNode } from 'react';

interface PanelLayoutProps {
  navItems: { to: string; label: string; end?: boolean }[];
  title: string;
  description?: string;
  action?: ReactNode;
}

const PanelLayout = ({ navItems, title, description, action }: PanelLayoutProps) => {
  return (
    <div className="space-y-8">
      <header className="rounded-3xl border border-brand-200 bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-brand-500">Panel</p>
            <h1 className="mt-2 text-3xl font-bold text-brand-800">{title}</h1>
            {description && (
              <p className="mt-2 max-w-2xl text-sm text-gray-600">{description}</p>
            )}
          </div>
          {action && <div className="flex shrink-0 items-center gap-3">{action}</div>}
        </div>
      </header>

      <div className="flex flex-col gap-6 lg:flex-row">
        <aside className="w-full shrink-0 lg:w-64">
          <nav className="rounded-2xl border border-brand-200 bg-white p-4 shadow-sm">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-brand-500">Nawigacja</h2>
            <ul className="space-y-1">
              {navItems.map((item) => (
                <li key={item.to}>
                  <NavLink
                    to={item.to}
                    end={item.end}
                    className={({ isActive }) =>
                      `block rounded-xl px-4 py-2.5 text-sm font-medium transition-colors ${
                        isActive
                          ? 'bg-brand-400/20 text-brand-800 shadow-sm'
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

        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default PanelLayout;
