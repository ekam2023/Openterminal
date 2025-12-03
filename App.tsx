import React, { useState, useEffect } from 'react';
import { initializeMarket, tickMarket } from './services/marketMock';
import { generateMarketAnalysis, generateHeadlines } from './services/geminiService';
import { StockData, NewsItem } from './types';
import CommandBar from './components/CommandBar';
import WatchList from './components/WatchList';
import ChartWidget from './components/ChartWidget';
import NewsWidget from './components/NewsWidget';
import AnalysisPanel from './components/AnalysisPanel';

const App: React.FC = () => {
  // --- State ---
  const [stocks, setStocks] = useState<Map<string, StockData>>(new Map());
  const [selectedSymbol, setSelectedSymbol] = useState<string>('AAPL');
  const [news, setNews] = useState<NewsItem[]>([]);
  
  // Analysis State
  const [analysisContent, setAnalysisContent] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [isFetchingNews, setIsFetchingNews] = useState<boolean>(false);

  // --- Initialization ---
  useEffect(() => {
    // Initialize Market Data
    const initialStocks = initializeMarket();
    setStocks(initialStocks);

    // Initial Analysis for default stock
    const defaultStock = initialStocks.get('AAPL');
    if (defaultStock) {
      handleAnalysis(defaultStock, "Provide a brief intraday technical summary.");
    }

    // Initial News
    handleNewsRefresh(Array.from(initialStocks.values()).slice(0, 5));
  }, []);

  // --- Market Ticker Loop ---
  useEffect(() => {
    const interval = setInterval(() => {
      setStocks(current => tickMarket(current));
    }, 1500); // 1.5s tick rate for realism
    return () => clearInterval(interval);
  }, []);

  // --- Actions ---

  const handleAnalysis = async (stock: StockData, query: string) => {
    setIsAnalyzing(true);
    setAnalysisContent(''); // Clear previous
    try {
      const result = await generateMarketAnalysis(stock, query);
      setAnalysisContent(result);
    } catch (e) {
      setAnalysisContent("Error connecting to intelligence network.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleNewsRefresh = async (stockList?: StockData[]) => {
    setIsFetchingNews(true);
    try {
      // Explicitly type targets to fix inference issue where it might be seen as unknown[]
      const targets: StockData[] = stockList || Array.from(stocks.values()).sort(() => 0.5 - Math.random()).slice(0, 4);
      const headlines = await generateHeadlines(targets);
      setNews(prev => [...headlines, ...prev].slice(0, 20)); // Keep last 20
    } catch (e) {
      console.error(e);
    } finally {
      setIsFetchingNews(false);
    }
  };

  const handleSymbolSelect = (symbol: string) => {
    if (stocks.has(symbol) && symbol !== selectedSymbol) {
      setSelectedSymbol(symbol);
      const stock = stocks.get(symbol);
      if (stock) {
        // Automatically analyze new selection
        handleAnalysis(stock, "Quick technical outlook.");
      }
    }
  };

  const handleCommand = (cmd: string) => {
    // 1. Check if command is a symbol
    if (stocks.has(cmd)) {
      handleSymbolSelect(cmd);
      return;
    }

    // 2. Check for keywords
    if (cmd === 'NEWS') {
      handleNewsRefresh();
      return;
    }

    // 3. Treat as natural language query for the *current* stock
    const currentStock = stocks.get(selectedSymbol);
    if (currentStock) {
      handleAnalysis(currentStock, cmd);
    }
  };

  // --- Render ---
  const currentStock = stocks.get(selectedSymbol);

  if (!currentStock) return <div className="bg-black text-white h-screen flex items-center justify-center">INITIALIZING TERMINAL...</div>;

  return (
    <div className="flex flex-col h-screen w-full bg-terminal-bg text-terminal-text overflow-hidden font-sans">
      {/* Command Bar */}
      <CommandBar 
        onCommand={handleCommand} 
        selectedSymbol={selectedSymbol}
      />

      {/* Main Grid */}
      <div className="flex-1 p-2 grid grid-cols-12 gap-2 overflow-hidden">
        
        {/* Left Column: WatchList (2 cols) */}
        <div className="col-span-3 lg:col-span-2 h-full min-w-[200px]">
          <WatchList 
            stocks={Array.from(stocks.values())} 
            selectedSymbol={selectedSymbol} 
            onSelect={handleSymbolSelect}
          />
        </div>

        {/* Center Column: Chart & Analysis (7 cols) */}
        <div className="col-span-6 lg:col-span-7 flex flex-col gap-2 h-full">
          {/* Top: Chart */}
          <div className="h-3/5 min-h-[300px]">
            <ChartWidget data={currentStock} />
          </div>
          
          {/* Bottom: AI Analysis */}
          <div className="h-2/5 min-h-[200px]">
            <AnalysisPanel 
              content={analysisContent} 
              loading={isAnalyzing} 
              symbol={selectedSymbol}
            />
          </div>
        </div>

        {/* Right Column: News (3 cols) */}
        <div className="col-span-3 h-full min-w-[250px]">
          <NewsWidget 
            news={news} 
            loading={isFetchingNews} 
            onGenerate={() => handleNewsRefresh()}
          />
        </div>

      </div>
      
      {/* Status Footer */}
      <div className="h-6 bg-terminal-panel border-t border-terminal-border flex items-center px-4 text-[10px] font-mono text-gray-500 justify-between select-none">
        <div className="flex space-x-4">
          <span><span className="text-terminal-accent">MODE:</span> REAL-TIME</span>
          <span><span className="text-terminal-accent">NET:</span> 12ms</span>
          <span><span className="text-terminal-accent">KEYS:</span> BLBG</span>
        </div>
        <div>
          OPENTERMINAL V1.0.4 | <span className="text-terminal-up">SYSTEM OPTIMAL</span>
        </div>
      </div>
    </div>
  );
};

export default App;