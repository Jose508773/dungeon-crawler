import React, { useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollText } from 'lucide-react';

const CombatLog = ({ messages }) => {
  const logRef = useRef(null);

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="h-full flex flex-col">
      <div 
        ref={logRef}
        className="flex-1 overflow-y-auto space-y-2.5 pr-2"
        style={{ scrollBehavior: 'smooth', maxHeight: 'calc(100vh - 200px)' }}
      >
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-32">
            <p className="fantasy-text text-sm opacity-50 italic">⚔️ No combat yet...</p>
          </div>
        ) : (
          messages.map((msg, index) => (
            <div 
              key={index} 
              className="stat-display p-3 rounded-lg border-l-4 border-amber-600 hover:bg-gradient-to-r hover:from-amber-950/30 hover:to-transparent transition-colors combat-entry"
            >
              <div className="flex items-start gap-3">
                <span className="fantasy-text text-xs px-2 py-1 bg-amber-900/40 rounded border border-amber-700 flex-shrink-0">
                  T:{msg.turn}
                </span>
                <span className="fantasy-text text-sm leading-relaxed flex-1">
                  {msg.message}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
      
      {/* Quick reference */}
      <div className="mt-4 pt-4 border-t-2 border-amber-700/50">
        <p className="fantasy-text text-xs opacity-70 text-center leading-relaxed">
          💡 Move adjacent to enemies to initiate combat • Use items in battle
        </p>
      </div>
    </div>
  );
};

export default CombatLog;

