import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowRight, Check, Loader2 } from 'lucide-react';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { Seo } from '@/components/shared/Seo';
import { supabase } from '@/lib/supabase';

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email address.');
      return;
    }
    setError('');
    setSubmitting(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to send reset link. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Seo title="Forgot Password" description="Reset your FORVA PropTech password." noindex />
      <AuthLayout
        title="Forgot password"
        subtitle="Enter your email and we'll send you a reset link"
        footer={
          <>
            Remember your password?{' '}
            <Link to="/login" className="text-accent-300 hover:underline">
              Sign in
            </Link>
          </>
        }
      >
        {sent ? (
          <div className="flex flex-col items-center gap-3 py-6 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-300">
              <Check size={24} />
            </div>
            <p className="text-sm text-silver-300">
              If an account exists for that email, a reset link is on its way.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label" htmlFor="email">Email</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-silver-500" />
                <input
                  id="email"
                  type="email"
                  className="input pl-9"
                  required
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={submitting}
                />
              </div>
            </div>
            {error && <p className="text-sm text-red-300">{error}</p>}
            <button type="submit" className="btn-primary w-full" disabled={submitting}>
              {submitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  Send Reset Link
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>
        )}
      </AuthLayout>
    </>
  );
}
