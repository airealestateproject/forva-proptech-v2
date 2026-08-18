import { useState, useEffect } from 'react';
import { Users, Loader2, AlertCircle } from 'lucide-react';
import { Seo } from '@/components/shared/Seo';
import { PageHeader } from '@/components/shared/SectionHeading';
import { supabase } from '@/lib/supabase';
import { formatDate } from '@/lib/format';

interface UserRow {
  user_id: string;
  role: string;
  client_id: string | null;
  agent_id: string | null;
  created_at: string;
  agent_name: string | null;
  agent_email: string | null;
  client_name: string | null;
  auth_email: string | null;
}

export function AdminUsersPage() {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const { data, error: err } = await supabase
          .from('app_users')
          .select('user_id, role, client_id, agent_id, created_at')
          .order('created_at', { ascending: false });
        if (err) throw err;

        const appUsers = data as { user_id: string; role: string; client_id: string | null; agent_id: string | null; created_at: string }[];

        const agentIds = appUsers.map((u) => u.agent_id).filter(Boolean) as string[];
        const clientIds = appUsers.map((u) => u.client_id).filter(Boolean) as string[];

        const [agentsRes, clientsRes] = await Promise.all([
          agentIds.length > 0
            ? supabase.from('agents').select('id, full_name, email').in('id', agentIds)
            : Promise.resolve({ data: [], error: null }),
          clientIds.length > 0
            ? supabase.from('clients').select('id, name').in('id', clientIds)
            : Promise.resolve({ data: [], error: null }),
        ]);

        if (agentsRes.error) throw agentsRes.error;
        if (clientsRes.error) throw clientsRes.error;

        const agentMap: Record<string, { full_name: string | null; email: string | null }> = {};
        for (const a of (agentsRes.data || []) as { id: string; full_name: string | null; email: string | null }[]) {
          agentMap[a.id] = { full_name: a.full_name, email: a.email };
        }

        const clientMap: Record<string, string> = {};
        for (const c of (clientsRes.data || []) as { id: string; name: string }[]) {
          clientMap[c.id] = c.name;
        }

        const enriched: UserRow[] = appUsers.map((u) => ({
          user_id: u.user_id,
          role: u.role,
          client_id: u.client_id,
          agent_id: u.agent_id,
          created_at: u.created_at,
          agent_name: u.agent_id ? agentMap[u.agent_id]?.full_name ?? null : null,
          agent_email: u.agent_id ? agentMap[u.agent_id]?.email ?? null : null,
          client_name: u.client_id ? clientMap[u.client_id] ?? null : null,
          auth_email: null,
        }));

        setUsers(enriched);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load users.');
      } finally {
        setLoading(false);
      }
    }
    fetchUsers();
  }, []);

  const roleBadge = (role: string) => {
    const classes: Record<string, string> = {
      super_admin: 'bg-accent-500/15 text-accent-300 border border-accent-500/30',
      agency_owner: 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30',
      agency_admin: 'bg-teal-500/15 text-teal-300 border border-teal-500/30',
      agent: 'bg-white/5 text-silver-300 border border-white/10',
    };
    return classes[role] || classes.agent;
  };

  return (
    <>
      <Seo title="Admin - Users" noindex />
      <div className="space-y-5">
        <PageHeader title="Platform Users" subtitle="All application users" />

        {loading ? (
          <div className="flex items-center justify-center gap-3 py-16 text-silver-400">
            <Loader2 size={20} className="animate-spin text-accent-300" />
            <span className="text-sm">Loading users...</span>
          </div>
        ) : error ? (
          <div className="card flex flex-col items-center gap-3 py-16 text-center">
            <AlertCircle size={28} className="text-red-300" />
            <p className="text-sm text-silver-300">{error}</p>
          </div>
        ) : users.length === 0 ? (
          <div className="card py-16 text-center">
            <Users size={32} className="mx-auto text-silver-600" />
            <p className="mt-3 text-sm text-silver-400">No users found.</p>
          </div>
        ) : (
          <div className="card overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/8 text-left text-xs text-silver-500">
                  <th className="px-4 py-3 font-medium">Name</th>
                  <th className="px-4 py-3 font-medium">Email</th>
                  <th className="px-4 py-3 font-medium">Role</th>
                  <th className="px-4 py-3 font-medium">Organization</th>
                  <th className="px-4 py-3 font-medium">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/8">
                {users.map((u) => (
                  <tr key={u.user_id} className="hover:bg-white/5 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent-gradient text-xs font-bold text-white">
                          {(u.agent_name || '?')[0]?.toUpperCase()}
                        </div>
                        <span className="font-medium text-white">{u.agent_name || 'Unknown'}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-silver-300">{u.agent_email || '-'}</td>
                    <td className="px-4 py-3">
                      <span className={`badge capitalize ${roleBadge(u.role)}`}>{u.role.replace('_', ' ')}</span>
                    </td>
                    <td className="px-4 py-3 text-silver-300">{u.client_name || '-'}</td>
                    <td className="px-4 py-3 text-silver-400">{formatDate(u.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
