import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Bell,
  Flame,
  CheckCircle2,
  Reply,
  Clock,
  CalendarCheck,
  CalendarClock,
  UserPlus,
  Check,
} from 'lucide-react';
import { Seo } from '@/components/shared/Seo';
import { PageHeader } from '@/components/shared/SectionHeading';
import { notifications as initialNotifications } from '@/data/demo';
import { formatRelative } from '@/lib/format';
import type { NotificationItem } from '@/types';

const typeIcon: Record<NotificationItem['type'], typeof Bell> = {
  new_hot_lead: Flame,
  lead_qualified: CheckCircle2,
  lead_replied: Reply,
  follow_up_required: Clock,
  appointment_booked: CalendarCheck,
  appointment_approaching: CalendarClock,
  lead_assigned: UserPlus,
};

export function NotificationsPage() {
  const [items, setItems] = useState<NotificationItem[]>(initialNotifications);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const visible = filter === 'all' ? items : items.filter((n) => !n.read);
  const unreadCount = items.filter((n) => !n.read).length;

  const markAllRead = () => {
    setItems((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const markRead = (id: string) => {
    setItems((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  return (
    <>
      <Seo title="Notifications" noindex />
      <div className="space-y-5">
        <PageHeader
          title="Notifications"
          subtitle={`${unreadCount} unread`}
          actions={
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 rounded-lg border border-white/10 bg-navy-850 p-1">
                <button
                  type="button"
                  onClick={() => setFilter('all')}
                  className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                    filter === 'all' ? 'bg-accent-500/15 text-accent-300' : 'text-silver-400 hover:text-white'
                  }`}
                >
                  All
                </button>
                <button
                  type="button"
                  onClick={() => setFilter('unread')}
                  className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                    filter === 'unread' ? 'bg-accent-500/15 text-accent-300' : 'text-silver-400 hover:text-white'
                  }`}
                >
                  Unread
                </button>
              </div>
              {unreadCount > 0 && (
                <button type="button" onClick={markAllRead} className="btn-secondary text-xs">
                  <Check size={14} />
                  Mark all read
                </button>
              )}
            </div>
          }
        />

        {visible.length === 0 ? (
          <div className="card py-16 text-center">
            <Bell size={32} className="mx-auto text-silver-600" />
            <p className="mt-3 text-sm text-silver-400">No notifications here.</p>
          </div>
        ) : (
          <div className="card divide-y divide-white/8">
            {visible.map((n) => {
              const Icon = typeIcon[n.type];
              return (
                <div
                  key={n.id}
                  className={`flex gap-3 p-4 transition-colors ${n.read ? '' : 'bg-accent-500/5'}`}
                >
                  <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-accent-500/15 text-accent-300">
                    <Icon size={18} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm font-medium text-white">{n.title}</p>
                      {!n.read && <span className="h-2 w-2 flex-shrink-0 rounded-full bg-accent-400 mt-1.5" />}
                    </div>
                    <p className="mt-0.5 text-sm text-silver-400">{n.description}</p>
                    <div className="mt-2 flex items-center gap-3">
                      <span className="text-xs text-silver-500">{formatRelative(n.timestamp)}</span>
                      {n.leadId && (
                        <Link
                          to={`/app/leads/${n.leadId}`}
                          onClick={() => markRead(n.id)}
                          className="text-xs text-accent-300 hover:underline"
                        >
                          View lead
                        </Link>
                      )}
                      {!n.read && (
                        <button
                          type="button"
                          onClick={() => markRead(n.id)}
                          className="text-xs text-silver-500 hover:text-white"
                        >
                          Mark read
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}
