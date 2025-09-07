import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

const MenuPanel = ({ 
  isOpen, 
  onClose, 
  title, 
  icon: Icon, 
  children, 
  position = 'left',
  width = 'w-80'
}) => {
  if (!isOpen) return null;

  const positionClasses = {
    left: 'left-0 top-0 bottom-0',
    right: 'right-0 top-0 bottom-0',
    bottom: 'bottom-0 left-0 right-0 h-64'
  };

  const slideClasses = {
    left: 'animate-slide-in-left',
    right: 'animate-slide-in-right', 
    bottom: 'animate-slide-in-bottom'
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-30"
        onClick={onClose}
      />
      
      {/* Panel */}
      <div className={`
        fixed ${positionClasses[position]} ${width} z-40
        ${slideClasses[position]}
      `}>
        <Card className="h-full bg-gray-800/95 border-gray-700 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-orange-400 flex items-center gap-2">
              {Icon && <Icon className="w-5 h-5" />}
              {title}
            </CardTitle>
            <Button
              onClick={onClose}
              size="sm"
              variant="ghost"
              className="h-8 w-8 p-0 hover:bg-gray-700"
            >
              <X className="w-4 h-4" />
            </Button>
          </CardHeader>
          <CardContent className="flex-1 overflow-auto">
            {children}
          </CardContent>
        </Card>
      </div>

      {/* Custom animations */}
      <style jsx>{`
        @keyframes slide-in-left {
          from { transform: translateX(-100%); }
          to { transform: translateX(0); }
        }
        
        @keyframes slide-in-right {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
        
        @keyframes slide-in-bottom {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        
        .animate-slide-in-left {
          animation: slide-in-left 0.3s ease-out;
        }
        
        .animate-slide-in-right {
          animation: slide-in-right 0.3s ease-out;
        }
        
        .animate-slide-in-bottom {
          animation: slide-in-bottom 0.3s ease-out;
        }
      `}</style>
    </>
  );
};

export default MenuPanel;

