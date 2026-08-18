import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {
  User,
  Building2,
  Users,
  Bell,
  Plug,
  Shield,
  Mail,
  Camera,
  Facebook,
  Instagram,
  Globe,
  Calendar,
  MessageSquare,
  Check,
  CreditCard,
  BarChart3,
  PhoneCall,
  Sparkles,
  Eye,
  EyeOff,
  Loader2,
  AlertCircle,
  UserPlus,
  Upload,
} from 'lucide-react';
import { Seo } from '@/components/shared/Seo';
import { PageHeader } from '@/components/shared/SectionHeading';
import { Modal } from '@/components/shared/Modal';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabase';
import { plans, trialDurationDays } from '@/data/plans';
import type { Section } from './settingsSections';
import { subscriptionStatusConfig, trialStatusConfig } from './settingsSections';

const sections: { key: Section; label: string; icon: typeof User }[] = [
  { key: 'profile', label: 'Profile', icon: User },
  { key: 'business', label: 'Business', icon: Building2 },
  { key: 'team', label: 'Team', icon: Users },
  { key: 'integrations', label: 'Integrations', icon: Plug },
  { key: 'notifications', label: 'Notifications', icon: Bell },
  { key: 'billing', label: 'Billing & Subscription', icon: CreditCard },
  { key: 'usage', label: 'Usage', icon: BarChart3 },
  { key: 'ai_voice', label: 'AI Voice', icon: PhoneCall },
  { key: 'security', label: 'Security', icon: Shield },
];

interface Integration {
  name: string;
  icon: typeof Facebook;
  status: 'not_connected' | 'setup_required' | 'coming_soon';
  desc: string;
  modalTitle: string;
  modalBody: string;
}

const integrations: Integration[] = [
  {
    name: 'Facebook / Meta',
    icon: Facebook,
    status: 'setup_required',
    desc: 'Capture leads from Facebook Lead Ads.',
    modalTitle: 'Facebook / Meta Lead Ads',
    modalBody: 'This integration connects your Facebook Lead Ad campaigns to FORVA so new leads are captured automatically. Setup requires connecting your Facebook Business account and authorizing lead access. This integration is not yet activated for your account.',
  },
  {
    name: 'Instagram',
    icon: Instagram,
    status: 'setup_required',
    desc: 'Capture Instagram lead inquiries.',
    modalTitle: 'Instagram Lead Inquiries',
    modalBody: 'This integration captures Instagram lead form submissions and DM inquiries into your FORVA pipeline. Setup requires connecting your Instagram Business account. This integration is not yet activated for your account.',
  },
  {
    name: 'Website',
    icon: Globe,
    status: 'setup_required',
    desc: 'Embed lead capture forms on your site.',
    modalTitle: 'Website Lead Capture',
    modalBody: 'This integration provides embeddable lead capture forms and webhook endpoints for your website. Setup involves placing a snippet or configuring a webhook URL on your site. This integration is not yet activated for your account.',
  },
  {
    name: 'Google Calendar',
    icon: Calendar,
    status: 'setup_required',
    desc: 'Sync appointments to your calendar.',
    modalTitle: 'Google Calendar Sync',
    modalBody: 'This integration syncs FORVA appointments to your connected Google Calendar and checks availability for booking. Setup requires OAuth authorization with your Google account. This integration is not yet activated for your account.',
  },
  {
    name: 'Email',
    icon: Mail,
    status: 'setup_required',
    desc: 'Send and receive lead email follow-ups.',
    modalTitle: 'Email Integration',
    modalBody: 'This integration enables automated email follow-ups and two-way email conversations with leads. Setup requires connecting and authorizing an email account. This integration is not yet activated for your account.',
  },
  {
    name: 'SMS',
    icon: MessageSquare,
    status: 'coming_soon',
    desc: 'Text-based lead follow-up and reminders.',
    modalTitle: 'SMS Integration',
    modalBody: 'This integration enables automated SMS follow-ups and two-way text conversations with leads. SMS integration is coming soon and not yet available for activation.',
  },
];

const statusConfig = {
  not_connected: { label: 'Not Connected', classes: 'bg-white/5 text-silver-400 border border-white/10' },
  setup_required: { label: 'Setup Required', classes: 'bg-amber-500/15 text-amber-300 border border-amber-500/30' },
  coming_soon: { label: 'Coming Soon', classes: 'bg-silver-500/15 text-silver-400 border border-silver-500/30' },
};

export function SettingsPage() {
  const { isAgency, isSuperAdmin } = useAuth();
  const [section, setSection] = useState<Section>('profile');
  const [modal, setModal] = useState<{ title: string; body: string } | null>(null);

  const visibleSections = sections.filter(
    (s) => s.key !== 'team' || isAgency || isSuperAdmin,
  );

  return (
    <>
      <Seo title="Settings" noindex />
      <div className="space-y-5">
        <PageHeader title="Settings" subtitle="Manage your account and preferences" />

        <div className="grid gap-5 lg:grid-cols-[200px_1fr]">
          <nav className="flex flex-row gap-1 overflow-x-auto lg:flex-col" aria-label="Settings sections">
            {visibleSections.map((s) => (
              <button
                key={s.key}
                type="button"
                onClick={() => setSection(s.key)}
                className={`flex flex-shrink-0 items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  section === s.key
                    ? 'bg-accent-500/15 text-accent-300'
                    : 'text-silver-400 hover:text-white hover:bg-white/5'
                }`}
              >
                <s.icon size={16} />
                <span>{s.label}</span>
              </button>
            ))}
          </nav>

          <div className="card p-5 sm:p-6">
            {section === 'profile' && <ProfileSection />}
            {section === 'business' && <BusinessSection />}
            {section === 'team' && (isAgency || isSuperAdmin) && <TeamSection />}
            {section === 'notifications' && <NotificationsSection />}
            {section === 'integrations' && (
              <IntegrationsSection onOpenModal={(m) => setModal(m)} />
            )}
            {section === 'billing' && <BillingSection />}
            {section === 'usage' && <UsageSection />}
            {section === 'ai_voice' && <AIVoiceSection />}
            {section === 'security' && <SecuritySection />}
          </div>
        </div>
      </div>

      {modal && (
        <Modal title={modal.title} onClose={() => setModal(null)}>
          <p className="text-sm leading-relaxed text-silver-300">{modal.body}</p>
          <div className="mt-5 flex justify-end gap-2">
            <button type="button" onClick={() => setModal(null)} className="btn-secondary">
              Close
            </button>
          </div>
        </Modal>
      )}
    </>
  );
}

// ---------- Profile Section ----------

function ProfileSection() {
  const { user, profile, refreshUser } = useAuth();
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setFullName(user?.name ?? '');
    setPhone(profile?.phone ?? '');
    setAvatarUrl(profile?.avatarUrl ?? null);
  }, [user, profile]);

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!allowedTypes.includes(file.type)) {
      setMessage({ type: 'error', text: 'Please select a JPEG, PNG, WebP, or GIF image.' });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setMessage({ type: 'error', text: 'Image must be under 5 MB.' });
      return;
    }

    setUploading(true);
    setMessage(null);

    try {
      const fileExt = file.name.split('.').pop();
      const filePath = `${user.id}/avatar-${Date.now()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { cacheControl: '3600', upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      if (profile?.agentId) {
        const { error: updateError } = await supabase
          .from('agents')
          .update({ avatar_url: publicUrl })
          .eq('id', profile.agentId);
        if (updateError) throw updateError;
      }

      setAvatarUrl(publicUrl);
      await refreshUser();
      setMessage({ type: 'success', text: 'Profile photo updated.' });
    } catch (err) {
      setMessage({
        type: 'error',
        text: err instanceof Error ? err.message : 'Failed to upload photo.',
      });
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    setMessage(null);

    try {
      const updates: Promise<unknown>[] = [];

      if (fullName !== user.name) {
        updates.push(
          supabase.auth.updateUser({ data: { full_name: fullName } }),
        );
      }

      if (profile?.agentId) {
        if (fullName !== user.name) {
          updates.push(
            supabase
              .from('agents')
              .update({ full_name: fullName })
              .eq('id', profile.agentId),
          );
        }
        if (phone !== profile.phone) {
          updates.push(
            supabase
              .from('agents')
              .update({ phone })
              .eq('id', profile.agentId),
          );
        }
      }

      if (updates.length === 0) {
        setMessage({ type: 'success', text: 'No changes to save.' });
        setSaving(false);
        return;
      }

      const results = await Promise.all(updates);
      const errorResult = results.find(
        (r) => r && typeof r === 'object' && 'error' in r && (r as { error: { message: string } }).error,
      );
      if (errorResult) throw new Error((errorResult as { error: { message: string } }).error.message);

      await refreshUser();
      setMessage({ type: 'success', text: 'Profile updated successfully.' });
    } catch (err) {
      setMessage({
        type: 'error',
        text: err instanceof Error ? err.message : 'Failed to update profile.',
      });
    } finally {
      setSaving(false);
    }
  };

  const initials = user?.name.split(' ').map((n) => n[0]).join('') || 'U';

  return (
    <form onSubmit={handleSave} className="space-y-4">
      <h2 className="text-sm font-semibold text-white">Profile</h2>
      <div className="flex items-center gap-4">
        <div className="relative h-16 w-16 overflow-hidden rounded-2xl bg-accent-gradient">
          {avatarUrl ? (
            <img src={avatarUrl} alt={user?.name} className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-lg font-bold text-white">
              {initials}
            </div>
          )}
        </div>
        <div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={handlePhotoUpload}
            className="hidden"
          />
          <button
            type="button"
            className="btn-secondary text-xs"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading || !profile?.agentId}
          >
            {uploading ? (
              <>
                <Loader2 size={14} className="animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Camera size={14} />
                Change photo
              </>
            )}
          </button>
          {!profile?.agentId && (
            <p className="mt-1 text-xs text-silver-500">Photo upload requires an agent profile.</p>
          )}
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="name">Full name</label>
          <input
            id="name"
            className="input"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Your name"
          />
        </div>
        <div>
          <label className="label" htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            className="input opacity-60"
            value={user?.email ?? ''}
            readOnly
            aria-readonly
          />
          <p className="mt-1 text-xs text-silver-500">
            Email changes are managed through Security settings below.
          </p>
        </div>
        <div>
          <label className="label" htmlFor="phone">Phone</label>
          <input
            id="phone"
            className="input"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="No phone on file"
          />
        </div>
      </div>
      <FormActions saving={saving} message={message} />
    </form>
  );
}

// ---------- Business Section ----------

function BusinessSection() {
  const { profile, canEditBusiness } = useAuth();
  const [clientName, setClientName] = useState('');
  const [market, setMarket] = useState('');
  const [timezone, setTimezone] = useState('');
  const [bookingUrl, setBookingUrl] = useState('');
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    setClientName(profile?.clientName ?? '');
    setMarket(profile?.clientMarket ?? '');
    setTimezone(profile?.clientTimezone ?? '');
    setBookingUrl(profile?.clientBookingUrl ?? '');
  }, [profile]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile?.clientId) {
      setMessage({ type: 'error', text: 'No business record found for your account.' });
      return;
    }
    setSaving(true);
    setMessage(null);

    try {
      const { error } = await supabase
        .from('clients')
        .update({
          name: clientName,
          market,
          timezone,
          booking_url: bookingUrl || null,
        })
        .eq('id', profile.clientId);

      if (error) throw error;
      setMessage({ type: 'success', text: 'Business settings updated successfully.' });
    } catch (err) {
      setMessage({
        type: 'error',
        text: err instanceof Error ? err.message : 'Failed to update business settings.',
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-4">
      <h2 className="text-sm font-semibold text-white">Business</h2>
      <div>
        <label className="label">Account type</label>
        <div className="flex gap-3">
          <div className={`flex-1 rounded-lg border p-3 text-sm ${profile?.clientName ? 'border-accent-400 bg-accent-500/10' : 'border-white/10'}`}>
            <p className="font-medium text-white">Agency / Team</p>
            <p className="text-xs text-silver-500">Multiple agents</p>
          </div>
          <div className={`flex-1 rounded-lg border p-3 text-sm ${!profile?.clientName ? 'border-accent-400 bg-accent-500/10' : 'border-white/10'}`}>
            <p className="font-medium text-white">Individual Agent</p>
            <p className="text-xs text-silver-500">Solo realtor</p>
          </div>
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="label" htmlFor="agency">Business name</label>
          <input
            id="agency"
            className="input"
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
            disabled={!canEditBusiness}
            placeholder="Not available yet"
          />
          {!canEditBusiness && (
            <p className="mt-1 text-xs text-silver-500">Only agency owners and admins can edit business details.</p>
          )}
        </div>
        <div>
          <label className="label" htmlFor="market">Market</label>
          <input
            id="market"
            className="input"
            value={market}
            onChange={(e) => setMarket(e.target.value)}
            disabled={!canEditBusiness}
            placeholder="Not available yet"
          />
        </div>
        <div>
          <label className="label" htmlFor="timezone">Timezone</label>
          <input
            id="timezone"
            className="input"
            value={timezone}
            onChange={(e) => setTimezone(e.target.value)}
            disabled={!canEditBusiness}
            placeholder="Not available yet"
          />
        </div>
        <div>
          <label className="label" htmlFor="bookingUrl">Booking URL</label>
          <input
            id="bookingUrl"
            className="input"
            value={bookingUrl}
            onChange={(e) => setBookingUrl(e.target.value)}
            disabled={!canEditBusiness}
            placeholder="Not available yet"
          />
        </div>
      </div>
      {canEditBusiness ? (
        <FormActions saving={saving} message={message} />
      ) : (
        <p className="text-xs text-silver-500">
          Business settings are read-only for your role. Contact your agency owner to make changes.
        </p>
      )}
    </form>
  );
}

// ---------- Team Section ----------

function TeamSection() {
  const [showInvite, setShowInvite] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-white">Team Members</h2>
        <button type="button" className="btn-primary text-xs" onClick={() => setShowInvite(true)}>
          <UserPlus size={14} />
          Invite Member
        </button>
      </div>
      <p className="text-sm text-silver-400">
        Manage your agency team members and their roles. Full team management is available on the Team page.
      </p>
      <div className="rounded-lg border border-dashed border-white/10 p-6 text-center text-sm text-silver-500">
        Team member invitations will appear here once configured.
      </div>

      {showInvite && (
        <Modal title="Invite Team Member" onClose={() => setShowInvite(false)}>
          <div className="space-y-4">
            <p className="text-sm text-silver-300">
              Enter the email address of the person you'd like to invite to your agency. They will receive an invitation to join your FORVA PropTech workspace.
            </p>
            <div>
              <label className="label" htmlFor="inviteEmail">Email address</label>
              <input id="inviteEmail" type="email" className="input" placeholder="colleague@example.com" />
            </div>
            <div className="rounded-lg border border-amber-500/20 bg-amber-500/5 p-3">
              <p className="text-xs text-amber-300">
                Invitation delivery is not yet configured. No email will be sent until the invitation system is activated. Please contact support to enable team invitations.
              </p>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setShowInvite(false)} className="btn-secondary">
                Cancel
              </button>
              <button
                type="button"
                onClick={() => setShowInvite(false)}
                className="btn-primary"
                disabled
              >
                Send Invite
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ---------- Notifications Section ----------

function NotificationsSection() {
  const { profile, refreshUser } = useAuth();
  const [inAppEnabled, setInAppEnabled] = useState(profile?.notificationInApp ?? true);
  const [emailEnabled, setEmailEnabled] = useState(profile?.notificationEmail ?? true);
  const [smsEnabled, setSmsEnabled] = useState(profile?.notificationSms ?? true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const preferences = [
    { key: 'in_app' as const, label: 'In-app notifications', desc: 'See notifications in the bell icon and Notifications page.' },
    { key: 'email' as const, label: 'Email notifications', desc: 'Receive lead alerts and updates via email. Requires email integration.' },
    { key: 'sms' as const, label: 'SMS notifications', desc: 'Receive lead alerts and reminders via text message. Requires SMS integration.' },
  ];

  const handleToggle = async (key: 'in_app' | 'email' | 'sms', value: boolean) => {
    if (key === 'in_app') setInAppEnabled(value);
    if (key === 'email') setEmailEnabled(value);
    if (key === 'sms') setSmsEnabled(value);

    if (!profile?.agentId) return;

    setSaving(true);
    setMessage(null);

    const column =
      key === 'in_app' ? 'notification_in_app' :
      key === 'email' ? 'notification_email' :
      'notification_sms';

    const { error } = await supabase
      .from('agents')
      .update({ [column]: value })
      .eq('id', profile.agentId);

    if (error) {
      setMessage({ type: 'error', text: error.message });
      if (key === 'in_app') setInAppEnabled(!value);
      if (key === 'email') setEmailEnabled(!value);
      if (key === 'sms') setSmsEnabled(!value);
    } else {
      setMessage({ type: 'success', text: 'Notification preference updated.' });
      await refreshUser();
    }
    setSaving(false);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-sm font-semibold text-white">Notification Preferences</h2>
      <div className="space-y-3">
        {preferences.map((p) => {
          const on = p.key === 'in_app' ? inAppEnabled : p.key === 'email' ? emailEnabled : smsEnabled;
          return (
            <label
              key={p.key}
              className="flex items-center justify-between rounded-lg border border-white/8 bg-navy-900/40 p-3 cursor-pointer"
            >
              <div>
                <p className="text-sm font-medium text-white">{p.label}</p>
                <p className="text-xs text-silver-500">{p.desc}</p>
              </div>
              <Toggle
                on={on}
                disabled={saving || !profile?.agentId}
                onToggle={() => handleToggle(p.key, !on)}
              />
            </label>
          );
        })}
      </div>
      {message && (
        <p className={`text-sm ${message.type === 'success' ? 'text-emerald-300' : 'text-red-300'}`}>
          {message.text}
        </p>
      )}
      {!profile?.agentId && (
        <p className="text-xs text-silver-500">
          Notification preferences require an agent profile. Contact your administrator.
        </p>
      )}
    </div>
  );
}

// ---------- Integrations Section ----------

function IntegrationsSection({ onOpenModal }: { onOpenModal: (m: { title: string; body: string }) => void }) {
  return (
    <div className="space-y-4">
      <h2 className="text-sm font-semibold text-white">Integrations</h2>
      <p className="text-sm text-silver-400">Connect FORVA PropTech to your lead sources and tools.</p>
      <div className="grid gap-3 sm:grid-cols-2">
        {integrations.map((int) => {
          const s = statusConfig[int.status];
          return (
            <div key={int.name} className="rounded-lg border border-white/8 bg-navy-900/40 p-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent-500/15 text-accent-300">
                    <int.icon size={18} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{int.name}</p>
                    <p className="text-xs text-silver-500">{int.desc}</p>
                  </div>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <span className={`badge ${s.classes}`}>{s.label}</span>
                <button
                  type="button"
                  className="btn-outline text-xs px-3 py-1.5"
                  onClick={() => onOpenModal({ title: int.modalTitle, body: int.modalBody })}
                >
                  {int.status === 'coming_soon' ? 'Coming Soon' : 'Set Up'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ---------- Billing Section ----------

type PlanKey = 'solo' | 'team' | 'agency';

function BillingSection() {
  const [subscription, setSubscription] = useState<{ plan: string; status: string; trial_ends_at: string | null } | null>(null);
  const [loading, setLoading] = useState(true);
  const [subscribingPlan, setSubscribingPlan] = useState<PlanKey | null>(null);
  const [billingError, setBillingError] = useState<string | null>(null);
  const { profile } = useAuth();

  useEffect(() => {
    async function fetchSubscription() {
      if (!profile?.clientId) {
        setLoading(false);
        return;
      }
      try {
        const { data } = await supabase
          .from('subscriptions')
          .select('plan, status, trial_ends_at')
          .eq('client_id', profile.clientId)
          .order('created_at', { ascending: false });
        const rows = data as { plan: string; status: string; trial_ends_at: string | null }[] | null;
        const active = rows?.find((r) => r.status === 'active') ?? null;
        setSubscription(active ?? rows?.[0] ?? null);
      } catch {
        setSubscription(null);
      } finally {
        setLoading(false);
      }
    }
    fetchSubscription();
  }, [profile?.clientId]);

  const handleSubscribe = async (planKey: PlanKey) => {
    setBillingError(null);

    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    const hasSession = !!session;
    const hasAccessToken = !!session?.access_token;
    console.log('[Billing] Session check:', { hasSession, hasAccessToken, sessionError: sessionError?.message });

    if (!session || !session.access_token) {
      setBillingError('Your session has expired. Please sign in again.');
      return;
    }

    setSubscribingPlan(planKey);
    try {
      const { data, error } = await supabase.functions.invoke(
        'paypal-create-subscription',
        {
          body: { plan_key: planKey },
          headers: {
            Authorization: `Bearer ${session.access_token}`,
          },
        },
      );

      if (error) {
        console.error('[Billing] Edge function error:', error.message);
        setBillingError('Unable to start PayPal subscription. Please try again.');
        return;
      }

      const result = data as { success?: boolean; approval_url?: string };
      if (result?.approval_url) {
        window.location.href = result.approval_url;
        return;
      }

      console.error('[Billing] Unexpected response shape:', data);
      setBillingError('Unable to start PayPal subscription. Please try again.');
    } catch (err) {
      console.error('[Billing] Exception during subscription:', err instanceof Error ? err.message : err);
      setBillingError('Unable to start PayPal subscription. Please try again.');
    } finally {
      setSubscribingPlan(null);
    }
  };

  const isActive = subscription?.status === 'active';
  const currentPlan = isActive ? subscription!.plan : 'trial';
  const currentStatus = isActive ? 'active' : 'trialing';

  return (
    <div className="space-y-5">
      <h2 className="text-sm font-semibold text-white">Billing & Subscription</h2>

      <div className="rounded-lg border border-white/8 bg-navy-900/40 p-4">
        {loading ? (
          <div className="flex items-center gap-2 py-2 text-silver-400">
            <Loader2 size={16} className="animate-spin text-accent-300" />
            <span className="text-sm">Loading subscription...</span>
          </div>
        ) : (
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs text-silver-500">Current Plan</p>
              <p className="text-lg font-bold text-white capitalize">{currentPlan}</p>
              {currentPlan === 'trial' && (
                <p className="text-sm text-silver-400">{trialDurationDays}-day free trial</p>
              )}
            </div>
            <div className="flex flex-col items-end gap-2">
              <span className={`badge capitalize ${currentStatus === 'trialing' ? subscriptionStatusConfig.trial.classes : 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30'}`}>
                {currentStatus}
              </span>
            </div>
          </div>
        )}
        <div className="mt-4 rounded-lg border border-accent-500/20 bg-accent-500/5 p-3">
          <p className="text-sm text-accent-300">
            {trialDurationDays}-day free trial. No payment method required yet.
          </p>
        </div>
      </div>

      {billingError && (
        <div className="flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/5 p-3">
          <AlertCircle size={16} className="flex-shrink-0 text-red-300" />
          <p className="text-sm text-red-300">{billingError}</p>
        </div>
      )}

      <div>
        <h3 className="text-sm font-semibold text-white">Available Plans</h3>
        <div className="mt-3 grid gap-3 sm:grid-cols-3">
          {plans.map((plan) => {
            const planKey = plan.id as PlanKey;
            const isThisPlanLoading = subscribingPlan === planKey;
            return (
              <div
                key={plan.id}
                className="rounded-lg border border-white/10 p-4"
              >
                <p className="text-sm font-semibold text-white">{plan.name}</p>
                <p className="text-lg font-bold text-white">${plan.monthlyPrice}<span className="text-xs text-silver-500">/mo</span></p>
                <p className="mt-1 text-xs text-silver-400">Up to {plan.entitlements.maxUsers} users</p>
                <button
                  type="button"
                  className="btn-outline mt-3 w-full text-xs"
                  disabled={subscribingPlan !== null}
                  onClick={() => handleSubscribe(planKey)}
                >
                  {isThisPlanLoading ? (
                    <span className="flex items-center justify-center gap-2">
                      <Loader2 size={14} className="animate-spin" />
                      Connecting to PayPal...
                    </span>
                  ) : (
                    `Switch to ${plan.name}`
                  )}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      <p className="text-xs text-silver-500">
        Subscriptions are securely processed through PayPal.
      </p>
    </div>
  );
}

// ---------- Usage Section ----------

function UsageSection() {
  const { profile } = useAuth();
  const [stats, setStats] = useState<{ label: string; value: string | number; icon: typeof Users }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUsage() {
      if (!profile?.clientId) {
        setLoading(false);
        return;
      }
      try {
        const [leadsRes, apptRes, followRes, closedRes] = await Promise.all([
          supabase.from('leads').select('id', { count: 'exact', head: true }).eq('client_id', profile.clientId),
          supabase.from('appointments').select('id', { count: 'exact', head: true }).eq('client_id', profile.clientId).neq('status', 'cancelled'),
          supabase.from('follow_up_jobs').select('id', { count: 'exact', head: true }).eq('client_id', profile.clientId).eq('status', 'sent'),
          supabase.from('closed_deals').select('id', { count: 'exact', head: true }).eq('client_id', profile.clientId),
        ]);

        setStats([
          { label: 'Total Leads', value: leadsRes.count ?? 0, icon: Users },
          { label: 'Appointments Booked', value: apptRes.count ?? 0, icon: Calendar },
          { label: 'Follow-ups Sent', value: followRes.count ?? 0, icon: MessageSquare },
          { label: 'Closed Deals', value: closedRes.count ?? 0, icon: Check },
        ]);
      } catch {
        setStats([]);
      } finally {
        setLoading(false);
      }
    }
    fetchUsage();
  }, [profile?.clientId]);

  const items = [
    ...stats,
    { label: 'AI Qualifications', value: 'Not available yet' as const, icon: Sparkles },
    { label: 'Email Activity', value: 'Not available yet' as const, icon: Mail },
    { label: 'SMS Activity', value: 'Not available yet' as const, icon: MessageSquare },
  ];

  return (
    <div className="space-y-5">
      <h2 className="text-sm font-semibold text-white">Usage</h2>
      <p className="text-sm text-silver-400">Track your account activity and usage.</p>
      {loading ? (
        <div className="flex items-center justify-center gap-3 py-8 text-silver-400">
          <Loader2 size={20} className="animate-spin text-accent-300" />
          <span className="text-sm">Loading usage data...</span>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <div key={item.label} className="rounded-lg border border-white/8 bg-navy-900/40 p-4">
              <div className="flex items-center gap-2">
                <item.icon size={16} className="text-accent-300" />
                <p className="text-xs text-silver-500">{item.label}</p>
              </div>
              <p className="mt-2 text-2xl font-bold text-white">
                {typeof item.value === 'number' ? item.value.toLocaleString() : item.value}
              </p>
            </div>
          ))}
        </div>
      )}
      <div className="rounded-lg border border-dashed border-white/10 p-4 text-center text-sm text-silver-500">
        Detailed provider usage (AI, email, SMS) will be shown once those integrations are activated.
      </div>
    </div>
  );
}

// ---------- AI Voice Section ----------

function AIVoiceSection() {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-white">AI Voice Add-On</h2>
        <span className="badge bg-silver-500/15 text-silver-400 border border-silver-500/30">
          Not Activated
        </span>
      </div>

      <div className="rounded-lg border border-white/8 bg-navy-900/40 p-4">
        <div className="flex items-start gap-3">
          <PhoneCall size={20} className="mt-0.5 flex-shrink-0 text-accent-300" />
          <div>
            <p className="text-sm text-white">AI Voice is an optional paid add-on for any plan.</p>
            <p className="mt-1 text-xs text-silver-400">
              It enables AI-powered calls to leads for qualification, follow-up, and appointment scheduling.
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-accent-500/20 bg-accent-500/5 p-4 text-center">
        <p className="text-sm text-accent-300">Contact Support to Activate</p>
        <p className="mt-1 text-xs text-silver-400">Self-service activation is coming soon.</p>
        <Link
          to="/contact"
          className="btn-outline mt-4 inline-flex text-xs"
        >
          Contact Support
        </Link>
      </div>
    </div>
  );
}

// ---------- Security Section ----------

function SecuritySection() {
  const { user, logout } = useAuth();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [sessionActive, setSessionActive] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSessionActive(!!session);
    });
  }, []);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);

    if (!currentPassword) {
      setMessage({ type: 'error', text: 'Please enter your current password.' });
      return;
    }
    if (newPassword.length < 8) {
      setMessage({ type: 'error', text: 'New password must be at least 8 characters.' });
      return;
    }
    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'New password and confirm password do not match.' });
      return;
    }
    if (newPassword === currentPassword) {
      setMessage({ type: 'error', text: 'New password must be different from your current password.' });
      return;
    }

    setSaving(true);

    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;

      setMessage({ type: 'success', text: 'Password updated successfully.' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      setMessage({
        type: 'error',
        text: err instanceof Error ? err.message : 'Failed to update password.',
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-5">
      <h2 className="text-sm font-semibold text-white">Security</h2>

      <div className="rounded-lg border border-white/8 bg-navy-900/40 p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-white">Current Session</p>
            <p className="text-xs text-silver-500">{user?.email}</p>
          </div>
          <span className={`badge ${sessionActive ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30' : 'bg-silver-500/15 text-silver-400 border border-silver-500/30'}`}>
            {sessionActive ? 'Active' : 'No active session'}
          </span>
        </div>
        <button
          type="button"
          onClick={() => logout()}
          className="btn-ghost mt-3 text-xs text-red-300 hover:text-red-200"
        >
          Sign out of all sessions
        </button>
      </div>

      <form onSubmit={handlePasswordChange} className="space-y-4">
        <h3 className="text-sm font-semibold text-white">Change Password</h3>
        <div>
          <label className="label" htmlFor="current">Current password</label>
          <div className="relative">
            <input
              id="current"
              type={showCurrent ? 'text' : 'password'}
              className="input pr-10"
              placeholder="Enter your current password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              autoComplete="current-password"
            />
            <button
              type="button"
              onClick={() => setShowCurrent((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-silver-500 hover:text-silver-300"
              aria-label={showCurrent ? 'Hide password' : 'Show password'}
            >
              {showCurrent ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="label" htmlFor="new">New password</label>
            <div className="relative">
              <input
                id="new"
                type={showNew ? 'text' : 'password'}
                className="input pr-10"
                placeholder="At least 8 characters"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                autoComplete="new-password"
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
            <label className="label" htmlFor="confirm">Confirm new password</label>
            <div className="relative">
              <input
                id="confirm"
                type={showConfirm ? 'text' : 'password'}
                className="input pr-10"
                placeholder="Re-enter new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                autoComplete="new-password"
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
        </div>
        <FormActions saving={saving} message={message} label="Update password" />
      </form>

      <div className="border-t border-white/8 pt-4">
        <h3 className="text-sm font-semibold text-red-300">Danger Zone</h3>
        <p className="mt-1 text-xs text-silver-500">
          Account deletion requests are handled via our{' '}
          <Link to="/data-deletion" className="text-accent-300 hover:underline">
            Data Deletion page
          </Link>
          .
        </p>
      </div>
    </div>
  );
}

// ---------- Shared components ----------

function FormActions({
  saving,
  message,
  label = 'Save Changes',
}: {
  saving: boolean;
  message: { type: 'success' | 'error'; text: string } | null;
  label?: string;
}) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
      <button type="submit" className="btn-primary" disabled={saving}>
        {saving ? (
          <>
            <Loader2 size={16} className="animate-spin" />
            Saving...
          </>
        ) : (
          label
        )}
      </button>
      {message && (
        <div className={`flex items-center gap-1.5 text-sm ${message.type === 'success' ? 'text-emerald-300' : 'text-red-300'}`}>
          {message.type === 'success' ? <Check size={14} /> : <AlertCircle size={14} />}
          {message.text}
        </div>
      )}
    </div>
  );
}

function Toggle({ on, disabled, onToggle }: { on: boolean; disabled?: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      disabled={disabled}
      onClick={onToggle}
      className={`relative h-6 w-11 flex-shrink-0 rounded-full transition-colors ${on ? 'bg-accent-500' : 'bg-white/10'} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      <span
        className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${on ? 'translate-x-[22px]' : 'translate-x-0.5'}`}
      />
    </button>
  );
}
