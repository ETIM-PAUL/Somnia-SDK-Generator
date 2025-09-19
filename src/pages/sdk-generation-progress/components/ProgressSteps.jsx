import React from 'react';
import Icon from '../../../components/AppIcon';

const ProgressSteps = ({ currentStep, steps, processingStatus }) => {
  const getStepStatus = (stepIndex) => {
    if (stepIndex < currentStep - 1) return 'completed';
    if (stepIndex === currentStep - 1) {
      if (processingStatus === 'error') return 'error';
      if (processingStatus === 'processing') return 'processing';
      return 'current';
    }
    return 'pending';
  };

  const getStepIcon = (stepIndex, status) => {
    switch (status) {
      case 'completed':
        return <Icon name="CheckCircle" size={20} color="var(--color-success)" />;
      case 'error':
        return <Icon name="XCircle" size={20} color="var(--color-error)" />;
      case 'processing':
        return <Icon name="Loader2" size={20} color="var(--color-primary)" className="animate-spin" />;
      case 'current':
        return <Icon name="Circle" size={20} color="var(--color-primary)" />;
      default:
        return <Icon name="Circle" size={20} color="var(--color-text-secondary)" />;
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
    <div className="bg-card rounded-lg shadow-subtle border border-border p-6">
      <h2 className="text-lg font-semibold text-foreground mb-6">SDK Generation Progress</h2>
      {/* Desktop Progress Steps */}
      <div className="hidden md:block">
        <div className="flex items-center justify-between">
          {steps?.map((step, index) => {
            const status = getStepStatus(index);
            return (
              <div key={index} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full border-2 transition-smooth mb-2">
                    {getStepIcon(index, status)}
                  </div>
                  <span className={`text-sm font-medium transition-smooth ${getStepColor(status)}`}>
                    {step?.name}
                  </span>
                  <span className="text-xs text-text-secondary mt-1 text-center max-w-24">
                    {step?.description}
                  </span>
                </div>
                {index < steps?.length - 1 && (
                  <div className={`w-16 h-0.5 mx-4 transition-smooth ${
                    status === 'completed' ? 'bg-success' : 'bg-border'
                  }`} />
                )}
              </div>
            );
          })}
        </div>
      </div>
      {/* Mobile Progress Steps */}
      <div className="md:hidden space-y-4">
        {steps?.map((step, index) => {
          const status = getStepStatus(index);
          return (
            <div key={index} className="flex items-center space-x-4">
              <div className="flex-shrink-0">
                {getStepIcon(index, status)}
              </div>
              <div className="flex-1">
                <h3 className={`font-medium ${getStepColor(status)}`}>
                  {step?.name}
                </h3>
                <p className="text-sm text-text-secondary">
                  {step?.description}
                </p>
                {status === 'processing' && step?.currentOperation && (
                  <p className="text-xs text-primary mt-1">
                    {step?.currentOperation}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ProgressSteps;