import { useState } from 'react';
import { X } from 'lucide-react';
import { agents } from '@/data/demo';
import { sourceConfig } from '@/lib/format';

export function AddLeadModal({ onClose }: { onClose: () => void }) {
  const [done, setDone] = useState(false);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center sm:items-center">
      <div className="absolute inset-0 bg-navy-950/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative z-10 max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-t-2xl border border-white/10 bg-navy-850 p-5 shadow-card-hover sm:rounded-2xl sm:p-6 scrollbar-thin animate-fade-in">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">Add New Lead</h2>
          <button
            type="button"
            onClick={onClose}
            className="text-silver-400 hover:text-white"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {done ? (
          <div className="py-10 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-300 text-xl font-bold">
              ✓
            </div>
            <p className="mt-3 text-sm text-silver-300">Lead added successfully.</p>
            <button onClick={onClose} className="btn-secondary mt-4">Done</button>
          </div>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setDone(true);
            }}
            className="mt-5 space-y-4"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="label" htmlFor="firstName">First name</label>
                <input id="firstName" className="input" required placeholder="Emily" />
              </div>
              <div>
                <label className="label" htmlFor="lastName">Last name</label>
                <input id="lastName" className="input" required placeholder="Carter" />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="label" htmlFor="email">Email</label>
                <input id="email" type="email" className="input" placeholder="emily@example.com" />
              </div>
              <div>
                <label className="label" htmlFor="phone">Phone</label>
                <input id="phone" className="input" placeholder="(415) 555-0100" />
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="label" htmlFor="source">Lead source</label>
                <select id="source" className="input" defaultValue="website">
                  {Object.entries(sourceConfig).map(([k, v]) => (
                    <option key={k} value={k}>{v.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label" htmlFor="agent">Assigned agent</label>
                <select id="agent" className="input" defaultValue={agents[0].id}>
                  {agents.map((a) => (
                    <option key={a.id} value={a.id}>{a.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="label" htmlFor="location">Property / location interest</label>
                <input id="location" className="input" placeholder="San Francisco, Mission District" />
              </div>
              <div>
                <label className="label" htmlFor="budget">Budget</label>
                <input id="budget" className="input" placeholder="$1.2M to $1.5M" />
              </div>
            </div>
            <div>
              <label className="label" htmlFor="notes">Notes</label>
              <textarea id="notes" className="input min-h-[80px] resize-y" placeholder="Any context about this lead..." />
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
              <button type="submit" className="btn-primary">Add Lead</button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
