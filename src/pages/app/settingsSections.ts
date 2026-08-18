export type Section =
  | 'profile'
  | 'business'
  | 'team'
  | 'notifications'
  | 'integrations'
  | 'billing'
  | 'usage'
  | 'ai_voice'
  | 'security';

export const subscriptionStatusConfig: Record<string, { label: string; classes: string }> = {
  trial: { label: 'Trial', classes: 'bg-accent-500/15 text-accent-300 border border-accent-500/30' },
  active: { label: 'Active', classes: 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30' },
  past_due: { label: 'Past Due', classes: 'bg-amber-500/15 text-amber-300 border border-amber-500/30' },
  cancelled: { label: 'Cancelled', classes: 'bg-red-500/15 text-red-300 border border-red-500/30' },
  expired: { label: 'Expired', classes: 'bg-silver-500/15 text-silver-400 border border-silver-500/30' },
};

export const trialStatusConfig: Record<string, { label: string; classes: string }> = {
  active: { label: 'Trial Active', classes: 'bg-accent-500/15 text-accent-300 border border-accent-500/30' },
  expired: { label: 'Trial Expired', classes: 'bg-red-500/15 text-red-300 border border-red-500/30' },
  converted: { label: 'Converted', classes: 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30' },
  cancelled: { label: 'Trial Cancelled', classes: 'bg-silver-500/15 text-silver-400 border border-silver-500/30' },
};
