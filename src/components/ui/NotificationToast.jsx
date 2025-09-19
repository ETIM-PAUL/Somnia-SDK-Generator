import React, { useState, useEffect } from 'react';
import Icon from '../AppIcon';
import Button from './Button';

const NotificationToast = ({ 
  notifications = [],
  onDismiss = () => {},
  position = 'top-right' // top-right, top-left, bottom-right, bottom-left
}) => {
  const [visibleNotifications, setVisibleNotifications] = useState([]);

  useEffect(() => {
    setVisibleNotifications(notifications);
  }, [notifications]);

  const handleDismiss = (notificationId) => {
    setVisibleNotifications(prev => 
      prev?.filter(notification => notification?.id !== notificationId)
    );
    onDismiss(notificationId);
  };

  const getPositionClasses = () => {
    switch (position) {
      case 'top-left':
        return 'top-4 left-4';
      case 'bottom-right':
        return 'bottom-4 right-4';
      case 'bottom-left':
        return 'bottom-4 left-4';
      default:
        return 'top-4 right-4';
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'success':
        return <Icon name="CheckCircle" size={20} color="var(--color-success)" />;
      case 'error':
        return <Icon name="XCircle" size={20} color="var(--color-error)" />;
      case 'warning':
        return <Icon name="AlertTriangle" size={20} color="var(--color-warning)" />;
      case 'info':
        return <Icon name="Info" size={20} color="var(--color-primary)" />;
      default:
        return <Icon name="Bell" size={20} color="var(--color-text-secondary)" />;
    }
  };

  const getNotificationStyles = (type) => {
    switch (type) {
      case 'success':
        return 'border-success/20 bg-success/5';
      case 'error':
        return 'border-error/20 bg-error/5';
      case 'warning':
        return 'border-warning/20 bg-warning/5';
      case 'info':
        return 'border-primary/20 bg-primary/5';
      default:
        return 'border-border bg-card';
    }
  };

  if (visibleNotifications?.length === 0) {
    return null;
  }

  return (
    <div className={`fixed z-300 space-y-2 ${getPositionClasses()}`}>
      {visibleNotifications?.map((notification) => (
        <ToastItem
          key={notification?.id}
          notification={notification}
          onDismiss={handleDismiss}
          getIcon={getNotificationIcon}
          getStyles={getNotificationStyles}
        />
      ))}
    </div>
  );
};

const ToastItem = ({ notification, onDismiss, getIcon, getStyles }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    // Animate in
    const timer = setTimeout(() => setIsVisible(true), 10);
    
    // Auto dismiss
    if (notification?.autoDismiss !== false) {
      const dismissTimer = setTimeout(() => {
        handleDismiss();
      }, notification?.duration || 5000);
      
      return () => {
        clearTimeout(timer);
        clearTimeout(dismissTimer);
      };
    }
    
    return () => clearTimeout(timer);
  }, []);

  const handleDismiss = () => {
    setIsExiting(true);
    setTimeout(() => {
      onDismiss(notification?.id);
    }, 200);
  };

  return (
    <div
      className={`
        transform transition-all duration-200 ease-out
        ${isVisible && !isExiting ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
        ${isExiting ? 'translate-x-full opacity-0' : ''}
      `}
    >
      <div
        className={`
          w-80 md:w-96 p-4 rounded-lg border shadow-elevated
          ${getStyles(notification?.type)}
          animate-fade-in
        `}
      >
        <div className="flex items-start space-x-3">
          <div className="flex-shrink-0 mt-0.5">
            {getIcon(notification?.type)}
          </div>
          
          <div className="flex-1 min-w-0">
            {notification?.title && (
              <h4 className="text-sm font-medium text-foreground mb-1">
                {notification?.title}
              </h4>
            )}
            <p className="text-sm text-text-secondary">
              {notification?.message}
            </p>
            
            {notification?.actions && notification?.actions?.length > 0 && (
              <div className="flex items-center space-x-2 mt-3">
                {notification?.actions?.map((action, index) => (
                  <Button
                    key={index}
                    variant={action?.variant || 'ghost'}
                    size="sm"
                    onClick={() => {
                      action?.onClick();
                      if (action?.dismissOnClick !== false) {
                        handleDismiss();
                      }
                    }}
                  >
                    {action?.label}
                  </Button>
                ))}
              </div>
            )}
          </div>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={handleDismiss}
            className="flex-shrink-0 -mt-1 -mr-1"
            iconName="X"
            iconSize={16}
          >
            <span className="sr-only">Dismiss</span>
          </Button>
        </div>
        
        {notification?.progress !== undefined && (
          <div className="mt-3">
            <div className="flex items-center justify-between text-xs text-text-secondary mb-1">
              <span>{notification?.progressLabel || 'Progress'}</span>
              <span>{notification?.progress}%</span>
            </div>
            <div className="w-full bg-border rounded-full h-1">
              <div
                className="bg-primary h-1 rounded-full transition-all duration-300"
                style={{ width: `${notification?.progress}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Hook for managing notifications
export const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);

  const addNotification = (notification) => {
    const id = Date.now() + Math.random();
    const newNotification = {
      id,
      type: 'info',
      autoDismiss: true,
      duration: 5000,
      ...notification
    };
    
    setNotifications(prev => [...prev, newNotification]);
    return id;
  };

  const removeNotification = (id) => {
    setNotifications(prev => prev?.filter(notification => notification?.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  // Convenience methods
  const success = (message, options = {}) => 
    addNotification({ ...options, type: 'success', message });
  
  const error = (message, options = {}) => 
    addNotification({ ...options, type: 'error', message, autoDismiss: false });
  
  const warning = (message, options = {}) => 
    addNotification({ ...options, type: 'warning', message });
  
  const info = (message, options = {}) => 
    addNotification({ ...options, type: 'info', message });

  return {
    notifications,
    addNotification,
    removeNotification,
    clearAll,
    success,
    error,
    warning,
    info
  };
};

export default NotificationToast;