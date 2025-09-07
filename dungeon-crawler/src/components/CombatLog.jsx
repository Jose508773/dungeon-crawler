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
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader className="pb-3">
        <CardTitle className="text-orange-400 flex items-center gap-2">
          <ScrollText className="w-5 h-5" />
          Combat Log
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div 
          ref={logRef}
          className="h-48 overflow-y-auto space-y-1 text-sm"
          style={{ scrollBehavior: 'smooth' }}
        >
          {messages.length === 0 ? (
            <p className="text-gray-500 italic">No messages yet...</p>
          ) : (
            messages.map((msg, index) => (
              <div 
                key={index} 
                className="p-2 bg-gray-700 rounded text-gray-200 border-l-2 border-orange-500"
              >
                <span className="text-xs text-gray-400 mr-2">
                  Turn {msg.turn}:
                </span>
                {msg.message}
              </div>
            ))
          )}
        </div>
        
        {/* Quick reference */}
        <div className="mt-3 pt-3 border-t border-gray-700">
          <p className="text-xs text-gray-500">
            Move adjacent to enemies to attack automatically
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default CombatLog;

