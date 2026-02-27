import { Link, NavLink } from 'react-router';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { logoutThunk } from '@/store/slices/authSlice';
import { toggleMobileMenu } from '@/store/slices/uiSlice';
import { useCartItemCount } from '@/hooks/useCart';
import { useQueryClient } from '@tanstack/react-query';
import { cartKeys } from '@/hooks/useCart';

const Navbar = () => {
  const dispatch = useAppDispatch();
  const queryClient = useQueryClient();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const cartCount = useCartItemCount();
  const { isMobileMenuOpen } = useAppSelector((state) => state.ui);

  const handleLogout = async () => {
    await dispatch(logoutThunk());
    queryClient.removeQueries({ queryKey: cartKeys.all });
  };

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `text-sm font-medium transition-colors ${
      isActive ? 'text-brand-800' : 'text-gray-500 hover:text-brand-800'
    }`;

  return (
    <header className="sticky top-0 z-50 border-b border-brand-200 bg-white/95 shadow-sm backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="text-xl font-bold text-brand-800">
          <span className="text-brand-500">Market</span>place
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          <NavLink to="/" end className={linkClass}>Strona główna</NavLink>
          <NavLink to="/products" className={linkClass}>Produkty</NavLink>

          {isAuthenticated && (
            <NavLink to="/cart" className={linkClass}>
              Koszyk
              {cartCount > 0 && (
                <span className="ml-1.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-brand-800 px-1 text-xs font-semibold text-white">
                  {cartCount}
                </span>
              )}
            </NavLink>
          )}

          {isAuthenticated ? (
            <>
              <NavLink to="/dashboard" className={linkClass}>Panel</NavLink>
              <span className="text-sm text-brand-500 font-medium">{user?.username}</span>
              <button
                onClick={handleLogout}
                className="rounded-lg border border-brand-200 bg-cream-50 px-4 py-2 text-sm font-medium text-brand-800 transition-colors hover:bg-brand-100"
              >
                Wyloguj
              </button>
            </>
          ) : (
            <>
              <NavLink to="/login" className={linkClass}>Zaloguj</NavLink>
              <Link
                to="/register"
                className="rounded-lg bg-brand-800 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-700"
              >
                Zarejestruj
              </Link>
            </>
          )}
        </nav>

        <button
          onClick={() => dispatch(toggleMobileMenu())}
          className="text-brand-800 md:hidden"
          aria-label="Toggle menu"
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isMobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {isMobileMenuOpen && (
        <nav className="border-t border-brand-200 bg-white px-4 py-4 md:hidden">
          <div className="flex flex-col gap-3">
            <NavLink to="/" end className={linkClass}>Strona główna</NavLink>
            <NavLink to="/products" className={linkClass}>Produkty</NavLink>
            {isAuthenticated && (
              <NavLink to="/cart" className={linkClass}>Koszyk ({cartCount})</NavLink>
            )}
            {isAuthenticated ? (
              <>
                <NavLink to="/dashboard" className={linkClass}>Panel</NavLink>
                <button onClick={handleLogout} className="text-left text-sm text-red-600 font-medium">Wyloguj</button>
              </>
            ) : (
              <>
                <NavLink to="/login" className={linkClass}>Zaloguj</NavLink>
                <NavLink to="/register" className={linkClass}>Zarejestruj</NavLink>
              </>
            )}
          </div>
        </nav>
      )}
    </header>
  );
};

export default Navbar;
