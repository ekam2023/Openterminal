import React from 'react';
import { StockData } from '../types';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface WatchListProps {
  stocks: StockData[];
  selectedSymbol: string;
  onSelect: (symbol: string) => void;
}

const WatchList: React.FC<WatchListProps> = ({ stocks, selectedSymbol, onSelect }) => {
  return (
    <div className="h-full bg-terminal-panel border border-terminal-border flex flex-col rounded-sm overflow-hidden">
      <div className="px-3 py-2 border-b border-terminal-border bg-stone-900/50">
        <h3 className="font-mono text-sm font-bold text-terminal-accent">MONITOR</h3>
      </div>
      <div className="flex-1 overflow-y-auto">
        <table className="w-full text-left border-collapse">
          <thead className="bg-black sticky top-0 z-10 text-xs font-mono text-gray-500 border-b border-terminal-border">
            <tr>
              <th className="p-2">Ticker</th>
              <th className="p-2 text-right">Last</th>
              <th className="p-2 text-right">Chg%</th>
            </tr>
          </thead>
          <tbody className="font-mono text-sm">
            {stocks.map((stock) => {
              const isUp = stock.change >= 0;
              const isSelected = selectedSymbol === stock.symbol;
              
              return (
                <tr 
                  key={stock.symbol}
                  onClick={() => onSelect(stock.symbol)}
                  className={`
                    cursor-pointer transition-colors border-b border-terminal-border/30 hover:bg-white/5
                    ${isSelected ? 'bg-terminal-highlight border-l-2 border-l-terminal-accent' : 'border-l-2 border-l-transparent'}
                  `}
                >
                  <td className="p-2 font-bold text-white">
                    {stock.symbol}
                    <div className="text-[10px] text-gray-500 font-sans truncate max-w-[80px]">{stock.name}</div>
                  </td>
                  <td className={`p-2 text-right ${isUp ? 'text-terminal-up' : 'text-terminal-down'}`}>
                    {stock.price.toFixed(2)}
                  </td>
                  <td className={`p-2 text-right flex items-center justify-end gap-1 ${isUp ? 'bg-green-900/20 text-terminal-up' : 'bg-red-900/20 text-terminal-down'}`}>
                    {isUp ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
                    {Math.abs(stock.changePercent).toFixed(2)}%
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default WatchList;
