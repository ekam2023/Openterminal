import React, { useRef, useEffect } from 'react';
import { Terminal, Cpu } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface AnalysisPanelProps {
  content: string;
  loading: boolean;
  symbol: string;
}

const AnalysisPanel: React.FC<AnalysisPanelProps> = ({ content, loading, symbol }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [content]);

  return (
    <div className="h-full bg-terminal-panel border border-terminal-border flex flex-col rounded-sm overflow-hidden">
      <div className="px-3 py-2 border-b border-terminal-border bg-stone-900/50 flex justify-between items-center">
        <div className="flex items-center text-terminal-accent font-mono text-sm font-bold">
          <Terminal size={14} className="mr-2" />
          <span>INTELLIGENCE // {symbol}</span>
        </div>
        {loading && (
          <div className="flex items-center text-xs font-mono text-terminal-accent animate-pulse">
            <Cpu size={12} className="mr-1" />
            PROCESSING...
          </div>
        )}
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 font-mono text-sm text-gray-300 bg-black" ref={scrollRef}>
        {loading && !content ? (
          <div className="space-y-2 opacity-50">
            <div className="h-4 bg-terminal-highlight w-3/4 rounded animate-pulse"></div>
            <div className="h-4 bg-terminal-highlight w-1/2 rounded animate-pulse"></div>
            <div className="h-4 bg-terminal-highlight w-5/6 rounded animate-pulse"></div>
          </div>
        ) : content ? (
           <div className="prose prose-invert prose-sm max-w-none prose-p:my-1 prose-headings:text-terminal-accent prose-headings:font-bold prose-headings:text-sm prose-strong:text-white">
             <ReactMarkdown>{content}</ReactMarkdown>
           </div>
        ) : (
          <div className="text-gray-600 text-xs">
            > Awaiting command or selection...
            <br/>
            > System Ready.
          </div>
        )}
        {/* Blinking cursor effect */}
        <span className="inline-block w-2 h-4 bg-terminal-accent ml-1 align-middle animate-pulse"></span>
      </div>
    </div>
  );
};

export default AnalysisPanel;