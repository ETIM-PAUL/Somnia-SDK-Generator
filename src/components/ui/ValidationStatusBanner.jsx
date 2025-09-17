import React, { useState, useEffect } from 'react';
import Icon from '../AppIcon';
import Button from './Button';

const ValidationStatusBanner = ({ 
  type = 'info', 
  title, 
  message, 
  isVisible = true, 
  isDismissible = false,
  onDismiss,
  action,
  persistent = false,
  autoHide = false,
  autoHideDelay = 5000
}) => {
  const [show, setShow] = useState(isVisible);

  useEffect(() => {
    setShow(isVisible);
  }, [isVisible]);

  useEffect(() => {
    if (autoHide && show && type !== 'error') {
      const timer = setTimeout(() => {
        handleDismiss();
      }, autoHideDelay);

      return () => clearTimeout(timer);
    }
  }, [autoHide, show, type, autoHideDelay]);

  const handleDismiss = () => {
    setShow(false);
    if (onDismiss) {
      onDismiss();
    }
  };

  if (!show) return null;

  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return {
          container: 'bg-success/10 border-success/20 text-success-foreground',
          icon: 'CheckCircle2',
          iconColor: 'var(--color-success)'
        };
      case 'warning':
        return {
          container: 'bg-warning/10 border-warning/20 text-warning-foreground',
          icon: 'AlertTriangle',
          iconColor: 'var(--color-warning)'
        };
      case 'error':
        return {
          container: 'bg-error/10 border-error/20 text-error-foreground',
          icon: 'AlertCircle',
          iconColor: 'var(--color-error)'
        };
      case 'loading':
        return {
          container: 'bg-accent/10 border-accent/20 text-accent-foreground',
          icon: 'Loader2',
          iconColor: 'var(--color-accent)'
        };
      default:
        return {
          container: 'bg-muted border-border text-muted-foreground',
          icon: 'Info',
          iconColor: 'var(--color-muted-foreground)'
        };
    }
  };

  const typeStyles = getTypeStyles();

  return (
    <div className={`
      relative rounded-lg border p-4 transition-all duration-300 animate-slide-in
      ${typeStyles?.container}
      ${persistent ? 'mb-6' : 'mb-4'}
    `}>
      <div className="flex items-start space-x-3">
        {/* Icon */}
        <div className="flex-shrink-0 mt-0.5">
          <Icon 
            name={typeStyles?.icon} 
            size={18} 
            color={typeStyles?.iconColor}
            strokeWidth={2}
            className={type === 'loading' ? 'animate-spin' : ''}
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
                variant="outline"
                size="sm"
                onClick={action?.onClick}
                iconName={action?.icon}
                iconPosition="left"
                className="text-xs"
              >
                {action?.label}
              </Button>
            </div>
          )}
        </div>

        {/* Dismiss Button */}
        {isDismissible && (
          <div className="flex-shrink-0">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDismiss}
              iconName="X"
              className="h-6 w-6 p-0 opacity-70 hover:opacity-100"
            />
          </div>
        )}
      </div>
      {/* Progress Bar for Loading */}
      {type === 'loading' && (
        <div className="mt-3">
          <div className="w-full bg-accent/20 rounded-full h-1">
            <div className="bg-accent h-1 rounded-full animate-pulse" style={{ width: '60%' }} />
          </div>
        </div>
      )}
    </div>
  );
};

export default ValidationStatusBanner;