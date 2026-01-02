// src/Routes/AppRouter.tsx
import Main from '@/Layouts/Main';
import PublicLayout from '@/Layouts/PublicLayout';
import CreateUserPage from '@/Pages/Admin/CreateUserPage';
import Categories from '@/Pages/Categories/Categories';
import {
  Account,
  Banners,
  Brands,
  DashboardPage,
  Invoices,
  LoginPage,
  Orders,
  Products,
  RegisterPage,
  UsersPage,
} from '@/Pages/Index';
import ProtectedRoute from '@/Routes/ProtectedRoute';
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router';

const router = createBrowserRouter([
  // -----------------------------
  // Default redirect to login
  // -----------------------------
  {
    path: '/',
    element: (
      <Navigate
        to='/login'
        replace
      />
    ),
  },

  // -----------------------------
  // Public Routes (Login/Register)
  // -----------------------------
  {
    element: <PublicLayout />,
    children: [
      { path: '/login', element: <LoginPage /> },
      { path: '/register', element: <RegisterPage /> }, // Normal registration (role fixed)
    ],
  },

  // -----------------------------
  // Protected Routes (Requires login)
  // -----------------------------
  {
    element: (
      <ProtectedRoute>
        <Main /> {/* Layout for dashboard */}
      </ProtectedRoute>
    ),
    children: [
      // Normal dashboard accessible by all logged-in users

      {
        path: '/dashboard',
        Component: DashboardPage,
      },
      {
        path: '/dashboard/account',
        Component: Account,
      },
      {
        path: '/dashboard/banners',
        Component: Banners,
      },
      {
        path: '/dashboard/brands',
        Component: Brands,
      },
      {
        path: '/dashboard/categories',
        Component: Categories,
      },
      {
        path: '/dashboard/invoices',
        Component: Invoices,
      },
      {
        path: '/dashboard/orders',
        Component: Orders,
      },
      {
        path: '/dashboard/products',
        Component: Products,
      },
      {
        path: '/dashboard/Users',
        Component: UsersPage,
      },
      {
        path: '/dashboard/create-users',
        Component: CreateUserPage,
      },

      // -----------------------------
      // Admin-only routes
      // -----------------------------
    ],
  },
]);

export default function AppRouter() {
  return <RouterProvider router={router} />;
}
