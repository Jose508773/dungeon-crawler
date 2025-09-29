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
  width = 'w-96'
}) => {
  if (!isOpen) return null;

  const positionClasses = {
    left: 'left-0 top-0 bottom-0',
    right: 'right-0 top-0 bottom-0',
    bottom: 'bottom-0 left-0 right-0'
  };

  const slideClasses = {
    left: 'animate-slide-in-left',
    right: 'animate-slide-in-right', 
    bottom: 'animate-slide-in-bottom'
  };

  // Dynamic sizing based on position
  const sizeClasses = position === 'bottom' ? 'h-2/3' : width;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 modal-overlay-enhanced z-30"
        onClick={onClose}
      />
      
      {/* Panel */}
      <div className={`
        fixed ${positionClasses[position]} ${sizeClasses} z-40
        ${slideClasses[position]}
        p-3
      `}>
        <div className="h-full fantasy-panel-enhanced rounded-xl overflow-hidden flex flex-col shadow-2xl">
          <div className="flex items-center justify-between px-6 py-4 border-b-4 border-amber-700/50 bg-gradient-to-r from-amber-950/40 to-transparent">
            <div className="fantasy-title text-sm flex items-center gap-3">
              {Icon && (typeof Icon === 'function' ? <Icon className="w-5 h-5" /> : <Icon className="w-5 h-5" />)}
              {title.toUpperCase()}
            </div>
            <button
              onClick={onClose}
              className="pixel-btn p-2 hover:bg-red-900/50"
              title="Close panel"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="flex-1 overflow-auto p-5">
            {children}
          </div>
        </div>
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

