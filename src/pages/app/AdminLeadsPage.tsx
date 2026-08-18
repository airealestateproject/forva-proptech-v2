import { useState, useEffect } from 'react';
import { TrendingUp, Loader2, AlertCircle } from 'lucide-react';
import { Seo } from '@/components/shared/Seo';
import { PageHeader } from '@/components/shared/SectionHeading';
import { supabase } from '@/lib/supabase';
import { formatDate } from '@/lib/format';

interface LeadRow {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  source: string | null;
  stage: string | null;
  created_at: string;
  client_id: string | null;
  assigned_agent_id: string | null;
  client_name: string | null;
  agent_name: string | null;
  closed_value: number | null;
}

export function AdminLeadsPage() {
  const [leads, setLeads] = useState<LeadRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchLeads() {
      try {
        const { data, error: err } = await supabase
          .from('leads')
          .select('id, first_name, last_name, email, source, stage, created_at, client_id, assigned_agent_id')
          .order('created_at', { ascending: false })
          .limit(200);
        if (err) throw err;

        const leadRows = (data || []) as Omit<LeadRow, 'client_name' | 'agent_name' | 'closed_value'>[];
        const clientIds = leadRows.map((l) => l.client_id).filter(Boolean) as string[];
        const agentIds = leadRows.map((l) => l.assigned_agent_id).filter(Boolean) as string[];
        const leadIds = leadRows.map((l) => l.id);

        const [clientsRes, agentsRes, dealsRes] = await Promise.all([
          clientIds.length > 0
            ? supabase.from('clients').select('id, name').in('id', clientIds)
            : Promise.resolve({ data: [], error: null }),
          agentIds.length > 0
            ? supabase.from('agents').select('id, full_name').in('id', agentIds)
            : Promise.resolve({ data: [], error: null }),
          leadIds.length > 0
            ? supabase.from('closed_deals').select('lead_id, transaction_price').in('lead_id', leadIds)
            : Promise.resolve({ data: [], error: null }),
        ]);

        if (clientsRes.error) throw clientsRes.error;
        if (agentsRes.error) throw agentsRes.error;

        const clientMap: Record<string, string> = {};
        for (const c of (clientsRes.data || []) as { id: string; name: string }[]) {
          clientMap[c.id] = c.name;
        }
        const agentMap: Record<string, string> = {};
        for (const a of (agentsRes.data || []) as { id: string; full_name: string | null }[]) {
          agentMap[a.id] = a.full_name || 'Unknown';
        }
        const dealMap: Record<string, number> = {};
        for (const d of (dealsRes.data || []) as { lead_id: string; transaction_price: number | null }[]) {
          dealMap[d.lead_id] = d.transaction_price || 0;
        }

        const enriched: LeadRow[] = leadRows.map((l) => ({
          ...l,
          client_name: l.client_id ? clientMap[l.client_id] ?? null : null,
          agent_name: l.assigned_agent_id ? agentMap[l.assigned_agent_id] ?? null : null,
          closed_value: dealMap[l.id] ?? null,
        }));

        setLeads(enriched);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load leads.');
      } finally {
        setLoading(false);
      }
    }
    fetchLeads();
  }, []);

  const stageBadge = (stage: string | null) => {
    if (stage === 'won') return 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30';
    if (stage === 'lost') return 'bg-silver-500/15 text-silver-400 border border-silver-500/30';
    return 'bg-white/5 text-silver-300 border border-white/10';
  };

  const currency = (n: number | null) =>
    n ? n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }) : '-';

  return (
    <>
      <Seo title="Admin - Leads" noindex />
      <div className="space-y-5">
        <PageHeader title="Platform Leads" subtitle="All leads across all clients" />

        {loading ? (
          <div className="flex items-center justify-center gap-3 py-16 text-silver-400">
            <Loader2 size={20} className="animate-spin text-accent-300" />
            <span className="text-sm">Loading leads...</span>
          </div>
        ) : error ? (
          <div className="card flex flex-col items-center gap-3 py-16 text-center">
            <AlertCircle size={28} className="text-red-300" />
            <p className="text-sm text-silver-300">{error}</p>
          </div>
        ) : leads.length === 0 ? (
          <div className="card py-16 text-center">
            <TrendingUp size={32} className="mx-auto text-silver-600" />
            <p className="mt-3 text-sm text-silver-400">No leads yet.</p>
          </div>
        ) : (
          <div className="card overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/8 text-left text-xs text-silver-500">
                  <th className="px-4 py-3 font-medium">Lead</th>
                  <th className="px-4 py-3 font-medium">Client</th>
                  <th className="px-4 py-3 font-medium">Agent</th>
                  <th className="px-4 py-3 font-medium">Source</th>
                  <th className="px-4 py-3 font-medium">Stage</th>
                  <th className="px-4 py-3 text-right font-medium">Closed Value</th>
                  <th className="px-4 py-3 font-medium">Created</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/8">
                {leads.map((l) => (
                  <tr key={l.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-medium text-white">{l.first_name} {l.last_name}</p>
                      <p className="text-xs text-silver-500">{l.email || '-'}</p>
                    </td>
                    <td className="px-4 py-3 text-silver-300">{l.client_name || '-'}</td>
                    <td className="px-4 py-3 text-silver-300">{l.agent_name || '-'}</td>
                    <td className="px-4 py-3 text-silver-300 capitalize">{l.source || '-'}</td>
                    <td className="px-4 py-3">
                      <span className={`badge capitalize ${stageBadge(l.stage)}`}>{l.stage || 'new'}</span>
                    </td>
                    <td className="px-4 py-3 text-right text-white">{currency(l.closed_value)}</td>
                    <td className="px-4 py-3 text-silver-400">{formatDate(l.created_at)}</td>
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
