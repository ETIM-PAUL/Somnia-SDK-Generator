import React from 'react';

const ProgressBar = ({ progress, estimatedTime, currentOperation }) => {
  const formatTime = (seconds) => {
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  return (
    <div className="bg-card rounded-lg shadow-subtle border border-border p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-foreground">Overall Progress</h3>
        <span className="text-2xl font-bold text-primary">{progress}%</span>
      </div>
      
      <div className="w-full bg-border rounded-full h-3 mb-4">
        <div 
          className="bg-primary h-3 rounded-full transition-all duration-500 ease-out relative overflow-hidden"
          style={{ width: `${progress}%` }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
        </div>
      </div>

      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
          <span className="text-text-secondary">
            {currentOperation || 'Processing...'}
          </span>
        </div>
        {estimatedTime > 0 && (
          <span className="text-text-secondary">
            Est. {formatTime(estimatedTime)} remaining
          </span>
        )}
      </div>
    </div>
  );
};

export default ProgressBar;