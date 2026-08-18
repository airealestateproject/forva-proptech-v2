import { type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, CircleCheck as CheckCircle2, Sparkles, Zap, Users } from 'lucide-react';
import { Logo } from '@/components/shared/Logo';

export function AuthLayout({ title, subtitle, children, footer }: { title: string; subtitle: string; children: ReactNode; footer?: ReactNode; }) {
  return (
    <div className="fv-auth-shell">
      <section className="fv-auth-brand-panel">
        <Link to="/" className="fv-auth-logo"><Logo variant="full" theme="dark" /></Link>
        <div className="fv-auth-story">
          <div className="fv-auth-eyebrow"><Sparkles size={15}/> AI-powered real estate lead engine</div>
          <h2>Turn every inquiry into your next opportunity.</h2>
          <p>Capture leads, qualify buyer intent, automate follow-up, and book appointments from one connected workspace.</p>
          <div className="fv-auth-benefits">
            <div><span><Zap size={18}/></span><div><strong>Respond instantly</strong><small>Keep new opportunities from going cold.</small></div></div>
            <div><span><Users size={18}/></span><div><strong>Know who to prioritize</strong><small>Buyer intelligence surfaces high-intent leads.</small></div></div>
            <div><span><CheckCircle2 size={18}/></span><div><strong>Move leads forward</strong><small>Follow-up and appointments stay in one workflow.</small></div></div>
          </div>
        </div>
        <div className="fv-auth-proof"><span className="fv-live-dot"/> Lead engine ready when you sign in</div>
      </section>
      <section className="fv-auth-form-panel">
        <div className="fv-auth-mobile-logo"><Logo variant="full" theme="dark" /></div>
        <div className="fv-auth-card">
          <div className="fv-auth-icon"><Logo variant="mark" theme="dark" /></div>
          <h1>{title}</h1><p className="fv-auth-subtitle">{subtitle}</p>
          <div className="fv-auth-form-content">{children}</div>
          {footer && <div className="fv-auth-footer">{footer}</div>}
          <Link to="/" className="fv-auth-back"><ArrowLeft size={14}/> Back to FORVA PropTech</Link>
        </div>
      </section>
    </div>
  );
}

export function AuthNote() {
  return null;
}
