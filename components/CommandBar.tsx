import React, { useState, useEffect } from 'react';
import { Search, Command, ArrowRight } from 'lucide-react';

interface CommandBarProps {
  onCommand: (cmd: string) => void;
  selectedSymbol: string;
}

const CommandBar: React.FC<CommandBarProps> = ({ onCommand, selectedSymbol }) => {
  const [input, setInput] = useState('');
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim()) {
      onCommand(input.trim().toUpperCase());
      setInput('');
    }
  };

  return (
    <div className="bg-terminal-panel border-b border-terminal-border flex items-center px-4 py-2 sticky top-0 z-50 shadow-md">
      <div className="flex items-center text-terminal-accent mr-4 font-mono font-bold select-none">
        <Command size={18} className="mr-2" />
        <span>OPENTERMINAL</span>
      </div>
      
      <form onSubmit={handleSubmit} className="flex-1 flex items-center bg-black border border-terminal-border rounded-sm px-3 py-1.5 focus-within:border-terminal-accent transition-colors">
        <span className="text-terminal-accent font-bold mr-2 text-sm">{'>'}</span>
        <input 
          type="text" 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`Enter command or security (Current: ${selectedSymbol})`}
          className="bg-transparent border-none outline-none text-white font-mono text-sm w-full placeholder-gray-600 uppercase"
          autoFocus
        />
        <button type="submit" className="text-terminal-accent hover:text-white">
          <ArrowRight size={16} />
        </button>
      </form>

      <div className="ml-4 flex items-center text-xs font-mono text-gray-400 space-x-4">
        <span className="text-terminal-up">CONN: OK</span>
        <span>{time.toLocaleTimeString([], { hour12: false })}</span>
        <span className="text-gray-500">G: {process.env.API_KEY ? 'ACTIVE' : 'NO_KEY'}</span>
      </div>
    </div>
  );
};

export default CommandBar;
