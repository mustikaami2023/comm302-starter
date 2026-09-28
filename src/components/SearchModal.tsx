import React, { useState, useMemo } from 'react';
import { MarketAsset } from '../types/market';
import { Search, X, TrendingUp, ArrowRight } from 'lucide-react';
import { FEATURED_INDICES, WORLD_INDICES, US_STOCKS, CRYPTO_ASSETS } from '../data/marketData';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectAsset: (asset: MarketAsset) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onSelectAsset,
}) => {
  const [query, setQuery] = useState('');
  const [filterType, setFilterType] = useState<'All' | 'Stocks' | 'Crypto' | 'Indices'>('All');

  // Combined searchable assets
  const allAssets = useMemo(() => {
    return [...FEATURED_INDICES, ...WORLD_INDICES, ...US_STOCKS, ...CRYPTO_ASSETS];
  }, []);

  const filteredAssets = useMemo(() => {
    return allAssets.filter((item) => {
      const matchesQuery =
        item.ticker.toLowerCase().includes(query.toLowerCase()) ||
        item.name.toLowerCase().includes(query.toLowerCase()) ||
        item.exchange.toLowerCase().includes(query.toLowerCase());

      if (!matchesQuery) return false;
      if (filterType === 'All') return true;
      if (filterType === 'Stocks' && item.category === 'Stocks') return true;
      if (filterType === 'Crypto' && item.category === 'Crypto') return true;
      if (filterType === 'Indices' && item.category === 'Indices') return true;
      return false;
    });
  }, [allAssets, query, filterType]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 backdrop-blur-sm p-4 pt-12 sm:pt-20">
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative w-full max-w-lg bg-white dark:bg-[#1e222d] rounded-2xl shadow-2xl border border-gray-200 dark:border-[#2a2e39] overflow-hidden z-10 flex flex-col max-h-[80vh]">
        {/* Search Input Bar */}
        <div className="p-3.5 border-b border-gray-100 dark:border-[#2a2e39] flex items-center space-x-3">
          <Search className="w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search markets, stocks, crypto, indices..."
            autoFocus
            className="flex-1 bg-transparent text-sm font-semibold text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="text-xs font-bold text-gray-500 hover:text-black dark:hover:text-white px-2 py-1 rounded"
          >
            Cancel
          </button>
        </div>

        {/* Filter Pills */}
        <div className="px-4 py-2 border-b border-gray-100 dark:border-[#2a2e39] flex space-x-2 overflow-x-auto no-scrollbar text-xs">
          {(['All', 'Stocks', 'Crypto', 'Indices'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-3 py-1 rounded-full font-semibold transition-colors ${
                filterType === type
                  ? 'bg-[#131722] dark:bg-white text-white dark:text-[#131722]'
                  : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#2a2e39]'
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div className="overflow-y-auto p-2 divide-y divide-gray-100 dark:divide-[#2a2e39] no-scrollbar">
          {filteredAssets.length > 0 ? (
            filteredAssets.map((asset) => (
              <button
                key={asset.id}
                onClick={() => {
                  onSelectAsset(asset);
                  onClose();
                }}
                className="w-full px-3 py-2.5 flex items-center justify-between text-left hover:bg-gray-50 dark:hover:bg-[#131722]/50 rounded-xl transition-colors group"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-[#2a2e39] flex items-center justify-center font-bold text-xs text-gray-800 dark:text-gray-200">
                    {asset.iconType === 'crypto'
                      ? asset.cryptoSymbol || '₿'
                      : asset.ticker.slice(0, 3)}
                  </div>
                  <div>
                    <div className="font-bold text-sm text-gray-900 dark:text-white flex items-center space-x-2">
                      <span>{asset.ticker}</span>
                      <span className="text-[10px] text-gray-400 font-normal">
                        {asset.exchange}
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[200px]">
                      {asset.name}
                    </div>
                  </div>
                </div>

                <div className="text-right">
                  <div className="font-bold text-sm text-gray-900 dark:text-white">
                    {asset.category === 'Crypto' && '$'}
                    {asset.price.toLocaleString()}
                  </div>
                  <div
                    className={`text-xs font-semibold ${
                      asset.changePercent >= 0 ? 'text-[#089981]' : 'text-[#F23645]'
                    }`}
                  >
                    {asset.changePercent >= 0 ? '+' : ''}
                    {asset.changePercent.toFixed(2)}%
                  </div>
                </div>
              </button>
            ))
          ) : (
            <div className="py-8 text-center text-sm text-gray-500">
              No symbols matching "{query}"
            </div>
          )}
        </div>

        {/* Quick Trending Footer */}
        <div className="p-3 bg-gray-50 dark:bg-[#131722] border-t border-gray-100 dark:border-[#2a2e39] flex items-center justify-between text-xs text-gray-500">
          <span className="flex items-center space-x-1 font-semibold">
            <TrendingUp className="w-3.5 h-3.5 text-[#2962FF]" />
            <span>Trending:</span>
          </span>
          <div className="flex items-center space-x-2">
            {['NVDA', 'BTC', 'SP500', 'AAPL'].map((sym) => (
              <button
                key={sym}
                onClick={() => setQuery(sym)}
                className="hover:underline text-gray-700 dark:text-gray-300 font-bold"
              >
                ${sym}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
