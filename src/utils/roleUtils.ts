/**
 * Utility functions for role-based permissions and UI rendering
 */

import { User } from '../contexts/AuthContext';

/**
 * Check if the user has the Employee role
 */
export function isEmployeeRole(user?: User | null): boolean {
  if (!user) return false;
  return user.role === 'employee';
}

/**
 * Check if the user has admin privileges (admin or super_admin)
 */
export function isAdminRole(user?: User | null): boolean {
  if (!user) return false;
  return user.role === 'admin' || user.role === 'super_admin';
}

/**
 * Check if the user has manager privileges (manager, admin, or super_admin)
 */
export function isManagerRole(user?: User | null): boolean {
  if (!user) return false;
  return user.role === 'manager' || user.role === 'admin' || user.role === 'super_admin';
}