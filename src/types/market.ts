export type MarketCategory =
  | 'Indices'
  | 'Futures'
  | 'Forex'
  | 'Government bonds'
  | 'Crypto'
  | 'Stocks';

export interface CandlePoint {
  time: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
}

export interface SparklinePoint {
  x: number;
  y: number;
}

export interface MarketAsset {
  id: string;
  ticker: string;
  name: string;
  exchange: string;
  category: MarketCategory;
  price: number;
  change: number;
  changePercent: number;
  currency: string;
  sparkline: number[]; // 10-15 normalized values
  marketCap?: string;
  badgeText?: string;
  badgeBg?: string;
  badgeColor?: string;
  iconType?: 'badge' | 'logo' | 'crypto' | 'text';
  logoSvg?: string;
  cryptoSymbol?: string;
  volume24h?: string;
  dayLow?: number;
  dayHigh?: number;
  yearLow?: number;
  yearHigh?: number;
  peRatio?: number;
  dividendYield?: string;
  sentiment?: 'Strong Buy' | 'Buy' | 'Neutral' | 'Sell' | 'Strong Sell';
  description?: string;
  history: Record<string, CandlePoint[]>; // '1D', '5D', '1M', '1Y', 'ALL'
}

export interface NewsItem {
  id: string;
  title: string;
  source: string;
  timeAgo: string;
  category: string;
  summary: string;
  url?: string;
  relatedTickers: string[];
}

export interface CommunityIdea {
  id: string;
  author: string;
  authorAvatar: string;
  title: string;
  ticker: string;
  sentiment: 'Long' | 'Short' | 'Neutral';
  timeAgo: string;
  description: string;
  likes: number;
  comments: number;
  chartPreview?: string;
}
