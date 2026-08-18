import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  CalendarDays,
  Clock,
  User,
  CalendarCheck,
} from 'lucide-react';
import { Seo } from '@/components/shared/Seo';
import { PageHeader } from '@/components/shared/SectionHeading';
import { AppointmentStatusBadge } from '@/components/shared/Badges';
import { LoadingState, ErrorState, EmptyState } from '@/components/shared/AsyncStates';
import { fetchAppointments } from '@/lib/queries';
import { formatDate } from '@/lib/format';
import type { Agent, Appointment, AppointmentStatus } from '@/types';

const tabs: { key: AppointmentStatus | 'all'; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'today', label: 'Today' },
  { key: 'upcoming', label: 'Upcoming' },
  { key: 'completed', label: 'Completed' },
  { key: 'cancelled', label: 'Cancelled' },
];

export function AppointmentsPage() {
  const [tab, setTab] = useState<AppointmentStatus | 'all'>('all');
  const [view, setView] = useState<'list' | 'calendar'>('list');
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [agentMap, setAgentMap] = useState<Record<string, Agent>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchAppointments().then((result) => {
      if (cancelled) return;
      setAppointments(result.appointments);
      setAgentMap(result.agentMap);
      setError(result.error);
      setLoading(false);
    });
    return () => { cancelled = true; };
  }, []);

  const filtered = appointments.filter((a) => tab === 'all' || a.status === tab);
  const sorted = [...filtered].sort((a, b) => `${a.date}T${a.time}`.localeCompare(`${b.date}T${b.time}`));

  // Calendar grouping
  const byDate = sorted.reduce<Record<string, typeof sorted>>((acc, a) => {
    (acc[a.date] = acc[a.date] || []).push(a);
    return acc;
  }, {});
  const dates = Object.keys(byDate).sort();

  return (
    <>
      <Seo title="Appointments" noindex />
      <div className="space-y-5">
        <PageHeader
          title="Appointments"
          subtitle={`${filtered.length} appointment${filtered.length === 1 ? '' : 's'}`}
          actions={
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setView('list')}
                className={`btn-secondary ${view === 'list' ? 'ring-2 ring-accent-400' : ''}`}
              >
                List
              </button>
              <button
                type="button"
                onClick={() => setView('calendar')}
                className={`btn-secondary ${view === 'calendar' ? 'ring-2 ring-accent-400' : ''}`}
              >
                Calendar
              </button>
            </div>
          }
        />

        {loading ? (
          <LoadingState label="Loading appointments..." />
        ) : error ? (
          <ErrorState message={error} />
        ) : (
          <>
            {/* Status tabs */}
            <div className="flex flex-wrap gap-2">
              {tabs.map((t) => (
                <button
                  key={t.key}
                  type="button"
                  onClick={() => setTab(t.key)}
                  className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                    tab === t.key
                      ? 'bg-accent-500/15 text-accent-300 border border-accent-500/30'
                      : 'text-silver-400 hover:text-white hover:bg-white/5 border border-transparent'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {sorted.length === 0 ? (
              <EmptyState icon={CalendarDays} message="No appointments in this view." />
            ) : view === 'list' ? (
              <div className="grid gap-3 sm:grid-cols-2">
                {sorted.map((a) => (
                  <div key={a.id} className="card card-hover p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-accent-500/15 text-accent-300">
                          <CalendarCheck size={18} />
                        </div>
                        <div>
                          <Link
                            to={`/app/leads/${a.leadId}`}
                            className="font-medium text-white hover:text-accent-300"
                          >
                            {a.leadName}
                          </Link>
                          <p className="text-xs text-silver-500 capitalize">{a.type.replace('_', ' ')}</p>
                        </div>
                      </div>
                      <AppointmentStatusBadge status={a.status} />
                    </div>
                    <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
                      <div className="flex items-center gap-2 text-silver-300">
                        <CalendarDays size={14} className="text-silver-500" />
                        {formatDate(a.date)}
                      </div>
                      <div className="flex items-center gap-2 text-silver-300">
                        <Clock size={14} className="text-silver-500" />
                        {a.time}
                      </div>
                      <div className="flex items-center gap-2 text-silver-300">
                        <User size={14} className="text-silver-500" />
                        {agentMap[a.agentId]?.name}
                      </div>
                    </dl>
                    {a.notes && <p className="mt-3 text-xs text-silver-400">{a.notes}</p>}
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {dates.map((date) => (
                  <div key={date} className="card p-4">
                    <div className="flex items-center gap-2 border-b border-white/8 pb-2">
                      <CalendarDays size={16} className="text-accent-300" />
                      <h3 className="text-sm font-semibold text-white">{formatDate(date)}</h3>
                    </div>
                    <div className="mt-3 space-y-2">
                      {byDate[date].map((a) => (
                        <div
                          key={a.id}
                          className="flex items-center gap-3 rounded-lg border border-white/8 bg-navy-900/40 p-3"
                        >
                          <div className="flex h-10 w-12 flex-shrink-0 flex-col items-center justify-center rounded-lg bg-accent-500/10">
                            <span className="text-sm font-bold text-accent-300">{a.time.split(':')[0]}</span>
                            <span className="text-[10px] text-silver-500">{a.time.split(':')[1]}</span>
                          </div>
                          <div className="min-w-0 flex-1">
                            <Link
                              to={`/app/leads/${a.leadId}`}
                              className="text-sm font-medium text-white hover:text-accent-300"
                            >
                              {a.leadName}
                            </Link>
                            <p className="text-xs text-silver-500 capitalize">
                              {a.type.replace('_', ' ')} {agentMap[a.agentId]?.name ? ` ${agentMap[a.agentId]?.name}` : ''}
                            </p>
                          </div>
                          <AppointmentStatusBadge status={a.status} />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}
