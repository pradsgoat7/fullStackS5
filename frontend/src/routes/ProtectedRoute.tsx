import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { AccessDeniedPage } from '../pages/AccessDeniedPage';
import { FullPageLoader } from '../components/common/FullPageLoader';
import type { Role } from '../types/auth';

interface ProtectedRouteProps {
  /** If set, only these roles may see the nested routes */
  roles?: Role[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ roles }) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <FullPageLoader />;
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (roles && !roles.includes(user.role)) {
    return <AccessDeniedPage />;
  }

  return <Outlet />;
};
