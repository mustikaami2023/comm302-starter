import React from 'react';
import { Search, Sun, Moon } from 'lucide-react';

interface HeaderProps {
  onOpenDrawer: () => void;
  onOpenSearch: () => void;
  onOpenAuth: () => void;
  isDark: boolean;
  onToggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenDrawer,
  onOpenSearch,
  onOpenAuth,
  isDark,
  onToggleTheme,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-[#131722]/95 backdrop-blur-md border-b border-gray-100 dark:border-[#2a2e39] px-4 h-14 flex items-center justify-between transition-colors">
      {/* Left: Hamburger Drawer and TradingView Geometric Logo */}
      <div className="flex items-center space-x-3.5">
        <button
          onClick={onOpenDrawer}
          aria-label="Open menu"
          className="p-1 -ml-1 text-gray-900 dark:text-gray-100 hover:text-gray-500 tap-highlight-transparent cursor-pointer"
          type="button"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            strokeLinecap="round"
            strokeWidth="2.2"
            viewBox="0 0 24 24"
          >
            <line x1="3" x2="21" y1="6" y2="6" />
            <line x1="3" x2="21" y1="12" y2="12" />
            <line x1="3" x2="21" y1="18" y2="18" />
          </svg>
        </button>

        {/* TradingView Geometric Logo Mark */}
        <a
          aria-label="TradingView Home"
          className="flex items-center text-gray-900 dark:text-white"
          href="#"
        >
          <svg className="h-6 w-auto" fill="currentColor" viewBox="0 0 36 28">
            <path d="M7 6h5v16H7V6zm8-6h5v28h-5V0zm8 11h5v17h-5V11z" />
          </svg>
        </a>
      </div>

      {/* Right: Search, Theme Toggle, and 'Get started' gradient pill CTA button */}
      <div className="flex items-center space-x-2 sm:space-x-3">
        <button
          onClick={onToggleTheme}
          aria-label="Toggle theme"
          className="p-2 text-gray-700 dark:text-gray-300 hover:text-black dark:hover:text-white tap-highlight-transparent rounded-full hover:bg-gray-100 dark:hover:bg-[#2a2e39] transition-colors"
          type="button"
        >
          {isDark ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
        </button>

        <button
          onClick={onOpenSearch}
          aria-label="Search markets"
          className="p-2 text-gray-900 dark:text-gray-200 hover:text-gray-500 tap-highlight-transparent rounded-full hover:bg-gray-100 dark:hover:bg-[#2a2e39] transition-colors"
          type="button"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.3" viewBox="0 0 24 24">
            <path
              d="M21 21l-4.35-4.35m1.85-5.15a7 7 0 11-14 0 7 7 0 0114 0z"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        <button
          onClick={onOpenAuth}
          className="bg-gradient-to-r from-[#2962FF] to-[#9924FF] text-white text-xs font-semibold px-4 py-2 rounded-full shadow-sm hover:opacity-95 active:scale-95 transition-all cursor-pointer whitespace-nowrap"
          type="button"
        >
          Get started
        </button>
      </div>
    </header>
  );
};
