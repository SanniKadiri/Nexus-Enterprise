
import React from 'react';
import { Role, User } from '../types';

interface RestrictedProps {
  to: Role[];
  user: User | null;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const Restricted: React.FC<RestrictedProps> = ({ to, user, children, fallback = null }) => {
  if (!user) return <>{fallback}</>;

  const roleHierarchy: Record<Role, number> = {
    'OWNER': 4,
    'ADMIN': 3,
    'EDITOR': 2,
    'VIEWER': 1
  };

  // Check if user has permission
  // Logic: If 'to' includes the user's exact role OR a lower role in hierarchy?
  // Actually, usually Restricted to=['ADMIN'] means ADMIN or higher.
  // But simplest implementation is strict inclusion check first.
  
  const hasAccess = to.includes(user.role);

  if (hasAccess) {
    return <>{children}</>;
  }

  return <>{fallback}</>;
};
