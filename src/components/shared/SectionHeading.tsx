import type { ReactNode } from 'react';

interface SectionHeadingProps {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  center?: boolean;
  className?: string;
}

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  center = false,
  className = '',
}: SectionHeadingProps) {
  return (
    <div className={`${center ? 'text-center mx-auto max-w-2xl' : 'max-w-2xl'} ${className}`}>
      {eyebrow && (
        <p className={`section-eyebrow mb-3 ${center ? 'justify-center' : ''}`}>
          <span className="h-px w-6 bg-accent-400" />
          {eyebrow}
        </p>
      )}
      <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl md:text-4xl text-balance">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-4 text-base text-silver-400 sm:text-lg leading-relaxed">{subtitle}</p>
      )}
    </div>
  );
}

export function PageHeader({
  title,
  subtitle,
  actions,
}: {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-xl font-bold tracking-tight text-white sm:text-2xl">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-silver-400">{subtitle}</p>}
      </div>
      {actions && <div className="flex flex-wrap items-center gap-2">{actions}</div>}
    </div>
  );
}
