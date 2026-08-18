import {
  Brain,
  Zap,
  MessageSquareReply,
  CalendarCheck,
  BarChart3,
  BellRing,
  Filter,
  Users,
  Globe2,
  Clock,
  Target,
  TrendingUp,
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { Seo } from '@/components/shared/Seo';
import { SectionHeading } from '@/components/shared/SectionHeading';

const groups = [
  {
    heading: 'Capture & Qualify',
    items: [
      { title: 'Multi-Channel Lead Capture', desc: 'Facebook Lead Ads, Instagram inquiries, website forms, and manual entry are unified into a single lead inbox.', icon: Globe2 },
      { title: 'AI-Powered Lead Qualification', desc: 'Every lead is automatically scored on buyer intent, budget, timeline, and financing status.', icon: Brain },
      { title: 'Buyer Intelligence', desc: 'AI-generated summary, hot/warm/cold rating, and qualification score for each lead.', icon: Target },
      { title: 'Instant Lead Response', desc: 'Automated first-touch messages reach leads within seconds of capture.', icon: Zap },
    ],
  },
  {
    heading: 'Book & Notify',
    items: [
      { title: 'Automated Follow-Up', desc: 'Channel-aware scheduled follow-ups keep leads warm without manual effort.', icon: MessageSquareReply },
      { title: 'Appointment Booking', desc: 'Leads self-book viewings and consultations directly into your calendar.', icon: CalendarCheck },
      { title: 'Realtor Notifications', desc: 'Real-time alerts for new hot leads, replies, follow-ups due, and approaching appointments.', icon: BellRing },
      { title: 'Lead Pipeline Management', desc: 'Visual pipeline from New → Contacted → Qualified → Appointment → Viewing → Won/Lost.', icon: Filter },
    ],
  },
  {
    heading: 'Grow & Scale',
    items: [
      { title: 'Analytics & Reporting', desc: 'Leads by source, conversion rate, pipeline distribution, and agent performance in one view.', icon: BarChart3 },
      { title: 'Team Collaboration', desc: 'Agency owners assign leads, monitor agents, and view agency-wide performance.', icon: Users },
      { title: 'Response & Follow-Up Tracking', desc: 'See how quickly your team responds and where follow-ups are slipping.', icon: Clock },
      { title: 'Conversion Insights', desc: 'Understand which sources and agents drive the most closings.', icon: TrendingUp },
    ],
  },
];

export function FeaturesPage() {
  return (
    <>
      <Seo
        title="Features"
        description="Explore the full FORVA PropTech feature set: AI lead qualification, instant response, automated follow-up, appointment booking, buyer intelligence, analytics, and team collaboration."
      />

      <section className="border-b border-white/8 bg-navy-radial py-16 sm:py-20">
        <div className="container-page text-center">
          <SectionHeading
            center
            eyebrow="Features"
            title="A complete PropTech lead engine"
            subtitle="Organized around the Capture → Qualify → Book → Notify → Grow workflow that turns inquiries into closings."
          />
        </div>
      </section>

      {groups.map((group) => (
        <section key={group.heading} className="py-14 sm:py-16 border-b border-white/8">
          <div className="container-page">
            <h2 className="mb-8 text-xl font-bold text-white sm:text-2xl">{group.heading}</h2>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {group.items.map((f) => (
                <div key={f.title} className="card card-hover p-6">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent-500/15 text-accent-300">
                    <f.icon size={22} />
                  </div>
                  <h3 className="mt-4 text-base font-semibold text-white">{f.title}</h3>
                  <p className="mt-2 text-sm text-silver-400 leading-relaxed">{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      ))}

      <section className="py-16 text-center">
        <div className="container-page">
          <Link to="/get-started" className="btn-primary px-6 py-3 text-base">
            Start 7-Day Free Trial
          </Link>
        </div>
      </section>
    </>
  );
}
