import React, { useState, useEffect, useId } from 'react';
import { MarketAsset, CandlePoint } from '../types/market';
import { X, Star, Share2, TrendingUp, TrendingDown, Activity, BarChart2 } from 'lucide-react';

interface AssetDetailModalProps {
  asset: MarketAsset | null;
  onClose: () => void;
  isWatchlisted: boolean;
  onToggleWatchlist: (assetId: string) => void;
}

export const AssetDetailModal: React.FC<AssetDetailModalProps> = ({
  asset,
  onClose,
  isWatchlisted,
  onToggleWatchlist,
}) => {
  const gradientId = useId();
  const [selectedTf, setSelectedTf] = useState<string>('1D');
  const [chartType, setChartType] = useState<'line' | 'candles'>('line');
  const [hoveredCandle, setHoveredCandle] = useState<CandlePoint | null>(null);
  const [livePrice, setLivePrice] = useState<number>(asset?.price || 0);
  const [priceFlash, setPriceFlash] = useState<'up' | 'down' | null>(null);
  const [isLiveActive, setIsLiveActive] = useState<boolean>(true);

  // Sync livePrice when asset changes
  useEffect(() => {
    if (asset) {
      setLivePrice(asset.price);
    }
  }, [asset]);

  // Live price tick simulation
  useEffect(() => {
    if (!asset || !isLiveActive) return;

    const interval = setInterval(() => {
      const deltaPercent = (Math.random() - 0.49) * 0.003;
      const delta = asset.price * deltaPercent;
      setLivePrice((prev) => {
        const next = Math.max(0.01, prev + delta);
        setPriceFlash(delta >= 0 ? 'up' : 'down');
        setTimeout(() => setPriceFlash(null), 600);
        return parseFloat(next.toFixed(2));
      });
    }, 2800);

    return () => clearInterval(interval);
  }, [asset, isLiveActive]);

  // Keyboard escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!asset) return null;

  const currentHistory: CandlePoint[] = asset.history[selectedTf] || asset.history['1D'] || [];
  const isPositive = asset.changePercent >= 0;
  const strokeColor = isPositive ? '#089981' : '#F23645';

  // SVG Chart Dimensions
  const chartWidth = 560;
  const chartHeight = 220;
  const paddingX = 10;
  const paddingY = 20;

  // Min / Max calculation
  const allCloses = currentHistory.map((c) => c.close);
  const allHighs = currentHistory.map((c) => c.high);
  const allLows = currentHistory.map((c) => c.low);
  const minPrice = Math.min(...allLows, livePrice * 0.98);
  const maxPrice = Math.max(...allHighs, livePrice * 1.02);
  const priceRange = maxPrice - minPrice || 1;

  const getY = (val: number) => {
    return chartHeight - paddingY - ((val - minPrice) / priceRange) * (chartHeight - paddingY * 2);
  };

  const getX = (index: number) => {
    if (currentHistory.length <= 1) return paddingX;
    return paddingX + (index / (currentHistory.length - 1)) * (chartWidth - paddingX * 2);
  };

  // Line points
  const linePoints = currentHistory.map((c, i) => ({
    x: getX(i),
    y: getY(c.close),
  }));

  const linePath = linePoints.reduce((acc, pt, i) => {
    if (i === 0) return `M ${pt.x.toFixed(1)} ${pt.y.toFixed(1)}`;
    return `${acc} L ${pt.x.toFixed(1)} ${pt.y.toFixed(1)}`;
  }, '');

  const areaPath = `${linePath} L ${chartWidth - paddingX} ${chartHeight} L ${paddingX} ${chartHeight} Z`;

  // Sentiment Color
  const getSentimentColor = (sentiment?: string) => {
    if (sentiment === 'Strong Buy') return 'bg-[#089981] text-white';
    if (sentiment === 'Buy') return 'bg-emerald-500 text-white';
    if (sentiment === 'Neutral') return 'bg-amber-500 text-white';
    if (sentiment === 'Sell') return 'bg-orange-500 text-white';
    return 'bg-[#F23645] text-white';
  };

  const activeCandle = hoveredCandle || currentHistory[currentHistory.length - 1];

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/60 backdrop-blur-sm p-0 sm:p-4 overflow-y-auto">
      {/* Background click to close */}
      <div className="fixed inset-0" onClick={onClose} />

      {/* Main Sheet Container */}
      <div className="relative w-full max-w-xl bg-white dark:bg-[#1e222d] rounded-t-3xl sm:rounded-2xl shadow-2xl border border-gray-200 dark:border-[#2a2e39] overflow-hidden max-h-[92vh] flex flex-col z-10 transition-all">
        {/* Grab Handle for touch */}
        <div className="w-12 h-1.5 bg-gray-300 dark:bg-gray-700 rounded-full mx-auto my-2.5 sm:hidden" />

        {/* Top Header */}
        <div className="px-5 py-3 border-b border-gray-100 dark:border-[#2a2e39] flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {/* Asset Avatar / Badge */}
            {asset.iconType === 'crypto' ? (
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-white text-xs shadow-xs"
                style={{ background: asset.badgeBg || '#F7931A' }}
              >
                {asset.cryptoSymbol || '₿'}
              </div>
            ) : asset.iconType === 'badge' ? (
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-white text-xs shadow-xs"
                style={{ backgroundColor: asset.badgeBg || '#2962FF' }}
              >
                {asset.badgeText}
              </div>
            ) : (
              <div className="w-9 h-9 rounded-full bg-[#131722] text-white flex items-center justify-center font-bold text-xs shadow-xs">
                {asset.ticker.slice(0, 3)}
              </div>
            )}

            <div>
              <div className="flex items-center space-x-2">
                <h3 className="font-extrabold text-lg text-gray-900 dark:text-white leading-tight">
                  {asset.ticker}
                </h3>
                <span className="text-[11px] font-medium text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-[#2a2e39] px-2 py-0.5 rounded">
                  {asset.exchange}
                </span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[200px] sm:max-w-xs">
                {asset.name}
              </p>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onToggleWatchlist(asset.id)}
              className={`p-2 rounded-full border transition-all ${
                isWatchlisted
                  ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 text-amber-500'
                  : 'border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#2a2e39]'
              }`}
              title={isWatchlisted ? 'Remove from watchlist' : 'Add to watchlist'}
            >
              <Star className="w-4 h-4" fill={isWatchlisted ? 'currentColor' : 'none'} />
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-full border border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-[#2a2e39] transition-colors"
              aria-label="Close dialog"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="overflow-y-auto px-5 py-4 space-y-5 no-scrollbar">
          {/* Price & Change Banner */}
          <div className="flex items-baseline justify-between flex-wrap gap-2">
            <div>
              <div className="flex items-baseline space-x-2">
                <span
                  className={`text-3xl font-extrabold tracking-tight transition-colors duration-300 ${
                    priceFlash === 'up'
                      ? 'text-[#089981]'
                      : priceFlash === 'down'
                      ? 'text-[#F23645]'
                      : 'text-gray-900 dark:text-white'
                  }`}
                >
                  {asset.category === 'Crypto' && '$'}
                  {livePrice.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </span>
                <span className="text-sm font-semibold text-gray-500 dark:text-gray-400">
                  {asset.currency}
                </span>

                {/* Live Pulse Dot */}
                <button
                  onClick={() => setIsLiveActive(!isLiveActive)}
                  className="flex items-center space-x-1 px-1.5 py-0.5 rounded text-[10px] font-bold text-gray-500 hover:bg-gray-100 dark:hover:bg-[#2a2e39]"
                  title={isLiveActive ? 'Live simulated feed active' : 'Simulation paused'}
                >
                  <span
                    className={`w-2 h-2 rounded-full ${
                      isLiveActive ? 'bg-emerald-500 animate-pulse' : 'bg-gray-400'
                    }`}
                  />
                  <span>{isLiveActive ? 'LIVE' : 'PAUSED'}</span>
                </button>
              </div>

              <div className="flex items-center space-x-2 mt-1">
                <span
                  className={`inline-flex items-center space-x-1 text-sm font-bold ${
                    isPositive ? 'text-[#089981]' : 'text-[#F23645]'
                  }`}
                >
                  {isPositive ? (
                    <TrendingUp className="w-4 h-4" />
                  ) : (
                    <TrendingDown className="w-4 h-4" />
                  )}
                  <span>
                    {isPositive ? '+' : ''}
                    {asset.change.toFixed(2)} ({isPositive ? '+' : ''}
                    {asset.changePercent.toFixed(2)}%)
                  </span>
                </span>
                <span className="text-xs text-gray-400">Today</span>
              </div>
            </div>

            {/* Chart type controls & sentiment tag */}
            <div className="flex items-center space-x-2">
              {asset.sentiment && (
                <div
                  className={`px-2.5 py-1 rounded-full text-xs font-bold tracking-tight shadow-xs ${getSentimentColor(
                    asset.sentiment
                  )}`}
                >
                  {asset.sentiment}
                </div>
              )}
              <div className="flex items-center bg-gray-100 dark:bg-[#2a2e39] rounded-lg p-0.5 text-xs font-semibold text-gray-600 dark:text-gray-300">
                <button
                  onClick={() => setChartType('line')}
                  className={`px-2 py-1 rounded transition-colors ${
                    chartType === 'line'
                      ? 'bg-white dark:bg-[#131722] text-[#2962FF] shadow-xs'
                      : 'hover:text-black dark:hover:text-white'
                  }`}
                >
                  Line
                </button>
                <button
                  onClick={() => setChartType('candles')}
                  className={`px-2 py-1 rounded transition-colors flex items-center space-x-1 ${
                    chartType === 'candles'
                      ? 'bg-white dark:bg-[#131722] text-[#2962FF] shadow-xs'
                      : 'hover:text-black dark:hover:text-white'
                  }`}
                >
                  <BarChart2 className="w-3.5 h-3.5" />
                  <span>Candles</span>
                </button>
              </div>
            </div>
          </div>

          {/* Interactive Chart Canvas */}
          <div className="bg-gray-50/70 dark:bg-[#131722] border border-gray-100 dark:border-[#2a2e39] rounded-2xl p-3 relative select-none">
            {/* Live Hover Info Kicker */}
            <div className="flex items-center justify-between text-[11px] text-gray-500 dark:text-gray-400 border-b border-gray-200/60 dark:border-gray-800 pb-1.5 mb-2 px-1">
              <span>{activeCandle ? `Time: ${activeCandle.time}` : 'Interactive Chart'}</span>
              {activeCandle && (
                <div className="flex items-center space-x-2.5 font-mono tabular-nums">
                  <span>O: {activeCandle.open}</span>
                  <span>H: {activeCandle.high}</span>
                  <span>L: {activeCandle.low}</span>
                  <span className={activeCandle.close >= activeCandle.open ? 'text-[#089981] font-bold' : 'text-[#F23645] font-bold'}>
                    C: {activeCandle.close}
                  </span>
                </div>
              )}
            </div>

            {/* SVG Chart Render */}
            <div className="relative w-full h-[220px]">
              <svg
                viewBox={`0 0 ${chartWidth} ${chartHeight}`}
                className="w-full h-full overflow-visible"
                preserveAspectRatio="none"
              >
                <defs>
                  <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={strokeColor} stopOpacity="0.28" />
                    <stop offset="100%" stopColor={strokeColor} stopOpacity="0.0" />
                  </linearGradient>
                </defs>

                {/* Horizontal price grid lines */}
                <line
                  x1="0"
                  y1={getY(minPrice + priceRange * 0.75)}
                  x2={chartWidth}
                  y2={getY(minPrice + priceRange * 0.75)}
                  stroke="currentColor"
                  className="text-gray-200 dark:text-gray-800"
                  strokeDasharray="3 3"
                />
                <line
                  x1="0"
                  y1={getY(minPrice + priceRange * 0.25)}
                  x2={chartWidth}
                  y2={getY(minPrice + priceRange * 0.25)}
                  stroke="currentColor"
                  className="text-gray-200 dark:text-gray-800"
                  strokeDasharray="3 3"
                />

                {chartType === 'line' ? (
                  <>
                    <path d={areaPath} fill={`url(#${gradientId})`} />
                    <path
                      d={linePath}
                      fill="none"
                      stroke={strokeColor}
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    {/* Pulsing endpoint */}
                    {linePoints.length > 0 && (
                      <circle
                        cx={linePoints[linePoints.length - 1].x}
                        cy={linePoints[linePoints.length - 1].y}
                        r="4"
                        fill={strokeColor}
                        className="animate-ping"
                        opacity="0.6"
                      />
                    )}
                    {linePoints.length > 0 && (
                      <circle
                        cx={linePoints[linePoints.length - 1].x}
                        cy={linePoints[linePoints.length - 1].y}
                        r="3.5"
                        fill={strokeColor}
                        stroke="#ffffff"
                        strokeWidth="1.5"
                      />
                    )}
                  </>
                ) : (
                  /* Candlesticks Render */
                  currentHistory.map((candle, idx) => {
                    const x = getX(idx);
                    const isGreen = candle.close >= candle.open;
                    const candleColor = isGreen ? '#089981' : '#F23645';
                    const yHigh = getY(candle.high);
                    const yLow = getY(candle.low);
                    const yOpen = getY(candle.open);
                    const yClose = getY(candle.close);
                    const candleTop = Math.min(yOpen, yClose);
                    const candleHeight = Math.max(Math.abs(yClose - yOpen), 2);
                    const candleWidth = Math.max(chartWidth / (currentHistory.length * 1.6), 4);

                    return (
                      <g key={idx}>
                        {/* Upper and Lower Wick */}
                        <line
                          x1={x}
                          y1={yHigh}
                          x2={x}
                          y2={yLow}
                          stroke={candleColor}
                          strokeWidth="1.2"
                        />
                        {/* Body */}
                        <rect
                          x={x - candleWidth / 2}
                          y={candleTop}
                          width={candleWidth}
                          height={candleHeight}
                          fill={candleColor}
                          rx="0.5"
                        />
                      </g>
                    );
                  })
                )}

                {/* Hover interactive vertical line indicator */}
                {hoveredCandle && (
                  <line
                    x1={getX(currentHistory.indexOf(hoveredCandle))}
                    y1="0"
                    x2={getX(currentHistory.indexOf(hoveredCandle))}
                    y2={chartHeight}
                    stroke="#2962FF"
                    strokeWidth="1"
                    strokeDasharray="2 2"
                  />
                )}
              </svg>

              {/* Invisible interactive hover scrub slots */}
              <div className="absolute inset-0 flex">
                {currentHistory.map((c, i) => (
                  <div
                    key={i}
                    className="flex-1 h-full cursor-crosshair"
                    onMouseEnter={() => setHoveredCandle(c)}
                    onMouseLeave={() => setHoveredCandle(null)}
                  />
                ))}
              </div>
            </div>

            {/* Timeframe Selector Pills */}
            <div className="mt-3 pt-2 border-t border-gray-100 dark:border-[#2a2e39] flex items-center justify-between">
              <div className="flex space-x-1">
                {['1D', '5D', '1M', '1Y', 'ALL'].map((tf) => (
                  <button
                    key={tf}
                    onClick={() => setSelectedTf(tf)}
                    className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${
                      selectedTf === tf
                        ? 'bg-[#131722] dark:bg-white text-white dark:text-[#131722] shadow-xs'
                        : 'text-gray-500 hover:text-black dark:hover:text-white'
                    }`}
                  >
                    {tf}
                  </button>
                ))}
              </div>

              <div className="text-[11px] font-medium text-gray-400 dark:text-gray-500">
                TradingView Feed
              </div>
            </div>
          </div>

          {/* Key Statistics Grid */}
          <div className="bg-gray-50 dark:bg-[#131722]/50 border border-gray-100 dark:border-[#2a2e39] rounded-2xl p-4">
            <h4 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
              Key Statistics
            </h4>

            {/* Day's Range Visual Bar */}
            <div className="mb-4">
              <div className="flex justify-between text-xs font-medium text-gray-600 dark:text-gray-300 mb-1">
                <span>Day Low: ${asset.dayLow?.toLocaleString() || (livePrice * 0.98).toFixed(2)}</span>
                <span>Day High: ${asset.dayHigh?.toLocaleString() || (livePrice * 1.02).toFixed(2)}</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 h-2 rounded-full overflow-hidden relative">
                <div
                  className="bg-[#2962FF] h-full rounded-full"
                  style={{
                    width: `${Math.min(
                      Math.max(
                        (((livePrice - (asset.dayLow || livePrice * 0.98)) /
                          ((asset.dayHigh || livePrice * 1.02) - (asset.dayLow || livePrice * 0.98))) *
                          100) || 50,
                        5
                      ),
                      95
                    )}%`,
                  }}
                />
              </div>
            </div>

            {/* 4-Stat Metric Box */}
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="bg-white dark:bg-[#1e222d] p-2.5 rounded-xl border border-gray-100 dark:border-[#2a2e39]">
                <div className="text-gray-400">52-Wk Range</div>
                <div className="font-bold text-gray-800 dark:text-gray-200 mt-0.5">
                  ${asset.yearLow?.toLocaleString() || '---'} – ${asset.yearHigh?.toLocaleString() || '---'}
                </div>
              </div>

              <div className="bg-white dark:bg-[#1e222d] p-2.5 rounded-xl border border-gray-100 dark:border-[#2a2e39]">
                <div className="text-gray-400">Market Cap / Vol</div>
                <div className="font-bold text-gray-800 dark:text-gray-200 mt-0.5">
                  {asset.marketCap || 'Active Liquidity'}
                </div>
              </div>

              <div className="bg-white dark:bg-[#1e222d] p-2.5 rounded-xl border border-gray-100 dark:border-[#2a2e39]">
                <div className="text-gray-400">P/E Ratio</div>
                <div className="font-bold text-gray-800 dark:text-gray-200 mt-0.5">
                  {asset.peRatio ? asset.peRatio.toFixed(1) : 'N/A'}
                </div>
              </div>

              <div className="bg-white dark:bg-[#1e222d] p-2.5 rounded-xl border border-gray-100 dark:border-[#2a2e39]">
                <div className="text-gray-400">Dividend Yield</div>
                <div className="font-bold text-gray-800 dark:text-gray-200 mt-0.5">
                  {asset.dividendYield || '0.00%'}
                </div>
              </div>
            </div>
          </div>

          {/* About Section */}
          {asset.description && (
            <div className="text-xs leading-relaxed text-gray-600 dark:text-gray-400">
              <h4 className="font-bold text-gray-800 dark:text-gray-200 mb-1 text-sm">
                About {asset.name}
              </h4>
              <p>{asset.description}</p>
            </div>
          )}
        </div>

        {/* Sticky Action Footer */}
        <div className="p-4 border-t border-gray-100 dark:border-[#2a2e39] bg-white/95 dark:bg-[#1e222d]/95 backdrop-blur flex items-center space-x-3">
          <button
            onClick={() => onToggleWatchlist(asset.id)}
            className={`flex-1 py-3 px-4 rounded-xl font-bold text-sm transition-all flex items-center justify-center space-x-2 ${
              isWatchlisted
                ? 'bg-gray-100 dark:bg-[#2a2e39] text-gray-700 dark:text-gray-200 hover:bg-gray-200'
                : 'bg-gray-100 dark:bg-[#2a2e39] text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            <Star className="w-4 h-4" fill={isWatchlisted ? 'currentColor' : 'none'} />
            <span>{isWatchlisted ? 'In Watchlist' : 'Add to Watchlist'}</span>
          </button>

          <button
            onClick={() => {
              alert(`Simulated order triggered for ${asset.ticker} at $${livePrice}`);
            }}
            className="flex-1 py-3 px-4 rounded-xl font-bold text-sm bg-gradient-to-r from-[#2962FF] to-[#9924FF] text-white shadow-md hover:opacity-95 active:scale-95 transition-all text-center flex items-center justify-center space-x-1.5"
          >
            <Activity className="w-4 h-4" />
            <span>Trade {asset.ticker}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
