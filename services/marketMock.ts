import { StockData } from "../types";

const INITIAL_STOCKS: Partial<StockData>[] = [
  { symbol: 'AAPL', name: 'Apple Inc.', price: 175.50, sector: 'Technology' },
  { symbol: 'MSFT', name: 'Microsoft Corp.', price: 380.20, sector: 'Technology' },
  { symbol: 'GOOGL', name: 'Alphabet Inc.', price: 140.10, sector: 'Technology' },
  { symbol: 'AMZN', name: 'Amazon.com', price: 155.30, sector: 'Consumer Cyclical' },
  { symbol: 'TSLA', name: 'Tesla Inc.', price: 210.80, sector: 'Consumer Cyclical' },
  { symbol: 'NVDA', name: 'NVIDIA Corp.', price: 650.00, sector: 'Technology' },
  { symbol: 'JPM', name: 'JPMorgan Chase', price: 170.40, sector: 'Financial' },
  { symbol: 'V', name: 'Visa Inc.', price: 280.10, sector: 'Financial' },
  { symbol: 'BTC', name: 'Bitcoin USD', price: 52000.00, sector: 'Crypto' },
  { symbol: 'ETH', name: 'Ethereum USD', price: 2800.00, sector: 'Crypto' },
];

// Helper to generate initial history
const generateHistory = (basePrice: number, points: number = 50) => {
  let currentPrice = basePrice;
  const history = [];
  const now = new Date();
  for (let i = points; i > 0; i--) {
    const time = new Date(now.getTime() - i * 60000); // 1 minute intervals
    const volatility = basePrice * 0.002;
    const change = (Math.random() - 0.5) * volatility;
    currentPrice += change;
    history.push({
      time: time.getHours() + ':' + time.getMinutes().toString().padStart(2, '0'),
      price: currentPrice
    });
  }
  return history;
};

export const initializeMarket = (): Map<string, StockData> => {
  const map = new Map<string, StockData>();
  INITIAL_STOCKS.forEach(s => {
    const history = generateHistory(s.price!);
    const currentPrice = history[history.length - 1].price;
    const openPrice = history[0].price;
    const change = currentPrice - openPrice;
    
    map.set(s.symbol!, {
      symbol: s.symbol!,
      name: s.name!,
      price: currentPrice,
      change: change,
      changePercent: (change / openPrice) * 100,
      volume: Math.floor(Math.random() * 10000000),
      history: history,
      sector: s.sector!
    });
  });
  return map;
};

export const tickMarket = (currentStocks: Map<string, StockData>): Map<string, StockData> => {
  const newMap = new Map(currentStocks);
  
  newMap.forEach((stock, symbol) => {
    const volatility = stock.price * 0.0008; // 0.08% volatility per tick
    const change = (Math.random() - 0.5) * volatility;
    const newPrice = stock.price + change;
    
    const now = new Date();
    const timeStr = now.getHours() + ':' + now.getMinutes().toString().padStart(2, '0');
    
    // Update history, keep last 50 points
    const newHistory = [...stock.history, { time: timeStr, price: newPrice }].slice(-50);
    
    const openPrice = newHistory[0].price;
    const totalChange = newPrice - openPrice;

    newMap.set(symbol, {
      ...stock,
      price: newPrice,
      change: totalChange,
      changePercent: (totalChange / openPrice) * 100,
      history: newHistory,
      volume: stock.volume + Math.floor(Math.random() * 5000)
    });
  });

  return newMap;
};
