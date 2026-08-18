import { useState, useEffect } from 'react';
import {
  Building2,
  Users,
  CreditCard,
  TrendingUp,
  CheckCircle2,
  Clock,
  DollarSign,
  Activity,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { Seo } from '@/components/shared/Seo';
import { PageHeader } from '@/components/shared/SectionHeading';
import { supabase } from '@/lib/supabase';
import { formatRelative } from '@/lib/format';

interface Metrics {
  totalClients: number;
  activeClients: number;
  trialClients: number;
  totalUsers: number;
  totalAgents: number;
  totalLeads: number;
  activeSubscriptions: number;
  trialSubscriptions: number;
  soloSubscriptions: number;
  teamSubscriptions: number;
  agencySubscriptions: number;
  mrr: number;
  arr: number;
  totalClosedDeals: number;
  totalClosedVolume: number;
  totalCommission: number;
}

interface ClientRow {
  id: string;
  name: string;
  status: string;
  created_at: string;
}

interface RecentActivity {
  id: string;
  workflow_name: string;
  action: string;
  result: string;
  created_at: string;
  client_id: string | null;
}

export function AdminDashboardPage() {
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [recentClients, setRecentClients] = useState<ClientRow[]>([]);
  const [recentActivity, setRecentActivity] = useState<RecentActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchAll() {
      try {
        const [
          clientsRes,
          appUsersRes,
          agentsRes,
          leadsRes,
          subsRes,
          closedDealsRes,
          recentClientsRes,
          activityRes,
        ] = await Promise.all([
          supabase.from('clients').select('id, name, status, created_at').order('created_at', { ascending: false }),
          supabase.from('app_users').select('user_id', { count: 'exact', head: true }),
          supabase.from('agents').select('id', { count: 'exact', head: true }),
          supabase.from('leads').select('id', { count: 'exact', head: true }),
          supabase.from('subscriptions').select('id, plan, status, monthly_price'),
          supabase.from('closed_deals').select('id, transaction_price, commission_amount'),
          supabase.from('clients').select('id, name, status, created_at').order('created_at', { ascending: false }).limit(5),
          supabase.from('automation_audit').select('id, workflow_name, action, result, created_at, client_id').order('created_at', { ascending: false }).limit(10),
        ]);

        if (clientsRes.error) throw clientsRes.error;

        const clients = (clientsRes.data || []) as ClientRow[];
        const subs = (subsRes.data || []) as { id: string; plan: string; status: string; monthly_price: number | null }[];
        const closedDeals = (closedDealsRes.data || []) as { id: string; transaction_price: number | null; commission_amount: number | null }[];

        const activeSubs = subs.filter((s) => s.status === 'active');
        const trialSubs = subs.filter((s) => s.status === 'trialing');
        const soloSubs = activeSubs.filter((s) => s.plan === 'solo');
        const teamSubs = activeSubs.filter((s) => s.plan === 'team');
        const agencySubs = activeSubs.filter((s) => s.plan === 'agency');

        const mrr = activeSubs.reduce((sum, s) => sum + (s.monthly_price || 0), 0);
        const totalClosedVolume = closedDeals.reduce((sum, d) => sum + (d.transaction_price || 0), 0);
        const totalCommission = closedDeals.reduce((sum, d) => sum + (d.commission_amount || 0), 0);

        setMetrics({
          totalClients: clients.length,
          activeClients: clients.filter((c) => c.status === 'active').length,
          trialClients: clients.filter((c) => c.status === 'trial').length,
          totalUsers: appUsersRes.count || 0,
          totalAgents: agentsRes.count || 0,
          totalLeads: leadsRes.count || 0,
          activeSubscriptions: activeSubs.length,
          trialSubscriptions: trialSubs.length,
          soloSubscriptions: soloSubs.length,
          teamSubscriptions: teamSubs.length,
          agencySubscriptions: agencySubs.length,
          mrr,
          arr: mrr * 12,
          totalClosedDeals: closedDeals.length,
          totalClosedVolume,
          totalCommission,
        });

        setRecentClients((recentClientsRes.data || []) as ClientRow[]);
        setRecentActivity((activityRes.data || []) as RecentActivity[]);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load admin data.');
      } finally {
        setLoading(false);
      }
    }
    fetchAll();
  }, []);

  if (loading) {
    return (
      <>
        <Seo title="Admin Dashboard" noindex />
        <div className="flex items-center justify-center gap-3 py-16 text-silver-400">
          <Loader2 size={20} className="animate-spin text-accent-300" />
          <span className="text-sm">Loading platform metrics...</span>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Seo title="Admin Dashboard" noindex />
        <div className="card flex flex-col items-center gap-3 py-16 text-center">
          <AlertCircle size={28} className="text-red-300" />
          <p className="text-sm text-silver-300">Failed to load admin data.</p>
          <p className="text-xs text-silver-500">{error}</p>
        </div>
      </>
    );
  }

  const currency = (n: number) =>
    n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });

  return (
    <>
      <Seo title="Admin Dashboard" noindex />
      <div className="space-y-6">
        <PageHeader title="Platform Overview" subtitle="FORVA PropTech Super Admin Dashboard" />

        {/* Customers */}
        <div>
          <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-white">
            <Users size={16} className="text-accent-300" />
            Customers
          </h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            <MetricCard label="Client Organizations" value={metrics?.totalClients ?? 0} icon={Building2} />
            <MetricCard label="Total Users" value={metrics?.totalUsers ?? 0} icon={Users} />
            <MetricCard label="Total Agents" value={metrics?.totalAgents ?? 0} icon={Users} />
            <MetricCard label="Active Accounts" value={metrics?.activeClients ?? 0} icon={CheckCircle2} accent="text-emerald-300" />
            <MetricCard label="Trial Accounts" value={metrics?.trialClients ?? 0} icon={Clock} accent="text-amber-300" />
          </div>
        </div>

        {/* Subscriptions */}
        <div>
          <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-white">
            <CreditCard size={16} className="text-accent-300" />
            Subscriptions
          </h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            <MetricCard label="Active Subscriptions" value={metrics?.activeSubscriptions ?? 0} icon={CheckCircle2} accent="text-emerald-300" />
            <MetricCard label="Trial Users" value={metrics?.trialSubscriptions ?? 0} icon={Clock} accent="text-amber-300" />
            <MetricCard label="Solo Accounts" value={metrics?.soloSubscriptions ?? 0} icon={Users} />
            <MetricCard label="Team Accounts" value={metrics?.teamSubscriptions ?? 0} icon={Users} />
            <MetricCard label="Agency Accounts" value={metrics?.agencySubscriptions ?? 0} icon={Building2} />
          </div>
          <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <MetricCard label="MRR" value={currency(metrics?.mrr ?? 0)} icon={DollarSign} accent="text-emerald-300" />
            <MetricCard label="ARR" value={currency(metrics?.arr ?? 0)} icon={TrendingUp} accent="text-emerald-300" />
            <MetricCard label="Subscription Revenue" value={currency(metrics?.mrr ?? 0)} icon={CreditCard} accent="text-emerald-300" />
          </div>
        </div>

        {/* Lead Platform */}
        <div>
          <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-white">
            <TrendingUp size={16} className="text-accent-300" />
            Lead Platform
          </h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            <MetricCard label="Total Leads" value={metrics?.totalLeads ?? 0} icon={TrendingUp} />
            <MetricCard label="Closed Deals" value={metrics?.totalClosedDeals ?? 0} icon={CheckCircle2} accent="text-emerald-300" />
            <MetricCard label="Total Closed Volume" value={currency(metrics?.totalClosedVolume ?? 0)} icon={DollarSign} accent="text-emerald-300" />
            <MetricCard label="Total Commission" value={currency(metrics?.totalCommission ?? 0)} icon={DollarSign} accent="text-accent-300" />
          </div>
        </div>

        {/* Recent signups */}
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="card p-5">
            <h2 className="text-sm font-semibold text-white">Recent Client Signups</h2>
            {recentClients.length === 0 ? (
              <p className="mt-4 text-sm text-silver-500">No clients yet.</p>
            ) : (
              <div className="mt-3 divide-y divide-white/8">
                {recentClients.map((c) => (
                  <div key={c.id} className="flex items-center justify-between py-3">
                    <div>
                      <p className="text-sm font-medium text-white">{c.name}</p>
                      <p className="text-xs text-silver-500">{formatRelative(c.created_at)}</p>
                    </div>
                    <span className={`badge capitalize ${c.status === 'active' ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30' : 'bg-amber-500/15 text-amber-300 border border-amber-500/30'}`}>
                      {c.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="card p-5">
            <h2 className="text-sm font-semibold text-white">Recent Platform Activity</h2>
            {recentActivity.length === 0 ? (
              <p className="mt-4 text-sm text-silver-500">No recent activity.</p>
            ) : (
              <ol className="mt-4 space-y-3">
                {recentActivity.map((a) => (
                  <li key={a.id} className="flex gap-3">
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-accent-500/15 text-accent-300">
                      <Activity size={16} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm text-silver-200">
                        {a.workflow_name} — {a.action}
                      </p>
                      <p className="text-xs text-silver-500">
                        {a.result} • {formatRelative(a.created_at)}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

function MetricCard({
  label,
  value,
  icon: Icon,
  accent = 'text-white',
}: {
  label: string;
  value: string | number;
  icon: typeof Users;
  accent?: string;
}) {
  return (
    <div className="card p-4">
      <div className="flex items-center justify-between">
        <Icon size={18} className={accent} />
      </div>
      <p className="mt-3 text-2xl font-bold text-white">
        {typeof value === 'number' ? value.toLocaleString() : value}
      </p>
      <p className="mt-0.5 text-xs text-silver-400">{label}</p>
    </div>
  );
}
