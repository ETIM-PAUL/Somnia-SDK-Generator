import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ActivityLogs = ({ logs, isExpanded, onToggleExpanded }) => {
  const [autoScroll, setAutoScroll] = useState(true);

  const getLogIcon = (type) => {
    switch (type) {
      case 'success':
        return <Icon name="CheckCircle" size={14} color="var(--color-success)" />;
      case 'warning':
        return <Icon name="AlertTriangle" size={14} color="var(--color-warning)" />;
      case 'error':
        return <Icon name="XCircle" size={14} color="var(--color-error)" />;
      case 'info':
        return <Icon name="Info" size={14} color="var(--color-primary)" />;
      default:
        return <Icon name="Circle" size={14} color="var(--color-text-secondary)" />;
    }
  };

  const getLogColor = (type) => {
    switch (type) {
      case 'success':
        return 'text-success';
      case 'warning':
        return 'text-warning';
      case 'error':
        return 'text-error';
      case 'info':
        return 'text-primary';
      default:
        return 'text-text-secondary';
    }
  };

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp)?.toLocaleTimeString('en-US', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <div className="bg-card rounded-lg shadow-subtle border border-border">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border">
        <div className="flex items-center space-x-3">
          <Icon name="Terminal" size={20} color="var(--color-text-secondary)" />
          <h3 className="text-lg font-semibold text-foreground">Generation Logs</h3>
          <span className="text-xs bg-surface px-2 py-1 rounded text-text-secondary">
            {logs?.length} entries
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setAutoScroll(!autoScroll)}
            iconName={autoScroll ? "Pause" : "Play"}
            iconPosition="left"
          >
            Auto-scroll
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleExpanded}
            iconName={isExpanded ? "ChevronUp" : "ChevronDown"}
            iconSize={16}
          >
            {isExpanded ? 'Collapse' : 'Expand'}
          </Button>
        </div>
      </div>
      {/* Logs Content */}
      <div className={`transition-all duration-300 ${isExpanded ? 'max-h-96' : 'max-h-48'} overflow-hidden`}>
        <div className="p-4 bg-surface/50 font-mono text-sm max-h-full overflow-y-auto">
          {logs?.length === 0 ? (
            <div className="text-center py-8 text-text-secondary">
              <Icon name="Terminal" size={32} color="var(--color-text-secondary)" className="mx-auto mb-2" />
              <p>No logs available yet</p>
            </div>
          ) : (
            <div className="space-y-2">
              {logs?.map((log, index) => (
                <div key={index} className="flex items-start space-x-3 py-1">
                  <span className="text-xs text-text-secondary mt-0.5 w-16 flex-shrink-0">
                    {formatTimestamp(log?.timestamp)}
                  </span>
                  <div className="flex-shrink-0 mt-0.5">
                    {getLogIcon(log?.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm ${getLogColor(log?.type)}`}>
                      {log?.message}
                    </p>
                    {log?.details && (
                      <p className="text-xs text-text-secondary mt-1 pl-4 border-l-2 border-border">
                        {log?.details}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      {/* Footer */}
      <div className="flex items-center justify-between p-3 border-t border-border bg-surface/30">
        <div className="flex items-center space-x-2 text-xs text-text-secondary">
          <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
          <span>Live monitoring active</span>
        </div>
        <Button variant="ghost" size="sm" iconName="Download" iconSize={14}>
          Export Logs
        </Button>
      </div>
    </div>
  );
};

export default ActivityLogs;