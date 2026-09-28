import React, { useState, useEffect, useId } from 'react';
import { MarketAsset, CandlePoint } from '../types/market';
import { FEATURED_INDICES, US_STOCKS, CRYPTO_ASSETS } from '../data/marketData';
import {
  ChevronDown,
  BarChart2,
  TrendingUp,
  Activity,
  Layers,
  SlidersHorizontal,
  Maximize2,
} from 'lucide-react';

interface ChartViewProps {
  initialAsset?: MarketAsset;
  onOpenAssetDetail: (asset: MarketAsset) => void;
}

export const ChartView: React.FC<ChartViewProps> = ({
  initialAsset,
  onOpenAssetDetail,
}) => {
  const gradientId = useId();
  const allAvailable = [...FEATURED_INDICES, ...US_STOCKS, ...CRYPTO_ASSETS];
  const [selectedAsset, setSelectedAsset] = useState<MarketAsset>(
    initialAsset || FEATURED_INDICES[0]
  );
  const [showSymbolPicker, setShowSymbolPicker] = useState<boolean>(false);
  const [timeframe, setTimeframe] = useState<string>('1D');
  const [chartType, setChartType] = useState<'candles' | 'line'>('candles');
  const [showMa20, setShowMa20] = useState<boolean>(true);
  const [showVolume, setShowVolume] = useState<boolean>(true);
  const [hoveredCandle, setHoveredCandle] = useState<CandlePoint | null>(null);
  const [livePrice, setLivePrice] = useState<number>(selectedAsset.price);
  const [flash, setFlash] = useState<'up' | 'down' | null>(null);

  useEffect(() => {
    setLivePrice(selectedAsset.price);
  }, [selectedAsset]);

  // Live price tick
  useEffect(() => {
    const timer = setInterval(() => {
      const deltaPercent = (Math.random() - 0.49) * 0.002;
      const delta = selectedAsset.price * deltaPercent;
      setLivePrice((prev) => {
        const next = Math.max(0.01, prev + delta);
        setFlash(delta >= 0 ? 'up' : 'down');
        setTimeout(() => setFlash(null), 500);
        return parseFloat(next.toFixed(2));
      });
    }, 2500);
    return () => clearInterval(timer);
  }, [selectedAsset]);

  const history: CandlePoint[] =
    selectedAsset.history[timeframe] || selectedAsset.history['1D'] || [];
  const activeCandle = hoveredCandle || history[history.length - 1];

  // Canvas Geometry
  const chartW = 420;
  const chartH = 260;
  const padX = 12;
  const padTop = 15;
  const padBottom = showVolume ? 50 : 20;

  const lows = history.map((c) => c.low);
  const highs = history.map((c) => c.high);
  const minP = Math.min(...lows, livePrice * 0.99);
  const maxP = Math.max(...highs, livePrice * 1.01);
  const rangeP = maxP - minP || 1;

  const maxVol = Math.max(...history.map((c) => c.volume), 1);

  const getY = (val: number) => {
    const usableH = chartH - padTop - padBottom;
    return chartH - padBottom - ((val - minP) / rangeP) * usableH;
  };

  const getX = (idx: number) => {
    if (history.length <= 1) return padX;
    return padX + (idx / (history.length - 1)) * (chartW - padX * 2);
  };

  // MA 20 calculation
  const ma20Points = history.map((_, i) => {
    const window = history.slice(Math.max(0, i - 19), i + 1);
    const avg = window.reduce((sum, c) => sum + c.close, 0) / window.length;
    return { x: getX(i), y: getY(avg) };
  });

  const ma20Path = ma20Points.reduce((acc, pt, i) => {
    return i === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`;
  }, '');

  // Line points for line chart mode
  const linePoints = history.map((c, i) => ({ x: getX(i), y: getY(c.close) }));
  const linePath = linePoints.reduce((acc, pt, i) => {
    return i === 0 ? `M ${pt.x} ${pt.y}` : `${acc} L ${pt.x} ${pt.y}`;
  }, '');
  const areaPath = `${linePath} L ${chartW - padX} ${chartH - padBottom} L ${padX} ${chartH - padBottom} Z`;

  const isPos = selectedAsset.changePercent >= 0;
  const strokeColor = isPos ? '#089981' : '#F23645';

  return (
    <main className="w-full max-w-md mx-auto px-4 pt-4 pb-24">
      {/* Top Symbol Header & Selector */}
      <div className="flex items-center justify-between relative mb-2">
        <button
          onClick={() => setShowSymbolPicker(!showSymbolPicker)}
          className="flex items-center space-x-2 bg-white dark:bg-[#1e222d] border border-gray-200 dark:border-[#2a2e39] px-3 py-1.5 rounded-xl shadow-xs hover:border-[#2962FF]"
        >
          <div className="font-extrabold text-sm text-gray-900 dark:text-white">
            {selectedAsset.ticker}
          </div>
          <span className="text-[10px] text-gray-400 font-medium">
            {selectedAsset.exchange}
          </span>
          <ChevronDown className="w-4 h-4 text-gray-400" />
        </button>

        {/* Quick Details Trigger */}
        <button
          onClick={() => onOpenAssetDetail(selectedAsset)}
          className="text-xs font-semibold text-[#2962FF] hover:underline flex items-center space-x-1"
        >
          <span>Asset info</span>
          <Maximize2 className="w-3.5 h-3.5" />
        </button>

        {/* Symbol Dropdown */}
        {showSymbolPicker && (
          <div className="absolute top-12 left-0 w-64 bg-white dark:bg-[#1e222d] border border-gray-200 dark:border-[#2a2e39] rounded-2xl shadow-2xl z-40 py-2 divide-y divide-gray-100 dark:divide-[#2a2e39] max-h-72 overflow-y-auto no-scrollbar">
            {allAvailable.map((asset) => (
              <button
                key={asset.id}
                onClick={() => {
                  setSelectedAsset(asset);
                  setShowSymbolPicker(false);
                }}
                className={`w-full px-3.5 py-2 text-left flex items-center justify-between hover:bg-gray-50 dark:hover:bg-[#131722]/50 ${
                  selectedAsset.id === asset.id ? 'bg-blue-50/50 dark:bg-blue-950/30' : ''
                }`}
              >
                <div>
                  <div className="font-bold text-xs text-gray-900 dark:text-white">
                    {asset.ticker}
                  </div>
                  <div className="text-[10px] text-gray-400">{asset.name}</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-xs text-gray-800 dark:text-gray-200">
                    ${asset.price.toFixed(2)}
                  </div>
                  <div
                    className={`text-[10px] font-semibold ${
                      asset.changePercent >= 0 ? 'text-[#089981]' : 'text-[#F23645]'
                    }`}
                  >
                    {asset.changePercent >= 0 ? '+' : ''}
                    {asset.changePercent.toFixed(2)}%
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Main Chart Card */}
      <div className="bg-white dark:bg-[#1e222d] border border-gray-200 dark:border-[#2a2e39] rounded-2xl shadow-xs overflow-hidden">
        {/* Price & Change Banner */}
        <div className="p-3.5 border-b border-gray-100 dark:border-[#2a2e39] flex items-baseline justify-between">
          <div>
            <div className="flex items-baseline space-x-2">
              <span
                className={`text-2xl font-black tabular-nums transition-colors duration-200 ${
                  flash === 'up'
                    ? 'text-[#089981]'
                    : flash === 'down'
                    ? 'text-[#F23645]'
                    : 'text-gray-900 dark:text-white'
                }`}
              >
                ${livePrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}
              </span>
              <span className="text-xs text-gray-400 font-semibold">{selectedAsset.currency}</span>
            </div>
            <div
              className={`text-xs font-bold tabular-nums mt-0.5 ${
                isPos ? 'text-[#089981]' : 'text-[#F23645]'
              }`}
            >
              {isPos ? '+' : ''}
              {selectedAsset.change.toFixed(2)} ({isPos ? '+' : ''}
              {selectedAsset.changePercent.toFixed(2)}%)
            </div>
          </div>

          {/* Chart View Mode Controls */}
          <div className="flex items-center space-x-1.5">
            <button
              onClick={() => setChartType(chartType === 'candles' ? 'line' : 'candles')}
              className="p-1.5 rounded-lg border border-gray-200 dark:border-gray-700 text-xs font-semibold text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-[#2a2e39]"
              title="Toggle Candles / Line"
            >
              {chartType === 'candles' ? (
                <BarChart2 className="w-4 h-4 text-[#2962FF]" />
              ) : (
                <TrendingUp className="w-4 h-4 text-[#2962FF]" />
              )}
            </button>

            <button
              onClick={() => setShowMa20(!showMa20)}
              className={`px-2 py-1 rounded-lg border text-[11px] font-bold ${
                showMa20
                  ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 text-amber-600 dark:text-amber-400'
                  : 'border-gray-200 dark:border-gray-700 text-gray-400'
              }`}
            >
              MA20
            </button>

            <button
              onClick={() => setShowVolume(!showVolume)}
              className={`px-2 py-1 rounded-lg border text-[11px] font-bold ${
                showVolume
                  ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-300 text-[#2962FF]'
                  : 'border-gray-200 dark:border-gray-700 text-gray-400'
              }`}
            >
              VOL
            </button>
          </div>
        </div>

        {/* Candle Data Feed Strip */}
        <div className="px-3.5 py-1.5 bg-gray-50/80 dark:bg-[#131722]/80 border-b border-gray-100 dark:border-[#2a2e39] text-[11px] text-gray-500 font-mono flex items-center justify-between tabular-nums">
          <span>{activeCandle?.time || '09:30'}</span>
          {activeCandle && (
            <div className="flex space-x-2">
              <span>O: {activeCandle.open}</span>
              <span>H: {activeCandle.high}</span>
              <span>L: {activeCandle.low}</span>
              <span className={activeCandle.close >= activeCandle.open ? 'text-[#089981] font-bold' : 'text-[#F23645] font-bold'}>
                C: {activeCandle.close}
              </span>
            </div>
          )}
        </div>

        {/* Chart Canvas */}
        <div className="relative w-full h-[260px] bg-white dark:bg-[#1e222d] select-none">
          <svg
            viewBox={`0 0 ${chartW} ${chartH}`}
            className="w-full h-full overflow-visible"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={strokeColor} stopOpacity="0.25" />
                <stop offset="100%" stopColor={strokeColor} stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Grid lines */}
            <line
              x1="0"
              y1={getY(minP + rangeP * 0.75)}
              x2={chartW}
              y2={getY(minP + rangeP * 0.75)}
              stroke="currentColor"
              className="text-gray-100 dark:text-gray-800"
              strokeDasharray="3 3"
            />
            <line
              x1="0"
              y1={getY(minP + rangeP * 0.25)}
              x2={chartW}
              y2={getY(minP + rangeP * 0.25)}
              stroke="currentColor"
              className="text-gray-100 dark:text-gray-800"
              strokeDasharray="3 3"
            />

            {/* Volume Histogram (bottom) */}
            {showVolume &&
              history.map((candle, idx) => {
                const x = getX(idx);
                const volH = (candle.volume / maxVol) * 35;
                const isGreen = candle.close >= candle.open;
                const volColor = isGreen ? 'rgba(8, 153, 129, 0.35)' : 'rgba(242, 54, 69, 0.35)';
                const w = Math.max(chartW / (history.length * 1.5), 3);
                return (
                  <rect
                    key={`vol-${idx}`}
                    x={x - w / 2}
                    y={chartH - volH - 4}
                    width={w}
                    height={volH}
                    fill={volColor}
                  />
                );
              })}

            {/* Price Line or Candlesticks */}
            {chartType === 'line' ? (
              <>
                <path d={areaPath} fill={`url(#${gradientId})`} />
                <path
                  d={linePath}
                  fill="none"
                  stroke={strokeColor}
                  strokeWidth="2.2"
                  strokeLinecap="round"
                />
              </>
            ) : (
              history.map((c, idx) => {
                const x = getX(idx);
                const isGreen = c.close >= c.open;
                const col = isGreen ? '#089981' : '#F23645';
                const yH = getY(c.high);
                const yL = getY(c.low);
                const yO = getY(c.open);
                const yC = getY(c.close);
                const bodyTop = Math.min(yO, yC);
                const bodyH = Math.max(Math.abs(yC - yO), 1.8);
                const w = Math.max(chartW / (history.length * 1.5), 4);

                return (
                  <g key={idx}>
                    <line x1={x} y1={yH} x2={x} y2={yL} stroke={col} strokeWidth="1.2" />
                    <rect
                      x={x - w / 2}
                      y={bodyTop}
                      width={w}
                      height={bodyH}
                      fill={col}
                      rx="0.5"
                    />
                  </g>
                );
              })
            )}

            {/* Moving Average Line */}
            {showMa20 && (
              <path
                d={ma20Path}
                fill="none"
                stroke="#F59E0B"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            )}

            {/* Crosshair indicator on hover */}
            {hoveredCandle && (
              <line
                x1={getX(history.indexOf(hoveredCandle))}
                y1="0"
                x2={getX(history.indexOf(hoveredCandle))}
                y2={chartH}
                stroke="#2962FF"
                strokeWidth="1"
                strokeDasharray="2 2"
              />
            )}
          </svg>

          {/* Interactive Scrub Slots */}
          <div className="absolute inset-0 flex">
            {history.map((c, i) => (
              <div
                key={i}
                className="flex-1 h-full cursor-crosshair"
                onMouseEnter={() => setHoveredCandle(c)}
                onMouseLeave={() => setHoveredCandle(null)}
              />
            ))}
          </div>
        </div>

        {/* Timeframe Bar */}
        <div className="p-2 border-t border-gray-100 dark:border-[#2a2e39] flex items-center justify-between text-xs font-semibold">
          <div className="flex space-x-1">
            {['1D', '5D', '1M', '1Y', 'ALL'].map((tf) => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-3 py-1 rounded-md transition-all ${
                  timeframe === tf
                    ? 'bg-[#131722] dark:bg-white text-white dark:text-[#131722] shadow-xs'
                    : 'text-gray-500 hover:text-black dark:hover:text-white'
                }`}
              >
                {tf}
              </button>
            ))}
          </div>

          <div className="text-[10px] text-gray-400">TradingView Precision</div>
        </div>
      </div>

      {/* Simulated Quick Order Action Bar */}
      <div className="mt-4 grid grid-cols-2 gap-3">
        <button
          onClick={() => alert(`Simulated SELL order for ${selectedAsset.ticker} placed`)}
          className="py-3 px-4 rounded-xl font-bold text-xs bg-[#FDF0F1] dark:bg-rose-950/50 text-[#F23645] border border-rose-200 dark:border-rose-900 shadow-xs hover:bg-rose-100 transition-all flex items-center justify-center space-x-2 cursor-pointer active:scale-95"
        >
          <span>Sell</span>
          <span className="tabular-nums">${(livePrice * 0.999).toFixed(2)}</span>
        </button>

        <button
          onClick={() => alert(`Simulated BUY order for ${selectedAsset.ticker} placed`)}
          className="py-3 px-4 rounded-xl font-bold text-xs bg-[#E7F7F4] dark:bg-emerald-950/50 text-[#089981] border border-emerald-200 dark:border-emerald-900 shadow-xs hover:bg-emerald-100 transition-all flex items-center justify-center space-x-2 cursor-pointer active:scale-95"
        >
          <span>Buy</span>
          <span className="tabular-nums">${(livePrice * 1.001).toFixed(2)}</span>
        </button>
      </div>
    </main>
  );
};
