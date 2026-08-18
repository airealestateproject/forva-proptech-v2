import { Link } from 'react-router-dom';
import { Zap, Brain, CalendarCheck, BellRing, ChartBar as BarChart3, ArrowRight } from 'lucide-react';
import { Seo } from '@/components/shared/Seo';
import { SectionHeading } from '@/components/shared/SectionHeading';

const steps = [
  {
    n: '01',
    title: 'Capture',
    icon: Zap,
    desc: 'Leads arrive from Facebook Lead Ads, Instagram inquiries, your website forms, and manual entry. Every channel funnels into one unified lead inbox, so no lead falls through the cracks.',
    points: ['Facebook & Instagram Lead Ads', 'Website inquiry forms', 'Manual lead entry', 'Unified lead inbox'],
  },
  {
    n: '02',
    title: 'Qualify',
    icon: Brain,
    desc: 'FORVA automatically scores each lead on buyer intent, budget, preferred location, property type, purchase timeline, and financing status. You get an AI summary and a qualification score the moment a lead arrives.',
    points: ['AI qualification scoring', 'Buyer intelligence summary', 'Hot / Warm / Cold rating', 'Intent & financing signals'],
  },
  {
    n: '03',
    title: 'Book',
    icon: CalendarCheck,
    desc: 'Instant automated follow-up reaches leads within seconds. Leads can self-book viewings and consultations directly into your calendar, so you move from inquiry to appointment without back-and-forth.',
    points: ['Instant first-touch response', 'Automated nurture sequences', 'Self-service appointment booking', 'Calendar-ready scheduling'],
  },
  {
    n: '04',
    title: 'Notify',
    icon: BellRing,
    desc: 'Realtors get real-time notifications the moment a hot lead arrives, a lead replies, a follow-up is due, or an appointment is approaching. You always know what needs attention next.',
    points: ['New hot lead alerts', 'Lead reply notifications', 'Follow-up reminders', 'Appointment approaching alerts'],
  },
  {
    n: '05',
    title: 'Grow',
    icon: BarChart3,
    desc: 'Track your full pipeline, conversion rate, lead source performance, and agent productivity. Understand what works, double down on winning sources, and scale your book of business.',
    points: ['Pipeline & conversion tracking', 'Lead source analytics', 'Agent performance', 'Agency-wide reporting'],
  },
];

export function HowItWorksPage() {
  return (
    <>
      <Seo
        title="How It Works"
        description="The FORVA PropTech workflow: Capture leads from every channel, qualify with AI, book appointments instantly, notify realtors in real time, and grow with analytics."
      />

      <section className="border-b border-white/8 bg-navy-900 bg-navy-radial py-16 sm:py-20">
        <div className="container-page text-center">
          <SectionHeading
            center
            eyebrow="How It Works"
            title="From inquiry to closing in five steps"
            subtitle="The Capture → Qualify → Book → Notify → Grow workflow powers every FORVA PropTech account."
          />
        </div>
      </section>

      <section className="bg-navy-900 py-16 sm:py-20">
        <div className="container-page space-y-12">
          {steps.map((s, i) => (
            <div
              key={s.title}
              className={`grid items-center gap-8 lg:grid-cols-2 ${i % 2 === 1 ? 'lg:[&>div:first-child]:order-2' : ''}`}
            >
              <div className="card p-8">
                <div className="flex items-center gap-4">
                  <span className="text-3xl font-bold gradient-text">{s.n}</span>
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent-500/15 text-accent-300">
                    <s.icon size={24} />
                  </div>
                  <h2 className="text-2xl font-bold text-white">{s.title}</h2>
                </div>
                <p className="mt-4 text-silver-300 leading-relaxed">{s.desc}</p>
                <ul className="mt-5 grid gap-2 sm:grid-cols-2">
                  {s.points.map((p) => (
                    <li key={p} className="flex items-center gap-2 text-sm text-silver-400">
                      <span className="h-1.5 w-1.5 rounded-full bg-accent-400" />
                      {p}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="relative hidden lg:flex items-center justify-center">
                <div className="h-48 w-48 rounded-full border border-white/8 bg-navy-radial" />
                <s.icon size={56} className="absolute text-accent-300/70" />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="border-t border-white/8 bg-navy-900 py-16 text-center">
        <div className="container-page">
          <h2 className="text-2xl font-bold text-white">Ready to get started?</h2>
          <p className="mt-3 text-silver-400">Start your 7-day free trial and see the full workflow live.</p>
          <Link to="/get-started" className="btn-primary mt-6 px-6 py-3 text-base">
            Start 7-Day Free Trial
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </>
  );
}
