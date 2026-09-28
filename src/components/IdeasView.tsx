import React, { useState } from 'react';
import { COMMUNITY_IDEAS, FEATURED_INDICES, US_STOCKS, CRYPTO_ASSETS } from '../data/marketData';
import { CommunityIdea, MarketAsset } from '../types/market';
import { ThumbsUp, MessageSquare, TrendingUp, TrendingDown, Plus, Check } from 'lucide-react';

interface IdeasViewProps {
  onSelectAsset: (asset: MarketAsset) => void;
}

export const IdeasView: React.FC<IdeasViewProps> = ({ onSelectAsset }) => {
  const [ideas, setIdeas] = useState<CommunityIdea[]>(COMMUNITY_IDEAS);
  const [likedMap, setLikedMap] = useState<Record<string, boolean>>({});
  const [showNewModal, setShowNewModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newTicker, setNewTicker] = useState('NVDA');
  const [newSentiment, setNewSentiment] = useState<'Long' | 'Short' | 'Neutral'>('Long');
  const [newDesc, setNewDesc] = useState('');

  const toggleLike = (id: string) => {
    setLikedMap((prev) => {
      const isLiked = !!prev[id];
      const next = { ...prev, [id]: !isLiked };
      setIdeas((list) =>
        list.map((item) =>
          item.id === id ? { ...item, likes: item.likes + (isLiked ? -1 : 1) } : item
        )
      );
      return next;
    });
  };

  const handlePostIdea = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newDesc.trim()) return;

    const created: CommunityIdea = {
      id: `idea-${Date.now()}`,
      author: 'You (Trader)',
      authorAvatar: 'YT',
      title: newTitle,
      ticker: newTicker,
      sentiment: newSentiment,
      timeAgo: 'Just now',
      description: newDesc,
      likes: 1,
      comments: 0,
    };

    setIdeas([created, ...ideas]);
    setLikedMap((prev) => ({ ...prev, [created.id]: true }));
    setShowNewModal(false);
    setNewTitle('');
    setNewDesc('');
  };

  const handleTickerClick = (ticker: string) => {
    const found =
      FEATURED_INDICES.find((a) => a.ticker.toUpperCase().includes(ticker.toUpperCase())) ||
      US_STOCKS.find((a) => a.ticker.toUpperCase().includes(ticker.toUpperCase())) ||
      CRYPTO_ASSETS.find((a) => a.ticker.toUpperCase().includes(ticker.toUpperCase()));

    if (found) {
      onSelectAsset(found);
    }
  };

  return (
    <main className="w-full max-w-md mx-auto px-4 pt-6 pb-24">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight text-gray-900 dark:text-white">
            Trading Ideas
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Technical analysis & trade setups from verified creators
          </p>
        </div>

        <button
          onClick={() => setShowNewModal(true)}
          className="px-3 py-1.5 bg-[#2962FF] hover:bg-[#1E53E5] text-white rounded-full text-xs font-bold flex items-center space-x-1 shadow-sm transition-all"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Publish</span>
        </button>
      </div>

      {/* Ideas Feed */}
      <div className="space-y-4">
        {ideas.map((idea) => {
          const isLiked = likedMap[idea.id];
          return (
            <article
              key={idea.id}
              className="p-4 bg-white dark:bg-[#1e222d] border border-gray-200 dark:border-[#2a2e39] rounded-2xl shadow-xs hover:border-gray-400 dark:hover:border-gray-500 transition-all space-y-3"
            >
              {/* Author & Sentiment Row */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 text-white flex items-center justify-center font-bold text-[11px]">
                    {idea.authorAvatar}
                  </div>
                  <div>
                    <div className="font-bold text-xs text-gray-900 dark:text-white">
                      {idea.author}
                    </div>
                    <div className="text-[10px] text-gray-400">{idea.timeAgo}</div>
                  </div>
                </div>

                <div className="flex items-center space-x-1.5">
                  <button
                    onClick={() => handleTickerClick(idea.ticker)}
                    className="text-xs font-bold text-[#2962FF] hover:underline"
                  >
                    ${idea.ticker}
                  </button>
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold flex items-center space-x-0.5 ${
                      idea.sentiment === 'Long'
                        ? 'bg-[#E7F7F4] text-[#089981] dark:bg-emerald-950/60 dark:text-emerald-400'
                        : idea.sentiment === 'Short'
                        ? 'bg-[#FDF0F1] text-[#F23645] dark:bg-rose-950/60 dark:text-rose-400'
                        : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300'
                    }`}
                  >
                    {idea.sentiment === 'Long' && <TrendingUp className="w-3 h-3 mr-0.5" />}
                    {idea.sentiment === 'Short' && <TrendingDown className="w-3 h-3 mr-0.5" />}
                    <span>{idea.sentiment}</span>
                  </span>
                </div>
              </div>

              {/* Title & Body */}
              <div>
                <h3 className="font-bold text-sm text-gray-900 dark:text-white leading-snug">
                  {idea.title}
                </h3>
                <p className="text-xs text-gray-600 dark:text-gray-300 mt-1.5 leading-relaxed">
                  {idea.description}
                </p>
              </div>

              {/* Footer Engagement */}
              <div className="pt-2 border-t border-gray-100 dark:border-[#2a2e39] flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                <button
                  onClick={() => toggleLike(idea.id)}
                  className={`flex items-center space-x-1 font-semibold transition-colors ${
                    isLiked ? 'text-[#2962FF]' : 'hover:text-black dark:hover:text-white'
                  }`}
                >
                  <ThumbsUp className="w-3.5 h-3.5" fill={isLiked ? 'currentColor' : 'none'} />
                  <span>{idea.likes}</span>
                </button>

                <div className="flex items-center space-x-1">
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>{idea.comments} comments</span>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {/* Publish New Idea Modal */}
      {showNewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="fixed inset-0" onClick={() => setShowNewModal(false)} />
          <form
            onSubmit={handlePostIdea}
            className="relative w-full max-w-sm bg-white dark:bg-[#1e222d] border border-gray-200 dark:border-[#2a2e39] rounded-2xl p-5 shadow-2xl z-10 space-y-3"
          >
            <h3 className="font-extrabold text-base text-gray-900 dark:text-white">
              Publish Trade Idea
            </h3>

            <div>
              <label className="block text-[11px] font-bold text-gray-600 dark:text-gray-300 mb-1">
                Headline
              </label>
              <input
                type="text"
                required
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g. S&P 500 support test before rally..."
                className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#131722] text-gray-900 dark:text-white focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] font-bold text-gray-600 dark:text-gray-300 mb-1">
                  Ticker
                </label>
                <select
                  value={newTicker}
                  onChange={(e) => setNewTicker(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#131722] text-gray-900 dark:text-white focus:outline-none font-semibold"
                >
                  <option value="SP500">S&P 500</option>
                  <option value="NASDAQ">Nasdaq 100</option>
                  <option value="NVDA">NVIDIA</option>
                  <option value="AAPL">Apple</option>
                  <option value="BTC">Bitcoin</option>
                  <option value="SOL">Solana</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-bold text-gray-600 dark:text-gray-300 mb-1">
                  Outlook
                </label>
                <select
                  value={newSentiment}
                  onChange={(e) => setNewSentiment(e.target.value as any)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#131722] text-gray-900 dark:text-white focus:outline-none font-semibold"
                >
                  <option value="Long">Long (Bullish)</option>
                  <option value="Short">Short (Bearish)</option>
                  <option value="Neutral">Neutral</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-gray-600 dark:text-gray-300 mb-1">
                Analysis & Setup Notes
              </label>
              <textarea
                rows={3}
                required
                value={newDesc}
                onChange={(e) => setNewDesc(e.target.value)}
                placeholder="Detail key support levels, moving averages, volume confirmation..."
                className="w-full px-3 py-2 text-xs rounded-xl border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-[#131722] text-gray-900 dark:text-white focus:outline-none resize-none"
              />
            </div>

            <div className="pt-2 flex justify-end space-x-2">
              <button
                type="button"
                onClick={() => setShowNewModal(false)}
                className="px-3 py-2 rounded-xl text-xs font-semibold text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-[#2962FF] text-white rounded-xl text-xs font-bold shadow-sm hover:opacity-95"
              >
                Post Idea
              </button>
            </div>
          </form>
        </div>
      )}
    </main>
  );
};
