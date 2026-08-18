import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { MessageSquare, Search, SlidersHorizontal, X } from 'lucide-react';
import { Seo } from '@/components/shared/Seo';
import { PageHeader } from '@/components/shared/SectionHeading';
import { LoadingState, ErrorState, EmptyState } from '@/components/shared/AsyncStates';
import { fetchAllConversations } from '@/lib/queries';
import { formatRelative } from '@/lib/format';
import type { MessageType } from '@/types';

interface ThreadRow {
  leadId: string;
  leadName: string;
  channel: MessageType;
  latestMessage: string;
  lastContact: string | null;
}

const channelConfig: Record<MessageType, { label: string; classes: string }> = {
  sms: { label: 'SMS', classes: 'bg-accent-500/15 text-accent-300 border border-accent-500/30' },
  email: { label: 'Email', classes: 'bg-indigo-500/15 text-indigo-300 border border-indigo-500/30' },
  facebook: { label: 'Facebook', classes: 'bg-blue-500/15 text-blue-300 border border-blue-500/30' },
  instagram: { label: 'Instagram', classes: 'bg-fuchsia-500/15 text-fuchsia-300 border border-fuchsia-500/30' },
  website: { label: 'Website', classes: 'bg-teal-500/15 text-teal-300 border border-teal-500/30' },
  note: { label: 'Note', classes: 'bg-silver-500/15 text-silver-300 border border-silver-500/30' },
};

export function MessagesPage() {
  const [query, setQuery] = useState('');
  const [channel, setChannel] = useState<MessageType | 'all'>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [threads, setThreads] = useState<ThreadRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchAllConversations().then((result) => {
      if (cancelled) return;
      const rows: ThreadRow[] = result.conversations.map((c) => {
        const latest = c.entries[0];
        return {
          leadId: c.leadId,
          leadName: c.leadName,
          channel: latest?.channel || 'note',
          latestMessage: latest?.body || 'No message content',
          lastContact: latest?.timestamp || null,
        };
      });
      setThreads(rows);
      setError(result.error);
      setLoading(false);
    });
    return () => { cancelled = true; };
  }, []);

  const filtered = useMemo(() => {
    return threads.filter((t) => {
      if (channel !== 'all' && t.channel !== channel) return false;
      if (query && !t.leadName.toLowerCase().includes(query.toLowerCase())) return false;
      return true;
    });
  }, [threads, channel, query]);

  const activeFilters = channel !== 'all' ? 1 : 0;

  return (
    <>
      <Seo title="Messages" noindex />
      <div className="space-y-5">
        <PageHeader title="Messages" subtitle="Communication control center" />

        {loading ? (
          <LoadingState label="Loading conversations..." />
        ) : error ? (
          <ErrorState message={error} />
        ) : (
          <>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative flex-1">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-silver-500" />
                <input
                  type="search"
                  placeholder="Search by lead name..."
                  className="input pl-9"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  aria-label="Search messages"
                />
              </div>
              <button
                type="button"
                onClick={() => setShowFilters((v) => !v)}
                className={`btn-secondary ${showFilters ? 'ring-2 ring-accent-400' : ''}`}
                aria-label="Toggle filters"
              >
                <SlidersHorizontal size={16} />
                <span className="hidden sm:inline">Filters</span>
                {activeFilters > 0 && (
                  <span className="rounded-full bg-accent-500 px-1.5 text-[10px] font-bold text-white">
                    {activeFilters}
                  </span>
                )}
              </button>
            </div>

            {showFilters && (
              <div className="card grid gap-3 p-4 animate-fade-in sm:grid-cols-2">
                <div>
                  <label className="label">Channel</label>
                  <select className="input" value={channel} onChange={(e) => setChannel(e.target.value as MessageType | 'all')}>
                    <option value="all">All channels</option>
                    {Object.entries(channelConfig).map(([k, v]) => (
                      <option key={k} value={k}>{v.label}</option>
                    ))}
                  </select>
                </div>
                {activeFilters > 0 && (
                  <button
                    type="button"
                    onClick={() => { setChannel('all'); }}
                    className="btn-ghost text-xs self-end"
                  >
                    <X size={14} />
                    Clear filters
                  </button>
                )}
              </div>
            )}

            {filtered.length === 0 ? (
              <EmptyState icon={MessageSquare} message="No conversations match your filters." />
            ) : (
              <div className="card divide-y divide-white/8">
                {filtered.map((t) => {
                  const c = channelConfig[t.channel];
                  return (
                    <Link
                      key={t.leadId}
                      to={`/app/leads/${t.leadId}`}
                      className="flex flex-col gap-2 p-4 hover:bg-white/5 transition-colors sm:flex-row sm:items-center sm:gap-4"
                    >
                      <div className="flex min-w-0 flex-1 items-center gap-3">
                        <span className={`badge flex-shrink-0 ${c.classes}`}>{c.label}</span>
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-white">{t.leadName}</p>
                          <p className="truncate text-xs text-silver-500">{t.latestMessage}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-silver-500 sm:flex-shrink-0">
                        <span className="hidden sm:inline">Last: {formatRelative(t.lastContact)}</span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}
