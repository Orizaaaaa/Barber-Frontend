import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import {
  LayoutDashboard,
  Calendar,
  Scissors,
  DollarSign,
  Package,
  FileText,
  Users,
  Percent,
  Bell,
  Settings,
  Star,
  Wallet,
  ChevronLeft,
  ChevronRight,
  X,
  LogOut
} from 'lucide-react';
import Logo from './Logo';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed, onToggle, mobileOpen, onMobileClose }) => {
  const location = useLocation();
  const { user, logout } = useAuth();

  const menuItems = {
    ADMIN: [
      { path: '/dashboard', icon: LayoutDashboard, label: 'Overview' },
      { path: '/dashboard/bookings', icon: Calendar, label: 'Bookings' },
      { path: '/dashboard/barbers', icon: Scissors, label: 'Barbers' },
      { path: '/dashboard/services', icon: Scissors, label: 'Services' },
      { path: '/dashboard/payments', icon: DollarSign, label: 'Payments' },
      { path: '/dashboard/inventory', icon: Package, label: 'Inventory' },
      { path: '/dashboard/resources', icon: Package, label: 'Resources' },
      { path: '/dashboard/reports', icon: FileText, label: 'Reports' },
      { path: '/dashboard/payrolls', icon: Wallet, label: 'Gaji & Komisi' },
      { path: '/dashboard/customers', icon: Users, label: 'Customers' },
      { path: '/dashboard/promos', icon: Percent, label: 'Promos' },
      { path: '/dashboard/notifications', icon: Bell, label: 'Notifications' },
      { path: '/dashboard/settings', icon: Settings, label: 'Settings' },
      { path: '/dashboard/reviews', icon: Star, label: 'Reviews' },
    ],
    BARBER: [
      { path: '/dashboard', icon: LayoutDashboard, label: 'Overview' },
      { path: '/dashboard/bookings', icon: Calendar, label: 'My Schedule' },
      { path: '/dashboard/earnings', icon: DollarSign, label: 'Penghasilan' },
      { path: '/dashboard/payrolls', icon: Wallet, label: 'Gaji Saya' },
      { path: '/dashboard/notifications', icon: Bell, label: 'Notifications' },
    ],
    CUSTOMER: [
      { path: '/dashboard', icon: LayoutDashboard, label: 'Overview' },
      { path: '/dashboard/bookings', icon: Calendar, label: 'My Bookings' },
      { path: '/dashboard/notifications', icon: Bell, label: 'Notifications' },
    ],
  };

  const items = menuItems[user?.role as keyof typeof menuItems] || menuItems.CUSTOMER;

  const isActive = (path: string) => {
    if (path === '/dashboard') {
      return location.pathname === '/dashboard';
    }
    return location.pathname.startsWith(path);
  };

  const handleLogout = () => {
    logout();
    onMobileClose();
  };

  const sidebarContent = (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b border-neutral-100 dark:border-neutral-800 flex items-center justify-between">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-accent to-gold-600 rounded-lg flex items-center justify-center shadow-gold">
              <Logo size="sm" />
            </div>
            <h1 className="text-lg font-black tracking-tighter text-neutral-900 dark:text-white font-serif">SUMA <span className="text-gradient-gold">BARBER</span></h1>
          </div>
        )}
        <button
          onClick={onToggle}
          className="p-1.5 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors text-neutral-400 hidden lg:block cursor-pointer"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
        </button>
        <button
          onClick={onMobileClose}
          className="p-1.5 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-lg transition-colors text-neutral-400 lg:hidden cursor-pointer"
          aria-label="Close sidebar"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* User info */}
      {!collapsed && user && (
        <div className="p-4 border-b border-neutral-100 dark:border-neutral-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-accent to-gold-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-gold">
              {user.name.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-neutral-900 dark:text-white truncate">{user.name}</p>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 capitalize">{user.role.toLowerCase()}</p>
            </div>
          </div>
        </div>
      )}

      <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-0.5">
        {items.map((item) => {
          const active = isActive(item.path);
          return (
            <Link
              key={item.path}
              to={item.path}
              onClick={onMobileClose}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 relative group cursor-pointer ${active
                ? 'bg-accent/10 dark:bg-accent/10 text-accent'
                : 'text-neutral-500 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 hover:text-neutral-700 dark:hover:text-neutral-300'
                }`}
            >
              {active && <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-accent rounded-full" />}
              <item.icon className={`w-[18px] h-[18px] flex-shrink-0 ${active ? 'text-accent' : ''}`} />
              {!collapsed && <span className={`font-medium text-sm ${active ? 'text-accent font-semibold' : ''}`}>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-neutral-100 dark:border-neutral-800 space-y-1">
        <button
          onClick={handleLogout}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 cursor-pointer w-full text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30`}
        >
          <LogOut className="w-[18px] h-[18px] flex-shrink-0" />
          {!collapsed && <span className="font-medium text-sm">Logout</span>}
        </button>
        <Link
          to="/"
          onClick={onMobileClose}
          className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 cursor-pointer ${location.pathname === '/'
            ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white'
            : 'text-neutral-500 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800 hover:text-neutral-700 dark:hover:text-neutral-300'
            }`}
        >
          <X className="w-[18px] h-[18px] flex-shrink-0" />
          {!collapsed && <span className="font-medium text-sm">Exit Dashboard</span>}
        </Link>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={`hidden lg:block fixed left-0 top-0 h-screen bg-white dark:bg-neutral-950 border-r border-neutral-100 dark:border-neutral-800 transition-all duration-300 z-50 ${collapsed ? 'w-16' : 'w-64'}`}
      >
        {sidebarContent}
      </aside>

      {/* Mobile sidebar */}
      <aside
        className={`lg:hidden fixed left-0 top-0 h-screen w-64 bg-white dark:bg-neutral-950 border-r border-neutral-100 dark:border-neutral-800 transition-transform duration-300 z-50 ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        {sidebarContent}
      </aside>
    </>
  );
};

export default Sidebar;
