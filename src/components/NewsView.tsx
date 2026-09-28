import React, { useState } from 'react';
import { NEWS_FEED, FEATURED_INDICES, US_STOCKS, CRYPTO_ASSETS } from '../data/marketData';
import { NewsItem, MarketAsset } from '../types/market';
import { Flame, Clock, ExternalLink, X, Bookmark } from 'lucide-react';

interface NewsViewProps {
  onSelectAsset: (asset: MarketAsset) => void;
}

export const NewsView: React.FC<NewsViewProps> = ({ onSelectAsset }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedNews, setSelectedNews] = useState<NewsItem | null>(null);

  const categories = ['All', 'Stocks', 'Crypto', 'Economy', 'Tech'];

  const filteredNews = NEWS_FEED.filter((n) =>
    selectedCategory === 'All' ? true : n.category === selectedCategory
  );

  const handleTickerClick = (ticker: string) => {
    const clean = ticker.replace('$', '').toUpperCase();
    const found =
      FEATURED_INDICES.find((a) => a.ticker.toUpperCase().includes(clean)) ||
      US_STOCKS.find((a) => a.ticker.toUpperCase().includes(clean)) ||
      CRYPTO_ASSETS.find((a) => a.ticker.toUpperCase().includes(clean));

    if (found) {
      onSelectAsset(found);
    }
  };

  return (
    <main className="w-full max-w-md mx-auto px-4 pt-6 pb-24">
      {/* Title */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white flex items-center space-x-2">
            <span>Market News</span>
            <Flame className="w-5 h-5 text-amber-500" />
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Real-time macroeconomic reporting & corporate filings
          </p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar py-1 pb-3 text-xs font-semibold border-b border-gray-100 dark:border-[#2a2e39] mb-4">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-3 py-1.5 rounded-full transition-colors whitespace-nowrap ${
              selectedCategory === cat
                ? 'bg-[#131722] dark:bg-white text-white dark:text-[#131722] shadow-xs'
                : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#2a2e39]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* News Stream List */}
      <div className="space-y-3.5">
        {filteredNews.map((news) => (
          <article
            key={news.id}
            onClick={() => setSelectedNews(news)}
            className="p-4 bg-white dark:bg-[#1e222d] border border-gray-200 dark:border-[#2a2e39] rounded-2xl shadow-xs hover:border-gray-400 dark:hover:border-gray-500 transition-all cursor-pointer"
          >
            <div className="flex items-center justify-between text-[11px] text-gray-500 dark:text-gray-400 mb-2">
              <span className="font-bold text-[#2962FF]">{news.source}</span>
              <div className="flex items-center space-x-1">
                <Clock className="w-3 h-3" />
                <span>{news.timeAgo}</span>
              </div>
            </div>

            <h3 className="font-bold text-sm text-gray-900 dark:text-white leading-snug mb-1.5">
              {news.title}
            </h3>

            <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-2 leading-relaxed mb-3">
              {news.summary}
            </p>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1.5">
                {news.relatedTickers.map((t) => (
                  <button
                    key={t}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleTickerClick(t);
                    }}
                    className="text-[10px] font-bold bg-blue-50 dark:bg-blue-950/60 text-[#2962FF] px-2 py-0.5 rounded-md hover:underline"
                  >
                    ${t}
                  </button>
                ))}
              </div>

              <span className="text-[11px] font-semibold text-gray-400 hover:text-black dark:hover:text-white flex items-center space-x-1">
                <span>Read story</span>
                <ExternalLink className="w-3 h-3" />
              </span>
            </div>
          </article>
        ))}
      </div>

      {/* News Reader Modal */}
      {selectedNews && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-xs p-0 sm:p-4">
          <div className="fixed inset-0" onClick={() => setSelectedNews(null)} />
          <div className="relative w-full max-w-lg bg-white dark:bg-[#1e222d] rounded-t-3xl sm:rounded-2xl p-6 shadow-2xl border border-gray-200 dark:border-[#2a2e39] z-10 space-y-4">
            <div className="flex justify-between items-start">
              <div>
                <span className="text-xs font-bold text-[#2962FF]">{selectedNews.source}</span>
                <span className="text-xs text-gray-400 ml-2">· {selectedNews.timeAgo}</span>
              </div>
              <button
                onClick={() => setSelectedNews(null)}
                className="text-gray-400 hover:text-black dark:hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <h2 className="text-lg font-extrabold text-gray-900 dark:text-white leading-tight">
              {selectedNews.title}
            </h2>

            <div className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed space-y-3">
              <p>{selectedNews.summary}</p>
              <p>
                Traders worldwide continue to monitor macroeconomic prints, corporate earnings
                calls, and liquidity trends in conjunction with proprietary algorithmic signals
                across institutional desks.
              </p>
            </div>

            <div className="pt-3 border-t border-gray-100 dark:border-[#2a2e39] flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-xs text-gray-500">Related:</span>
                {selectedNews.relatedTickers.map((t) => (
                  <button
                    key={t}
                    onClick={() => {
                      setSelectedNews(null);
                      handleTickerClick(t);
                    }}
                    className="text-xs font-bold text-[#2962FF] underline"
                  >
                    ${t}
                  </button>
                ))}
              </div>
              <button
                onClick={() => setSelectedNews(null)}
                className="px-4 py-2 bg-gray-100 dark:bg-[#2a2e39] text-gray-900 dark:text-white rounded-xl text-xs font-bold"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};
