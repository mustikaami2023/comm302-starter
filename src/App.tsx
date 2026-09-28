/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { NavigationDrawer } from './components/NavigationDrawer';
import { SearchModal } from './components/SearchModal';
import { AuthModal } from './components/AuthModal';
import { AssetDetailModal } from './components/AssetDetailModal';
import { MarketsView } from './components/MarketsView';
import { NewsView } from './components/NewsView';
import { ChartView } from './components/ChartView';
import { IdeasView } from './components/IdeasView';
import { BottomNav, TabType } from './components/BottomNav';
import { MarketAsset } from './types/market';
import { FEATURED_INDICES } from './data/marketData';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabType>('Markets');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<MarketAsset | null>(null);
  const [isDark, setIsDark] = useState<boolean>(false);
  const [watchlist, setWatchlist] = useState<string[]>(['sp500', 'nvda', 'btc']);

  // Sync dark class on documentElement
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const toggleWatchlist = (assetId: string) => {
    setWatchlist((prev) =>
      prev.includes(assetId) ? prev.filter((id) => id !== assetId) : [...prev, assetId]
    );
  };

  const handleOpenAssetDetail = (asset: MarketAsset) => {
    setSelectedAsset(asset);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FD] dark:bg-[#131722] text-[#131722] dark:text-[#D1D4DC] flex flex-col font-sans transition-colors duration-200">
      {/* Mobile Frame Container: responsive centered view */}
      <div className="w-full max-w-md mx-auto min-h-screen bg-white dark:bg-[#131722] flex flex-col shadow-xl sm:border-x sm:border-gray-200 dark:sm:border-[#2a2e39] relative">
        {/* Sticky Header */}
        <Header
          onOpenDrawer={() => setDrawerOpen(true)}
          onOpenSearch={() => setSearchOpen(true)}
          onOpenAuth={() => setAuthOpen(true)}
          isDark={isDark}
          onToggleTheme={() => setIsDark(!isDark)}
        />

        {/* View Switcher based on Bottom Nav Tab */}
        <div className="flex-1">
          {activeTab === 'Markets' && (
            <MarketsView
              onSelectAsset={handleOpenAssetDetail}
              onOpenSearch={() => setSearchOpen(true)}
            />
          )}

          {activeTab === 'News' && (
            <NewsView onSelectAsset={handleOpenAssetDetail} />
          )}

          {activeTab === 'Chart' && (
            <ChartView
              initialAsset={selectedAsset || FEATURED_INDICES[0]}
              onOpenAssetDetail={handleOpenAssetDetail}
            />
          )}

          {activeTab === 'Ideas' && (
            <IdeasView onSelectAsset={handleOpenAssetDetail} />
          )}
        </div>

        {/* Fixed Mobile Bottom Navigation */}
        <BottomNav activeTab={activeTab} onSelectTab={setActiveTab} />

        {/* Side Navigation Drawer */}
        <NavigationDrawer
          isOpen={drawerOpen}
          onClose={() => setDrawerOpen(false)}
          onOpenAuth={() => setAuthOpen(true)}
          onSelectTab={setActiveTab}
          watchlistCount={watchlist.length}
          isDark={isDark}
          onToggleTheme={() => setIsDark(!isDark)}
        />

        {/* Quick Search Modal */}
        <SearchModal
          isOpen={searchOpen}
          onClose={() => setSearchOpen(false)}
          onSelectAsset={handleOpenAssetDetail}
        />

        {/* Auth / Get Started Modal */}
        <AuthModal
          isOpen={authOpen}
          onClose={() => setAuthOpen(false)}
          onSuccess={(email) => {
            console.log('User signed in:', email);
          }}
        />

        {/* Full Asset Detail Sheet / Modal */}
        {selectedAsset && (
          <AssetDetailModal
            asset={selectedAsset}
            onClose={() => setSelectedAsset(null)}
            isWatchlisted={watchlist.includes(selectedAsset.id)}
            onToggleWatchlist={toggleWatchlist}
          />
        )}
      </div>
    </div>
  );
}
