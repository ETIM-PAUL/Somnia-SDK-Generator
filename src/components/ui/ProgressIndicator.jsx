import React from 'react';
import Icon from '../AppIcon';

const ProgressIndicator = ({ 
  currentStep = 1, 
  totalSteps = 4, 
  stepLabels = ['Input', 'Validate', 'Generate', 'Complete'],
  processingStatus = 'idle', // idle, processing, completed, error
  completionPercentage = 0 
}) => {
  const getStepStatus = (stepIndex) => {
    if (stepIndex < currentStep - 1) return 'completed';
    if (stepIndex === currentStep - 1) {
      if (processingStatus === 'error') return 'error';
      if (processingStatus === 'processing') return 'processing';
      if (processingStatus === 'completed') return 'completed';
      return 'current';
    }
    return 'pending';
  };

  const getStepIcon = (stepIndex, status) => {
    switch (status) {
      case 'completed':
        return <Icon name="CheckCircle" size={16} color="var(--color-success)" />;
      case 'error':
        return <Icon name="XCircle" size={16} color="var(--color-error)" />;
      case 'processing':
        return <Icon name="Loader2" size={16} color="var(--color-primary)" className="animate-spin" />;
      case 'current':
        return <Icon name="Circle" size={16} color="var(--color-primary)" />;
      default:
        return <Icon name="Circle" size={16} color="var(--color-text-secondary)" />;
    }
  };

  const getStepColor = (status) => {
    switch (status) {
      case 'completed':
        return 'text-success';
      case 'error':
        return 'text-error';
      case 'processing': case'current':
        return 'text-primary';
      default:
        return 'text-text-secondary';
    }
  };

  return (
    <div className="bg-surface rounded-lg p-4 shadow-subtle">
      {/* Desktop Progress Indicator */}
      <div className="hidden md:block">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-foreground">SDK Generation Progress</h3>
          {processingStatus === 'processing' && (
            <span className="text-xs text-text-secondary">{completionPercentage}% complete</span>
          )}
        </div>
        
        <div className="flex items-center space-x-4">
          {stepLabels?.map((label, index) => {
            const status = getStepStatus(index);
            return (
              <div key={index} className="flex items-center space-x-2">
                <div className="flex flex-col items-center">
                  <div className="flex items-center justify-center w-8 h-8 rounded-full border-2 transition-smooth">
                    {getStepIcon(index, status)}
                  </div>
                  <span className={`text-xs mt-1 font-medium transition-smooth ${getStepColor(status)}`}>
                    {label}
                  </span>
                </div>
                {index < stepLabels?.length - 1 && (
                  <div className={`w-12 h-0.5 mx-2 transition-smooth ${
                    status === 'completed' ? 'bg-success' : 'bg-border'
                  }`} />
                )}
              </div>
            );
          })}
        </div>

        {/* Progress Bar for Processing State */}
        {processingStatus === 'processing' && (
          <div className="mt-4">
            <div className="w-full bg-border rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-300 ease-out"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
          </div>
        )}
      </div>
      {/* Mobile Progress Indicator */}
      <div className="md:hidden">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-foreground">Progress</h3>
          <span className="text-xs text-text-secondary">
            Step {currentStep} of {totalSteps}
          </span>
        </div>
        
        <div className="flex items-center space-x-2 mb-3">
          {getStepIcon(currentStep - 1, getStepStatus(currentStep - 1))}
          <span className={`text-sm font-medium ${getStepColor(getStepStatus(currentStep - 1))}`}>
            {stepLabels?.[currentStep - 1]}
          </span>
        </div>

        <div className="w-full bg-border rounded-full h-2">
          <div 
            className="bg-primary h-2 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </div>

        {processingStatus === 'processing' && (
          <div className="mt-2 text-center">
            <span className="text-xs text-text-secondary">{completionPercentage}% complete</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProgressIndicator;