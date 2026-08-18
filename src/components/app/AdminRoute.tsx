import { useState, useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { AdminShell } from '@/components/app/AdminShell';
import { LoadingState } from '@/components/shared/AsyncStates';
import { supabase } from '@/lib/supabase';

export function AdminRoute() {
  const { isAuthenticated, isSuperAdmin, loading, profile } = useAuth();
  const location = useLocation();
  const [sessionChecked, setSessionChecked] = useState(false);
  const [hasSession, setHasSession] = useState(false);

  // If auth context says not authenticated, double-check the actual Supabase session
  // before redirecting, to avoid false logout on transient profile rebuilds.
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      supabase.auth.getSession().then(({ data: { session } }) => {
        setHasSession(!!session);
        setSessionChecked(true);
      });
    } else {
      setSessionChecked(true);
      setHasSession(isAuthenticated);
    }
  }, [loading, isAuthenticated]);

  if (loading || !sessionChecked) {
    return <LoadingState label="Verifying admin access..." />;
  }

  if (!hasSession) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // Session exists but profile might still be loading — wait for it
  if (!profile) {
    return <LoadingState label="Loading your profile..." />;
  }

  if (!isSuperAdmin) {
    return <Navigate to="/app/dashboard" replace />;
  }

  return (
    <AdminShell>
      <Outlet />
    </AdminShell>
  );
}
