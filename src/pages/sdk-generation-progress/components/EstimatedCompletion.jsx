import React, { useState, useEffect } from 'react';
import Icon from '../../../components/AppIcon';

const EstimatedCompletion = ({ 
  startTime, 
  estimatedDuration, 
  currentProgress, 
  contractComplexity 
}) => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const calculateElapsedTime = () => {
    const elapsed = Math.floor((currentTime - startTime) / 1000);
    return elapsed;
  };

  const calculateRemainingTime = () => {
    const elapsed = calculateElapsedTime();
    const totalEstimated = estimatedDuration;
    const progressRatio = currentProgress / 100;
    
    if (progressRatio > 0) {
      const estimatedTotal = elapsed / progressRatio;
      return Math.max(0, Math.floor(estimatedTotal - elapsed));
    }
    
    return totalEstimated - elapsed;
  };

  const formatTime = (seconds) => {
    if (seconds < 0) return '0s';
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    if (minutes < 60) return `${minutes}m ${remainingSeconds}s`;
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  };

  const getComplexityColor = (complexity) => {
    switch (complexity?.toLowerCase()) {
      case 'low':
        return 'text-success';
      case 'medium':
        return 'text-warning';
      case 'high':
        return 'text-error';
      default:
        return 'text-text-secondary';
    }
  };

  const getComplexityIcon = (complexity) => {
    switch (complexity?.toLowerCase()) {
      case 'low':
        return 'TrendingDown';
      case 'medium':
        return 'Minus';
      case 'high':
        return 'TrendingUp';
      default:
        return 'Activity';
    }
  };

  const elapsedTime = calculateElapsedTime();
  const remainingTime = calculateRemainingTime();
  const estimatedCompletion = new Date(currentTime.getTime() + (remainingTime * 1000));

  return (
    <div className="bg-card rounded-lg shadow-subtle border border-border p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
          <Icon name="Clock" size={20} color="var(--color-primary)" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground">Time Estimates</h3>
          <p className="text-sm text-text-secondary">Generation timing information</p>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {/* Elapsed Time */}
        <div className="p-4 bg-surface rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="Play" size={16} color="var(--color-text-secondary)" />
            <span className="text-sm font-medium text-foreground">Elapsed Time</span>
          </div>
          <p className="text-2xl font-bold text-primary">{formatTime(elapsedTime)}</p>
          <p className="text-xs text-text-secondary mt-1">
            Started at {startTime?.toLocaleTimeString()}
          </p>
        </div>

        {/* Remaining Time */}
        <div className="p-4 bg-surface rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <Icon name="Timer" size={16} color="var(--color-text-secondary)" />
            <span className="text-sm font-medium text-foreground">Remaining Time</span>
          </div>
          <p className="text-2xl font-bold text-warning">{formatTime(remainingTime)}</p>
          <p className="text-xs text-text-secondary mt-1">
            Est. completion: {estimatedCompletion?.toLocaleTimeString()}
          </p>
        </div>
      </div>
      {/* Contract Complexity */}
      <div className="p-4 bg-surface rounded-lg mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Icon 
              name={getComplexityIcon(contractComplexity)} 
              size={16} 
              color="var(--color-text-secondary)" 
            />
            <span className="text-sm font-medium text-foreground">Contract Complexity</span>
          </div>
          <span className={`text-sm font-medium capitalize ${getComplexityColor(contractComplexity)}`}>
            {contractComplexity}
          </span>
        </div>
        <div className="mt-2 text-xs text-text-secondary">
          {contractComplexity === 'low' && 'Simple contract with basic functions'}
          {contractComplexity === 'medium' && 'Moderate complexity with multiple interfaces'}
          {contractComplexity === 'high' && 'Complex contract with advanced features'}
        </div>
      </div>
      {/* Progress Indicator */}
      <div className="flex items-center justify-between text-sm">
        <span className="text-text-secondary">Generation Progress</span>
        <span className="font-medium text-foreground">{currentProgress}% Complete</span>
      </div>
      <div className="w-full bg-border rounded-full h-2 mt-2">
        <div 
          className="bg-primary h-2 rounded-full transition-all duration-300"
          style={{ width: `${currentProgress}%` }}
        />
      </div>
    </div>
  );
};

export default EstimatedCompletion;