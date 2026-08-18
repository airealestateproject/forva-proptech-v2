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
  trial: { label: 'Trial', classes: 'bg-blue-100 text-blue-700 border border-blue-300' },
  active: { label: 'Active', classes: 'bg-emerald-100 text-emerald-700 border border-emerald-300' },
  past_due: { label: 'Past Due', classes: 'bg-amber-100 text-amber-700 border border-amber-300' },
  cancelled: { label: 'Cancelled', classes: 'bg-red-100 text-red-700 border border-red-300' },
  expired: { label: 'Expired', classes: 'bg-slate-100 text-slate-500 border border-slate-300' },
};

export const trialStatusConfig: Record<string, { label: string; classes: string }> = {
  active: { label: 'Trial Active', classes: 'bg-blue-100 text-blue-700 border border-blue-300' },
  expired: { label: 'Trial Expired', classes: 'bg-red-100 text-red-700 border border-red-300' },
  converted: { label: 'Converted', classes: 'bg-emerald-100 text-emerald-700 border border-emerald-300' },
  cancelled: { label: 'Trial Cancelled', classes: 'bg-slate-100 text-slate-500 border border-slate-300' },
};
