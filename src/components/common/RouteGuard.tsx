import React, { ReactNode } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { BusinessSubUserRole, BusinessSubUserPermissions } from '../../types/platform';
import { ShieldAlert } from 'lucide-react';

interface RouteGuardProps {
  children: ReactNode;
  requiredRole?: (BusinessSubUserRole | 'super_admin')[];
  requiredPermission?: keyof BusinessSubUserPermissions;
  fallback?: ReactNode;
}

export const RouteGuard: React.FC<RouteGuardProps> = ({
  children,
  requiredRole,
  requiredPermission,
  fallback,
}) => {
  const { hasRole, hasPermission, currentUser } = useAuth();

  if (requiredRole && !hasRole(requiredRole)) {
    if (fallback) return <>{fallback}</>;
    return (
      <div className="p-6 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-center space-y-3">
        <ShieldAlert className="w-8 h-8 text-amber-400 mx-auto" />
        <h3 className="text-sm font-semibold text-white">Erişim İzni Yetersiz (ACL)</h3>
        <p className="text-xs text-[#A1A1A6] max-w-sm mx-auto">
          Mevcut rolünüz ({currentUser.businessSubRole || currentUser.role}) bu modülü görüntülemek için yetkilendirilmemiştir.
        </p>
      </div>
    );
  }

  if (requiredPermission && !hasPermission(requiredPermission)) {
    if (fallback) return <>{fallback}</>;
    return (
      <div className="p-6 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-center space-y-3">
        <ShieldAlert className="w-8 h-8 text-amber-400 mx-auto" />
        <h3 className="text-sm font-semibold text-white">İşlem Yetkisi Kısıtlı</h3>
        <p className="text-xs text-[#A1A1A6] max-w-sm mx-auto">
          Hesabınızda <span className="font-mono text-white/80">{requiredPermission}</span> yetkisi bulunmamaktadır.
        </p>
      </div>
    );
  }

  return <>{children}</>;
};
