import { useState } from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import { Menu, X, ArrowRight } from 'lucide-react';

const navItems = [
  { to: '/features', label: 'Features' },
  { to: '/how-it-works', label: 'How It Works' },
  { to: '/pricing', label: 'Pricing' },
  { to: '/contact', label: 'Contact' },
];

const footerGroups = [
  {
    title: 'Platform',
    links: [
      ['/features/ai-powered-lead-qualification', 'AI Lead Qualification'],
      ['/features/instant-lead-response', 'Instant Lead Response'],
      ['/features/automated-follow-up', 'Automated Follow-Up'],
      ['/features/appointment-booking', 'Appointment Booking'],
      ['/features/buyer-intelligence', 'Buyer Intelligence'],
    ],
  },
  {
    title: 'Workflow',
    links: [
      ['/features/multi-channel-capture', 'Multi-Channel Capture'],
      ['/features/realtor-notifications', 'Realtor Notifications'],
      ['/features/lead-pipeline-management', 'Pipeline Management'],
      ['/features/team-collaboration', 'Team Collaboration'],
      ['/how-it-works', 'How FORVA Works'],
    ],
  },
  {
    title: 'Company',
    links: [
      ['/pricing', 'Pricing'],
      ['/contact', 'Contact'],
      ['/get-started', 'Start Free Trial'],
      ['/login', 'Client Login'],
    ],
  },
];

export function PublicLayout() {
  const [open, setOpen] = useState(false);

  return (
    <div className="fp-public-layout">
      <header className="fp-header">
        <div className="fp-shell fp-header-inner">
          <Link to="/" className="fp-brand" aria-label="FORVA PropTech home">
            <img src="/forva-logo-master.png" alt="FORVA PropTech" />
          </Link>

          <nav className="fp-nav" aria-label="Main navigation">
            {navItems.map((item) => (
              <NavLink key={item.to} to={item.to} className={({ isActive }) => isActive ? 'active' : ''}>
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="fp-header-actions">
            <Link to="/login" className="fp-login-link">Login</Link>
            <Link to="/contact" className="fp-header-secondary">Talk to sales</Link>
            <Link to="/get-started" className="fp-header-primary">Start for free <ArrowRight size={15} /></Link>
          </div>

          <button type="button" className="fp-menu-button" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} onClick={() => setOpen((v) => !v)}>
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {open && (
          <div className="fp-mobile-menu">
            <div className="fp-shell">
              {navItems.map((item) => <NavLink key={item.to} to={item.to} onClick={() => setOpen(false)}>{item.label}</NavLink>)}
              <Link to="/login" onClick={() => setOpen(false)}>Login</Link>
              <Link to="/get-started" onClick={() => setOpen(false)} className="fp-mobile-cta">Start for free</Link>
            </div>
          </div>
        )}
      </header>

      <main><Outlet /></main>

      <footer className="fp-footer">
        <div className="fp-shell">
          <div className="fp-footer-grid">
            <div className="fp-footer-brand">
              <img src="/forva-logo-master.png" alt="FORVA PropTech" />
              <p>AI-powered real estate lead automation built to help teams capture, qualify, engage, book, and manage opportunities in one connected workflow.</p>
              <Link to="/get-started" className="fp-footer-cta">Start 7-day free trial <ArrowRight size={15} /></Link>
            </div>

            {footerGroups.map((group) => (
              <div className="fp-footer-column" key={group.title}>
                <h3>{group.title}</h3>
                {group.links.map(([to, label]) => <Link to={to} key={to}>{label}</Link>)}
              </div>
            ))}

            <div className="fp-footer-trust">
              <div className="fp-trust-icon"><img src="/forva-app-icon-master.png" alt="FORVA app icon" /></div>
              <h3>Built for modern real estate teams</h3>
              <p>Web + installable app experience with a connected lead workflow.</p>
              <div className="fp-trust-tags"><span>AI workflow</span><span>Lead intelligence</span><span>Team-ready</span></div>
            </div>
          </div>

          <div className="fp-footer-bottom">
            <div>© 2026 FORVA PropTech</div>
            <div className="fp-legal-links">
              <Link to="/privacy">Privacy</Link><Link to="/terms">Terms</Link><Link to="/data-deletion">Data Deletion</Link>
            </div>
<div className="fp-footer-contact"><Link to="/contact">Contact FORVA</Link></div>
          </div>
        </div>
      </footer>
    </div>
  );
}
