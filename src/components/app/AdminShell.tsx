import { useState, type ReactNode } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import {
  Shield,
  LayoutDashboard,
  Users,
  Building2,
  CreditCard,
  TrendingUp,
  Settings as SettingsIcon,
  LogOut,
  Menu,
  X,
  ArrowLeft,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { Logo } from '@/components/shared/Logo';

const adminNavItems = [
  { to: '/admin', label: 'Overview', icon: LayoutDashboard, end: true },
  { to: '/admin/clients', label: 'Clients', icon: Building2 },
  { to: '/admin/users', label: 'Users', icon: Users },
  { to: '/admin/subscriptions', label: 'Subscriptions', icon: CreditCard },
  { to: '/admin/leads', label: 'Leads', icon: TrendingUp },
  { to: '/admin/settings', label: 'Settings', icon: SettingsIcon },
];

export function AdminShell({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-navy-900">
      {/* Desktop sidebar */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-white/8 bg-navy-950 lg:flex lg:flex-col">
        <div className="flex h-16 items-center gap-2 border-b border-white/8 px-5">
          <Logo variant="mark" className="h-8" />
          <div className="flex items-center gap-1.5">
            <Shield size={14} className="text-accent-300" />
            <span className="text-sm font-bold tracking-wide text-white">ADMIN</span>
          </div>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4 scrollbar-thin" aria-label="Admin sidebar">
          {adminNavItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-accent-500/15 text-accent-300'
                    : 'text-silver-400 hover:bg-white/5 hover:text-white'
                }`
              }
            >
              <item.icon size={18} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-white/8 p-3">
          <Link
            to="/app/dashboard"
            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-silver-400 transition-colors hover:bg-white/5 hover:text-white"
          >
            <ArrowLeft size={18} />
            <span>Back to App</span>
          </Link>
          <div className="mt-2 flex items-center gap-3 rounded-lg px-3 py-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent-gradient text-xs font-bold text-white">
              {user?.name.split(' ').map((n) => n[0]).join('') || 'A'}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-white">{user?.name}</p>
              <p className="truncate text-xs text-silver-500">Super Admin</p>
            </div>
            <button
              type="button"
              onClick={handleLogout}
              className="text-silver-400 hover:text-white transition-colors"
              aria-label="Log out"
            >
              <LogOut size={16} />
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-navy-950/70 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-72 max-w-[80%] border-r border-white/8 bg-navy-950 animate-slide-in">
            <div className="flex h-16 items-center justify-between border-b border-white/8 px-5">
              <div className="flex items-center gap-2">
                <Logo variant="mark" className="h-8" />
                <Shield size={14} className="text-accent-300" />
                <span className="text-sm font-bold text-white">ADMIN</span>
              </div>
              <button
                type="button"
                onClick={() => setMobileOpen(false)}
                className="text-silver-400 hover:text-white"
                aria-label="Close menu"
              >
                <X size={20} />
              </button>
            </div>
            <nav className="space-y-1 px-3 py-4" aria-label="Mobile admin sidebar">
              {adminNavItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.end}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                      isActive
                        ? 'bg-accent-500/15 text-accent-300'
                        : 'text-silver-400 hover:bg-white/5 hover:text-white'
                    }`
                  }
                >
                  <item.icon size={18} />
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </nav>
            <div className="absolute inset-x-0 bottom-0 border-t border-white/8 p-3">
              <Link
                to="/app/dashboard"
                className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-silver-400 hover:bg-white/5 hover:text-white"
              >
                <ArrowLeft size={18} />
                <span>Back to App</span>
              </Link>
              <button
                type="button"
                onClick={handleLogout}
                className="mt-2 flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-silver-400 hover:bg-white/5 hover:text-white"
              >
                <LogOut size={18} />
                <span>Log out</span>
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Main column */}
      <div className="lg:pl-64">
        <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-white/8 bg-navy-900/80 px-4 backdrop-blur-md sm:px-6">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="btn-ghost p-2 lg:hidden"
            aria-label="Open menu"
          >
            <Menu size={20} />
          </button>
          <div className="flex items-center gap-2">
            <Shield size={18} className="text-accent-300" />
            <span className="text-sm font-semibold text-white">FORVA Super Admin</span>
          </div>
        </header>

        <main className="px-4 py-6 sm:px-6 lg:px-8">{children}</main>
      </div>
    </div>
  );
}
