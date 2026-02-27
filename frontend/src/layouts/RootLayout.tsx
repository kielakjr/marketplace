import { Outlet } from 'react-router';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const RootLayout = () => {
  return (
    <div className="flex min-h-screen flex-col bg-cream-50">
      <Navbar />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default RootLayout;
