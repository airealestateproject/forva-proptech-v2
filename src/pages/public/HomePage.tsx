import { useEffect, useState } from 'react';
import { ArrowRight, ChartBar as BarChart3, BellRing, Brain, CalendarCheck, CircleCheck as CheckCircle2, ChevronLeft, ChevronRight, Filter, Globe as Globe2, MessageSquareReply, Mic as Mic2, Plug, Users, Zap, Plus, Minus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Seo } from '@/components/shared/Seo';
import { plans, trialDurationDays } from '@/data/plans';

const features = [
  {
    slug: 'ai-powered-lead-qualification',
    title: 'AI-Powered Lead Qualification',
    desc: 'Every lead is scored on buyer intent, budget, timeline, and financing so you know who to call first.',
    icon: Brain,
    label: 'Qualification score',
    metric: '92 / 100',
    chips: ['High intent', '$650K–$850K', '0–3 months'],
    image: '/feature-lead-qualification.png',
  },
  {
    slug: 'instant-lead-response',
    title: 'Instant Lead Response',
    desc: 'Automated first-touch messages reach leads within seconds, before they cool off.',
    icon: Zap,
    label: 'First response',
    metric: '< 30 sec',
    chips: ['Website inquiry', 'SMS sent', 'Reply received'],
    image: '/feature-instant-response.png',
  },
  {
    slug: 'automated-follow-up',
    title: 'Automated Follow-Up',
    desc: 'Scheduled, channel-aware follow-ups keep nurture moving without manual effort.',
    icon: MessageSquareReply,
    label: 'Active nurture',
    metric: 'Day 4 / 7',
    chips: ['SMS', 'Email', 'Next touch 2:30 PM'],
    image: '/feature-automated-followup.png',
  },
  {
    slug: 'appointment-booking',
    title: 'Appointment Booking',
    desc: 'Leads book viewings and consultations on your calendar with no back-and-forth.',
    icon: CalendarCheck,
    label: 'Viewing booked',
    metric: 'Thu · 2:00 PM',
    chips: ['Confirmed', 'Calendar synced', 'Reminder on'],
    image: '/feature-appointment-booking.png',
  },
  {
    slug: 'buyer-intelligence',
    title: 'Buyer Intelligence',
    desc: 'AI summary, intent rating, and qualification score for every lead in one view.',
    icon: BarChart3,
    label: 'Buyer intent',
    metric: 'High',
    chips: ['Pre-approved', '3 bedrooms', 'Miami Beach'],
    image: '/feature-buyer-intelligence.png',
  },
  {
    slug: 'realtor-notifications',
    title: 'Realtor Notifications',
    desc: 'Push-style alerts for new hot leads, replies, and appointments approaching.',
    icon: BellRing,
    label: 'Hot lead alert',
    metric: 'Just now',
    chips: ['New reply', 'High score', 'Call suggested'],
    image: '/feature-realtor-notifications.png',
  },
  {
    slug: 'lead-pipeline-management',
    title: 'Lead Pipeline Management',
    desc: 'Visual pipeline from New to Won with drag-friendly stages and temperature flags.',
    icon: Filter,
    label: 'Pipeline',
    metric: '18 active',
    chips: ['New 6', 'Qualified 7', 'Viewing 5'],
    image: '/feature-lead-pipeline.png',
  },
  {
    slug: 'team-collaboration',
    title: 'Team Collaboration',
    desc: 'Agency owners assign leads, track agent performance, and manage the whole team.',
    icon: Users,
    label: 'Team activity',
    metric: '4 agents online',
    chips: ['Lead assigned', 'Note added', 'Follow-up done'],
    image: '/feature-team-collaboration.png',
  },
  {
    slug: 'multi-channel-capture',
    title: 'Multi-Channel Capture',
    desc: 'Facebook Lead Ads, Instagram, website forms, and manual entry, all unified.',
    icon: Globe2,
    label: 'Lead sources',
    metric: '4 connected',
    chips: ['Facebook', 'Instagram', 'Website'],
    image: '/feature-multichannel-capture.png',
  },
];

const journeySteps = [
  { label: 'Property Inquiry', icon: Globe2 },
  { label: 'Lead Capture', icon: Filter },
  { label: 'AI Qualification', icon: Brain },
  { label: 'Instant Response', icon: Zap },
  { label: 'Automated Follow-Up', icon: MessageSquareReply },
  { label: 'Appointment', icon: CalendarCheck },
  { label: 'Realtor Notification', icon: BellRing },
  { label: 'Conversion', icon: CheckCircle2 },
];

const workflow = [
  { label: 'Lead captured', icon: Globe2 },
  { label: 'Instant response', icon: Zap },
  { label: 'AI Voice conversation', icon: Mic2 },
  { label: 'AI qualification', icon: Brain },
  { label: 'Buyer intelligence', icon: BarChart3 },
  { label: 'Automated follow-up', icon: MessageSquareReply },
  { label: 'Appointment booking', icon: CalendarCheck },
  { label: 'Realtor notification', icon: BellRing },
  { label: 'Pipeline / CRM', icon: Filter },
  { label: 'Closed', icon: CheckCircle2 },
];

const integrations = [
  { name: 'Facebook / Meta', icon: Globe2 },
  { name: 'Instagram', icon: Globe2 },
  { name: 'Website Forms', icon: Filter },
  { name: 'Google Calendar', icon: CalendarCheck },
  { name: 'Email', icon: MessageSquareReply },
  { name: 'SMS', icon: MessageSquareReply },
];

const testimonials = [
  { name: 'Client story 01', role: 'Real estate professional', quote: 'Replace this preview with a verified customer quote about faster lead response and better follow-up.', result: 'Faster lead response' },
  { name: 'Client story 02', role: 'Real estate team', quote: 'Replace this preview with a verified story about keeping more inbound leads engaged automatically.', result: 'More engaged leads' },
  { name: 'Client story 03', role: 'Agency owner', quote: 'Replace this preview with a verified story about clearer buyer qualification and stronger agent prioritization.', result: 'Clearer qualification' },
  { name: 'Client story 04', role: 'Realtor', quote: 'Replace this preview with a verified story about reducing manual follow-up while keeping conversations moving.', result: 'Less manual follow-up' },
  { name: 'Client story 05', role: 'Brokerage team', quote: 'Replace this preview with a verified story about booking more conversations directly from fresh inquiries.', result: 'More appointments' },
  { name: 'Client story 06', role: 'Team lead', quote: 'Replace this preview with a verified story about seeing every lead, owner, stage, and next action in one place.', result: 'Better visibility' },
  { name: 'Client story 07', role: 'Real estate agency', quote: 'Replace this preview with a verified story about bringing Facebook, Instagram, and website leads into one workflow.', result: 'Unified lead capture' },
  { name: 'Client story 08', role: 'Realtor', quote: 'Replace this preview with a verified story about receiving useful alerts when high-intent prospects need attention.', result: 'Timely notifications' },
  { name: 'Client story 09', role: 'Agency manager', quote: 'Replace this preview with a verified story about assigning leads faster and improving team accountability.', result: 'Stronger team workflow' },
  { name: 'Client story 10', role: 'Broker', quote: 'Replace this preview with a verified story about using automation and buyer intelligence to support more consistent closing activity.', result: 'More consistent pipeline' },
];

const faqs = [
  {
    q: 'What is FORVA PropTech?',
    a: 'FORVA PropTech is an AI-powered real estate lead engine that captures, qualifies, follows up with, and converts property inquiries. It unifies Facebook Lead Ads, Instagram, website forms, and manual entry into one connected workflow.',
  },
  {
    q: 'How does the 7-day free trial work?',
    a: `Every plan includes a ${trialDurationDays}-day free trial with full access to FORVA PropTech. No credit card is required to start. You can explore all features, connect lead sources, and see the workflow in action before committing.`,
  },
  {
    q: 'Which lead sources does FORVA support?',
    a: 'FORVA captures leads from Facebook Lead Ads, Instagram inquiries, website forms, and manual entry. All channels funnel into one unified lead inbox so nothing falls through the cracks.',
  },
  {
    q: 'How does AI qualification work?',
    a: 'FORVA automatically scores each lead on buyer intent, budget, preferred location, property type, purchase timeline, and financing status. You get an AI summary and qualification score the moment a lead arrives.',
  },
  {
    q: 'Can I use FORVA with my team?',
    a: 'Yes. The Team plan supports up to 5 users and the Agency plan supports up to 15. Agency owners can assign leads, track agent performance, and manage the whole team from one dashboard.',
  },
  {
    q: 'What payment methods do you accept?',
    a: 'Subscriptions are securely processed through PayPal. You can switch plans or cancel anytime from your billing settings.',
  },
  {
    q: 'Is there a long-term contract?',
    a: 'No. All plans are month-to-month. You can upgrade, downgrade, or cancel at any time.',
  },
  {
    q: 'Does FORVA work on mobile?',
    a: 'Yes. FORVA PropTech is a fully responsive web application and installable PWA. You can use it on desktop, tablet, and mobile with full functionality across all devices.',
  },
];

function WorkflowRow({ reverse = false }: { reverse?: boolean }) {
  const doubled = [...workflow, ...workflow];
  return (
    <div className="fp-marquee" aria-label="FORVA workflow capabilities">
      <div className={`fp-marquee-track ${reverse ? 'fp-marquee-reverse' : ''}`}>
        {doubled.map((item, index) => {
          const Icon = item.icon;
          return (
            <div className="fp-flow-pill" key={`${item.label}-${index}`} aria-hidden={index >= workflow.length}>
              <span className="fp-flow-icon"><Icon size={18} /></span>
              <span>{item.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function FaqItem({ faq, isOpen, onToggle }: { faq: { q: string; a: string }; isOpen: boolean; onToggle: () => void }) {
  return (
    <div className="fp-faq-item">
      <button type="button" onClick={onToggle} className="fp-faq-question" aria-expanded={isOpen}>
        <span>{faq.q}</span>
        {isOpen ? <Minus size={18} /> : <Plus size={18} />}
      </button>
      {isOpen && <p className="fp-faq-answer">{faq.a}</p>}
    </div>
  );
}

export function HomePage() {
  const [testimonialIndex, setTestimonialIndex] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setTestimonialIndex((current) => (current + 1) % testimonials.length);
    }, 7000);
    return () => window.clearInterval(timer);
  }, []);

  const activeTestimonial = testimonials[testimonialIndex];

  const nextTestimonial = () => setTestimonialIndex((i) => (i + 1) % testimonials.length);
  const previousTestimonial = () => setTestimonialIndex((i) => (i - 1 + testimonials.length) % testimonials.length);

  return (
    <div className="fp-site">
      <Seo
        title="AI-Powered Real Estate Lead Engine"
        description="FORVA PropTech helps real estate professionals capture leads, qualify buyers with AI, follow up faster, book appointments and manage every opportunity in one workflow."
      />

      {/* Hero */}
      <section className="fp-hero">
        <div className="fp-shell fp-hero-grid">
          <div className="fp-hero-copy">
            <div className="fp-eyebrow"><span className="fp-dot" /> AI-Powered Real Estate Automation</div>
            <h1>Capture. Qualify.<br />Convert. Close.</h1>
            <p>
              Turn every inquiry into an opportunity. FORVA captures, qualifies, and follows up with real estate leads automatically, so your team can focus on closing.
            </p>
            <div className="fp-hero-actions">
              <Link to="/get-started" className="fp-button fp-button-primary">Start for free <ArrowRight size={17} /></Link>
              <a href="#how-forva-works" className="fp-text-link">See how it works <ArrowRight size={16} /></a>
            </div>
            <div className="fp-hero-note">{trialDurationDays}-day free trial · Built for real estate professionals</div>
          </div>

          <div className="fp-video-card">
            <video src="/forva-hero.mp4" autoPlay muted loop playsInline controls preload="metadata" aria-label="FORVA PropTech product overview" />
          </div>
        </div>
      </section>

      {/* Customer Journey */}
      <section className="fp-journey-section">
        <div className="fp-shell">
          <div className="fp-section-intro">
            <span className="fp-kicker">The FORVA Journey</span>
            <h2>From property inquiry to conversion</h2>
            <p>Every lead follows a clear path forward — from the first inquiry through qualification, follow-up, and appointment to a closed deal.</p>
          </div>
          <div className="fp-journey-track">
            {journeySteps.map((step, i) => {
              const Icon = step.icon;
              return (
                <div className="fp-journey-step" key={step.label}>
                  <div className="fp-journey-icon"><Icon size={22} /></div>
                  <span>{step.label}</span>
                  {i < journeySteps.length - 1 && <div className="fp-journey-arrow"><ArrowRight size={14} /></div>}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="fp-feature-area">
        <div className="fp-shell">
          <div className="fp-section-intro">
            <span className="fp-kicker">One connected lead engine</span>
            <h2>Built around the work that moves a lead forward.</h2>
            <p>Each capability works as part of one real estate workflow—from the first inquiry to the next best action.</p>
          </div>

          <div className="fp-feature-stack">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <article className={`fp-feature-row ${index % 2 ? 'fp-feature-row-reverse' : ''}`} key={feature.slug}>
                  <div className="fp-feature-copy">
                    <div className="fp-feature-number">0{index + 1}</div>
                    <div className="fp-feature-title-line"><Icon size={21} /><span>{feature.title}</span></div>
                    <p>{feature.desc}</p>
                    <Link to={`/features/${feature.slug}`} className="fp-learn-link">
                      Learn more about {feature.title} <ArrowRight size={16} />
                    </Link>
                  </div>

                  <div className="fp-product-visual" aria-label={`${feature.title} product visual`}>
                    <img src={feature.image} alt={`${feature.title} interface`} />
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* How FORVA Works */}
      <section id="how-forva-works" className="fp-how-section">
        <div className="fp-shell fp-how-heading">
          <span className="fp-kicker">How FORVA Works</span>
          <h2>From new lead to closed deal. Automatically.</h2>
          <p>FORVA connects capture, conversations, AI intelligence, scheduling, notifications, and pipeline management into one continuous workflow.</p>
          <Link to="/how-it-works" className="fp-learn-link">Explore the complete workflow <ArrowRight size={16} /></Link>
        </div>
        <div className="fp-flow-wrap">
          <WorkflowRow />
          <WorkflowRow reverse />
        </div>
      </section>

      {/* Integrations */}
      <section className="fp-integrations-section">
        <div className="fp-shell">
          <div className="fp-section-intro">
            <span className="fp-kicker">Connect your tools</span>
            <h2>One workflow for every lead source</h2>
            <p>FORVA connects to the channels real estate teams already use, so every inquiry enters one consistent workflow.</p>
          </div>
          <div className="fp-integrations-grid">
            {integrations.map((int) => {
              const Icon = int.icon;
              return (
                <div className="fp-integration-card" key={int.name}>
                  <div className="fp-integration-icon"><Icon size={24} /></div>
                  <span>{int.name}</span>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="fp-testimonial-section">
        <div className="fp-shell">
          <div className="fp-testimonial-heading">
            <div>
              <span className="fp-kicker">Customer stories</span>
              <h2>Results become the story.</h2>
            </div>
            <p>Carousel structure is ready for 10 verified FORVA customer stories. The current entries are clearly marked preview content and should be replaced before production.</p>
          </div>

          <div className="fp-testimonial-card">
            <div className="fp-testimonial-result">{activeTestimonial.result}</div>
            <blockquote>“{activeTestimonial.quote}”</blockquote>
            <div className="fp-testimonial-person">
              <div className="fp-avatar" aria-hidden="true">{String(testimonialIndex + 1).padStart(2, '0')}</div>
              <div>
                <strong>{activeTestimonial.name}</strong>
                <span>{activeTestimonial.role} · Preview placeholder</span>
              </div>
            </div>
          </div>

          <div className="fp-carousel-controls">
            <div className="fp-dots" aria-label="Choose testimonial">
              {testimonials.map((item, index) => (
                <button
                  type="button"
                  key={item.name}
                  className={index === testimonialIndex ? 'active' : ''}
                  aria-label={`Show testimonial ${index + 1}`}
                  aria-current={index === testimonialIndex ? 'true' : undefined}
                  onClick={() => setTestimonialIndex(index)}
                />
              ))}
            </div>
            <div className="fp-arrow-buttons">
              <button type="button" onClick={previousTestimonial} aria-label="Previous testimonial"><ChevronLeft size={22} /></button>
              <button type="button" onClick={nextTestimonial} aria-label="Next testimonial"><ChevronRight size={22} /></button>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Preview */}
      <section className="fp-pricing-preview">
        <div className="fp-shell">
          <div className="fp-section-intro">
            <span className="fp-kicker">Pricing</span>
            <h2>Plans that scale with your business</h2>
            <p>{trialDurationDays}-day free trial. No credit card required to start.</p>
          </div>
          <div className="fp-pricing-grid">
            {plans.map((plan) => (
              <div className={`fp-pricing-card ${plan.highlighted ? 'fp-pricing-featured' : ''}`} key={plan.id}>
                {plan.highlighted && <span className="fp-pricing-badge">Most Popular</span>}
                <h3>{plan.name}</h3>
                <div className="fp-pricing-price">
                  <span className="fp-pricing-amount">${plan.monthlyPrice}</span>
                  <span className="fp-pricing-period">/month</span>
                </div>
                <p className="fp-pricing-desc">{plan.description}</p>
                <ul className="fp-pricing-features">
                  {plan.features.slice(0, 5).map((f) => (
                    <li key={f}><CheckCircle2 size={16} /> {f}</li>
                  ))}
                </ul>
                <Link to="/get-started" className={`fp-button ${plan.highlighted ? 'fp-button-primary' : 'fp-button-secondary'}`}>
                  {plan.cta} <ArrowRight size={15} />
                </Link>
              </div>
            ))}
          </div>
          <div className="fp-pricing-footer">
            <Link to="/pricing" className="fp-learn-link">Compare all plans <ArrowRight size={16} /></Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="fp-faq-section">
        <div className="fp-shell">
          <div className="fp-section-intro">
            <span className="fp-kicker">FAQ</span>
            <h2>Frequently asked questions</h2>
          </div>
          <div className="fp-faq-list">
            {faqs.map((faq, i) => (
              <FaqItem
                key={i}
                faq={faq}
                isOpen={openFaq === i}
                onToggle={() => setOpenFaq(openFaq === i ? null : i)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="fp-final-cta">
        <div className="fp-shell fp-final-cta-card">
          <div>
            <span className="fp-kicker">Ready when your next lead arrives</span>
            <h2>Give every real estate lead a faster path forward.</h2>
          </div>
          <div className="fp-final-actions">
            <Link to="/get-started" className="fp-button fp-button-primary">Start {trialDurationDays}-day free trial <ArrowRight size={17} /></Link>
            <Link to="/contact" className="fp-button fp-button-secondary">Talk to sales</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
