import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Check, User, Building2, Sparkles } from 'lucide-react';
import { Seo } from '@/components/shared/Seo';
import { SectionHeading } from '@/components/shared/SectionHeading';
import { trialDurationDays } from '@/data/plans';

export function GetStartedPage() {
  const [accountType, setAccountType] = useState<'individual' | 'agency'>('individual');
  const [mode, setMode] = useState<'trial' | 'demo'>('trial');
  const [submitted, setSubmitted] = useState(false);
  const navigate = useNavigate();

  if (submitted) {
    return (
      <>
        <Seo title="Get Started" description="Request a demo of FORVA PropTech." noindex />
        <section className="py-24">
          <div className="container-page">
            <div className="card mx-auto max-w-lg p-8 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-300">
                <Check size={24} />
              </div>
              {mode === 'demo' ? (
                <>
                  <h1 className="mt-4 text-2xl font-bold text-white">Request received</h1>
                  <p className="mt-3 text-silver-400">
                    Thanks for your interest in FORVA PropTech. Our team will reach out within one
                    business day to schedule your demo.
                  </p>
                  <button onClick={() => navigate('/')} className="btn-secondary mt-6">
                    Back to Home
                  </button>
                </>
              ) : (
                <>
                  <h1 className="mt-4 text-2xl font-bold text-white">Your free trial is ready</h1>
                  <p className="mt-3 text-silver-400">
                    Your {trialDurationDays}-day free trial has been set up. Complete onboarding to access your dashboard.
                  </p>
                  <button onClick={() => navigate('/onboarding')} className="btn-primary mt-6">
                    Continue to Onboarding
                  </button>
                </>
              )}
            </div>
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <Seo title="Get Started" description="Start a 7-day free trial or request a demo of FORVA PropTech." />

      <section className="border-b border-white/8 bg-navy-radial py-16 sm:py-20">
        <div className="container-page text-center">
          <SectionHeading
            center
            eyebrow="Get Started"
            title="Start working your leads with FORVA"
            subtitle={`Start your ${trialDurationDays}-day free trial, or request a personalized demo.`}
          />

          <div className="mt-8 inline-flex items-center rounded-full border border-white/10 bg-navy-900/60 p-1">
            <button
              type="button"
              onClick={() => setMode('trial')}
              className={`rounded-full px-5 py-2 text-sm font-medium transition-colors ${
                mode === 'trial' ? 'bg-accent-500 text-white' : 'text-silver-400 hover:text-white'
              }`}
            >
              Start Free Trial
            </button>
            <button
              type="button"
              onClick={() => setMode('demo')}
              className={`rounded-full px-5 py-2 text-sm font-medium transition-colors ${
                mode === 'demo' ? 'bg-accent-500 text-white' : 'text-silver-400 hover:text-white'
              }`}
            >
              Request Demo
            </button>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container-page mx-auto max-w-2xl">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setSubmitted(true);
            }}
            className="card space-y-6 p-6 sm:p-8"
          >
            {mode === 'trial' && (
              <div className="flex items-start gap-3 rounded-lg border border-accent-500/20 bg-accent-500/5 p-4">
                <Sparkles size={18} className="mt-0.5 flex-shrink-0 text-accent-300" />
                <p className="text-sm text-silver-300">
                  Your {trialDurationDays}-day free trial includes full access to FORVA PropTech. No credit card required.
                </p>
              </div>
            )}

            <div>
              <span className="label">Account type</span>
              <div className="grid gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() => setAccountType('individual')}
                  className={`flex items-center gap-3 rounded-lg border p-4 text-left transition-colors ${
                    accountType === 'individual'
                      ? 'border-accent-400 bg-accent-500/10'
                      : 'border-white/10 hover:border-white/20'
                  }`}
                >
                  <User size={20} className="text-accent-300" />
                  <div>
                    <p className="text-sm font-semibold text-white">Individual Agent</p>
                    <p className="text-xs text-silver-400">Solo realtor managing your own leads</p>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => setAccountType('agency')}
                  className={`flex items-center gap-3 rounded-lg border p-4 text-left transition-colors ${
                    accountType === 'agency'
                      ? 'border-accent-400 bg-accent-500/10'
                      : 'border-white/10 hover:border-white/20'
                  }`}
                >
                  <Building2 size={20} className="text-accent-300" />
                  <div>
                    <p className="text-sm font-semibold text-white">Agency / Team</p>
                    <p className="text-xs text-silver-400">Multiple agents under one account</p>
                  </div>
                </button>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="label" htmlFor="firstName">First name</label>
                <input id="firstName" className="input" required placeholder="Sarah" />
              </div>
              <div>
                <label className="label" htmlFor="lastName">Last name</label>
                <input id="lastName" className="input" required placeholder="Mitchell" />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="label" htmlFor="email">Work email</label>
                <input id="email" type="email" className="input" required placeholder="you@agency.com" />
              </div>
              <div>
                <label className="label" htmlFor="phone">Phone</label>
                <input id="phone" className="input" placeholder="(415) 555-0100" />
              </div>
            </div>

            {accountType === 'agency' && (
              <div>
                <label className="label" htmlFor="agency">Agency name</label>
                <input id="agency" className="input" placeholder="FORVA Realty Group" />
              </div>
            )}

            {mode === 'demo' && (
              <div>
                <label className="label" htmlFor="teamSize">Team size</label>
                <select id="teamSize" className="input" defaultValue="1-5">
                  <option>Just me</option>
                  <option>1-5 agents</option>
                  <option>6-20 agents</option>
                  <option>20+ agents</option>
                </select>
              </div>
            )}

            {mode === 'demo' && (
              <div>
                <label className="label" htmlFor="notes">Anything else?</label>
                <textarea id="notes" className="input min-h-[100px] resize-y" placeholder="Tell us about your current lead sources or questions..." />
              </div>
            )}

            <button type="submit" className="btn-primary w-full">
              {mode === 'trial' ? `Start ${trialDurationDays}-Day Free Trial` : 'Request Demo'}
            </button>
            <p className="text-center text-xs text-silver-500">
              By submitting, you agree to our{' '}
              <a href="/terms" className="text-accent-300 hover:underline">Terms</a> and{' '}
              <a href="/privacy" className="text-accent-300 hover:underline">Privacy Policy</a>.
            </p>
          </form>
        </div>
      </section>
    </>
  );
}
