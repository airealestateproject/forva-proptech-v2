import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Building2, Loader2, AlertCircle, ChevronRight } from 'lucide-react';
import { Seo } from '@/components/shared/Seo';
import { PageHeader } from '@/components/shared/SectionHeading';
import { supabase } from '@/lib/supabase';
import { formatDate, formatRelative } from '@/lib/format';

interface ClientRow {
  id: string;
  name: string;
  status: string;
  market: string | null;
  created_at: string;
  agent_count: number;
  user_count: number;
  lead_count: number;
  closed_deal_count: number;
  closed_volume: number;
  plan: string | null;
  sub_status: string | null;
}

export function AdminClientsPage() {
  const [clients, setClients] = useState<ClientRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchClients() {
      try {
        const { data: clientData, error: clientErr } = await supabase
          .from('clients')
          .select('id, name, status, market, created_at')
          .order('created_at', { ascending: false });
        if (clientErr) throw clientErr;

        const clients = clientData as Omit<ClientRow, 'agent_count' | 'user_count' | 'lead_count' | 'closed_deal_count' | 'closed_volume' | 'plan' | 'sub_status'>[];

        const [agentsRes, usersRes, leadsRes, dealsRes, subsRes] = await Promise.all([
          supabase.from('agents').select('client_id'),
          supabase.from('app_users').select('client_id'),
          supabase.from('leads').select('client_id'),
          supabase.from('closed_deals').select('client_id, transaction_price'),
          supabase.from('subscriptions').select('client_id, plan, status'),
        ]);

        if (agentsRes.error) throw agentsRes.error;

        const agentCounts: Record<string, number> = {};
        for (const a of (agentsRes.data || []) as { client_id: string | null }[]) {
          if (a.client_id) agentCounts[a.client_id] = (agentCounts[a.client_id] || 0) + 1;
        }

        const userCounts: Record<string, number> = {};
        for (const u of (usersRes.data || []) as { client_id: string | null }[]) {
          if (u.client_id) userCounts[u.client_id] = (userCounts[u.client_id] || 0) + 1;
        }

        const leadCounts: Record<string, number> = {};
        for (const l of (leadsRes.data || []) as { client_id: string | null }[]) {
          if (l.client_id) leadCounts[l.client_id] = (leadCounts[l.client_id] || 0) + 1;
        }

        const dealCounts: Record<string, number> = {};
        const dealVolumes: Record<string, number> = {};
        for (const d of (dealsRes.data || []) as { client_id: string | null; transaction_price: number | null }[]) {
          if (d.client_id) {
            dealCounts[d.client_id] = (dealCounts[d.client_id] || 0) + 1;
            dealVolumes[d.client_id] = (dealVolumes[d.client_id] || 0) + (d.transaction_price || 0);
          }
        }

        const subMap: Record<string, { plan: string; status: string }> = {};
        for (const s of (subsRes.data || []) as { client_id: string | null; plan: string; status: string }[]) {
          if (s.client_id) subMap[s.client_id] = { plan: s.plan, status: s.status };
        }

        const enriched: ClientRow[] = clients.map((c) => ({
          ...c,
          agent_count: agentCounts[c.id] || 0,
          user_count: userCounts[c.id] || 0,
          lead_count: leadCounts[c.id] || 0,
          closed_deal_count: dealCounts[c.id] || 0,
          closed_volume: dealVolumes[c.id] || 0,
          plan: subMap[c.id]?.plan ?? null,
          sub_status: subMap[c.id]?.status ?? null,
        }));

        setClients(enriched);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load clients.');
      } finally {
        setLoading(false);
      }
    }
    fetchClients();
  }, []);

  const currency = (n: number) =>
    n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });

  return (
    <>
      <Seo title="Admin - Clients" noindex />
      <div className="space-y-5">
        <PageHeader title="Client Organizations" subtitle="Platform-wide client accounts" />

        {loading ? (
          <div className="flex items-center justify-center gap-3 py-16 text-silver-400">
            <Loader2 size={20} className="animate-spin text-accent-300" />
            <span className="text-sm">Loading clients...</span>
          </div>
        ) : error ? (
          <div className="card flex flex-col items-center gap-3 py-16 text-center">
            <AlertCircle size={28} className="text-red-300" />
            <p className="text-sm text-silver-300">{error}</p>
          </div>
        ) : clients.length === 0 ? (
          <div className="card py-16 text-center">
            <Building2 size={32} className="mx-auto text-silver-600" />
            <p className="mt-3 text-sm text-silver-400">No client organizations yet.</p>
          </div>
        ) : (
          <div className="card overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/8 text-left text-xs text-silver-500">
                  <th className="px-4 py-3 font-medium">Business</th>
                  <th className="px-4 py-3 font-medium">Plan</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 text-center font-medium">Users</th>
                  <th className="px-4 py-3 text-center font-medium">Agents</th>
                  <th className="px-4 py-3 text-center font-medium">Leads</th>
                  <th className="px-4 py-3 text-center font-medium">Closed Deals</th>
                  <th className="px-4 py-3 text-right font-medium">Closed Volume</th>
                  <th className="px-4 py-3 font-medium">Created</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/8">
                {clients.map((c) => (
                  <tr key={c.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent-500/15 text-xs font-bold text-accent-300">
                          {c.name?.[0]?.toUpperCase() || '?'}
                        </div>
                        <div>
                          <p className="font-medium text-white">{c.name}</p>
                          <p className="text-xs text-silver-500">{c.market || '-'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="badge capitalize bg-white/5 text-silver-300 border border-white/10">
                        {c.plan || 'none'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`badge capitalize ${c.status === 'active' ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30' : 'bg-amber-500/15 text-amber-300 border border-amber-500/30'}`}>
                        {c.sub_status || c.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center text-white">{c.user_count}</td>
                    <td className="px-4 py-3 text-center text-white">{c.agent_count}</td>
                    <td className="px-4 py-3 text-center text-white">{c.lead_count}</td>
                    <td className="px-4 py-3 text-center text-white">{c.closed_deal_count}</td>
                    <td className="px-4 py-3 text-right text-white">{currency(c.closed_volume)}</td>
                    <td className="px-4 py-3 text-silver-400">{formatDate(c.created_at)}</td>
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
