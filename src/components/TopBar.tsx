import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { notificationService } from '@/services/notification.service';
import { Bell, Sun, Moon, LogOut, User, Search, Settings, Menu } from 'lucide-react';

interface TopBarProps {
  onMenuClick?: () => void;
}

const TopBar: React.FC<TopBarProps> = ({ onMenuClick }) => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    loadUnreadCount();
  }, []);

  const loadUnreadCount = async () => {
    try {
      const notifications = await notificationService.listNotifications();
      setUnreadCount(notifications.filter((n: any) => !n.isRead).length);
    } catch (error) {
      console.error('Error loading notifications:', error);
    }
  };

  return (
    <header className="h-16 bg-white/80 dark:bg-neutral-950/80 backdrop-blur-xl border-b border-neutral-100/50 dark:border-neutral-800/50 flex items-center justify-between px-4 sm:px-8 sticky top-0 z-40">
      <div className="flex items-center gap-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 text-neutral-400 hover:text-accent hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-xl transition-all duration-200 cursor-pointer"
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>
        <h2 className="text-lg font-bold text-neutral-800 dark:text-white capitalize hidden sm:block">
          {window.location.pathname.split('/').pop()?.replace('-', ' ') || 'Overview'}
        </h2>
      </div>

      <div className="hidden md:flex flex-1 max-w-md mx-8">
        <div className="relative w-full group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400 group-focus-within:text-accent transition-colors" />
          <input
            type="text"
            placeholder="Search everything..."
            className="w-full bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-200 dark:border-neutral-700 rounded-xl pl-11 pr-4 py-2.5 text-sm focus:outline-none focus:border-accent focus:ring-2 focus:ring-accent/10 transition-all duration-200"
          />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={toggleTheme}
          className="p-2.5 text-neutral-400 hover:text-accent hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-xl transition-all duration-200 cursor-pointer"
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>

        <button
          onClick={() => navigate('/dashboard/settings')}
          className="p-2.5 text-neutral-400 hover:text-accent hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-xl transition-all duration-200 cursor-pointer hidden sm:block"
          title="Settings"
        >
          <Settings className="w-5 h-5" />
        </button>

        <button
          onClick={() => navigate('/dashboard/notifications')}
          className="p-2.5 text-neutral-400 hover:text-accent hover:bg-neutral-50 dark:hover:bg-neutral-800 rounded-xl transition-all duration-200 relative cursor-pointer"
          title="Notifications"
        >
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute top-2 right-2 w-2 h-2 bg-accent rounded-full border-2 border-white dark:border-neutral-900 animate-pulse" />
          )}
        </button>

        <div className="flex items-center gap-3 ml-2 pl-4 border-l border-neutral-100 dark:border-neutral-800">
          <div className="text-right hidden sm:block">
            <div className="text-sm font-bold text-neutral-800 dark:text-white leading-none mb-1">{user?.name}</div>
            <div className="text-[10px] font-bold text-accent uppercase tracking-[0.15em] leading-none">{user?.role}</div>
          </div>
          <div className="w-9 h-9 bg-gradient-to-br from-accent to-gold-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-gold">
            {user?.name?.charAt(0) || <User className="w-4 h-4" />}
          </div>
          <button
            onClick={logout}
            className="p-2.5 text-neutral-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-xl transition-all duration-200 cursor-pointer"
            title="Logout"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default TopBar;
