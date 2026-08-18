export type AccountType = 'individual' | 'agency';
export type UserRole = 'super_admin' | 'agency_owner' | 'agency_admin' | 'agent';

export type BillingPeriod = 'monthly' | 'annual';
export type SubscriptionStatus = 'trial' | 'active' | 'past_due' | 'cancelled' | 'expired';
export type TrialStatus = 'active' | 'expired' | 'converted' | 'cancelled';

export type SupportedCountry = 'US' | 'GB' | 'AU';
export type Currency = 'USD' | 'GBP' | 'AUD';

export interface RegionalSettings {
  country: SupportedCountry;
  currency: Currency;
  timezone: string;
  phoneFormat: 'US' | 'UK' | 'AU';
  dateFormat: 'MM/DD/YYYY' | 'DD/MM/YYYY';
}

export interface PlanEntitlement {
  maxUsers: number;
  maxActiveLeads: number;
  aiQualification: boolean;
  automatedFollowUp: boolean;
  appointments: boolean;
  notifications: boolean;
  standardAnalytics: boolean;
  advancedAnalytics: boolean;
  leadAssignment: boolean;
  teamManagement: boolean;
  agencyControls: boolean;
  coreIntegrations: boolean;
  higherUsageAllowances: boolean;
}

export interface Plan {
  id: 'solo' | 'team' | 'agency';
  name: string;
  description: string;
  monthlyPrice: number;
  annualPrice: number | null;
  billingPeriod: BillingPeriod;
  features: string[];
  entitlements: PlanEntitlement;
  cta: string;
  highlighted?: boolean;
}

export interface Usage {
  leadsProcessed: number;
  aiQualifications: number;
  automatedFollowUps: number;
  emailActivity: number;
  smsActivity: number;
  appointmentsBooked: number;
  teamSeatsUsed: number;
}

export interface Organization {
  id: string;
  name: string;
  country: SupportedCountry;
  primaryMarket: string;
  timezone: string;
  planId: Plan['id'];
}

export interface OrganizationMember {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: 'active' | 'invited';
  leadsCount: number;
  appointmentsCount: number;
  conversionRate: number;
}

export interface Subscription {
  id: string;
  planId: Plan['id'];
  status: SubscriptionStatus;
  billingPeriod: BillingPeriod;
  monthlyPrice: number;
  trialStatus: TrialStatus;
  trialStartDate: string | null;
  trialEndDate: string | null;
  daysRemaining: number;
  nextBillingDate: string | null;
  seatsUsed: number;
  seatsTotal: number;
}

export interface AIVoiceAddOn {
  status: 'not_activated' | 'contact_support' | 'active';
  callsTotal: number;
  answeredCalls: number;
  totalCallDuration: string;
  qualificationResults: number;
  appointmentsGenerated: number;
  callSummaries: AIVoiceCallSummary[];
}

export interface AIVoiceCallSummary {
  id: string;
  leadName: string;
  date: string;
  duration: string;
  outcome: string;
  qualificationResult: string;
  summary: string;
}

export type LeadTemperature = 'hot' | 'warm' | 'cold';
export type PipelineStage =
  | 'new'
  | 'contacted'
  | 'qualified'
  | 'appointment_booked'
  | 'viewing'
  | 'won'
  | 'lost';

export type LeadSource =
  | 'facebook'
  | 'instagram'
  | 'website'
  | 'manual'
  | 'other';

export type BuyerIntent = 'high' | 'medium' | 'low';
export type FinancingStatus = 'pre_approved' | 'pre_qualified' | 'cash' | 'not_started';
export type PurchaseTimeline =
  | '0_30_days'
  | '1_3_months'
  | '3_6_months'
  | '6_plus_months'
  | 'exploring';

export type MessageType = 'sms' | 'email' | 'facebook' | 'instagram' | 'website' | 'note';

export type AppointmentStatus = 'upcoming' | 'today' | 'completed' | 'cancelled';
export type AppointmentType = 'viewing' | 'consultation' | 'follow_up' | 'closing';

export interface Agent {
  id: string;
  name: string;
  email: string;
  phone: string;
  avatarInitials: string;
  role: UserRole;
  leadsCount: number;
  appointmentsCount: number;
  wonCount: number;
  conversionRate: number;
}

export interface ConversationEntry {
  id: string;
  leadId: string;
  channel: MessageType;
  direction: 'inbound' | 'outbound';
  body: string;
  timestamp: string;
}

export interface Lead {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  source: LeadSource;
  temperature: LeadTemperature;
  stage: PipelineStage;
  assignedAgentId: string;
  createdAt: string;
  lastContact: string | null;
  nextFollowUp: string | null;
  lastMessage: string | null;
  appointmentStatus: AppointmentStatus | null;
  qualificationScore: number;
  buyerIntent: BuyerIntent;
  budget: string;
  preferredLocation: string;
  propertyType: string;
  timeline: PurchaseTimeline;
  financing: FinancingStatus;
  aiSummary: string;
  notes: string;
}

export interface Appointment {
  id: string;
  leadId: string;
  leadName: string;
  agentId: string;
  date: string;
  time: string;
  type: AppointmentType;
  status: AppointmentStatus;
  notes: string;
}

export interface NotificationItem {
  id: string;
  type:
    | 'new_hot_lead'
    | 'lead_qualified'
    | 'lead_replied'
    | 'follow_up_required'
    | 'appointment_booked'
    | 'appointment_approaching'
    | 'lead_assigned';
  title: string;
  description: string;
  timestamp: string;
  read: boolean;
  leadId?: string;
}

export interface ActivityEvent {
  id: string;
  leadId: string;
  kind:
    | 'lead_created'
    | 'lead_qualified'
    | 'follow_up_sent'
    | 'lead_replied'
    | 'appointment_booked'
    | 'lead_assigned';
  text: string;
  timestamp: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  accountType: AccountType;
  role: UserRole;
  agencyName?: string;
  avatarUrl?: string | null;
}
