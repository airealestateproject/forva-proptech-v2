import { Link } from 'react-router-dom';
import {
  Users, Flame, CalendarCheck, TrendingUp, ArrowRight, MessageSquare,
  Sparkles, CheckCircle2, Clock3, Target, Zap, Globe2
} from 'lucide-react';
import { Seo } from '@/components/shared/Seo';
import { leads, dashboardStats, leadSourceBreakdown, recentActivity, agentMap } from '@/data/demo';
import { formatRelative, stageConfig } from '@/lib/format';
import { useAuth } from '@/context/AuthContext';

const stages = [
  { id: 'new', label: 'New', tone: 'blue' },
  { id: 'contacted', label: 'Contacted', tone: 'amber' },
  { id: 'qualified', label: 'Qualified', tone: 'green' },
  { id: 'appointment_booked', label: 'Appointment', tone: 'purple' },
  { id: 'won', label: 'Won', tone: 'emerald' },
] as const;

export function DashboardPage() {
  const { user, isAgency } = useAuth();
  const first = user?.name?.split(' ')[0] || 'there';
  const hot = leads.filter(l => l.temperature === 'hot').slice(0, 4);
  const maxSource = Math.max(...leadSourceBreakdown.map(s => s.count), 1);

  return (
    <>
      <Seo title="Overview" noindex />
      <div className="fv-dashboard-page">
        <section className="fv-page-titlebar">
          <div><div className="fv-page-eyebrow"><span className="fv-live-dot"/> Lead engine active</div><h1>Good afternoon, {first}</h1><p>{isAgency ? 'Here is what is moving across your team today.' : 'Here is what is moving across your pipeline today.'}</p></div>
          <div className="fv-title-actions"><Link to="/app/leads" className="fv-secondary-action">View all leads</Link><Link to="/app/leads?add=1" className="fv-primary-action">Add new lead</Link></div>
        </section>

        <section className="fv-metric-grid">
          <Metric icon={Users} label="Total Leads" value={dashboardStats.totalLeads} note="Across all sources" trend="+18%" />
          <Metric icon={Flame} label="High Intent" value={dashboardStats.hotLeads} note="Ready for attention" trend="Priority" tone="green" />
          <Metric icon={CalendarCheck} label="Appointments" value={dashboardStats.appointmentsBooked} note="Upcoming + today" trend="+12%" tone="purple" />
          <Metric icon={TrendingUp} label="Conversion Rate" value={`${dashboardStats.conversionRate}%`} note="Lead to won" trend="+2.4%" tone="amber" />
        </section>

        <section className="fv-dashboard-grid">
          <div className="fv-panel fv-pipeline-panel">
            <div className="fv-panel-head"><div><h2>Lead pipeline</h2><p>See where every opportunity is right now.</p></div><Link to="/app/leads">Open leads <ArrowRight size={14}/></Link></div>
            <div className="fv-pipeline-columns">
              {stages.map(stage => {
                const items = leads.filter(l => l.stage === stage.id).slice(0,3);
                return <div className={`fv-pipe-col ${stage.tone}`} key={stage.id}>
                  <div className="fv-pipe-head"><strong>{stage.label}</strong><span>{leads.filter(l=>l.stage===stage.id).length}</span></div>
                  <div className="fv-pipe-stack">
                    {items.length ? items.map(l => <Link to={`/app/leads/${l.id}`} className="fv-lead-mini" key={l.id}>
                      <div className="fv-mini-top"><span className="fv-mini-avatar">{l.firstName[0]}{l.lastName[0]}</span><strong>{l.firstName} {l.lastName}</strong></div>
                      <p>{l.propertyType} · {l.preferredLocation.split(',')[0]}</p><small>{l.budget}</small>
                    </Link>) : <div className="fv-empty-mini">No leads</div>}
                  </div>
                </div>
              })}
            </div>
          </div>

          <aside className="fv-panel fv-ai-panel">
            <div className="fv-ai-panel-icon"><Sparkles size={19}/></div><span className="fv-ai-label">FORVA INTELLIGENCE</span>
            <h2>{hot.length} leads deserve attention now.</h2><p>High-intent buyers are showing strong budget, timeline, and engagement signals.</p>
            <div className="fv-ai-list">{hot.slice(0,3).map(l => <Link to={`/app/leads/${l.id}`} key={l.id}><div><strong>{l.firstName} {l.lastName}</strong><small>{l.qualificationScore}/100 qualification</small></div><span>{l.temperature}</span></Link>)}</div>
            <Link className="fv-ai-cta" to="/app/leads?temp=hot">Review priority leads <ArrowRight size={15}/></Link>
          </aside>
        </section>

        <section className="fv-lower-grid">
          <div className="fv-panel">
            <div className="fv-panel-head"><div><h2>Recent lead activity</h2><p>What changed across your pipeline.</p></div></div>
            <div className="fv-activity-list">{recentActivity.slice(0,5).map((a,i) => <div className="fv-activity-row" key={a.id}><span className={`fv-activity-icon i${i%4}`}>{i%3===0?<Zap size={15}/>:i%3===1?<MessageSquare size={15}/>:<CheckCircle2 size={15}/>}</span><div><strong>{a.text}</strong><small>{formatRelative(a.timestamp)}</small></div></div>)}</div>
          </div>
          <div className="fv-panel">
            <div className="fv-panel-head"><div><h2>Lead sources</h2><p>Where new opportunities are coming from.</p></div></div>
            <div className="fv-source-list">{leadSourceBreakdown.map((s,i)=><div key={s.source}><div className="fv-source-line"><span><Globe2 size={14}/>{s.label}</span><strong>{s.count}</strong></div><div className="fv-source-track"><span style={{width:`${(s.count/maxSource)*100}%`}} className={`s${i}`}/></div></div>)}</div>
          </div>
          <div className="fv-panel">
            <div className="fv-panel-head"><div><h2>Follow-up queue</h2><p>Keep the next action moving.</p></div><Link to="/app/leads">View queue</Link></div>
            <div className="fv-follow-list">{leads.filter(l=>l.nextFollowUp && !['won','lost'].includes(l.stage)).slice(0,4).map(l=><Link to={`/app/leads/${l.id}`} key={l.id}><span className="fv-follow-icon"><Clock3 size={15}/></span><div><strong>{l.firstName} {l.lastName}</strong><small>{stageConfig[l.stage].label} · {agentMap[l.assignedAgentId]?.name}</small></div><Target size={14}/></Link>)}</div>
          </div>
        </section>
      </div>
    </>
  );
}

function Metric({icon:Icon,label,value,note,trend,tone='blue'}:{icon:any;label:string;value:string|number;note:string;trend:string;tone?:string}){
  return <div className={`fv-metric ${tone}`}><div className="fv-metric-icon"><Icon size={19}/></div><div className="fv-metric-copy"><span>{label}</span><strong>{value}</strong><small>{note}</small></div><div className="fv-metric-trend">{trend}</div></div>
}
