import { useState } from 'react';
import { Users, CheckCircle2, Flame, CalendarCheck, Trophy, TrendingUp } from 'lucide-react';
import { Seo } from '@/components/shared/Seo';
import { PageHeader } from '@/components/shared/SectionHeading';
import { analytics, agents, leadSourceBreakdown } from '@/data/demo';

type RangeKey = '7d' | '30d' | '90d';

const ranges: { key: RangeKey; label: string }[] = [
  { key: '7d', label: '7 days' },
  { key: '30d', label: '30 days' },
  { key: '90d', label: '90 days' },
];

const maxSource = Math.max(...leadSourceBreakdown.map((s) => s.count));
const maxPipeline = Math.max(...analytics.pipelineDistribution.map((s) => s.count));
const maxWeeklyLeads = Math.max(...analytics.weeklyTrend.map((w) => w.leads));

export function AnalyticsPage() {
  const [range, setRange] = useState<RangeKey>('30d');
  const totals = analytics.rangeTotals[range];

  const cards = [
    { label: 'Leads Captured', value: totals.leads, icon: Users, accent: 'text-accent-300' },
    { label: 'Qualified Leads', value: totals.qualified, icon: CheckCircle2, accent: 'text-teal-300' },
    { label: 'Hot Leads', value: totals.hot, icon: Flame, accent: 'text-red-300' },
    { label: 'Appointments', value: totals.appointments, icon: CalendarCheck, accent: 'text-violet-300' },
    { label: 'Won Leads', value: totals.won, icon: Trophy, accent: 'text-emerald-300' },
    { label: 'Conversion', value: `${((totals.won / totals.leads) * 100).toFixed(1)}%`, icon: TrendingUp, accent: 'text-emerald-300' },
  ];

  return (
    <>
      <Seo title="Analytics" noindex />
      <div className="space-y-5">
        <PageHeader
          title="Analytics"
          subtitle="Lead performance and agent activity"
          actions={
            <div className="flex items-center gap-1 rounded-lg border border-white/10 bg-navy-850 p-1">
              {ranges.map((r) => (
                <button
                  key={r.key}
                  type="button"
                  onClick={() => setRange(r.key)}
                  className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                    range === r.key ? 'bg-accent-500/15 text-accent-300' : 'text-silver-400 hover:text-white'
                  }`}
                >
                  {r.label}
                </button>
              ))}
            </div>
          }
        />

        {/* Summary cards */}
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {cards.map((c) => (
            <div key={c.label} className="card p-4">
              <c.icon size={18} className={c.accent} />
              <p className="mt-3 text-2xl font-bold text-white">{c.value}</p>
              <p className="mt-0.5 text-xs text-silver-400">{c.label}</p>
            </div>
          ))}
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          {/* Leads by source */}
          <div className="card p-5">
            <h2 className="text-sm font-semibold text-white">Leads by Source</h2>
            <div className="mt-4 space-y-3">
              {leadSourceBreakdown.map((s) => (
                <div key={s.source}>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-silver-300">{s.label}</span>
                    <span className="font-semibold text-white">{s.count}</span>
                  </div>
                  <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-white/8">
                    <div
                      className="h-full rounded-full bg-accent-gradient"
                      style={{ width: `${(s.count / maxSource) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Pipeline distribution */}
          <div className="card p-5">
            <h2 className="text-sm font-semibold text-white">Pipeline Distribution</h2>
            <div className="mt-4 space-y-3">
              {analytics.pipelineDistribution.map((s) => (
                <div key={s.stage}>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-silver-300">{s.label}</span>
                    <span className="font-semibold text-white">{s.count}</span>
                  </div>
                  <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-white/8">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-accent-500 to-cyan-400"
                      style={{ width: `${(s.count / maxPipeline) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Weekly trend (simple bar chart) */}
        <div className="card p-5">
          <h2 className="text-sm font-semibold text-white">Weekly Lead Trend</h2>
          <div className="mt-6 flex items-end justify-between gap-3 h-40">
            {analytics.weeklyTrend.map((w) => (
              <div key={w.label} className="flex flex-1 flex-col items-center gap-2">
                <div className="flex w-full items-end justify-center gap-1" style={{ height: '120px' }}>
                  <div
                    className="w-1/2 rounded-t bg-accent-400/70"
                    style={{ height: `${(w.leads / maxWeeklyLeads) * 100}%` }}
                    title={`${w.leads} leads`}
                  />
                  <div
                    className="w-1/2 rounded-t bg-cyan-400/50"
                    style={{ height: `${(w.qualified / maxWeeklyLeads) * 100}%` }}
                    title={`${w.qualified} qualified`}
                  />
                </div>
                <span className="text-xs text-silver-500">{w.label}</span>
              </div>
            ))}
          </div>
          <div className="mt-3 flex items-center justify-center gap-4 text-xs text-silver-400">
            <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm bg-accent-400/70" /> Leads</span>
            <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-sm bg-cyan-400/50" /> Qualified</span>
          </div>
        </div>

        {/* Agent performance */}
        <div className="card p-5">
          <h2 className="text-sm font-semibold text-white">Agent Performance</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="border-b border-white/8 text-left text-xs text-silver-500">
                <tr>
                  <th className="px-2 py-2 font-medium">Agent</th>
                  <th className="px-2 py-2 font-medium">Leads</th>
                  <th className="px-2 py-2 font-medium">Appointments</th>
                  <th className="px-2 py-2 font-medium">Won</th>
                  <th className="px-2 py-2 font-medium">Conversion</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/8">
                {agents.map((a) => (
                  <tr key={a.id} className="hover:bg-white/5 transition-colors">
                    <td className="px-2 py-3">
                      <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-navy-700 text-xs font-semibold text-white">
                          {a.avatarInitials}
                        </div>
                        <span className="font-medium text-white">{a.name}</span>
                      </div>
                    </td>
                    <td className="px-2 py-3 text-silver-300">{a.leadsCount}</td>
                    <td className="px-2 py-3 text-silver-300">{a.appointmentsCount}</td>
                    <td className="px-2 py-3 text-silver-300">{a.wonCount}</td>
                    <td className="px-2 py-3">
                      <span className="text-emerald-300 font-medium">{a.conversionRate}%</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
