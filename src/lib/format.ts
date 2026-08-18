import type {
  AppointmentStatus,
  LeadSource,
  LeadTemperature,
  PipelineStage,
} from '@/types';

export function formatRelative(iso: string | null): string {
  if (!iso) return '-';
  const date = new Date(iso);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMin = Math.round(diffMs / 60000);
  const diffHr = Math.round(diffMin / 60);
  const diffDay = Math.round(diffHr / 24);

  if (diffMin < 1) return 'just now';
  if (diffMin < 60) return `${diffMin}m ago`;
  if (diffHr < 24) return `${diffHr}h ago`;
  if (diffDay < 7) return `${diffDay}d ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

export const temperatureConfig: Record<
  LeadTemperature,
  { label: string; classes: string; dot: string }
> = {
  hot: {
    label: 'Hot',
    classes: 'bg-red-500/15 text-red-300 border border-red-500/30',
    dot: 'bg-red-400',
  },
  warm: {
    label: 'Warm',
    classes: 'bg-amber-500/15 text-amber-300 border border-amber-500/30',
    dot: 'bg-amber-400',
  },
  cold: {
    label: 'Cold',
    classes: 'bg-sky-500/15 text-sky-300 border border-sky-500/30',
    dot: 'bg-sky-400',
  },
};

export const stageConfig: Record<
  PipelineStage,
  { label: string; classes: string }
> = {
  new: { label: 'New', classes: 'bg-accent-500/15 text-accent-300 border border-accent-500/30' },
  contacted: { label: 'Contacted', classes: 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/30' },
  qualified: { label: 'Qualified', classes: 'bg-teal-500/15 text-teal-300 border border-teal-500/30' },
  appointment_booked: { label: 'Appointment', classes: 'bg-violet-500/15 text-violet-300 border border-violet-500/30' },
  viewing: { label: 'Viewing', classes: 'bg-fuchsia-500/15 text-fuchsia-300 border border-fuchsia-500/30' },
  won: { label: 'Won', classes: 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30' },
  lost: { label: 'Lost', classes: 'bg-silver-500/15 text-silver-400 border border-silver-500/30' },
};

export const stageOrder: PipelineStage[] = [
  'new',
  'contacted',
  'qualified',
  'appointment_booked',
  'viewing',
  'won',
  'lost',
];

export const sourceConfig: Record<LeadSource, { label: string; icon: string }> = {
  facebook: { label: 'Facebook', icon: 'facebook' },
  instagram: { label: 'Instagram', icon: 'instagram' },
  website: { label: 'Website', icon: 'website' },
  manual: { label: 'Manual', icon: 'manual' },
  other: { label: 'Other', icon: 'other' },
};

export const appointmentStatusConfig: Record<
  AppointmentStatus,
  { label: string; classes: string }
> = {
  upcoming: { label: 'Upcoming', classes: 'bg-accent-500/15 text-accent-300 border border-accent-500/30' },
  today: { label: 'Today', classes: 'bg-amber-500/15 text-amber-300 border border-amber-500/30' },
  completed: { label: 'Completed', classes: 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30' },
  cancelled: { label: 'Cancelled', classes: 'bg-silver-500/15 text-silver-400 border border-silver-500/30' },
};

export function scoreColor(score: number): string {
  if (score >= 85) return 'text-emerald-400';
  if (score >= 70) return 'text-accent-300';
  if (score >= 50) return 'text-amber-300';
  return 'text-silver-400';
}

export function scoreBar(score: number): string {
  if (score >= 85) return 'bg-emerald-400';
  if (score >= 70) return 'bg-accent-400';
  if (score >= 50) return 'bg-amber-400';
  return 'bg-silver-500';
}
