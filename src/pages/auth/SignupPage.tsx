import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { Mail, Lock, User, ArrowRight, Loader as Loader2 } from 'lucide-react';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { Seo } from '@/components/shared/Seo';
import { supabase } from '@/lib/supabase';

export function SignupPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string })?.from || '/onboarding';
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !password) {
      setError('Please fill in all fields.');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    setError('');
    setSubmitting(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: fullName } },
      });
      if (error) throw error;
      if (data.session) {
        navigate(from, { replace: true });
      } else {
        navigate('/login?registered=1', { replace: true });
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unable to create account. Please try again.';
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Seo title="Create Account" description="Start your FORVA PropTech free trial." noindex />
      <AuthLayout
        title="Create your account"
        subtitle="Start your 7-day free trial — no credit card required"
        footer={
          <>
            Already have an account?{' '}
            <Link to="/login" className="text-accent-300 hover:underline">
              Sign in
            </Link>
          </>
        }
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="label" htmlFor="name">Full name</label>
            <div className="relative">
              <User size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-silver-500" />
              <input
                id="name"
                type="text"
                className="input pl-9"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Sarah Mitchell"
                autoComplete="name"
                disabled={submitting}
              />
            </div>
          </div>
          <div>
            <label className="label" htmlFor="email">Email</label>
            <div className="relative">
              <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-silver-500" />
              <input
                id="email"
                type="email"
                className="input pl-9"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
                disabled={submitting}
              />
            </div>
          </div>
          <div>
            <label className="label" htmlFor="password">Password</label>
            <div className="relative">
              <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-silver-500" />
              <input
                id="password"
                type="password"
                className="input pl-9"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 8 characters"
                autoComplete="new-password"
                disabled={submitting}
              />
            </div>
          </div>

          {error && <p className="text-sm text-red-300">{error}</p>}

          <button type="submit" className="btn-primary w-full" disabled={submitting}>
            {submitting ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Creating account...
              </>
            ) : (
              <>
                Create Account
                <ArrowRight size={16} />
              </>
            )}
          </button>
          <p className="text-center text-xs text-silver-500">
            By creating an account, you agree to our{' '}
            <Link to="/terms" className="text-accent-300 hover:underline">Terms</Link> and{' '}
            <Link to="/privacy" className="text-accent-300 hover:underline">Privacy Policy</Link>.
          </p>
        </form>
      </AuthLayout>
    </>
  );
}
