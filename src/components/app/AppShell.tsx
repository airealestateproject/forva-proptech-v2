import { useState, type ReactNode } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Users, CalendarDays, MessageSquare, BarChart3, UserCircle2,
  Bell, Settings as SettingsIcon, LogOut, Menu, X, Search, Plus, Shield,
  Sparkles, Zap, ChevronDown
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const navItems = [
  { to: '/app/dashboard', label: 'Overview', icon: LayoutDashboard },
  { to: '/app/leads', label: 'Leads', icon: Users },
  { to: '/app/messages', label: 'Conversations', icon: MessageSquare },
  { to: '/app/appointments', label: 'Appointments', icon: CalendarDays },
  { to: '/app/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/app/team', label: 'Team', icon: UserCircle2, agencyOnly: true },
  { to: '/app/settings', label: 'Integrations & Settings', icon: SettingsIcon },
  { to: '/admin', label: 'Admin Dashboard', icon: Shield, superAdminOnly: true },
];

export function AppShell({ children }: { children: ReactNode }) {
  const { user, profile, isAgency, isSuperAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const visibleNav = navItems.filter((n) => (!n.agencyOnly || isAgency) && (!('superAdminOnly' in n) || (n.superAdminOnly && isSuperAdmin)));
  const agencyLabel = profile?.clientName || (isAgency ? user?.agencyName : null);

  const handleLogout = async () => { await logout(); navigate('/'); };

  const Sidebar = ({ mobile = false }: { mobile?: boolean }) => (
    <div className="fv-sidebar-inner">
      <div className="fv-sidebar-brand">
        <Link to="/app/dashboard" onClick={() => mobile && setMobileOpen(false)}>
          <img src="/forva-logo-master.png" alt="FORVA PropTech" />
        </Link>
        {mobile && <button className="fv-icon-btn" onClick={() => setMobileOpen(false)} aria-label="Close menu"><X size={19}/></button>}
      </div>
      <div className="fv-workspace-card">
        <div className="fv-workspace-icon"><Sparkles size={16}/></div>
        <div><span>Workspace</span><strong>{agencyLabel || 'My Realty Business'}</strong></div>
        <ChevronDown size={15}/>
      </div>
      <nav className="fv-sidebar-nav" aria-label="Main application navigation">
        <p className="fv-nav-label">WORKSPACE</p>
        {visibleNav.map((item) => (
          <NavLink key={item.to} to={item.to} onClick={() => mobile && setMobileOpen(false)} className={({isActive}) => `fv-nav-item ${isActive ? 'active' : ''}`}>
            <item.icon size={18}/><span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
      <div className="fv-ai-status">
        <div className="fv-ai-status-title"><span className="fv-live-dot"/><Zap size={14}/> Lead engine active</div>
        <p>Capture, qualification and follow-up are running.</p>
        <Link to="/app/analytics">View performance →</Link>
      </div>
      <div className="fv-sidebar-user">
        <div className="fv-avatar">{profile?.avatarUrl ? <img src={profile.avatarUrl} alt=""/> : user?.name.split(' ').map(n=>n[0]).join('').slice(0,2)}</div>
        <div className="fv-user-copy"><strong>{user?.name}</strong><span>{agencyLabel || 'Realtor'}</span></div>
        <button onClick={handleLogout} className="fv-icon-btn" aria-label="Log out"><LogOut size={16}/></button>
      </div>
    </div>
  );

  return (
    <div className="forva-app">
      <aside className="fv-sidebar"><Sidebar /></aside>
      {mobileOpen && <div className="fv-mobile-overlay" onClick={() => setMobileOpen(false)}><aside className="fv-mobile-drawer" onClick={e=>e.stopPropagation()}><Sidebar mobile /></aside></div>}
      <div className="fv-main-column">
        <header className="fv-topbar">
          <button type="button" onClick={() => setMobileOpen(true)} className="fv-icon-btn fv-mobile-menu" aria-label="Open menu"><Menu size={20}/></button>
          <div className="fv-global-search"><Search size={17}/><input type="search" placeholder="Search leads, conversations, appointments..." aria-label="Search"/><kbd>⌘ K</kbd></div>
          <div className="fv-topbar-actions">
            <Link to="/app/notifications" className="fv-icon-btn fv-notification-button" aria-label="Notifications"><Bell size={19}/><span/></Link>
            <Link to="/app/leads?add=1" className="fv-add-lead"><Plus size={17}/> Add Lead</Link>
          </div>
        </header>
        <main className="fv-content">{children}</main>
      </div>
      <nav className="fv-bottom-nav" aria-label="Mobile navigation">
        {visibleNav.slice(0,5).map(item => <NavLink key={item.to} to={item.to} className={({isActive})=>isActive?'active':''}><item.icon size={20}/><span>{item.label === 'Conversations' ? 'Messages' : item.label}</span></NavLink>)}
      </nav>
    </div>
  );
}
