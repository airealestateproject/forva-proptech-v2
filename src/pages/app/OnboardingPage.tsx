import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Check,
  User,
  Building2,
  ArrowRight,
  ArrowLeft,
  Plug,
  Users,
  Sparkles,
} from 'lucide-react';
import { Seo } from '@/components/shared/Seo';
import { plans } from '@/data/plans';
import type { AccountType, SupportedCountry } from '@/types';

type Step = 'welcome' | 'account_type' | 'business' | 'plan' | 'integrations' | 'team' | 'complete';

const stepOrder: Step[] = ['welcome', 'account_type', 'business', 'plan', 'integrations', 'team', 'complete'];

const countries: { value: SupportedCountry; label: string }[] = [
  { value: 'US', label: 'United States' },
  { value: 'GB', label: 'United Kingdom' },
  { value: 'AU', label: 'Australia' },
];

const integrationOptions = [
  { id: 'facebook', label: 'Facebook / Meta', desc: 'Capture leads from Facebook Lead Ads' },
  { id: 'instagram', label: 'Instagram', desc: 'Capture Instagram lead inquiries' },
  { id: 'website', label: 'Website Forms', desc: 'Embed lead capture forms on your site' },
  { id: 'google_calendar', label: 'Google Calendar', desc: 'Sync appointments to your calendar' },
  { id: 'email', label: 'Email', desc: 'Send and receive lead email follow-ups' },
  { id: 'sms', label: 'SMS', desc: 'Text-based lead follow-up and reminders' },
];

export function OnboardingPage() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>('welcome');
  const [accountType, setAccountType] = useState<AccountType>('individual');
  const [selectedPlan, setSelectedPlan] = useState<string>('solo');
  const [selectedIntegrations, setSelectedIntegrations] = useState<string[]>([]);

  const stepIndex = stepOrder.indexOf(step);
  const isAgency = accountType === 'agency';

  const next = () => {
    const nextStep = stepOrder[stepIndex + 1];
    if (nextStep === 'team' && !isAgency) {
      setStep('complete');
    } else if (nextStep) {
      setStep(nextStep);
    }
  };

  const back = () => {
    const prevStep = stepOrder[stepIndex - 1];
    if (prevStep) setStep(prevStep);
  };

  const toggleIntegration = (id: string) => {
    setSelectedIntegrations((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id],
    );
  };

  const finish = () => navigate('/app/dashboard');

  return (
    <>
      <Seo title="Onboarding" noindex />
      <div className="forva-app min-h-screen bg-navy-radial">
        <div className="container-page mx-auto max-w-2xl py-12">
          {/* Progress bar */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              {stepOrder.slice(1, -1).map((s, i) => {
                const active = stepOrder.indexOf(step) >= i + 1;
                return (
                  <div
                    key={s}
                    className={`h-1.5 flex-1 rounded-full ${active ? 'bg-accent-500' : 'bg-white/10'} ${i > 0 ? 'ml-2' : ''}`}
                  />
                );
              })}
            </div>
            <p className="mt-3 text-xs text-silver-500">
              Step {Math.min(stepIndex, stepOrder.length - 2)} of {stepOrder.length - 2}
            </p>
          </div>

          <div className="card p-6 sm:p-8">
            {step === 'welcome' && (
              <div className="text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-accent-gradient text-white">
                  <Sparkles size={28} />
                </div>
                <h1 className="mt-5 text-2xl font-bold text-white">Welcome to FORVA PropTech</h1>
                <p className="mt-3 text-silver-400">
                  FORVA doesn't just store leads. It works the leads. Let's get your account set up in a few quick steps.
                </p>
                <button type="button" onClick={next} className="btn-primary mt-8 w-full">
                  Get Started
                  <ArrowRight size={16} />
                </button>
              </div>
            )}

            {step === 'account_type' && (
              <div>
                <h2 className="text-lg font-bold text-white">Account type</h2>
                <p className="mt-1 text-sm text-silver-400">Choose the option that best describes you.</p>
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => setAccountType('individual')}
                    className={`flex items-center gap-3 rounded-lg border p-4 text-left transition-colors ${
                      accountType === 'individual' ? 'border-accent-400 bg-accent-500/10' : 'border-white/10 hover:border-white/20'
                    }`}
                  >
                    <User size={20} className="text-accent-300" />
                    <div>
                      <p className="text-sm font-semibold text-white">Individual Realtor</p>
                      <p className="text-xs text-silver-400">A single real estate professional</p>
                    </div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setAccountType('agency')}
                    className={`flex items-center gap-3 rounded-lg border p-4 text-left transition-colors ${
                      accountType === 'agency' ? 'border-accent-400 bg-accent-500/10' : 'border-white/10 hover:border-white/20'
                    }`}
                  >
                    <Building2 size={20} className="text-accent-300" />
                    <div>
                      <p className="text-sm font-semibold text-white">Agency / Team</p>
                      <p className="text-xs text-silver-400">Multiple agents under one account</p>
                    </div>
                  </button>
                </div>
                <StepNav onBack={back} onNext={next} />
              </div>
            )}

            {step === 'business' && (
              <div>
                <h2 className="text-lg font-bold text-white">Business profile</h2>
                <p className="mt-1 text-sm text-silver-400">Tell us about your business.</p>
                <div className="mt-5 space-y-4">
                  <div>
                    <label className="label" htmlFor="name">Full name</label>
                    <input id="name" className="input" placeholder="Sarah Mitchell" />
                  </div>
                  {isAgency && (
                    <div>
                      <label className="label" htmlFor="agency">Business / Agency name</label>
                      <input id="agency" className="input" placeholder="FORVA Realty Group" />
                    </div>
                  )}
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="label" htmlFor="email">Email</label>
                      <input id="email" type="email" className="input" placeholder="you@agency.com" />
                    </div>
                    <div>
                      <label className="label" htmlFor="phone">Phone</label>
                      <input id="phone" className="input" placeholder="(415) 555-0100" />
                    </div>
                  </div>
                  <div>
                    <label className="label" htmlFor="website">Website (optional)</label>
                    <input id="website" className="input" placeholder="https://youragency.com" />
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="label" htmlFor="country">Country</label>
                      <select id="country" className="input" defaultValue="US">
                        {countries.map((c) => (
                          <option key={c.value} value={c.value}>{c.label}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="label" htmlFor="market">Primary market</label>
                      <input id="market" className="input" placeholder="San Francisco Bay Area" />
                    </div>
                  </div>
                  <div>
                    <label className="label" htmlFor="tz">Time zone</label>
                    <select id="tz" className="input" defaultValue="America/Los_Angeles">
                      <option value="America/Los_Angeles">Pacific (PT)</option>
                      <option value="America/Denver">Mountain (MT)</option>
                      <option value="America/Chicago">Central (CT)</option>
                      <option value="America/New_York">Eastern (ET)</option>
                      <option value="Europe/London">UK (GMT)</option>
                      <option value="Australia/Sydney">Sydney (AET)</option>
                    </select>
                  </div>
                </div>
                <StepNav onBack={back} onNext={next} />
              </div>
            )}

            {step === 'plan' && (
              <div>
                <h2 className="text-lg font-bold text-white">Choose your plan</h2>
                <p className="mt-1 text-sm text-silver-400">Start with a 7-day free trial. You can change or cancel anytime.</p>
                <div className="mt-5 space-y-3">
                  {plans.map((plan) => (
                    <button
                      key={plan.id}
                      type="button"
                      onClick={() => setSelectedPlan(plan.id)}
                      className={`w-full rounded-lg border p-4 text-left transition-colors ${
                        selectedPlan === plan.id ? 'border-accent-400 bg-accent-500/10' : 'border-white/10 hover:border-white/20'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-semibold text-white">{plan.name}</p>
                          <p className="text-xs text-silver-400">{plan.description}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-lg font-bold text-white">${plan.monthlyPrice}</p>
                          <p className="text-xs text-silver-500">/month</p>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
                <StepNav onBack={back} onNext={next} />
              </div>
            )}

            {step === 'integrations' && (
              <div>
                <h2 className="text-lg font-bold text-white">Connect your integrations</h2>
                <p className="mt-1 text-sm text-silver-400">Select the lead sources and tools you use. You can connect more later.</p>
                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  {integrationOptions.map((opt) => {
                    const selected = selectedIntegrations.includes(opt.id);
                    return (
                      <button
                        key={opt.id}
                        type="button"
                        onClick={() => toggleIntegration(opt.id)}
                        className={`flex items-start gap-3 rounded-lg border p-4 text-left transition-colors ${
                          selected ? 'border-accent-400 bg-accent-500/10' : 'border-white/10 hover:border-white/20'
                        }`}
                      >
                        <Plug size={18} className={`mt-0.5 flex-shrink-0 ${selected ? 'text-accent-300' : 'text-silver-500'}`} />
                        <div>
                          <p className="text-sm font-medium text-white">{opt.label}</p>
                          <p className="text-xs text-silver-500">{opt.desc}</p>
                        </div>
                        {selected && <Check size={16} className="ml-auto text-accent-300" />}
                      </button>
                    );
                  })}
                </div>
                <StepNav onBack={back} onNext={next} />
              </div>
            )}

            {step === 'team' && isAgency && (
              <div>
                <h2 className="text-lg font-bold text-white">Team setup</h2>
                <p className="mt-1 text-sm text-silver-400">Invite team members to your agency.</p>
                <div className="mt-5 space-y-3">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div>
                      <label className="label" htmlFor="memberName">Member name</label>
                      <input id="memberName" className="input" placeholder="Agent name" />
                    </div>
                    <div>
                      <label className="label" htmlFor="memberEmail">Member email</label>
                      <input id="memberEmail" type="email" className="input" placeholder="agent@agency.com" />
                    </div>
                  </div>
                  <button type="button" className="btn-outline text-xs">
                    <Users size={14} />
                    Add another member
                  </button>
                  <div className="rounded-lg border border-dashed border-white/10 p-6 text-center text-sm text-silver-500">
                    You can invite more team members after onboarding from the Team page.
                  </div>
                </div>
                <StepNav onBack={back} onNext={next} />
              </div>
            )}

            {step === 'complete' && (
              <div className="text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-300">
                  <Check size={28} />
                </div>
                <h1 className="mt-5 text-2xl font-bold text-white">You're all set</h1>
                <p className="mt-3 text-silver-400">
                  Your FORVA PropTech account is ready. Your 7-day free trial has started.
                </p>
                <button type="button" onClick={finish} className="btn-primary mt-8 w-full">
                  Go to Dashboard
                  <ArrowRight size={16} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

function StepNav({ onBack, onNext }: { onBack: () => void; onNext: () => void }) {
  return (
    <div className="mt-6 flex items-center justify-between">
      <button type="button" onClick={onBack} className="btn-ghost text-sm">
        <ArrowLeft size={16} />
        Back
      </button>
      <button type="button" onClick={onNext} className="btn-primary text-sm">
        Continue
        <ArrowRight size={16} />
      </button>
    </div>
  );
}
