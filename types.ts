export interface StockData {
  symbol: string;
  name: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
  history: { time: string; price: number }[];
  sector: string;
  details?: string;
}

export interface NewsItem {
  id: string;
  headline: string;
  source: string;
  time: string;
  summary: string;
  impact: 'POSITIVE' | 'NEGATIVE' | 'NEUTRAL';
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
  isThinking?: boolean;
}

export enum ViewMode {
  DASHBOARD = 'DASHBOARD',
  ANALYSIS = 'ANALYSIS',
  NEWS = 'NEWS'
}

export interface MarketContextType {
  stocks: Map<string, StockData>;
  selectedSymbol: string;
  selectSymbol: (symbol: string) => void;
  marketStatus: 'OPEN' | 'CLOSED' | 'PRE-MARKET';
}