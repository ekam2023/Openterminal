import React from 'react';
import { NewsItem } from '../types';
import { Globe, RefreshCw, Newspaper } from 'lucide-react';

interface NewsWidgetProps {
  news: NewsItem[];
  loading: boolean;
  onGenerate: () => void;
}

const NewsWidget: React.FC<NewsWidgetProps> = ({ news, loading, onGenerate }) => {
  return (
    <div className="h-full bg-terminal-panel border border-terminal-border flex flex-col rounded-sm overflow-hidden">
      <div className="px-3 py-2 border-b border-terminal-border bg-stone-900/50 flex justify-between items-center">
        <div className="flex items-center text-terminal-accent font-mono text-sm font-bold">
          <Newspaper size={14} className="mr-2" />
          <span>NEWS WIRE</span>
        </div>
        <button 
          onClick={onGenerate}
          disabled={loading}
          className={`text-gray-400 hover:text-white transition-colors ${loading ? 'animate-spin' : ''}`}
        >
          <RefreshCw size={14} />
        </button>
      </div>
      
      <div className="flex-1 overflow-y-auto p-2 space-y-2">
        {loading && news.length === 0 ? (
          <div className="text-center p-4 text-xs font-mono text-gray-500 animate-pulse">
            FETCHING WIRE DATA...
          </div>
        ) : (
          news.map((item) => (
            <div 
              key={item.id} 
              className="p-3 border border-terminal-border/50 bg-black/40 hover:bg-white/5 transition-colors cursor-pointer group"
            >
              <div className="flex justify-between items-start mb-1">
                <span className="text-[10px] font-mono text-terminal-accent bg-terminal-accent/10 px-1 rounded">
                  {item.source}
                </span>
                <span className="text-[10px] font-mono text-gray-500">{item.time}</span>
              </div>
              <h4 className="text-sm font-bold text-gray-200 group-hover:text-white leading-tight mb-2">
                {item.headline}
              </h4>
              <p className="text-xs text-gray-500 line-clamp-2 font-sans">
                {item.summary}
              </p>
              <div className="mt-2 flex justify-end">
                <span className={`text-[9px] font-mono uppercase px-1 ${
                  item.impact === 'POSITIVE' ? 'text-terminal-up' : 
                  item.impact === 'NEGATIVE' ? 'text-terminal-down' : 'text-gray-500'
                }`}>
                  {item.impact} IMPACT
                </span>
              </div>
            </div>
          ))
        )}
        
        {news.length === 0 && !loading && (
          <div className="text-center p-8 text-gray-600 text-xs font-mono">
            NO HEADLINES.<br/>PRESS REFRESH TO GENERATE.
          </div>
        )}
      </div>
    </div>
  );
};

export default NewsWidget;