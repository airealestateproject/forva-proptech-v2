import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Lock, ArrowRight, Loader2, Eye, EyeOff, Check, AlertCircle } from 'lucide-react';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { Seo } from '@/components/shared/Seo';
import { supabase } from '@/lib/supabase';

export function ResetPasswordPage() {
  const navigate = useNavigate();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');
  const [hasSession, setHasSession] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setHasSession(!!session);
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setSubmitting(true);

    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      setDone(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to reset password. The reset link may have expired.');
    } finally {
      setSubmitting(false);
    }
  };

  if (!hasSession) {
    return (
      <>
        <Seo title="Reset Password" description="Set a new password for your FORVA PropTech account." noindex />
        <AuthLayout
          title="Reset password"
          subtitle="Your reset link may have expired"
          footer={
            <Link to="/forgot-password" className="text-accent-300 hover:underline">
              Request a new reset link
            </Link>
          }
        >
          <div className="flex flex-col items-center gap-3 py-6 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-amber-500/15 text-amber-300">
              <AlertCircle size={24} />
            </div>
            <p className="text-sm text-silver-300">
              This password reset link is invalid or has expired. Please request a new one.
            </p>
            <Link to="/forgot-password" className="btn-primary mt-2">
              Request New Link
              <ArrowRight size={16} />
            </Link>
          </div>
        </AuthLayout>
      </>
    );
  }

  return (
    <>
      <Seo title="Reset Password" description="Set a new password for your FORVA PropTech account." noindex />
      <AuthLayout
        title="Reset password"
        subtitle="Choose a new password for your account"
        footer={
          <Link to="/login" className="text-accent-300 hover:underline">
            Back to sign in
          </Link>
        }
      >
        {done ? (
          <div className="flex flex-col items-center gap-3 py-6 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-300">
              <Check size={24} />
            </div>
            <p className="text-sm text-silver-300">Your password has been reset successfully.</p>
            <button
              type="button"
              onClick={() => navigate('/app/dashboard')}
              className="btn-primary mt-2"
            >
              Go to Dashboard
              <ArrowRight size={16} />
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="label" htmlFor="password">New password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-silver-500" />
                <input
                  id="password"
                  type={showNew ? 'text' : 'password'}
                  className="input pl-9 pr-10"
                  required
                  placeholder="At least 8 characters"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  disabled={submitting}
                />
                <button
                  type="button"
                  onClick={() => setShowNew((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-silver-500 hover:text-silver-300"
                  aria-label={showNew ? 'Hide password' : 'Show password'}
                >
                  {showNew ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <div>
              <label className="label" htmlFor="confirm">Confirm password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-silver-500" />
                <input
                  id="confirm"
                  type={showConfirm ? 'text' : 'password'}
                  className="input pl-9 pr-10"
                  required
                  placeholder="Re-enter new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={submitting}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-silver-500 hover:text-silver-300"
                  aria-label={showConfirm ? 'Hide password' : 'Show password'}
                >
                  {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            {error && <p className="text-sm text-red-300">{error}</p>}
            <button type="submit" className="btn-primary w-full" disabled={submitting}>
              {submitting ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Resetting...
                </>
              ) : (
                <>
                  Reset Password
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
