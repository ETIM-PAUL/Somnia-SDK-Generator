import React, { useEffect, useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ValidationToast = ({ 
  type = 'info', 
  title, 
  message, 
  isVisible = false, 
  onClose, 
  autoClose = true, 
  duration = 5000,
  action 
}) => {
  const [show, setShow] = useState(isVisible);

  useEffect(() => {
    setShow(isVisible);
  }, [isVisible]);

  useEffect(() => {
    if (show && autoClose && type !== 'error') {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [show, autoClose, type, duration]);

  const handleClose = () => {
    setShow(false);
    setTimeout(() => {
      if (onClose) onClose();
    }, 300);
  };

  if (!show) return null;

  const getToastStyles = () => {
    switch (type) {
      case 'success':
        return {
          container: 'bg-success text-success-foreground border-success/20',
          icon: 'CheckCircle2',
          iconColor: 'currentColor'
        };
      case 'error':
        return {
          container: 'bg-error text-error-foreground border-error/20',
          icon: 'AlertCircle',
          iconColor: 'currentColor'
        };
      case 'warning':
        return {
          container: 'bg-warning text-warning-foreground border-warning/20',
          icon: 'AlertTriangle',
          iconColor: 'currentColor'
        };
      default:
        return {
          container: 'bg-accent text-accent-foreground border-accent/20',
          icon: 'Info',
          iconColor: 'currentColor'
        };
    }
  };

  const toastStyles = getToastStyles();

  return (
    <div className="fixed top-20 right-6 z-50 animate-slide-in">
      <div className={`
        max-w-md w-full rounded-lg border shadow-lg p-4 transition-all duration-300
        ${toastStyles?.container}
      `}>
        <div className="flex items-start space-x-3">
          {/* Icon */}
          <div className="flex-shrink-0 mt-0.5">
            <Icon 
              name={toastStyles?.icon} 
              size={18} 
              color={toastStyles?.iconColor}
              strokeWidth={2}
            />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            {title && (
              <div className="text-sm font-medium mb-1">
                {title}
              </div>
            )}
            {message && (
              <div className="text-sm opacity-90">
                {message}
              </div>
            )}
            
            {/* Action Button */}
            {action && (
              <div className="mt-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={action?.onClick}
                  iconName={action?.icon}
                  iconPosition="left"
                  className="text-xs h-7 px-2 bg-white/10 hover:bg-white/20 text-current"
                >
                  {action?.label}
                </Button>
              </div>
            )}
          </div>

          {/* Close Button */}
          <div className="flex-shrink-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              iconName="X"
              className="h-6 w-6 p-0 opacity-70 hover:opacity-100 text-current hover:bg-white/10"
            />
          </div>
        </div>

        {/* Progress Bar for Auto-close */}
        {autoClose && type !== 'error' && (
          <div className="mt-3">
            <div className="w-full bg-white/20 rounded-full h-1">
              <div 
                className="bg-white h-1 rounded-full transition-all duration-300 animate-progress"
                style={{ 
                  animation: `progress ${duration}ms linear forwards`
                }}
              />
            </div>
          </div>
        )}
      </div>
      <style jsx>{`
        @keyframes progress {
          from { width: 100%; }
          to { width: 0%; }
        }
        
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
        
        .animate-progress {
          animation: progress var(--duration) linear forwards;
        }
      `}</style>
    </div>
  );
};

export default ValidationToast;