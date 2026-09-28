import React from 'react';

export type TabType = 'Markets' | 'News' | 'Chart' | 'Ideas';

interface BottomNavProps {
  activeTab: TabType;
  onSelectTab: (tab: TabType) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onSelectTab }) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 dark:bg-[#131722]/95 backdrop-blur-md border-t border-gray-200 dark:border-[#2a2e39] px-6 py-2 flex justify-around items-center text-center max-w-md mx-auto transition-colors">
      {/* Tab: Markets */}
      <button
        onClick={() => onSelectTab('Markets')}
        className={`flex flex-col items-center tap-highlight-transparent cursor-pointer transition-colors ${
          activeTab === 'Markets'
            ? 'text-[#2962FF]'
            : 'text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white'
        }`}
        type="button"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={activeTab === 'Markets' ? '2.3' : '2'} viewBox="0 0 24 24">
          <path d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span className={`text-[10px] mt-1 ${activeTab === 'Markets' ? 'font-bold' : 'font-medium'}`}>
          Markets
        </span>
      </button>

      {/* Tab: News */}
      <button
        onClick={() => onSelectTab('News')}
        className={`flex flex-col items-center tap-highlight-transparent cursor-pointer transition-colors ${
          activeTab === 'News'
            ? 'text-[#2962FF]'
            : 'text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white'
        }`}
        type="button"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={activeTab === 'News' ? '2.3' : '2'} viewBox="0 0 24 24">
          <path
            d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span className={`text-[10px] mt-1 ${activeTab === 'News' ? 'font-bold' : 'font-medium'}`}>
          News
        </span>
      </button>

      {/* Tab: Chart */}
      <button
        onClick={() => onSelectTab('Chart')}
        className={`flex flex-col items-center tap-highlight-transparent cursor-pointer transition-colors ${
          activeTab === 'Chart'
            ? 'text-[#2962FF]'
            : 'text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white'
        }`}
        type="button"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={activeTab === 'Chart' ? '2.3' : '2'} viewBox="0 0 24 24">
          <path
            d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span className={`text-[10px] mt-1 ${activeTab === 'Chart' ? 'font-bold' : 'font-medium'}`}>
          Chart
        </span>
      </button>

      {/* Tab: Community / Ideas */}
      <button
        onClick={() => onSelectTab('Ideas')}
        className={`flex flex-col items-center tap-highlight-transparent cursor-pointer transition-colors ${
          activeTab === 'Ideas'
            ? 'text-[#2962FF]'
            : 'text-gray-500 dark:text-gray-400 hover:text-black dark:hover:text-white'
        }`}
        type="button"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={activeTab === 'Ideas' ? '2.3' : '2'} viewBox="0 0 24 24">
          <path
            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <span className={`text-[10px] mt-1 ${activeTab === 'Ideas' ? 'font-bold' : 'font-medium'}`}>
          Ideas
        </span>
      </button>
    </nav>
  );
};
