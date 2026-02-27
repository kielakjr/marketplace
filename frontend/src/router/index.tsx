import { createBrowserRouter } from 'react-router';
import RootLayout from '@/layouts/RootLayout';
import AuthLayout from '@/layouts/AuthLayout';
import DashboardLayout from '@/layouts/DashboardLayout';
import ProtectedRoute from '@/components/ProtectedRoute';
import HomePage from '@/pages/HomePage';
import ProductsPage from '@/pages/ProductsPage';
import ProductDetailPage from '@/pages/ProductDetailPage';
import LoginPage from '@/pages/LoginPage';
import RegisterPage from '@/pages/RegisterPage';
import DashboardPage from '@/pages/DashboardPage';
import MyProductsPage from '@/pages/MyProductsPage';
import CartPage from '@/pages/CartPage';
import NotFoundPage from '@/pages/NotFoundPage';

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'products', element: <ProductsPage /> },
      { path: 'products/:id', element: <ProductDetailPage /> },

      {
        element: <ProtectedRoute />,
        children: [
          { path: 'cart', element: <CartPage /> },
          {
            path: 'dashboard',
            element: <DashboardLayout />,
            children: [
              { index: true, element: <DashboardPage /> },
              { path: 'my-products', element: <MyProductsPage /> },
            ],
          },
        ],
      },

      {
        element: <AuthLayout />,
        children: [
          { path: 'login', element: <LoginPage /> },
          { path: 'register', element: <RegisterPage /> },
        ],
      },

      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);
