import { Mail, Phone, Users, CalendarCheck, Trophy, TrendingUp } from 'lucide-react';
import { Seo } from '@/components/shared/Seo';
import { PageHeader } from '@/components/shared/SectionHeading';
import { agents } from '@/data/demo';
import { useAuth } from '@/context/AuthContext';

export function TeamPage() {
  const { isAgency, user } = useAuth();

  if (!isAgency) {
    return (
      <>
        <Seo title="Team" noindex />
        <div className="card py-16 text-center">
          <Users size={32} className="mx-auto text-silver-600" />
          <p className="mt-3 text-sm text-silver-400">Team management is available for agency accounts.</p>
          <p className="mt-1 text-xs text-silver-500">Upgrade to an agency plan to manage multiple agents.</p>
        </div>
      </>
    );
  }

  return (
    <>
      <Seo title="Team" noindex />
      <div className="space-y-5">
        <PageHeader
          title="Team"
          subtitle={`${user?.agencyName} • ${agents.length} members`}
        />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {agents.map((a) => (
            <div key={a.id} className="card card-hover p-5">
              <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent-gradient text-sm font-bold text-white">
                  {a.avatarInitials}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-white">{a.name}</p>
                  <p className="text-xs text-silver-500 capitalize">
                    {a.role === 'agency_owner' ? 'Agency Owner' : 'Agent'}
                  </p>
                </div>
              </div>

              <div className="mt-4 space-y-2 text-xs text-silver-400">
                <div className="flex items-center gap-2">
                  <Mail size={13} className="text-silver-500" />
                  <span className="truncate">{a.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone size={13} className="text-silver-500" />
                  <span>{a.phone}</span>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-3 gap-2 border-t border-white/8 pt-4 text-center">
                <div>
                  <div className="flex items-center justify-center text-accent-300">
                    <Users size={14} />
                  </div>
                  <p className="mt-1 text-lg font-bold text-white">{a.leadsCount}</p>
                  <p className="text-[10px] text-silver-500">Leads</p>
                </div>
                <div>
                  <div className="flex items-center justify-center text-violet-300">
                    <CalendarCheck size={14} />
                  </div>
                  <p className="mt-1 text-lg font-bold text-white">{a.appointmentsCount}</p>
                  <p className="text-[10px] text-silver-500">Appts</p>
                </div>
                <div>
                  <div className="flex items-center justify-center text-emerald-300">
                    <Trophy size={14} />
                  </div>
                  <p className="mt-1 text-lg font-bold text-white">{a.wonCount}</p>
                  <p className="text-[10px] text-silver-500">Won</p>
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between rounded-lg bg-navy-900/50 px-3 py-2">
                <span className="flex items-center gap-1.5 text-xs text-silver-400">
                  <TrendingUp size={12} />
                  Conversion
                </span>
                <span className="text-sm font-semibold text-emerald-300">{a.conversionRate}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
