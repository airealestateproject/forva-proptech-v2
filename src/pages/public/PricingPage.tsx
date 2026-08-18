import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, Sparkles, Building2, Users, User } from 'lucide-react';
import { Seo } from '@/components/shared/Seo';
import { SectionHeading } from '@/components/shared/SectionHeading';
import { plans, trialDurationDays } from '@/data/plans';
import type { BillingPeriod } from '@/types';

const planIcons: Record<string, typeof User> = {
  solo: User,
  team: Users,
  agency: Building2,
};

export function PricingPage() {
  const [billing, setBilling] = useState<BillingPeriod>('monthly');

  return (
    <>
      <Seo
        title="Pricing"
        description="FORVA PropTech pricing plans for individual realtors, small teams, and agencies. Start with a 7-day free trial."
      />

      <section className="border-b border-white/8 bg-navy-radial py-16 sm:py-20">
        <div className="container-page text-center">
          <SectionHeading
            center
            eyebrow="Pricing"
            title="Plans that scale with your business"
            subtitle={`Every plan includes a ${trialDurationDays}-day free trial. No credit card required to start.`}
          />

          <div className="mt-8 inline-flex items-center rounded-full border border-white/10 bg-navy-900/60 p-1">
            <button
              type="button"
              onClick={() => setBilling('monthly')}
              className={`rounded-full px-5 py-2 text-sm font-medium transition-colors ${
                billing === 'monthly' ? 'bg-accent-500 text-white' : 'text-silver-400 hover:text-white'
              }`}
            >
              Monthly
            </button>
            <button
              type="button"
              onClick={() => setBilling('annual')}
              className={`rounded-full px-5 py-2 text-sm font-medium transition-colors ${
                billing === 'annual' ? 'bg-accent-500 text-white' : 'text-silver-400 hover:text-white'
              }`}
            >
              Annual
            </button>
          </div>
          {billing === 'annual' && (
            <p className="mt-3 text-xs text-silver-500">Annual pricing is coming soon. Contact sales for details.</p>
          )}
        </div>
      </section>

      <section className="py-16 sm:py-20">
        <div className="container-page">
          <div className="grid gap-6 lg:grid-cols-3">
            {plans.map((plan) => {
              const Icon = planIcons[plan.id] ?? User;
              const price = billing === 'annual' && plan.annualPrice !== null ? plan.annualPrice : plan.monthlyPrice;
              const periodLabel = billing === 'annual' ? '/year' : '/month';
              return (
                <div
                  key={plan.id}
                  className={`card relative flex flex-col p-6 sm:p-8 ${
                    plan.highlighted ? 'border-accent-400/60 ring-1 ring-accent-400/30' : ''
                  }`}
                >
                  {plan.highlighted && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-accent-gradient px-3 py-1 text-[11px] font-bold text-white">
                      Most Popular
                    </span>
                  )}

                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-500/15 text-accent-300">
                      <Icon size={20} />
                    </div>
                    <h3 className="text-lg font-bold text-white">{plan.name}</h3>
                  </div>

                  <p className="mt-3 text-sm text-silver-400 leading-relaxed">{plan.description}</p>

                  <div className="mt-5">
                    <span className="text-4xl font-bold text-white">${price}</span>
                    <span className="text-sm text-silver-500">{periodLabel}</span>
                  </div>

                  <ul className="mt-6 space-y-3 text-sm">
                    {plan.features.map((f) => (
                      <li key={f} className="flex items-start gap-2.5 text-silver-300">
                        <Check size={16} className="mt-0.5 flex-shrink-0 text-accent-300" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-8 flex flex-col gap-2">
                    <Link to="/get-started" className={plan.highlighted ? 'btn-primary' : 'btn-outline'}>
                      {plan.cta}
                    </Link>
                    <Link to="/contact" className="btn-ghost text-xs">
                      Contact Sales
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-12">
            <div className="card mx-auto max-w-2xl p-6 text-center">
              <Sparkles size={24} className="mx-auto text-accent-300" />
              <h3 className="mt-3 text-base font-semibold text-white">AI Voice Add-On</h3>
              <p className="mt-2 text-sm text-silver-400">
                AI Voice is an optional paid add-on available for any plan. Contact support to activate.
              </p>
              <Link to="/contact" className="btn-outline mt-4 text-xs">
                Contact Support to Activate
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
