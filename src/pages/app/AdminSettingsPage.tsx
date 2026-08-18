import { Shield, Globe, Bell } from 'lucide-react';
import { Seo } from '@/components/shared/Seo';
import { PageHeader } from '@/components/shared/SectionHeading';

export function AdminSettingsPage() {
  return (
    <>
      <Seo title="Admin - Settings" noindex />
      <div className="space-y-5">
        <PageHeader title="Platform Settings" subtitle="FORVA PropTech Super Admin configuration" />

        <div className="card p-5">
          <div className="flex items-center gap-2">
            <Shield size={18} className="text-accent-300" />
            <h2 className="text-sm font-semibold text-white">Platform Configuration</h2>
          </div>
          <p className="mt-2 text-sm text-silver-400">
            These settings control platform-wide behavior for all FORVA PropTech accounts.
          </p>

          <div className="mt-5 space-y-4">
            <div className="rounded-lg border border-white/8 bg-navy-900/40 p-4">
              <div className="flex items-center gap-2">
                <Globe size={16} className="text-accent-300" />
                <h3 className="text-sm font-medium text-white">Default Region</h3>
              </div>
              <p className="mt-1 text-xs text-silver-500">
                Platform-wide default region for new accounts. Individual clients can override this.
              </p>
              <p className="mt-2 text-sm text-silver-300">United States (US)</p>
            </div>

            <div className="rounded-lg border border-white/8 bg-navy-900/40 p-4">
              <div className="flex items-center gap-2">
                <Bell size={16} className="text-accent-300" />
                <h3 className="text-sm font-medium text-white">Platform Notifications</h3>
              </div>
              <p className="mt-1 text-xs text-silver-500">
                Super Admin notifications for platform events, new signups, and integration failures.
              </p>
            </div>
          </div>
        </div>

        <div className="card p-5">
          <h2 className="text-sm font-semibold text-white">Payment Provider</h2>
          <p className="mt-2 text-sm text-silver-400">
            No payment provider is connected. Subscription revenue metrics will show $0 until a provider is configured.
            Once connected, payment-provider data becomes the authoritative source for subscription revenue.
          </p>
          <div className="mt-4 rounded-lg border border-amber-500/20 bg-amber-500/5 p-3">
            <p className="text-xs text-amber-300">
              Connect a payment provider to enable subscription billing, MRR tracking, and plan management.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
