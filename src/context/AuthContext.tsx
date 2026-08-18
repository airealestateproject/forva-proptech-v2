import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';
import type { Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import type { User } from '@/types';

interface AppUserRow {
  user_id: string;
  client_id: string;
  agent_id: string | null;
  role: string;
}

interface AgentRow {
  id: string;
  full_name: string;
  email: string | null;
  phone: string | null;
  avatar_url: string | null;
  notification_email: boolean;
  notification_sms: boolean;
  notification_in_app: boolean;
}

interface ClientRow {
  id: string;
  name: string;
  market: string;
  timezone: string;
  status: string;
  booking_url: string | null;
  pwa_name: string;
}

export interface UserProfile {
  user: User;
  agentId: string | null;
  clientId: string | null;
  phone: string | null;
  avatarUrl: string | null;
  notificationEmail: boolean;
  notificationSms: boolean;
  notificationInApp: boolean;
  clientName: string | null;
  clientMarket: string | null;
  clientTimezone: string | null;
  clientBookingUrl: string | null;
  clientStatus: string | null;
}

interface AuthContextValue {
  user: User | null;
  profile: UserProfile | null;
  isAuthenticated: boolean;
  isAgency: boolean;
  isSuperAdmin: boolean;
  canEditBusiness: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

const ADMIN_ROLES = ['super_admin', 'agency_owner', 'agency_admin'];

async function buildProfileFromSession(session: Session): Promise<UserProfile | null> {
  const authUser = session.user;
  const email = authUser.email || '';

  const { data, error } = await supabase
    .from('app_users')
    .select('user_id, client_id, agent_id, role')
    .eq('user_id', authUser.id)
    .maybeSingle();

  if (error) {
    console.error('Failed to fetch app_users row:', error.message);
    return null;
  }

  if (!data) {
    console.error('No app_users row found for auth user:', authUser.id);
    return null;
  }

  const appUser = data as AppUserRow;
  const role = appUser.role as User['role'];
  const accountType: User['accountType'] =
    role === 'super_admin' ? 'individual' : role === 'agency_owner' || role === 'agency_admin' ? 'agency' : 'individual';

  let agentData: AgentRow | null = null;
  if (appUser.agent_id) {
    const { data: ag, error: agErr } = await supabase
      .from('agents')
      .select('id, full_name, email, phone, avatar_url, notification_email, notification_sms, notification_in_app')
      .eq('id', appUser.agent_id)
      .maybeSingle();
    if (agErr) {
      console.error('Failed to fetch agent row:', agErr.message);
    } else {
      agentData = ag as AgentRow | null;
    }
  }

  let clientData: ClientRow | null = null;
  if (appUser.client_id) {
    const { data: cl, error: clErr } = await supabase
      .from('clients')
      .select('id, name, market, timezone, status, booking_url, pwa_name')
      .eq('id', appUser.client_id)
      .maybeSingle();
    if (clErr) {
      console.error('Failed to fetch client row:', clErr.message);
    } else {
      clientData = cl as ClientRow | null;
    }
  }

  const fullName =
    agentData?.full_name ||
    (authUser.user_metadata?.full_name as string) ||
    (authUser.user_metadata?.name as string) ||
    email.split('@')[0];

  const user: User = {
    id: authUser.id,
    name: fullName,
    email,
    accountType,
    role,
    agencyName: accountType === 'agency' ? (clientData?.name ?? undefined) : undefined,
    avatarUrl: agentData?.avatar_url ?? null,
  };

  return {
    user,
    agentId: appUser.agent_id,
    clientId: appUser.client_id,
    phone: agentData?.phone ?? null,
    avatarUrl: agentData?.avatar_url ?? null,
    notificationEmail: agentData?.notification_email ?? true,
    notificationSms: agentData?.notification_sms ?? true,
    notificationInApp: agentData?.notification_in_app ?? true,
    clientName: clientData?.name ?? null,
    clientMarket: clientData?.market ?? null,
    clientTimezone: clientData?.timezone ?? null,
    clientBookingUrl: clientData?.booking_url ?? null,
    clientStatus: clientData?.status ?? null,
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session) {
      const p = await buildProfileFromSession(session);
      setProfile(p);
    } else {
      setProfile(null);
    }
  }, []);

  useEffect(() => {
    let mounted = true;

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!mounted) return;
      if (session) {
        buildProfileFromSession(session).then((p) => {
          if (!mounted) return;
          setProfile(p);
          setLoading(false);
        });
      } else {
        setLoading(false);
      }
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      (async () => {
        if (session) {
          const p = await buildProfileFromSession(session);
          if (!mounted) return;
          if (p) {
            setProfile(p);
          }
        } else if (event === 'SIGNED_OUT') {
          if (!mounted) return;
          setProfile(null);
        }
        setLoading(false);
      })();
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
  }, []);

  const logout = useCallback(async () => {
    await supabase.auth.signOut();
    setProfile(null);
  }, []);

  const user = profile?.user ?? null;
  const role = user?.role;
  const isSuperAdmin = role === 'super_admin';
  const canEditBusiness = ADMIN_ROLES.includes(role ?? 'agent');

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        isAuthenticated: !!user,
        isAgency: user?.accountType === 'agency',
        isSuperAdmin,
        canEditBusiness,
        loading,
        login,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
