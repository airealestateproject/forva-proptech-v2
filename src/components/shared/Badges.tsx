import type { LeadTemperature, PipelineStage } from '@/types';
import {
  temperatureConfig,
  stageConfig,
  sourceConfig,
  appointmentStatusConfig,
} from '@/lib/format';

export function TemperatureBadge({ temp }: { temp: LeadTemperature }) {
  const c = temperatureConfig[temp];
  return (
    <span className={`badge ${c.classes}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${c.dot}`} />
      {c.label}
    </span>
  );
}

export function StageBadge({ stage }: { stage: PipelineStage }) {
  const c = stageConfig[stage];
  return <span className={`badge ${c.classes}`}>{c.label}</span>;
}

export function SourceBadge({ source }: { source: keyof typeof sourceConfig }) {
  const c = sourceConfig[source];
  return (
    <span className="badge bg-white/5 text-silver-300 border border-white/10">
      {c.label}
    </span>
  );
}

export function AppointmentStatusBadge({
  status,
}: {
  status: keyof typeof appointmentStatusConfig;
}) {
  const c = appointmentStatusConfig[status];
  return <span className={`badge ${c.classes}`}>{c.label}</span>;
}

export function ScorePill({ score }: { score: number }) {
  const color =
    score >= 85 ? 'text-emerald-300' : score >= 70 ? 'text-accent-300' : score >= 50 ? 'text-amber-300' : 'text-silver-400';
  const bar =
    score >= 85 ? 'bg-emerald-400' : score >= 70 ? 'bg-accent-400' : score >= 50 ? 'bg-amber-400' : 'bg-silver-500';
  return (
    <div className="flex items-center gap-2">
      <div className="h-1.5 w-16 overflow-hidden rounded-full bg-white/10">
        <div className={`h-full rounded-full ${bar}`} style={{ width: `${score}%` }} />
      </div>
      <span className={`text-xs font-semibold ${color}`}>{score}</span>
    </div>
  );
}
