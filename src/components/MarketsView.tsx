import React, { useState } from 'react';
import { MarketAsset, MarketCategory } from '../types/market';
import { Sparkline } from './Sparkline';
import { CategoryFilter } from './CategoryFilter';
import {
  FEATURED_INDICES,
  WORLD_INDICES,
  US_STOCKS,
  CRYPTO_ASSETS,
  MARKET_MOVERS,
} from '../data/marketData';

interface MarketsViewProps {
  onSelectAsset: (asset: MarketAsset) => void;
  onOpenSearch: () => void;
}

export const MarketsView: React.FC<MarketsViewProps> = ({ onSelectAsset, onOpenSearch }) => {
  const [activeCategory, setActiveCategory] = useState<MarketCategory>('Indices');
  const [selectedRegion, setSelectedRegion] = useState<string>('everywhere');
  const [showRegionMenu, setShowRegionMenu] = useState<boolean>(false);
  const [moversTab, setMoversTab] = useState<'highestVolume' | 'topGainers' | 'topLosers'>(
    'highestVolume'
  );

  const categories: MarketCategory[] = [
    'Indices',
    'Futures',
    'Forex',
    'Government bonds',
    'Crypto',
    'Stocks',
  ];

  // Map mover item to a MarketAsset if clicked
  const handleMoverClick = (mover: (typeof MARKET_MOVERS.highestVolume)[0]) => {
    // Check if we have matching asset in our pools
    const found =
      US_STOCKS.find((s) => s.id === mover.id) ||
      FEATURED_INDICES.find((i) => i.id === mover.id) ||
      CRYPTO_ASSETS.find((c) => c.id === mover.id);

    if (found) {
      onSelectAsset(found);
    } else {
      // Synthesize on the fly
      const isPos = mover.isPositive;
      const changeNum = parseFloat(mover.change.replace('%', ''));
      const synthesized: MarketAsset = {
        id: mover.id,
        ticker: mover.ticker,
        name: mover.name,
        exchange: 'NASDAQ',
        category: 'Stocks',
        price: mover.rawPrice,
        change: parseFloat((mover.rawPrice * (changeNum / 100)).toFixed(2)),
        changePercent: changeNum,
        currency: 'USD',
        sparkline: isPos ? [20, 24, 28, 32, 30, 36, 40] : [40, 36, 32, 28, 25, 20, 18],
        dayLow: parseFloat((mover.rawPrice * 0.98).toFixed(2)),
        dayHigh: parseFloat((mover.rawPrice * 1.02).toFixed(2)),
        yearLow: parseFloat((mover.rawPrice * 0.7).toFixed(2)),
        yearHigh: parseFloat((mover.rawPrice * 1.3).toFixed(2)),
        sentiment: isPos ? 'Buy' : 'Neutral',
        description: `${mover.name} is actively traded across global markets with significant institutional and retail participation.`,
        history: {
          '1D': [
            { time: '09:30', open: mover.rawPrice * 0.99, high: mover.rawPrice * 1.01, low: mover.rawPrice * 0.98, close: mover.rawPrice, volume: 150000 },
          ],
        },
      };
      onSelectAsset(synthesized);
    }
  };

  return (
    <main className="w-full max-w-md mx-auto pb-24">
      {/* Title And Category Navigation */}
      <section className="pt-6 px-4">
        {/* Dynamic Title with dropdown arrow */}
        <div className="relative inline-block">
          <button
            onClick={() => setShowRegionMenu(!showRegionMenu)}
            className="inline-flex items-center space-x-2 cursor-pointer group text-left tap-highlight-transparent"
            type="button"
          >
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white group-hover:opacity-90">
              Markets, {selectedRegion}
            </h1>
            <svg
              className={`w-6 h-6 mt-1 text-gray-900 dark:text-white transition-transform ${
                showRegionMenu ? 'rotate-180' : 'group-hover:translate-y-0.5'
              }`}
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              viewBox="0 0 24 24"
            >
              <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          {/* Region Dropdown Menu */}
          {showRegionMenu && (
            <div className="absolute left-0 mt-2 w-56 bg-white dark:bg-[#1e222d] border border-gray-200 dark:border-[#2a2e39] rounded-2xl shadow-xl z-30 py-2 divide-y divide-gray-100 dark:divide-[#2a2e39]">
              {[
                { id: 'everywhere', label: 'Everywhere (Global)' },
                { id: 'United States', label: 'United States' },
                { id: 'Europe', label: 'Europe & UK' },
                { id: 'Asia Pacific', label: 'Asia-Pacific' },
              ].map((reg) => (
                <button
                  key={reg.id}
                  onClick={() => {
                    setSelectedRegion(reg.id);
                    setShowRegionMenu(false);
                  }}
                  className={`w-full px-4 py-2 text-left text-xs font-semibold transition-colors flex items-center justify-between ${
                    selectedRegion === reg.id
                      ? 'text-[#2962FF] bg-blue-50/50 dark:bg-blue-950/30'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#131722]'
                  }`}
                >
                  <span>{reg.label}</span>
                  {selectedRegion === reg.id && <span className="text-xs">✓</span>}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Horizontal Filter Pills */}
        <CategoryFilter
          categories={categories}
          activeCategory={activeCategory}
          onSelectCategory={setActiveCategory}
        />
      </section>

      {/* SECTION 1: Featured Major Indices Cards */}
      <section className="mt-5">
        <div className="flex space-x-3 overflow-x-auto no-scrollbar px-4 pb-2">
          {FEATURED_INDICES.map((asset) => {
            const isPos = asset.changePercent >= 0;
            return (
              <article
                key={asset.id}
                onClick={() => onSelectAsset(asset)}
                className="flex-shrink-0 w-64 bg-white dark:bg-[#1e222d] border border-gray-200 dark:border-[#2a2e39] rounded-2xl p-4 shadow-xs hover:border-gray-400 dark:hover:border-gray-500 transition-all flex flex-col justify-between cursor-pointer active:scale-[0.99]"
              >
                <div>
                  {/* Header: Badge & Ticker Title */}
                  <div className="flex items-center space-x-2.5">
                    <span
                      className="w-7 h-7 rounded-full text-white text-[11px] font-bold flex items-center justify-center tracking-tight shadow-xs"
                      style={{ backgroundColor: asset.badgeBg }}
                    >
                      {asset.badgeText}
                    </span>
                    <span className="font-bold text-base text-gray-900 dark:text-white">
                      {asset.ticker}
                    </span>
                  </div>

                  {/* Value and Change */}
                  <div className="mt-3">
                    <div className="text-xl font-bold tracking-tight text-gray-900 dark:text-white tabular-nums">
                      {asset.price.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </div>
                    <div className="flex items-center space-x-1.5 mt-0.5">
                      <span
                        className={`font-semibold text-xs tabular-nums ${
                          isPos ? 'text-[#089981]' : 'text-[#F23645]'
                        }`}
                      >
                        {isPos ? '+' : ''}
                        {asset.change.toFixed(2)} ({isPos ? '+' : ''}
                        {asset.changePercent.toFixed(2)}%)
                      </span>
                      <span className="text-[10px] text-gray-500 dark:text-gray-400 font-medium">
                        {asset.currency}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Mini Sparkline Canvas Graphic (SVG) */}
                <div className="mt-4 pt-2 border-t border-gray-100 dark:border-[#2a2e39] flex items-end justify-between">
                  <Sparkline data={asset.sparkline} isPositive={isPos} className="w-full h-12" />
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* SECTION 2: World Indices Section */}
      <section className="mt-8">
        <div className="px-4 mb-3">
          <button
            onClick={onOpenSearch}
            className="inline-flex items-center space-x-1 text-2xl font-bold text-gray-900 dark:text-white hover:text-[#2962FF] dark:hover:text-[#2962FF] transition-colors group tap-highlight-transparent"
          >
            <span>World indices</span>
            <svg
              className="w-5 h-5 transition-transform group-hover:translate-x-1"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              viewBox="0 0 24 24"
            >
              <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        {/* World Indices Horizontal Slider */}
        <div className="flex space-x-3 overflow-x-auto no-scrollbar px-4 pb-2">
          {WORLD_INDICES.map((asset) => {
            const isPos = asset.changePercent >= 0;
            return (
              <article
                key={asset.id}
                onClick={() => onSelectAsset(asset)}
                className="flex-shrink-0 w-64 bg-white dark:bg-[#1e222d] border border-gray-200 dark:border-[#2a2e39] rounded-2xl p-4 shadow-xs hover:border-gray-400 dark:hover:border-gray-500 transition-all flex flex-col justify-between cursor-pointer active:scale-[0.99]"
              >
                <div>
                  <div className="flex items-center space-x-2.5">
                    <span
                      className="w-8 h-8 rounded-full text-white text-[11px] font-bold flex items-center justify-center shadow-xs"
                      style={{ backgroundColor: asset.badgeBg }}
                    >
                      {asset.badgeText}
                    </span>
                    <div>
                      <div className="font-bold text-base text-gray-900 dark:text-white leading-tight">
                        {asset.ticker}
                      </div>
                      <div className="text-[11px] text-gray-500 dark:text-gray-400 font-medium">
                        {asset.name}
                      </div>
                    </div>
                  </div>

                  <div className="mt-3">
                    <div className="text-xl font-bold text-gray-900 dark:text-white tracking-tight tabular-nums">
                      {asset.price.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </div>
                    <div className="flex items-center space-x-1 mt-0.5">
                      <span
                        className={`font-semibold text-xs tabular-nums ${
                          isPos ? 'text-[#089981]' : 'text-[#F23645]'
                        }`}
                      >
                        {isPos ? '+' : ''}
                        {asset.change.toFixed(2)} ({isPos ? '+' : ''}
                        {asset.changePercent.toFixed(2)}%)
                      </span>
                      <span className="text-[10px] text-gray-500 dark:text-gray-400 font-medium">
                        {asset.currency}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-2 border-t border-gray-100 dark:border-[#2a2e39]">
                  <Sparkline data={asset.sparkline} isPositive={isPos} className="w-full h-10" />
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* SECTION 3: US Stocks Section */}
      <section className="mt-9">
        <div className="px-4 mb-3">
          <button
            onClick={onOpenSearch}
            className="inline-flex items-center space-x-2 text-2xl font-bold text-gray-900 dark:text-white hover:text-[#2962FF] dark:hover:text-[#2962FF] transition-colors group tap-highlight-transparent"
          >
            {/* Stylized US Flag Badge */}
            <span className="w-6 h-6 rounded-full overflow-hidden inline-flex border border-gray-200 dark:border-gray-700 shadow-xs flex-shrink-0">
              <svg className="w-full h-full" viewBox="0 0 32 32">
                <rect fill="#bf0a30" height="32" width="32" />
                <rect fill="#fff" height="4.9" width="32" y="4.9" />
                <rect fill="#fff" height="4.9" width="32" y="14.7" />
                <rect fill="#fff" height="4.9" width="32" y="24.5" />
                <rect fill="#002868" height="17" width="14" />
                <circle cx="4" cy="4" fill="#fff" r="1" />
                <circle cx="10" cy="4" fill="#fff" r="1" />
                <circle cx="7" cy="8.5" fill="#fff" r="1" />
                <circle cx="4" cy="13" fill="#fff" r="1" />
                <circle cx="10" cy="13" fill="#fff" r="1" />
              </svg>
            </span>
            <span>US stocks</span>
            <svg
              className="w-5 h-5 transition-transform group-hover:translate-x-1"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              viewBox="0 0 24 24"
            >
              <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        {/* US Stocks Horizontal Slider */}
        <div className="flex space-x-3 overflow-x-auto no-scrollbar px-4 pb-2">
          {US_STOCKS.map((asset) => {
            const isPos = asset.changePercent >= 0;
            return (
              <article
                key={asset.id}
                onClick={() => onSelectAsset(asset)}
                className="flex-shrink-0 w-64 bg-white dark:bg-[#1e222d] border border-gray-200 dark:border-[#2a2e39] rounded-2xl p-4 shadow-xs hover:border-gray-400 dark:hover:border-gray-500 transition-all flex flex-col justify-between cursor-pointer active:scale-[0.99]"
              >
                <div>
                  <div className="flex items-center space-x-2.5">
                    {/* Brand Logos */}
                    {asset.id === 'nvda' && (
                      <div className="w-7 h-7 rounded-full bg-[#131722] flex items-center justify-center p-1 shadow-xs">
                        <svg className="w-full h-full" fill="#76B900" viewBox="0 0 24 24">
                          <path d="M6 16.5C7.2 17.5 9 18 11.2 18c4.2 0 7.5-2.8 7.5-6.8 0-4.3-3.6-6.7-7.8-6.7-3.8 0-6.9 2.5-6.9 5.8 0 2.2 1.4 3.7 3.5 3.7 1.8 0 3-1.1 3-2.6 0-1.1-.8-1.9-2-1.9-.3 0-.6.1-.8.2.3-.9 1.2-1.5 2.3-1.5 1.5 0 2.6 1 2.6 2.3 0 1.9-1.8 3.3-4.1 3.3-2.1 0-3.6-1.3-3.6-3 0-3 2.9-5.1 6.5-5.1 4.1 0 7.3 2.4 7.3 6.1 0 4-3.5 6.6-7.8 6.6-2.5 0-4.6-.7-6-2l1.1-1.4z" />
                        </svg>
                      </div>
                    )}
                    {asset.id === 'aapl' && (
                      <div className="w-7 h-7 rounded-full bg-black dark:bg-white text-white dark:text-black flex items-center justify-center p-1.5 shadow-xs">
                        <svg className="w-full h-full" fill="currentColor" viewBox="0 0 170 170">
                          <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.69-3.04-7.67-7.83-11.96-14.36-6.19-9.5-11-20.47-14.42-32.91-3.43-12.44-5.14-24.16-5.14-35.15 0-14.42 3.5-26.68 10.51-36.78 7.01-10.1 16.03-15.25 27.06-15.46 5.35 0 11.39 1.52 18.11 4.56 6.72 3.04 11.09 4.56 13.11 4.56 1.7 0 6.32-1.63 13.87-4.89 7.55-3.26 13.75-4.66 18.6-4.2 13.79 1.13 24.38 6.46 31.78 15.99-12.16 7.42-18.12 17.65-17.88 30.69.25 10.32 4.16 19.06 11.74 26.23 7.58 7.17 16.63 11.24 27.17 12.22-2.34 7.21-5.13 14.39-8.36 21.55zM119.22 33.15c0-7.3 2.66-14.28 7.99-20.94 5.33-6.66 11.89-10.96 19.68-12.21.32 1.34.48 2.57.48 3.69 0 7.2-2.73 14.17-8.19 20.9-5.46 6.73-12.06 10.92-19.8 12.06-.08-1.17-.16-2.34-.16-3.5z" />
                        </svg>
                      </div>
                    )}
                    {asset.id === 'msft' && (
                      <div className="w-7 h-7 rounded-full bg-gray-100 dark:bg-[#131722] flex items-center justify-center p-1.5 shadow-xs">
                        <div className="grid grid-cols-2 gap-0.5 w-3.5 h-3.5">
                          <div className="bg-[#F25022]" />
                          <div className="bg-[#7FBA00]" />
                          <div className="bg-[#00A4EF]" />
                          <div className="bg-[#FFB900]" />
                        </div>
                      </div>
                    )}
                    {asset.id === 'googl' && (
                      <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-xs shadow-xs">
                        G
                      </div>
                    )}
                    {asset.id === 'amzn' && (
                      <div className="w-7 h-7 rounded-full bg-[#FF9900] text-white flex items-center justify-center font-bold text-xs shadow-xs">
                        a
                      </div>
                    )}

                    <div className="leading-tight">
                      <div className="font-bold text-base text-gray-900 dark:text-white">
                        {asset.ticker}
                      </div>
                      <div className="text-[11px] text-gray-500 dark:text-gray-400 font-medium">
                        {asset.name}
                      </div>
                    </div>
                  </div>

                  <div className="mt-3">
                    <div className="text-xl font-bold text-gray-900 dark:text-white tracking-tight tabular-nums">
                      ${asset.price.toFixed(2)}
                    </div>
                    <div className="flex items-center space-x-1 mt-0.5">
                      <span
                        className={`font-semibold text-xs tabular-nums ${
                          isPos ? 'text-[#089981]' : 'text-[#F23645]'
                        }`}
                      >
                        {isPos ? '+' : ''}
                        {asset.change.toFixed(2)} ({isPos ? '+' : ''}
                        {asset.changePercent.toFixed(2)}%)
                      </span>
                      <span className="text-[10px] text-gray-400 font-medium">
                        {asset.marketCap}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-2 border-t border-gray-100 dark:border-[#2a2e39]">
                  <Sparkline data={asset.sparkline} isPositive={isPos} className="w-full h-10" />
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* SECTION 4: Crypto Section */}
      <section className="mt-9">
        <div className="px-4 mb-3">
          <button
            onClick={onOpenSearch}
            className="inline-flex items-center space-x-1.5 text-2xl font-bold text-gray-900 dark:text-white hover:text-[#2962FF] dark:hover:text-[#2962FF] transition-colors group tap-highlight-transparent"
          >
            <span>Crypto</span>
            <svg
              className="w-5 h-5 transition-transform group-hover:translate-x-1"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              viewBox="0 0 24 24"
            >
              <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        {/* Crypto Horizontal Slider */}
        <div className="flex space-x-3 overflow-x-auto no-scrollbar px-4 pb-2">
          {CRYPTO_ASSETS.map((asset) => {
            const isPos = asset.changePercent >= 0;
            return (
              <article
                key={asset.id}
                onClick={() => onSelectAsset(asset)}
                className="flex-shrink-0 w-64 bg-white dark:bg-[#1e222d] border border-gray-200 dark:border-[#2a2e39] rounded-2xl p-4 shadow-xs hover:border-gray-400 dark:hover:border-gray-500 transition-all flex flex-col justify-between cursor-pointer active:scale-[0.99]"
              >
                <div>
                  <div className="flex items-center space-x-2.5">
                    <div
                      className="w-7 h-7 rounded-full text-white flex items-center justify-center font-bold text-xs shadow-xs"
                      style={{ background: asset.badgeBg }}
                    >
                      {asset.cryptoSymbol}
                    </div>
                    <div className="leading-tight">
                      <div className="font-bold text-base text-gray-900 dark:text-white">
                        {asset.ticker}
                      </div>
                      <div className="text-[11px] text-gray-500 dark:text-gray-400 font-medium">
                        {asset.name}
                      </div>
                    </div>
                  </div>

                  <div className="mt-3">
                    <div className="text-xl font-bold text-gray-900 dark:text-white tracking-tight tabular-nums">
                      ${asset.price.toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </div>
                    <div className="flex items-center space-x-1 mt-0.5">
                      <span
                        className={`font-semibold text-xs tabular-nums ${
                          isPos ? 'text-[#089981]' : 'text-[#F23645]'
                        }`}
                      >
                        {isPos ? '+' : ''}
                        {asset.change.toFixed(2)} ({isPos ? '+' : ''}
                        {asset.changePercent.toFixed(2)}%)
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-4 pt-2 border-t border-gray-100 dark:border-[#2a2e39]">
                  <Sparkline data={asset.sparkline} isPositive={isPos} className="w-full h-10" />
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* SECTION 5: Market Movers Table */}
      <section className="mt-10 px-4">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Market movers</h2>
          <button
            onClick={onOpenSearch}
            className="text-xs font-semibold text-[#2962FF] hover:underline"
          >
            View all
          </button>
        </div>

        {/* Tab Filter Switcher */}
        <div className="flex space-x-2 border-b border-gray-200 dark:border-[#2a2e39] pb-2 mb-3 text-xs font-semibold">
          <button
            onClick={() => setMoversTab('highestVolume')}
            className={`pb-2 -mb-2 px-1 transition-all ${
              moversTab === 'highestVolume'
                ? 'text-[#2962FF] border-b-2 border-[#2962FF]'
                : 'text-gray-500 hover:text-black dark:hover:text-white'
            }`}
          >
            Highest volume
          </button>
          <button
            onClick={() => setMoversTab('topGainers')}
            className={`pb-2 -mb-2 px-2 transition-all ${
              moversTab === 'topGainers'
                ? 'text-[#2962FF] border-b-2 border-[#2962FF]'
                : 'text-gray-500 hover:text-black dark:hover:text-white'
            }`}
          >
            Top gainers
          </button>
          <button
            onClick={() => setMoversTab('topLosers')}
            className={`pb-2 -mb-2 px-2 transition-all ${
              moversTab === 'topLosers'
                ? 'text-[#2962FF] border-b-2 border-[#2962FF]'
                : 'text-gray-500 hover:text-black dark:hover:text-white'
            }`}
          >
            Top losers
          </button>
        </div>

        {/* Table Rows Container */}
        <div className="divide-y divide-gray-100 dark:divide-[#2a2e39]">
          {MARKET_MOVERS[moversTab].map((item) => (
            <div
              key={item.id}
              onClick={() => handleMoverClick(item)}
              className="py-3 flex items-center justify-between cursor-pointer hover:bg-gray-50/70 dark:hover:bg-[#1e222d]/70 px-1 rounded-xl transition-colors"
            >
              <div className="flex items-center space-x-3">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-[10px] shadow-xs"
                  style={{ backgroundColor: item.iconBg, color: item.iconColor }}
                >
                  {item.iconLetter}
                </div>
                <div>
                  <div className="font-bold text-sm text-gray-900 dark:text-white leading-snug">
                    {item.ticker}
                  </div>
                  <div className="text-[11px] text-gray-500 dark:text-gray-400">{item.name}</div>
                </div>
              </div>

              <div className="text-right">
                <div className="text-sm font-semibold text-gray-900 dark:text-white leading-snug tabular-nums">
                  {item.price}
                </div>
                <div
                  className={`inline-block mt-0.5 px-2 py-0.5 rounded text-[11px] font-semibold tabular-nums ${
                    item.isPositive
                      ? 'bg-[#E7F7F4] text-[#089981] dark:bg-emerald-950/60 dark:text-emerald-400'
                      : 'bg-[#FDF0F1] text-[#F23645] dark:bg-rose-950/60 dark:text-rose-400'
                  }`}
                >
                  {item.change}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
};
