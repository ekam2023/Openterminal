import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { StockData } from '../types';

interface ChartWidgetProps {
  data: StockData;
}

const ChartWidget: React.FC<ChartWidgetProps> = ({ data }) => {
  const isPositive = data.change >= 0;
  const color = isPositive ? '#00cc44' : '#ff3333';
  const gradientId = `color${data.symbol}`;

  // Calculate domain to make chart look dynamic
  const minPrice = Math.min(...data.history.map(d => d.price));
  const maxPrice = Math.max(...data.history.map(d => d.price));
  const padding = (maxPrice - minPrice) * 0.1;

  return (
    <div className="h-full w-full flex flex-col bg-terminal-panel border border-terminal-border rounded-sm overflow-hidden">
      <div className="px-3 py-2 border-b border-terminal-border flex justify-between items-center bg-stone-900/50">
        <div className="font-mono text-sm">
          <span className="font-bold text-white mr-2">GP</span>
          <span className="text-terminal-accent">Line Chart Intraday</span>
        </div>
        <div className="text-xs font-mono text-gray-500">1 MIN INTERVAL</div>
      </div>
      
      <div className="flex-1 min-h-0 relative group">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data.history}>
            <defs>
              <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.3}/>
                <stop offset="95%" stopColor={color} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <XAxis 
              dataKey="time" 
              hide={true} // Hide X Axis for cleaner sparkline look usually, or style it minimal
              stroke="#444"
              tick={{fill: '#666', fontSize: 10}}
              interval="preserveStartEnd"
            />
            <YAxis 
              domain={[minPrice - padding, maxPrice + padding]} 
              orientation="right" 
              tick={{fill: '#888', fontSize: 11, fontFamily: 'monospace'}}
              stroke="#333"
              width={50}
            />
            <Tooltip 
              contentStyle={{ backgroundColor: '#111', borderColor: '#333', color: '#fff' }}
              itemStyle={{ color: color }}
              labelStyle={{ color: '#888' }}
              formatter={(value: number) => [value.toFixed(2), "Price"]}
            />
            <ReferenceLine y={data.history[0]?.price} stroke="#666" strokeDasharray="3 3" />
            <Area 
              type="monotone" 
              dataKey="price" 
              stroke={color} 
              fillOpacity={1} 
              fill={`url(#${gradientId})`} 
              strokeWidth={2}
              isAnimationActive={false} // Disable animation for real-time feel
            />
          </AreaChart>
        </ResponsiveContainer>
        
        {/* Watermark */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-terminal-border text-6xl font-bold opacity-10 pointer-events-none select-none">
          {data.symbol}
        </div>
      </div>
    </div>
  );
};

export default ChartWidget;
