/**
 * TFKS Authentication & Authorization Layer (D4)
 * Provides authentication state, Role-Based Access Control (RBAC), and Route Guards
 */

import { usePlatform } from '../context/PlatformContext';
import { BusinessSubUserRole, BusinessSubUserPermissions } from '../types/platform';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: 'super_admin' | 'business_owner' | 'business_sub_user' | 'courier' | 'customer';
  businessId?: string;
  businessSubRole?: BusinessSubUserRole;
  permissions?: BusinessSubUserPermissions;
}

export function useAuth() {
  const { activeBusinessAccount, activeBusinessSubUser, activeView } = usePlatform();

  // Resolve current active authenticated user from context session
  let currentUser: AuthUser;

  if (activeView === 'admin') {
    currentUser = {
      id: 'usr-admin-01',
      name: 'Sistem Yöneticisi',
      email: 'admin@motopilot.com',
      role: 'super_admin',
    };
  } else if (activeView === 'business') {
    if (activeBusinessSubUser) {
      currentUser = {
        id: activeBusinessSubUser.id,
        name: activeBusinessSubUser.name,
        email: activeBusinessSubUser.email,
        role: 'business_sub_user',
        businessId: activeBusinessAccount.id,
        businessSubRole: activeBusinessSubUser.role,
        permissions: activeBusinessSubUser.permissions,
      };
    } else {
      currentUser = {
        id: `owner-${activeBusinessAccount.id}`,
        name: `${activeBusinessAccount.title} (Ana Yönetici)`,
        email: activeBusinessAccount.contactEmail,
        role: 'business_owner',
        businessId: activeBusinessAccount.id,
        businessSubRole: 'owner',
        permissions: {
          canCreateOrders: true,
          canCancelOrders: true,
          canViewFinancials: true,
          canManageSubUsers: true,
          canExportReports: true,
          canManageApiKeys: true,
        },
      };
    }
  } else if (activeView === 'courier') {
    currentUser = {
      id: 'kurye-1',
      name: 'Mert Aksoy',
      email: 'mert.aksoy@motopilot.com',
      role: 'courier',
    };
  } else {
    currentUser = {
      id: 'customer-current',
      name: 'Kişisel Kullanıcı',
      email: 'kullanici@motopilot.com',
      role: 'customer',
    };
  }

  const hasPermission = (permissionKey: keyof BusinessSubUserPermissions): boolean => {
    if (currentUser.role === 'super_admin' || currentUser.role === 'business_owner') {
      return true;
    }
    if (currentUser.permissions) {
      return !!currentUser.permissions[permissionKey];
    }
    return false;
  };

  const hasRole = (allowedRoles: (BusinessSubUserRole | 'super_admin')[]): boolean => {
    if (currentUser.role === 'super_admin') return true;
    if (currentUser.businessSubRole && allowedRoles.includes(currentUser.businessSubRole)) {
      return true;
    }
    return false;
  };

  return {
    currentUser,
    isAuthenticated: true,
    hasPermission,
    hasRole,
  };
}
