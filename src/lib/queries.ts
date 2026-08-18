import { supabase } from './supabase';
import type {
  Lead,
  LeadTemperature,
  PipelineStage,
  LeadSource,
  BuyerIntent,
  FinancingStatus,
  PurchaseTimeline,
  Appointment,
  AppointmentStatus,
  AppointmentType,
  ConversationEntry,
  MessageType,
  Agent,
  ActivityEvent,
} from '@/types';

// ---------- Types for raw Supabase rows ----------

interface LeadRow {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  phone: string | null;
  source: string | null;
  source_detail: string | null;
  lead_type: string | null;
  stage: string | null;
  priority: string | null;
  assigned_agent_id: string | null;
  consent_sms: boolean | null;
  consent_email: boolean | null;
  last_contacted_at: string | null;
  next_follow_up_at: string | null;
  created_at: string;
  updated_at: string | null;
  buyer_state: string | null;
  inquiry_count: number | null;
  last_inquiry_at: string | null;
  client_id: string | null;
  do_not_contact: boolean | null;
  preferred_channel: string | null;
}

interface LeadScoreRow {
  id: string;
  lead_id: string;
  readiness_score: number | null;
  intent_score: number | null;
  engagement_score: number | null;
  financing_score: number | null;
  overall_score: number | null;
  classification: string | null;
  recommended_action: string | null;
  score_reason: string | null;
  scored_at: string;
}

interface LeadQualificationRow {
  id: string;
  lead_id: string;
  budget_min: string | null;
  budget_max: string | null;
  preferred_location: string | null;
  property_type: string | null;
  bedrooms: number | null;
  bathrooms: string | null;
  timeline: string | null;
  financing_status: string | null;
  has_agent: boolean | null;
  first_time_buyer: boolean | null;
  motivation: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

interface BuyerVerificationRow {
  id: string;
  lead_id: string;
  email_verified: boolean;
  phone_verified: boolean;
  financing_verified: boolean;
  proof_of_funds_verified: boolean;
  verification_status: string;
  verification_notes: string | null;
  verified_at: string | null;
  created_at: string;
  updated_at: string;
}

interface ConversationRow {
  id: string;
  lead_id: string;
  channel: string;
  direction: string;
  sender_type: string | null;
  message: string | null;
  sent_at: string | null;
  created_at: string | null;
}

interface AppointmentRow {
  id: string;
  lead_id: string;
  appointment_type: string | null;
  scheduled_at: string;
  status: string;
  meeting_link: string | null;
  created_at: string;
  updated_at: string | null;
  agent_id: string | null;
}

interface AgentRow {
  id: string;
  client_id: string | null;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  active: boolean;
  notification_email: boolean;
  notification_sms: boolean;
  created_at: string;
}

interface FollowUpJobRow {
  id: string;
  lead_id: string;
  channel: string;
  purpose: string | null;
  due_at: string;
  status: string;
  sent_at: string | null;
  created_at: string;
}

interface LeadInquiryRow {
  id: string;
  lead_id: string;
  source: string;
  external_inquiry_id: string | null;
  inquiry_type: string | null;
  raw_message: string | null;
  property_reference: string | null;
  created_at: string;
  source_detail: string | null;
}

// ---------- Mappers ----------

function mapTemperature(priority: string | null): LeadTemperature {
  if (priority === 'hot') return 'hot';
  if (priority === 'warm') return 'warm';
  if (priority === 'cold') return 'cold';
  return 'cold';
}

function mapStage(stage: string | null): PipelineStage {
  const valid: PipelineStage[] = [
    'new', 'contacted', 'qualified', 'appointment_booked', 'viewing', 'won', 'lost',
  ];
  if (stage && valid.includes(stage as PipelineStage)) return stage as PipelineStage;
  return 'new';
}

function mapSource(source: string | null): LeadSource {
  const valid: LeadSource[] = ['facebook', 'instagram', 'website', 'manual', 'other'];
  if (source && valid.includes(source as LeadSource)) return source as LeadSource;
  return 'other';
}

function mapBuyerIntent(buyerState: string | null, classification: string | null): BuyerIntent {
  if (buyerState === 'qualified' || classification === 'hot') return 'high';
  if (buyerState === 'exploring' || classification === 'cold') return 'low';
  if (classification === 'warm') return 'medium';
  return 'medium';
}

function mapFinancing(financing: string | null): FinancingStatus {
  if (financing === 'preapproved' || financing === 'pre_approved') return 'pre_approved';
  if (financing === 'pre_qualified' || financing === 'prequalified') return 'pre_qualified';
  if (financing === 'cash') return 'cash';
  return 'not_started';
}

function mapTimeline(timeline: string | null): PurchaseTimeline {
  const map: Record<string, PurchaseTimeline> = {
    '0_30_days': '0_30_days',
    '31_90_days': '1_3_months',
    '1_3_months': '1_3_months',
    '3_6_months': '3_6_months',
    '6_plus_months': '6_plus_months',
    exploring: 'exploring',
  };
  return map[timeline || ''] || 'exploring';
}

function mapBudget(min: string | null, max: string | null): string {
  if (!min && !max) return 'Not available yet';
  const fmt = (v: string) => `$${Number(v).toLocaleString('en-US')}`;
  if (min && max) return `${fmt(min)} to ${fmt(max)}`;
  return min ? fmt(min) : `Up to ${fmt(max!)}`;
}

function mapAppointmentStatus(status: string): AppointmentStatus {
  if (status === 'completed') return 'completed';
  if (status === 'cancelled') return 'cancelled';
  if (status === 'today') return 'today';
  return 'upcoming';
}

function mapAppointmentType(type: string | null): AppointmentType {
  if (type === 'viewing') return 'viewing';
  if (type === 'consultation' || type === 'Buyer Consultation') return 'consultation';
  if (type === 'follow_up' || type === 'follow-up') return 'follow_up';
  if (type === 'closing') return 'closing';
  return 'consultation';
}

function mapChannel(channel: string): MessageType {
  if (channel === 'sms') return 'sms';
  if (channel === 'email') return 'email';
  if (channel === 'facebook') return 'facebook';
  if (channel === 'instagram') return 'instagram';
  if (channel === 'website') return 'website';
  return 'note';
}

function mapAgent(row: AgentRow): Agent {
  const initials = (row.full_name || '?')
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('');
  return {
    id: row.id,
    name: row.full_name || 'Unknown Agent',
    email: row.email || '',
    phone: row.phone || '',
    avatarInitials: initials,
    role: 'agent',
    leadsCount: 0,
    appointmentsCount: 0,
    wonCount: 0,
    conversionRate: 0,
  };
}

// ---------- Query functions ----------

export async function fetchAgents(): Promise<Record<string, Agent>> {
  const { data, error } = await supabase.from('agents').select('*');
  if (error) {
    console.error('Failed to fetch agents:', error.message);
    return {};
  }
  const rows = (data || []) as AgentRow[];
  const map: Record<string, Agent> = {};
  for (const row of rows) {
    map[row.id] = mapAgent(row);
  }
  return map;
}

export async function fetchLatestScores(): Promise<Record<string, LeadScoreRow>> {
  const { data, error } = await supabase
    .from('lead_scores')
    .select('*')
    .order('scored_at', { ascending: false });
  if (error) {
    console.error('Failed to fetch lead scores:', error.message);
    return {};
  }
  const rows = (data || []) as LeadScoreRow[];
  const map: Record<string, LeadScoreRow> = {};
  for (const row of rows) {
    if (!map[row.lead_id]) {
      map[row.lead_id] = row;
    }
  }
  return map;
}

export async function fetchQualifications(): Promise<Record<string, LeadQualificationRow>> {
  const { data, error } = await supabase
    .from('lead_qualification')
    .select('*')
    .order('updated_at', { ascending: false });
  if (error) {
    console.error('Failed to fetch qualifications:', error.message);
    return {};
  }
  const rows = (data || []) as LeadQualificationRow[];
  const map: Record<string, LeadQualificationRow> = {};
  for (const row of rows) {
    if (!map[row.lead_id]) {
      map[row.lead_id] = row;
    }
  }
  return map;
}

export async function fetchVerifications(): Promise<Record<string, BuyerVerificationRow>> {
  const { data, error } = await supabase
    .from('buyer_verification')
    .select('*')
    .order('updated_at', { ascending: false });
  if (error) {
    console.error('Failed to fetch verifications:', error.message);
    return {};
  }
  const rows = (data || []) as BuyerVerificationRow[];
  const map: Record<string, BuyerVerificationRow> = {};
  for (const row of rows) {
    if (!map[row.lead_id]) {
      map[row.lead_id] = row;
    }
  }
  return map;
}

function buildLead(
  row: LeadRow,
  score: LeadScoreRow | undefined,
  qual: LeadQualificationRow | undefined,
  agentMap: Record<string, Agent>,
): Lead {
  const temperature = score?.classification
    ? mapTemperature(score.classification)
    : mapTemperature(row.priority);

  const buyerIntent = mapBuyerIntent(row.buyer_state, score?.classification || null);

  const aiSummary = score?.score_reason || 'Not available yet';

  return {
    id: row.id,
    firstName: row.first_name || '',
    lastName: row.last_name || '',
    email: row.email || '',
    phone: row.phone || '',
    source: mapSource(row.source),
    temperature,
    stage: mapStage(row.stage),
    assignedAgentId: row.assigned_agent_id || '',
    createdAt: row.created_at,
    lastContact: row.last_contacted_at,
    nextFollowUp: row.next_follow_up_at,
    lastMessage: null,
    appointmentStatus: null,
    qualificationScore: score?.overall_score ?? 0,
    buyerIntent,
    budget: qual ? mapBudget(qual.budget_min, qual.budget_max) : 'Not available yet',
    preferredLocation: qual?.preferred_location || 'Not available yet',
    propertyType: qual?.property_type || 'Not available yet',
    timeline: mapTimeline(qual?.timeline || null),
    financing: mapFinancing(qual?.financing_status || null),
    aiSummary,
    notes: qual?.notes || qual?.motivation || 'Not available yet',
  };
}

export interface LeadListResult {
  leads: Lead[];
  agentMap: Record<string, Agent>;
  error: string | null;
}

export async function fetchLeads(): Promise<LeadListResult> {
  const [leadsRes, scoreMap, qualMap, agentMap] = await Promise.all([
    supabase.from('leads').select('*').order('created_at', { ascending: false }),
    fetchLatestScores(),
    fetchQualifications(),
    fetchAgents(),
  ]);

  if (leadsRes.error) {
    console.error('Failed to fetch leads:', leadsRes.error.message);
    return { leads: [], agentMap, error: leadsRes.error.message };
  }

  const rows = (leadsRes.data || []) as LeadRow[];
  const leads = rows.map((r) => buildLead(r, scoreMap[r.id], qualMap[r.id], agentMap));

  return { leads, agentMap, error: null };
}

export interface LeadDetailResult {
  lead: Lead | null;
  agent: Agent | null;
  conversations: ConversationEntry[];
  appointments: Appointment[];
  activities: ActivityEvent[];
  verification: BuyerVerificationRow | null;
  inquiries: LeadInquiryRow[];
  error: string | null;
}

export async function fetchLeadDetail(id: string): Promise<LeadDetailResult> {
  const [leadRes, scoreMap, qualMap, agentMap, convRes, apptRes, verifyRes, inquiryRes] =
    await Promise.all([
      supabase.from('leads').select('*').eq('id', id).single(),
      fetchLatestScores(),
      fetchQualifications(),
      fetchAgents(),
      supabase.from('conversations').select('*').eq('lead_id', id).order('sent_at', { ascending: true }),
      supabase.from('appointments').select('*').eq('lead_id', id).order('scheduled_at', { ascending: false }),
      supabase.from('buyer_verification').select('*').eq('lead_id', id).order('updated_at', { ascending: false }).limit(1),
      supabase.from('lead_inquiries').select('*').eq('lead_id', id).order('created_at', { ascending: false }),
    ]);

  if (leadRes.error) {
    console.error('Failed to fetch lead:', leadRes.error.message);
    return {
      lead: null,
      agent: null,
      conversations: [],
      appointments: [],
      activities: [],
      verification: null,
      inquiries: [],
      error: leadRes.error.message,
    };
  }

  const leadRow = leadRes.data as LeadRow;
  const lead = buildLead(leadRow, scoreMap[leadRow.id], qualMap[leadRow.id], agentMap);
  const agent = leadRow.assigned_agent_id ? agentMap[leadRow.assigned_agent_id] || null : null;

  const conversations: ConversationEntry[] = ((convRes.data || []) as ConversationRow[]).map((c) => ({
    id: c.id,
    leadId: c.lead_id,
    channel: mapChannel(c.channel),
    direction: (c.direction as 'inbound' | 'outbound') || 'inbound',
    body: c.message || '',
    timestamp: c.sent_at || c.created_at || '',
  }));

  const appointments: Appointment[] = ((apptRes.data || []) as AppointmentRow[]).map((a) => {
    const dt = new Date(a.scheduled_at);
    return {
      id: a.id,
      leadId: a.lead_id,
      leadName: `${lead.firstName} ${lead.lastName}`,
      agentId: a.agent_id || '',
      date: dt.toISOString().split('T')[0],
      time: dt.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
      type: mapAppointmentType(a.appointment_type),
      status: mapAppointmentStatus(a.status),
      notes: a.meeting_link ? `Meeting link: ${a.meeting_link}` : '',
    };
  });

  const verification = verifyRes.data
    ? (verifyRes.data as BuyerVerificationRow)
    : null;

  const inquiries = ((inquiryRes.data || []) as LeadInquiryRow[]);

  // Build activities from inquiries
  const activities: ActivityEvent[] = inquiries.map((q) => ({
    id: q.id,
    leadId: q.lead_id,
    kind: 'lead_created',
    text: q.raw_message || q.inquiry_type || 'Inquiry received',
    timestamp: q.created_at,
  }));

  return {
    lead,
    agent,
    conversations,
    appointments,
    activities,
    verification,
    inquiries,
    error: null,
  };
}

export interface AppointmentsResult {
  appointments: Appointment[];
  agentMap: Record<string, Agent>;
  error: string | null;
}

export async function fetchAppointments(): Promise<AppointmentsResult> {
  const [apptRes, agentMap] = await Promise.all([
    supabase.from('appointments').select('*').order('scheduled_at', { ascending: false }),
    fetchAgents(),
  ]);

  if (apptRes.error) {
    console.error('Failed to fetch appointments:', apptRes.error.message);
    return { appointments: [], agentMap, error: apptRes.error.message };
  }

  const rows = (apptRes.data || []) as AppointmentRow[];

  // Fetch lead names for appointments
  const leadIds = [...new Set(rows.map((r) => r.lead_id))];
  let leadNameMap: Record<string, { firstName: string; lastName: string }> = {};
  if (leadIds.length > 0) {
    const { data: leadData } = await supabase
      .from('leads')
      .select('id, first_name, last_name')
      .in('id', leadIds);
    if (leadData) {
      for (const l of leadData as { id: string; first_name: string; last_name: string }[]) {
        leadNameMap[l.id] = { firstName: l.first_name || '', lastName: l.last_name || '' };
      }
    }
  }

  const appointments: Appointment[] = rows.map((a) => {
    const dt = new Date(a.scheduled_at);
    const names = leadNameMap[a.lead_id] || { firstName: '', lastName: '' };
    return {
      id: a.id,
      leadId: a.lead_id,
      leadName: `${names.firstName} ${names.lastName}`.trim() || 'Unknown Lead',
      agentId: a.agent_id || '',
      date: dt.toISOString().split('T')[0],
      time: dt.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }),
      type: mapAppointmentType(a.appointment_type),
      status: mapAppointmentStatus(a.status),
      notes: a.meeting_link ? `Meeting link: ${a.meeting_link}` : '',
    };
  });

  return { appointments, agentMap, error: null };
}

export interface ConversationsResult {
  conversations: { leadId: string; leadName: string; entries: ConversationEntry[] }[];
  error: string | null;
}

export async function fetchAllConversations(): Promise<ConversationsResult> {
  const [convRes, leadsRes] = await Promise.all([
    supabase.from('conversations').select('*').order('sent_at', { ascending: false }),
    supabase.from('leads').select('id, first_name, last_name'),
  ]);

  if (convRes.error) {
    console.error('Failed to fetch conversations:', convRes.error.message);
    return { conversations: [], error: convRes.error.message };
  }

  const leadNameMap: Record<string, string> = {};
  if (leadsRes.data) {
    for (const l of leadsRes.data as { id: string; first_name: string; last_name: string }[]) {
      leadNameMap[l.id] = `${l.first_name || ''} ${l.last_name || ''}`.trim();
    }
  }

  const rows = (convRes.data || []) as ConversationRow[];
  const byLead: Record<string, ConversationEntry[]> = {};

  for (const c of rows) {
    if (!byLead[c.lead_id]) byLead[c.lead_id] = [];
    byLead[c.lead_id].unshift({
      id: c.id,
      leadId: c.lead_id,
      channel: mapChannel(c.channel),
      direction: (c.direction as 'inbound' | 'outbound') || 'inbound',
      body: c.message || '',
      timestamp: c.sent_at || c.created_at || '',
    });
  }

  const conversations = Object.entries(byLead).map(([leadId, entries]) => ({
    leadId,
    leadName: leadNameMap[leadId] || 'Unknown Lead',
    entries,
  }));

  return { conversations, error: null };
}

export interface DashboardStatsResult {
  totalLeads: number;
  newLeads: number;
  hotLeads: number;
  qualifiedLeads: number;
  followUpsDue: number;
  appointmentsBooked: number;
  error: string | null;
}

export async function fetchDashboardStats(): Promise<DashboardStatsResult> {
  const [leadsRes, scoreRes, apptRes, followRes] = await Promise.all([
    supabase.from('leads').select('id, stage, priority, next_follow_up_at'),
    fetchLatestScores(),
    supabase.from('appointments').select('id, status, scheduled_at'),
    supabase.from('follow_up_jobs').select('id, status, due_at'),
  ]);

  if (leadsRes.error) {
    console.error('Failed to fetch dashboard stats:', leadsRes.error.message);
    return {
      totalLeads: 0,
      newLeads: 0,
      hotLeads: 0,
      qualifiedLeads: 0,
      followUpsDue: 0,
      appointmentsBooked: 0,
      error: leadsRes.error.message,
    };
  }

  const leadRows = (leadsRes.data || []) as {
    id: string;
    stage: string | null;
    priority: string | null;
    next_follow_up_at: string | null;
  }[];

  const totalLeads = leadRows.length;
  const newLeads = leadRows.filter((l) => l.stage === 'new').length;
  const qualifiedLeads = leadRows.filter((l) => l.stage === 'qualified').length;

  // Hot leads from score classification
  const hotFromScores = Object.values(scoreRes).filter((s) => s.classification === 'hot').length;
  const hotFromPriority = leadRows.filter((l) => l.priority === 'hot').length;
  const hotLeads = Math.max(hotFromScores, hotFromPriority);

  const followUpsDue = leadRows.filter(
    (l) => l.next_follow_up_at && l.stage !== 'closed' && l.stage !== 'lost',
  ).length;

  const now = new Date();
  const apptRows = (apptRes.data || []) as { id: string; status: string; scheduled_at: string }[];
  const appointmentsBooked = apptRows.filter((a) => {
    if (a.status === 'cancelled' || a.status === 'completed') return false;
    return new Date(a.scheduled_at) >= now;
  }).length;

  return {
    totalLeads,
    newLeads,
    hotLeads,
    qualifiedLeads,
    followUpsDue,
    appointmentsBooked,
    error: null,
  };
}

export interface LeadSourceBreakdownResult {
  breakdown: { source: LeadSource; count: number; label: string }[];
  error: string | null;
}

export async function fetchLeadSourceBreakdown(): Promise<LeadSourceBreakdownResult> {
  const { data, error } = await supabase.from('leads').select('source');
  if (error) {
    console.error('Failed to fetch lead sources:', error.message);
    return { breakdown: [], error: error.message };
  }

  const rows = (data || []) as { source: string | null }[];
  const counts: Record<string, number> = {};
  for (const r of rows) {
    const s = r.source || 'other';
    counts[s] = (counts[s] || 0) + 1;
  }

  const labels: Record<string, string> = {
    facebook: 'Facebook',
    instagram: 'Instagram',
    website: 'Website',
    manual: 'Manual',
    other: 'Other',
  };

  const sources: LeadSource[] = ['facebook', 'instagram', 'website', 'manual', 'other'];
  const breakdown = sources
    .map((s) => ({ source: s, count: counts[s] || 0, label: labels[s] }))
    .filter((s) => s.count > 0);

  return { breakdown, error: null };
}
