import useAuthStore from '@/Store/UseAuthStore';
import type { ReactNode } from 'react';
import { Navigate } from 'react-router';

type ProtectedRouteProps = {
  children: ReactNode;
};

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated, user } = useAuthStore();

  // যদি লগইন না থাকে বা role admin না হয়
  if (!isAuthenticated || user?.role !== 'admin') {
    return (
      <Navigate
        to='/login'
        replace
      />
    );
  }

  return <>{children}</>; // Layout + nested routes safe
};

export default ProtectedRoute;
