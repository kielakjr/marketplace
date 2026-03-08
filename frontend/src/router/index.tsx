import { createBrowserRouter } from 'react-router';
import RootLayout from '@/layouts/RootLayout';
import AuthLayout from '@/layouts/AuthLayout';
import AdminPanelLayout from '@/layouts/AdminPanelLayout';
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
import AdminPanelPage from '@/pages/admin/AdminPanelPage';
import AdminCategories from '@/pages/admin/AdminCategories';
import AdminUsers from '@/pages/admin/AdminUsers';
import AdminOrders from '@/pages/admin/AdminOrders';
import AdminOrderDetail from '@/pages/admin/AdminOrderDetail';
import AdminProducts from '@/pages/admin/AdminProducts';
import NotFoundPage from '@/pages/NotFoundPage';
import OrdersPage from '@/pages/OrdersPage';
import OrderDetailPage from '@/pages/OrderDetailPage';
import SaleDetailPage from '@/pages/SaleDetailPage';
import CheckoutPage from '@/pages/CheckoutPage';
import SalesPage from '@/pages/SalesPage';
import MyProfilePage from '@/pages/MyProfilePage';
import ProfilePage from '@/pages/ProfilePage';

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
          { path: 'checkout', element: <CheckoutPage /> },
          {
            path: 'dashboard',
            element: <DashboardLayout />,
            children: [
              { index: true, element: <DashboardPage /> },
              { path: 'my-products', element: <MyProductsPage /> },
              { path: 'orders', element: <OrdersPage /> },
              { path: 'orders/:id', element: <OrderDetailPage />},
              { path: 'sales', element: <SalesPage /> },
              { path: 'sales/:id', element: <SaleDetailPage /> },
            ],
          },
          {
            path: 'profile',
            children: [
              { index: true, element: <MyProfilePage /> },
              { path: ':id', element: <ProfilePage /> },
            ]
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
      {
        element: <ProtectedRoute requiredRole="ADMIN" />,
        children: [
          {
            path: 'admin',
            element: <AdminPanelLayout />,
            children: [
              { index: true, element: <AdminPanelPage /> },
              { path: 'categories', element: <AdminCategories /> },
              { path: 'products', element: <AdminProducts /> },
              { path: 'users', element: <AdminUsers /> },
              { path: 'orders', element: <AdminOrders /> },
              { path: 'orders/:id', element: <AdminOrderDetail /> },
            ],
          },
        ],
      },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);
