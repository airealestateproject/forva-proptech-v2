import { useState, useMemo, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Search,
  Filter,
  X,
  ArrowRight,
  SlidersHorizontal,
  Ban,
} from 'lucide-react';
import { Seo } from '@/components/shared/Seo';
import { PageHeader } from '@/components/shared/SectionHeading';
import {
  TemperatureBadge,
  StageBadge,
  SourceBadge,
  ScorePill,
} from '@/components/shared/Badges';
import { AddLeadModal } from '@/components/app/AddLeadModal';
import { LoadingState, ErrorState, EmptyState } from '@/components/shared/AsyncStates';
import { fetchLeads } from '@/lib/queries';
import {
  formatRelative,
  temperatureConfig,
  stageConfig,
  sourceConfig,
  stageOrder,
} from '@/lib/format';
import type {
  Agent,
  Lead,
  LeadTemperature,
  PipelineStage,
  LeadSource,
} from '@/types';

export function LeadsPage() {
  const [params, setParams] = useSearchParams();
  const [showAdd, setShowAdd] = useState(params.get('add') === '1');
  const [query, setQuery] = useState('');
  const [temp, setTemp] = useState<LeadTemperature | 'all'>(
    (params.get('temp') as LeadTemperature) || 'all'
  );
  const [stage, setStage] = useState<PipelineStage | 'all'>(
    (params.get('stage') as PipelineStage) || 'all'
  );
  const [source, setSource] = useState<LeadSource | 'all'>('all');
  const [agent, setAgent] = useState<string | 'all'>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [sort, setSort] = useState<'recent' | 'score' | 'name'>('recent');

  const [leads, setLeads] = useState<Lead[]>([]);
  const [agentMap, setAgentMap] = useState<Record<string, Agent>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchLeads().then((result) => {
      if (cancelled) return;
      setLeads(result.leads);
      setAgentMap(result.agentMap);
      setError(result.error);
      setLoading(false);
    });
    return () => { cancelled = true; };
  }, []);

  const filtered = useMemo(() => {
    let list = leads.filter((l) => {
      if (temp !== 'all' && l.temperature !== temp) return false;
      if (stage !== 'all' && l.stage !== stage) return false;
      if (source !== 'all' && l.source !== source) return false;
      if (agent !== 'all' && l.assignedAgentId !== agent) return false;
      if (query) {
        const q = query.toLowerCase();
        const hay = `${l.firstName} ${l.lastName} ${l.email} ${l.preferredLocation}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
    list = [...list].sort((a, b) => {
      if (sort === 'score') return b.qualificationScore - a.qualificationScore;
      if (sort === 'name') return a.firstName.localeCompare(b.firstName);
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
    return list;
  }, [leads, query, temp, stage, source, agent, sort]);

  const updateParam = (key: string, value: string) => {
    const next = new URLSearchParams(params);
    if (value && value !== 'all') next.set(key, value);
    else next.delete(key);
    setParams(next, { replace: true });
  };

  const activeFilters =
    (temp !== 'all' ? 1 : 0) + (stage !== 'all' ? 1 : 0) + (source !== 'all' ? 1 : 0) + (agent !== 'all' ? 1 : 0);

  return (
    <>
      <Seo title="Leads" noindex />
      <div className="space-y-5">
        <PageHeader
          title="Leads"
          subtitle={`${filtered.length} lead${filtered.length === 1 ? '' : 's'}`}
        />

        {loading ? (
          <LoadingState label="Loading leads..." />
        ) : error ? (
          <ErrorState message={error} />
        ) : (
          <>
            {/* Search + filter toggle */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              <div className="relative flex-1">
                <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-silver-500" />
                <input
                  type="search"
                  placeholder="Search by name, email, or location..."
                  className="input pl-9"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  aria-label="Search leads"
                />
              </div>
              <div className="flex items-center gap-2">
                <select
                  className="input"
                  value={sort}
                  onChange={(e) => setSort(e.target.value as typeof sort)}
                  aria-label="Sort leads"
                >
                  <option value="recent">Most recent</option>
                  <option value="score">Qualification score</option>
                  <option value="name">Name (A to Z)</option>
                </select>
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
            </div>

            {/* Filter row */}
            {showFilters && (
              <div className="card grid gap-3 p-4 animate-fade-in sm:grid-cols-2 lg:grid-cols-4">
                <FilterSelect
                  label="Temperature"
                  value={temp}
                  onChange={(v) => {
                    setTemp(v as LeadTemperature | 'all');
                    updateParam('temp', v);
                  }}
                  options={[
                    { value: 'all', label: 'All' },
                    ...Object.entries(temperatureConfig).map(([k, v]) => ({ value: k, label: v.label })),
                  ]}
                />
                <FilterSelect
                  label="Stage"
                  value={stage}
                  onChange={(v) => {
                    setStage(v as PipelineStage | 'all');
                    updateParam('stage', v);
                  }}
                  options={[
                    { value: 'all', label: 'All' },
                    ...stageOrder.map((s) => ({ value: s, label: stageConfig[s].label })),
                  ]}
                />
                <FilterSelect
                  label="Source"
                  value={source}
                  onChange={(v) => setSource(v as LeadSource | 'all')}
                  options={[
                    { value: 'all', label: 'All' },
                    ...Object.entries(sourceConfig).map(([k, v]) => ({ value: k, label: v.label })),
                  ]}
                />
                <FilterSelect
                  label="Assigned Agent"
                  value={agent}
                  onChange={(v) => setAgent(v)}
                  options={[
                    { value: 'all', label: 'All' },
                    ...Object.values(agentMap).map((a) => ({ value: a.id, label: a.name })),
                  ]}
                />
                {activeFilters > 0 && (
                  <button
                    type="button"
                    onClick={() => {
                      setTemp('all');
                      setStage('all');
                      setSource('all');
                      setAgent('all');
                      setParams({}, { replace: true });
                    }}
                    className="btn-ghost text-xs self-end"
                  >
                    <X size={14} />
                    Clear filters
                  </button>
                )}
              </div>
            )}

            {/* Leads */}
            {filtered.length === 0 ? (
              <EmptyState icon={Filter} message="No leads match your filters." />
            ) : (
              <>
                {/* Desktop table */}
                <div className="card hidden overflow-hidden lg:block">
                  <table className="w-full text-sm">
                    <thead className="border-b border-white/8 text-left text-xs text-silver-500">
                      <tr>
                        <th className="px-4 py-3 font-medium">Lead</th>
                        <th className="px-4 py-3 font-medium">Temp</th>
                        <th className="px-4 py-3 font-medium">Score</th>
                        <th className="px-4 py-3 font-medium">Stage</th>
                        <th className="px-4 py-3 font-medium">Source</th>
                        <th className="px-4 py-3 font-medium">Agent</th>
                        <th className="px-4 py-3 font-medium">Last Contact</th>
                        <th className="px-4 py-3 font-medium">Next</th>
                        <th className="px-4 py-3" />
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/8">
                      {filtered.map((l) => (
                        <tr key={l.id} className="hover:bg-white/5 transition-colors">
                          <td className="px-4 py-3">
                            <Link to={`/app/leads/${l.id}`} className="font-medium text-white hover:text-accent-300">
                              {l.firstName} {l.lastName}
                            </Link>
                            <p className="text-xs text-silver-500">{l.preferredLocation}</p>
                          </td>
                          <td className="px-4 py-3"><TemperatureBadge temp={l.temperature} /></td>
                          <td className="px-4 py-3"><ScorePill score={l.qualificationScore} /></td>
                          <td className="px-4 py-3"><StageBadge stage={l.stage} /></td>
                          <td className="px-4 py-3"><SourceBadge source={l.source} /></td>
                          <td className="px-4 py-3 text-silver-300">{agentMap[l.assignedAgentId]?.name}</td>
                          <td className="px-4 py-3 text-silver-400">{formatRelative(l.lastContact)}</td>
                          <td className="px-4 py-3 text-silver-400">{formatRelative(l.nextFollowUp)}</td>
                          <td className="px-4 py-3">
                            <Link to={`/app/leads/${l.id}`} className="text-silver-500 hover:text-accent-300">
                              <ArrowRight size={16} />
                            </Link>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Mobile cards */}
                <div className="space-y-3 lg:hidden">
                  {filtered.map((l) => (
                    <Link
                      key={l.id}
                      to={`/app/leads/${l.id}`}
                      className="card card-hover block p-4"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="font-medium text-white">
                            {l.firstName} {l.lastName}
                          </p>
                          <p className="text-xs text-silver-500">{l.preferredLocation}</p>
                        </div>
                        <TemperatureBadge temp={l.temperature} />
                      </div>
                      <div className="mt-3 flex flex-wrap items-center gap-2">
                        <StageBadge stage={l.stage} />
                        <SourceBadge source={l.source} />
                        <ScorePill score={l.qualificationScore} />
                      </div>
                      <div className="mt-3 flex items-center justify-between text-xs text-silver-500">
                        <span>{agentMap[l.assignedAgentId]?.name}</span>
                        <span>Last: {formatRelative(l.lastContact)}</span>
                      </div>
                    </Link>
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </div>

      {showAdd && <AddLeadModal onClose={() => {
        setShowAdd(false);
        if (params.get('add')) {
          const next = new URLSearchParams(params);
          next.delete('add');
          setParams(next, { replace: true });
        }
      }} />}
    </>
  );
}

function FilterSelect({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div>
      <label className="label">{label}</label>
      <select className="input" value={value} onChange={(e) => onChange(e.target.value)}>
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </div>
  );
}
