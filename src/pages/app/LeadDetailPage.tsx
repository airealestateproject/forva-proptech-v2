import { useState, useEffect } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Clock,
  User,
  Brain,
  MessageSquare,
  Home,
  DollarSign,
  CalendarCheck,
  CheckCircle2,
  Reply,
  UserPlus,
  Sparkles,
  Ban,
  ShieldCheck,
} from 'lucide-react';
import { Seo } from '@/components/shared/Seo';
import {
  TemperatureBadge,
  StageBadge,
  SourceBadge,
  ScorePill,
} from '@/components/shared/Badges';
import { LoadingState, ErrorState, EmptyState } from '@/components/shared/AsyncStates';
import { fetchLeadDetail } from '@/lib/queries';
import {
  formatRelative,
  formatDateTime,
  formatDate,
  stageConfig,
  stageOrder,
} from '@/lib/format';
import type { Agent, Lead, Appointment, ConversationEntry, PipelineStage, MessageType } from '@/types';

const channelLabels: Record<MessageType, string> = {
  sms: 'SMS',
  email: 'Email',
  facebook: 'Facebook',
  instagram: 'Instagram',
  website: 'Website',
  note: 'Note',
};

const channelColors: Record<MessageType, string> = {
  sms: 'bg-accent-500/15 text-accent-300',
  email: 'bg-indigo-500/15 text-indigo-300',
  facebook: 'bg-blue-500/15 text-blue-300',
  instagram: 'bg-fuchsia-500/15 text-fuchsia-300',
  website: 'bg-teal-500/15 text-teal-300',
  note: 'bg-silver-500/15 text-silver-300',
};

export function LeadDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [lead, setLead] = useState<Lead | null>(null);
  const [agent, setAgent] = useState<Agent | null>(null);
  const [conversations, setConversations] = useState<ConversationEntry[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [verificationStatus, setVerificationStatus] = useState<string | null>(null);
  const [doNotContact, setDoNotContact] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stage, setStage] = useState<PipelineStage | undefined>(undefined);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    setLoading(true);
    fetchLeadDetail(id).then((result) => {
      if (cancelled) return;
      setLead(result.lead);
      setAgent(result.agent);
      setConversations(result.conversations);
      setAppointments(result.appointments);
      setVerificationStatus(result.verification?.verification_status || null);
      setDoNotContact(result.lead?.notes?.includes('do_not_contact') || false);
      setStage(result.lead?.stage);
      setError(result.error);
      setLoading(false);
    });
    return () => { cancelled = true; };
  }, [id]);

  if (loading) {
    return (
      <>
        <Seo title="Lead Detail" noindex />
        <LoadingState label="Loading lead..." />
      </>
    );
  }

  if (error || !lead) {
    return (
      <>
        <Seo title="Lead Detail" noindex />
        <ErrorState message={error || 'Lead not found.'} />
      </>
    );
  }

  const appt = appointments[0];

  return (
    <>
      <Seo title={`${lead.firstName} ${lead.lastName}`} noindex />
      <div className="space-y-5">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="btn-ghost text-sm"
        >
          <ArrowLeft size={16} />
          Back
        </button>

        {/* Do Not Contact banner */}
        {doNotContact && (
          <div className="flex items-center gap-3 rounded-lg border border-red-500/30 bg-red-500/10 p-4">
            <Ban size={18} className="flex-shrink-0 text-red-300" />
            <p className="text-sm text-red-200">
              This lead has been flagged as Do Not Contact. Do not initiate follow-up.
            </p>
          </div>
        )}

        {/* Header card */}
        <div className="card p-5 sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-accent-gradient text-lg font-bold text-white">
                {lead.firstName[0]}{lead.lastName[0]}
              </div>
              <div>
                <h1 className="text-xl font-bold text-white sm:text-2xl">
                  {lead.firstName} {lead.lastName}
                </h1>
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <TemperatureBadge temp={lead.temperature} />
                  <StageBadge stage={lead.stage} />
                  <SourceBadge source={lead.source} />
                  {verificationStatus && verificationStatus !== 'unverified' && (
                    <span className="badge bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                      <ShieldCheck size={12} />
                      {verificationStatus}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <ScorePill score={lead.qualificationScore} />
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <ContactItem icon={Mail} label="Email" value={lead.email} />
            <ContactItem icon={Phone} label="Phone" value={lead.phone} />
            <ContactItem icon={User} label="Assigned Agent" value={agent?.name} />
            <ContactItem icon={Clock} label="Created" value={formatDate(lead.createdAt)} />
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          {/* Left: Buyer Intelligence + Pipeline + Appointment */}
          <div className="space-y-5 lg:col-span-2">
            {/* AI Buyer Intelligence */}
            <div className="card overflow-hidden">
              <div className="flex items-center gap-2 border-b border-white/8 bg-accent-500/5 px-5 py-3">
                <Brain size={18} className="text-accent-300" />
                <h2 className="text-sm font-semibold text-white">AI Buyer Intelligence</h2>
                <span className="ml-auto badge bg-accent-500/15 text-accent-300 border border-accent-500/30">
                  <Sparkles size={12} />
                  AI-derived
                </span>
              </div>
              <div className="p-5">
                <div className="grid gap-4 sm:grid-cols-2">
                  <IntelItem icon={Brain} label="Buyer Intent" value={lead.buyerIntent.charAt(0).toUpperCase() + lead.buyerIntent.slice(1)} />
                  <IntelItem icon={DollarSign} label="Budget" value={lead.budget} />
                  <IntelItem icon={MapPin} label="Preferred Location" value={lead.preferredLocation} />
                  <IntelItem icon={Home} label="Property Type" value={lead.propertyType} />
                  <IntelItem icon={Clock} label="Timeline" value={timelineLabel(lead.timeline)} />
                  <IntelItem icon={DollarSign} label="Financing" value={financingLabel(lead.financing)} />
                </div>
                <div className="mt-5 rounded-lg border border-accent-500/20 bg-accent-500/5 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-accent-300">AI Summary</p>
                  <p className="mt-2 text-sm leading-relaxed text-silver-200">{lead.aiSummary}</p>
                  <p className="mt-3 text-xs text-silver-500">
                    AI-derived information. Verify key details with the lead before acting.
                  </p>
                </div>
              </div>
            </div>

            {/* Pipeline */}
            <div className="card p-5">
              <h2 className="text-sm font-semibold text-white">Pipeline Stage</h2>
              <p className="mt-1 text-xs text-silver-500">Update the current stage of this lead. Changes are not persisted in demo mode.</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {stageOrder.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setStage(s)}
                    className={`badge transition-all ${
                      (stage || lead.stage) === s
                        ? stageConfig[s].classes + ' ring-2 ring-offset-2 ring-offset-navy-850 ring-accent-400/50'
                        : 'bg-white/5 text-silver-400 border border-white/10 hover:border-white/20'
                    }`}
                  >
                    {stageConfig[s].label}
                  </button>
                ))}
              </div>
            </div>

            {/* Conversation timeline */}
            <div className="card p-5">
              <h2 className="text-sm font-semibold text-white">Conversation Timeline</h2>
              {conversations.length === 0 ? (
                <p className="mt-4 text-sm text-silver-500">No conversation recorded yet.</p>
              ) : (
                <ol className="mt-4 space-y-4">
                  {conversations.map((c) => (
                    <li key={c.id} className="flex gap-3">
                      <div className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg text-xs font-bold ${channelColors[c.channel]}`}>
                        {channelLabels[c.channel][0]}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={`badge ${channelColors[c.channel]}`}>{channelLabels[c.channel]}</span>
                          <span className="text-xs text-silver-500">
                            {c.direction === 'inbound' ? 'From lead' : 'From agent'}
                          </span>
                          <span className="text-xs text-silver-500">{formatRelative(c.timestamp)}</span>
                        </div>
                        <p className="mt-1.5 text-sm text-silver-200">{c.body}</p>
                      </div>
                    </li>
                  ))}
                </ol>
              )}
            </div>
          </div>

          {/* Right: Follow-up + Appointment + Activity + Notes */}
          <div className="space-y-5">
            {/* Follow-up */}
            <div className="card p-5">
              <h2 className="text-sm font-semibold text-white">Follow-up</h2>
              <dl className="mt-3 space-y-3 text-sm">
                <Row label="Last follow-up" value={lead.lastContact ? formatDateTime(lead.lastContact) : 'Not available yet'} />
                <Row label="Next scheduled" value={lead.nextFollowUp ? formatDateTime(lead.nextFollowUp) : 'Not available yet'} />
                <Row label="Status" value={lead.nextFollowUp ? 'Scheduled' : 'None scheduled'} />
              </dl>
            </div>

            {/* Appointment */}
            <div className="card p-5">
              <h2 className="text-sm font-semibold text-white">Appointment</h2>
              {appt ? (
                <dl className="mt-3 space-y-3 text-sm">
                  <Row label="Date" value={formatDate(appt.date)} />
                  <Row label="Time" value={appt.time} />
                  <Row label="Type" value={appt.type.replace('_', ' ')} />
                  <Row label="Status" value={appt.status.charAt(0).toUpperCase() + appt.status.slice(1)} />
                  {appt.notes && (
                    <div>
                      <dt className="text-xs text-silver-500">Notes</dt>
                      <dd className="mt-1 text-sm text-silver-200">{appt.notes}</dd>
                    </div>
                  )}
                </dl>
              ) : (
                <p className="mt-3 text-sm text-silver-500">No appointment scheduled.</p>
              )}
            </div>

            {/* Activity timeline */}
            <div className="card p-5">
              <h2 className="text-sm font-semibold text-white">Activity Timeline</h2>
              <ol className="mt-4 space-y-3">
                <ActivityRow icon={UserPlus} text="Lead created" time={formatRelative(lead.createdAt)} />
                {lead.lastContact && (
                  <ActivityRow icon={MessageSquare} text="Last contact made" time={formatRelative(lead.lastContact)} />
                )}
                {lead.stage === 'qualified' && (
                  <ActivityRow icon={CheckCircle2} text="Lead qualified" time={formatRelative(lead.lastContact)} />
                )}
                {appt && (
                  <ActivityRow icon={CalendarCheck} text={`Appointment ${appt.status}`} time={formatRelative(appt.date)} />
                )}
              </ol>
            </div>

            {/* Notes */}
            <div className="card p-5">
              <h2 className="text-sm font-semibold text-white">Realtor Notes</h2>
              <p className="mt-3 text-sm text-silver-200">{lead.notes}</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

function ContactItem({ icon: Icon, label, value }: { icon: typeof Mail; label: string; value?: string }) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-white/8 bg-navy-900/40 p-3">
      <Icon size={16} className="text-accent-300 flex-shrink-0" />
      <div className="min-w-0">
        <p className="text-xs text-silver-500">{label}</p>
        <p className="truncate text-sm text-white">{value || 'Not available yet'}</p>
      </div>
    </div>
  );
}

function IntelItem({ icon: Icon, label, value }: { icon: typeof Mail; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-accent-500/10 text-accent-300">
        <Icon size={16} />
      </div>
      <div className="min-w-0">
        <p className="text-xs text-silver-500">{label}</p>
        <p className="text-sm font-medium text-white">{value}</p>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <dt className="text-xs text-silver-500">{label}</dt>
      <dd className="text-right text-sm text-white">{value}</dd>
    </div>
  );
}

function ActivityRow({ icon: Icon, text, time }: { icon: typeof Mail; text: string; time: string }) {
  return (
    <li className="flex gap-3">
      <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-accent-500/15 text-accent-300">
        <Icon size={14} />
      </div>
      <div>
        <p className="text-sm text-silver-200">{text}</p>
        <p className="text-xs text-silver-500">{time}</p>
      </div>
    </li>
  );
}

function timelineLabel(t: string): string {
  const map: Record<string, string> = {
    '0_30_days': '0 to 30 days',
    '1_3_months': '1 to 3 months',
    '3_6_months': '3 to 6 months',
    '6_plus_months': '6+ months',
    exploring: 'Exploring',
  };
  return map[t] || t;
}

function financingLabel(f: string): string {
  const map: Record<string, string> = {
    pre_approved: 'Pre-approved',
    pre_qualified: 'Pre-qualified',
    cash: 'Cash buyer',
    not_started: 'Not started',
  };
  return map[f] || f;
}
