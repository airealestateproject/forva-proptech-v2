import { useState, useEffect } from 'react';
import { CreditCard, Loader2, AlertCircle } from 'lucide-react';
import { Seo } from '@/components/shared/Seo';
import { PageHeader } from '@/components/shared/SectionHeading';
import { supabase } from '@/lib/supabase';
import { formatDate } from '@/lib/format';

interface SubRow {
  id: string;
  client_id: string | null;
  plan: string;
  status: string;
  monthly_price: number | null;
  trial_ends_at: string | null;
  created_at: string;
  client_name: string | null;
}

export function AdminSubscriptionsPage() {
  const [subs, setSubs] = useState<SubRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSubs() {
      try {
        const { data, error: err } = await supabase
          .from('subscriptions')
          .select('id, client_id, plan, status, monthly_price, trial_ends_at, created_at')
          .order('created_at', { ascending: false });
        if (err) throw err;

        const subRows = (data || []) as Omit<SubRow, 'client_name'>[];
        const clientIds = subRows.map((s) => s.client_id).filter(Boolean) as string[];

        let clientMap: Record<string, string> = {};
        if (clientIds.length > 0) {
          const { data: clients } = await supabase
            .from('clients')
            .select('id, name')
            .in('id', clientIds);
          for (const c of (clients || []) as { id: string; name: string }[]) {
            clientMap[c.id] = c.name;
          }
        }

        const enriched: SubRow[] = subRows.map((s) => ({
          ...s,
          client_name: s.client_id ? clientMap[s.client_id] ?? null : null,
        }));

        setSubs(enriched);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load subscriptions.');
      } finally {
        setLoading(false);
      }
    }
    fetchSubs();
  }, []);

  const statusBadge = (status: string) => {
    const classes: Record<string, string> = {
      active: 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30',
      trialing: 'bg-amber-500/15 text-amber-300 border border-amber-500/30',
      past_due: 'bg-red-500/15 text-red-300 border border-red-500/30',
      cancelled: 'bg-silver-500/15 text-silver-400 border border-silver-500/30',
      expired: 'bg-silver-500/15 text-silver-400 border border-silver-500/30',
    };
    return classes[status] || 'bg-white/5 text-silver-300 border border-white/10';
  };

  const currency = (n: number | null) =>
    n ? n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }) : '-';

  return (
    <>
      <Seo title="Admin - Subscriptions" noindex />
      <div className="space-y-5">
        <PageHeader title="Subscriptions" subtitle="Platform subscription overview" />

        {loading ? (
          <div className="flex items-center justify-center gap-3 py-16 text-silver-400">
            <Loader2 size={20} className="animate-spin text-accent-300" />
            <span className="text-sm">Loading subscriptions...</span>
          </div>
        ) : error ? (
          <div className="card flex flex-col items-center gap-3 py-16 text-center">
            <AlertCircle size={28} className="text-red-300" />
            <p className="text-sm text-silver-300">{error}</p>
          </div>
        ) : subs.length === 0 ? (
          <div className="card py-16 text-center">
            <CreditCard size={32} className="mx-auto text-silver-600" />
            <p className="mt-3 text-sm text-silver-400">No subscriptions yet.</p>
            <p className="mt-1 text-xs text-silver-500">
              Subscription revenue will appear here once a payment provider is connected.
            </p>
          </div>
        ) : (
          <div className="card overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/8 text-left text-xs text-silver-500">
                  <th className="px-4 py-3 font-medium">Organization</th>
                  <th className="px-4 py-3 font-medium">Plan</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 text-right font-medium">MRR</th>
                  <th className="px-4 py-3 font-medium">Trial End</th>
                  <th className="px-4 py-3 font-medium">Started</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/8">
                {subs.map((s) => (
                  <tr key={s.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-4 py-3 font-medium text-white">{s.client_name || '-'}</td>
                    <td className="px-4 py-3">
                      <span className="badge capitalize bg-white/5 text-silver-300 border border-white/10">{s.plan}</span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`badge capitalize ${statusBadge(s.status)}`}>{s.status}</span>
                    </td>
                    <td className="px-4 py-3 text-right text-white">
                      {s.status === 'active' ? currency(s.monthly_price) : '-'}
                    </td>
                    <td className="px-4 py-3 text-silver-400">{s.trial_ends_at ? formatDate(s.trial_ends_at) : '-'}</td>
                    <td className="px-4 py-3 text-silver-400">{formatDate(s.created_at)}</td>
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
