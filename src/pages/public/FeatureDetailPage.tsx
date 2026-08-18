import { Navigate, Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Seo } from '@/components/shared/Seo';

const details: Record<string, { title: string; intro: string; points: string[]; outcome: string }> = {
  'ai-powered-lead-qualification': {
    title: 'AI-Powered Lead Qualification',
    intro: 'FORVA organizes the signals that help a real estate professional understand buyer readiness quickly, including intent, budget, purchase timeline, and financing context.',
    points: ['Qualification score for each lead', 'Intent and urgency signals', 'Budget and timeline context', 'Financing status captured with the lead record'],
    outcome: 'Prioritize the conversations that deserve attention first without manually reviewing every new inquiry.',
  },
  'instant-lead-response': {
    title: 'Instant Lead Response',
    intro: 'FORVA is designed to engage new inquiries quickly so fresh leads do not sit untouched while interest is highest.',
    points: ['Automated first-touch workflow', 'Response activity attached to the lead record', 'Consistent response process across incoming leads', 'Designed to hand qualified conversations to the realtor'],
    outcome: 'Reduce the delay between a new inquiry and the first meaningful conversation.',
  },
  'automated-follow-up': {
    title: 'Automated Follow-Up',
    intro: 'FORVA keeps lead nurture moving with scheduled follow-up actions instead of relying on agents to remember every next touch manually.',
    points: ['Structured follow-up sequences', 'Channel-aware nurture workflow', 'Lead activity history', 'Clear next-action visibility'],
    outcome: 'Keep more opportunities active while reducing repetitive manual follow-up work.',
  },
  'appointment-booking': {
    title: 'Appointment Booking',
    intro: 'FORVA connects qualified conversations with the next practical step: a viewing, consultation, or real estate appointment.',
    points: ['Calendar-connected booking flow', 'Viewing and consultation scheduling', 'Appointment details stored with the lead', 'Upcoming appointment visibility'],
    outcome: 'Move from conversation to booked next step with less back-and-forth.',
  },
  'buyer-intelligence': {
    title: 'Buyer Intelligence',
    intro: 'FORVA brings important lead context into one view so agents can understand who the buyer is, what they want, and how ready they are to move.',
    points: ['AI-generated lead summary', 'Intent rating and qualification score', 'Preference and timeline context', 'Centralized buyer profile'],
    outcome: 'Start every realtor conversation with useful context instead of a blank lead record.',
  },
  'realtor-notifications': {
    title: 'Realtor Notifications',
    intro: 'FORVA surfaces important lead events so agents can focus on the moments that need human attention.',
    points: ['Hot-lead alerts', 'Reply notifications', 'Appointment reminders', 'Follow-up attention cues'],
    outcome: 'Help realtors respond to meaningful events without continuously watching the dashboard.',
  },
  'lead-pipeline-management': {
    title: 'Lead Pipeline Management',
    intro: 'FORVA gives teams a clear visual view of where each opportunity sits from new inquiry through qualification, appointment, and outcome.',
    points: ['Stage-based lead workflow', 'New-to-Won pipeline visibility', 'Temperature and priority context', 'Clear ownership and next actions'],
    outcome: 'Know what is moving, what is stuck, and what should happen next across the pipeline.',
  },
  'team-collaboration': {
    title: 'Team Collaboration',
    intro: 'FORVA gives agency owners and teams shared visibility into lead ownership, activity, and agent execution.',
    points: ['Lead assignment', 'Shared lead context', 'Agent activity visibility', 'Team-level performance view'],
    outcome: 'Coordinate lead handling across the agency without fragmented spreadsheets or disconnected notes.',
  },
  'multi-channel-capture': {
    title: 'Multi-Channel Capture',
    intro: 'FORVA centralizes leads from the channels real estate teams already use so every inquiry enters one consistent workflow.',
    points: ['Facebook Lead Ads', 'Instagram inquiries', 'Website lead forms', 'Manual lead entry'],
    outcome: 'Bring fragmented lead sources into one place before qualification, follow-up, and booking begin.',
  },
};

export function FeatureDetailPage() {
  const { slug = '' } = useParams();
  const feature = details[slug];
  if (!feature) return <Navigate to="/features" replace />;

  return (
    <div className="fp-site">
      <Seo title={feature.title} description={feature.intro} />
      <section className="fp-detail-hero">
        <div className="fp-shell">
          <Link to="/#features" className="fp-back-link"><ArrowLeft size={16} /> Back to features</Link>
          <span className="fp-kicker">FORVA Capability</span>
          <h1>{feature.title}</h1>
          <p>{feature.intro}</p>
        </div>
      </section>
      <section className="fp-detail-body">
        <div className="fp-shell fp-detail-grid">
          <div className="fp-detail-card">
            <span className="fp-kicker">What it brings together</span>
            <div className="fp-detail-points">
              {feature.points.map((point) => <div key={point}><CheckCircle2 size={20} /><span>{point}</span></div>)}
            </div>
          </div>
          <div className="fp-detail-card fp-detail-outcome">
            <span className="fp-kicker">Why it matters</span>
            <h2>{feature.outcome}</h2>
            <Link to="/get-started" className="fp-button fp-button-primary">Start for free <ArrowRight size={16} /></Link>
          </div>
        </div>
      </section>
    </div>
  );
}
