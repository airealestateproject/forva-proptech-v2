import type { ReactNode } from 'react';
import { Seo } from '@/components/shared/Seo';

export function LegalLayout({
  title,
  description,
  lastUpdated,
  children,
}: {
  title: string;
  description: string;
  lastUpdated: string;
  children: ReactNode;
}) {
  return (
    <>
      <Seo title={title} description={description} />
      <section className="border-b border-white/8 bg-navy-radial py-12 sm:py-16">
        <div className="container-page">
          <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">{title}</h1>
          <p className="mt-2 text-sm text-silver-500">Last updated: {lastUpdated}</p>
        </div>
      </section>
      <section className="py-12 sm:py-16">
        <div className="container-page mx-auto max-w-3xl space-y-6 text-sm leading-relaxed text-silver-300">
          {children}
          <div className="mt-10 rounded-lg border border-white/8 bg-navy-850/60 p-4 text-xs text-silver-500">
            This page is provided as a template structure. Final legal text should be reviewed and
            replaced by a qualified professional before production use.
          </div>
        </div>
      </section>
    </>
  );
}

export function LegalH2({ children }: { children: ReactNode }) {
  return <h2 className="pt-4 text-lg font-semibold text-white">{children}</h2>;
}
