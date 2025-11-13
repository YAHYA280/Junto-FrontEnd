import React, { ReactNode } from 'react';
import { useAuthStore } from '../../../store/authStore';

interface AuthGuardProps {
  children: ReactNode;
  requireDriver?: boolean;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({
  children,
  requireDriver = false,
}) => {
  const { isAuthenticated } = useAuthStore();

  // For now, just check if authenticated
  // You can add driver-specific logic later
  if (!isAuthenticated && requireDriver) {
    return null;
  }

  return <>{children}</>;
};
