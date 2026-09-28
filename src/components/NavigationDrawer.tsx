import React from 'react';
import {
  X,
  LineChart,
  Grid,
  Calendar,
  Flame,
  Globe,
  Settings,
  HelpCircle,
  Bookmark,
  Sun,
  Moon,
  ChevronRight,
  ShieldCheck,
} from 'lucide-react';

interface NavigationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenAuth: () => void;
  onSelectTab: (tab: 'Markets' | 'News' | 'Chart' | 'Ideas') => void;
  watchlistCount: number;
  isDark: boolean;
  onToggleTheme: () => void;
}

export const NavigationDrawer: React.FC<NavigationDrawerProps> = ({
  isOpen,
  onClose,
  onOpenAuth,
  onSelectTab,
  watchlistCount,
  isDark,
  onToggleTheme,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      />

      {/* Drawer Content */}
      <div className="relative w-72 max-w-[85vw] h-full bg-white dark:bg-[#1e222d] border-r border-gray-200 dark:border-[#2a2e39] shadow-2xl flex flex-col z-10 overflow-y-auto no-scrollbar">
        {/* Top Header */}
        <div className="p-4 border-b border-gray-100 dark:border-[#2a2e39] flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <svg className="h-6 w-auto text-[#2962FF]" fill="currentColor" viewBox="0 0 36 28">
              <path d="M7 6h5v16H7V6zm8-6h5v28h-5V0zm8 11h5v17h-5V11z" />
            </svg>
            <span className="font-extrabold text-base tracking-tight text-gray-900 dark:text-white">
              TradingView
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-full text-gray-500 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-[#2a2e39]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* User Card CTA */}
        <div className="p-4 border-b border-gray-100 dark:border-[#2a2e39] bg-gradient-to-br from-blue-50/60 to-purple-50/40 dark:from-[#131722] dark:to-[#1e222d]">
          <div className="flex items-center space-x-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#2962FF] to-[#9924FF] text-white flex items-center justify-center font-bold text-sm">
              TV
            </div>
            <div>
              <div className="font-bold text-sm text-gray-900 dark:text-white">Guest Investor</div>
              <div className="text-[11px] text-gray-500">Free Tier Account</div>
            </div>
          </div>
          <button
            onClick={() => {
              onClose();
              onOpenAuth();
            }}
            className="w-full py-2 bg-[#2962FF] hover:bg-[#1E53E5] text-white text-xs font-bold rounded-lg shadow-sm transition-colors text-center"
          >
            Sign in or Join Free
          </button>
        </div>

        {/* Menu Navigation */}
        <div className="py-2 flex-1">
          <div className="px-4 py-1.5 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
            Markets & Tools
          </div>

          <button
            onClick={() => {
              onSelectTab('Markets');
              onClose();
            }}
            className="w-full px-4 py-2.5 flex items-center justify-between text-left text-sm font-semibold text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-[#131722]/50 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <Globe className="w-4 h-4 text-gray-500" />
              <span>Markets Overview</span>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </button>

          <button
            onClick={() => {
              onSelectTab('Chart');
              onClose();
            }}
            className="w-full px-4 py-2.5 flex items-center justify-between text-left text-sm font-semibold text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-[#131722]/50 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <LineChart className="w-4 h-4 text-[#2962FF]" />
              <span>Supercharts</span>
            </div>
            <span className="text-[10px] bg-blue-100 dark:bg-blue-900/50 text-[#2962FF] px-1.5 py-0.5 rounded font-bold">
              PRO
            </span>
          </button>

          <button
            onClick={() => {
              onSelectTab('News');
              onClose();
            }}
            className="w-full px-4 py-2.5 flex items-center justify-between text-left text-sm font-semibold text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-[#131722]/50 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <Flame className="w-4 h-4 text-amber-500" />
              <span>Financial News</span>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </button>

          <button
            onClick={() => {
              onSelectTab('Ideas');
              onClose();
            }}
            className="w-full px-4 py-2.5 flex items-center justify-between text-left text-sm font-semibold text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-[#131722]/50 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <Grid className="w-4 h-4 text-purple-500" />
              <span>Community Ideas</span>
            </div>
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </button>

          <div className="my-2 border-t border-gray-100 dark:border-[#2a2e39]" />

          <div className="px-4 py-1.5 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
            Personal
          </div>

          <div className="w-full px-4 py-2.5 flex items-center justify-between text-left text-sm font-semibold text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-[#131722]/50 transition-colors cursor-pointer">
            <div className="flex items-center space-x-3">
              <Bookmark className="w-4 h-4 text-amber-500" />
              <span>Watchlist</span>
            </div>
            <span className="text-xs bg-gray-100 dark:bg-[#2a2e39] text-gray-700 dark:text-gray-300 px-2 py-0.5 rounded-full font-bold">
              {watchlistCount}
            </span>
          </div>

          <div className="w-full px-4 py-2.5 flex items-center justify-between text-left text-sm font-semibold text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-[#131722]/50 transition-colors cursor-pointer">
            <div className="flex items-center space-x-3">
              <Calendar className="w-4 h-4 text-blue-500" />
              <span>Economic Calendar</span>
            </div>
            <span className="text-[10px] text-gray-400">Fed Week</span>
          </div>

          <div className="my-2 border-t border-gray-100 dark:border-[#2a2e39]" />

          <div className="px-4 py-1.5 text-[11px] font-bold text-gray-400 uppercase tracking-wider">
            Preferences
          </div>

          {/* Theme Switcher */}
          <div className="px-4 py-2 flex items-center justify-between">
            <div className="flex items-center space-x-3 text-sm font-semibold text-gray-800 dark:text-gray-200">
              {isDark ? <Moon className="w-4 h-4 text-blue-400" /> : <Sun className="w-4 h-4 text-amber-500" />}
              <span>Dark Theme</span>
            </div>
            <button
              onClick={onToggleTheme}
              className={`w-11 h-6 rounded-full transition-colors p-0.5 flex items-center ${
                isDark ? 'bg-[#2962FF] justify-end' : 'bg-gray-300 justify-start'
              }`}
            >
              <div className="w-5 h-5 rounded-full bg-white shadow-xs" />
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 dark:border-[#2a2e39] text-xs text-gray-400 flex items-center justify-between">
          <span>v2026.09 · Mobile Web</span>
          <div className="flex items-center space-x-1 text-emerald-500 font-medium">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Encrypted</span>
          </div>
        </div>
      </div>
    </div>
  );
};
