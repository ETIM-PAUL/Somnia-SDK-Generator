import React from 'react';
import { useLocation } from 'react-router-dom';
import Icon from '../AppIcon';

const StepProgressIndicator = () => {
  const location = useLocation();

  const steps = [
    {
      id: 'contract-input',
      title: 'Contract Input',
      description: 'Smart contract validation and verification',
      path: '/contract-input-dashboard',
      icon: 'FileCode',
      status: 'completed' // This would be dynamic based on actual state
    },
    {
      id: 'sdk-configuration',
      title: 'SDK Configuration',
      description: 'Language selection and generation parameters',
      path: '/sdk-configuration',
      icon: 'Settings',
      status: 'current' // This would be dynamic based on actual state
    },
    {
      id: 'generation',
      title: 'Generation',
      description: 'SDK creation and download',
      path: '/generation',
      icon: 'Download',
      status: 'pending' // This would be dynamic based on actual state
    }
  ];

  const getCurrentStepIndex = () => {
    return steps?.findIndex(step => step?.path === location?.pathname);
  };

  const getStepStatus = (stepIndex) => {
    const currentIndex = getCurrentStepIndex();
    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'current';
    return 'pending';
  };

  const getStepIcon = (step, status) => {
    if (status === 'completed') return 'CheckCircle2';
    if (status === 'current') return step?.icon;
    return step?.icon;
  };

  const getStepIconColor = (status) => {
    if (status === 'completed') return 'var(--color-success)';
    if (status === 'current') return 'var(--color-primary)';
    return 'var(--color-muted-foreground)';
  };

  return (
    <div className="sticky top-16 px-4 md:px-20 w-full z-40 bg-background border-b border-border">
      <div className="px-6 py-4">
        {/* Desktop Progress Indicator */}
        <div className="hidden md:flex justify-center">
          <div className="flex items-center justify-center w-full">
            {steps?.map((step, index) => {
              const status = getStepStatus(index);
              const isLast = index === steps?.length - 1;
              
              return (
                <div key={step?.id} className="flex items-center flex-1">
                  {/* Step Circle */}
                  <div className="flex items-center">
                    <div className={`
                      flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-200
                      ${status === 'completed' 
                        ? 'bg-success border-success text-success-foreground' 
                        : status === 'current' ?'bg-primary border-primary text-primary-foreground' :'bg-background border-muted-foreground/30 text-muted-foreground'
                      }
                    `}>
                      <Icon 
                        name={getStepIcon(step, status)} 
                        size={18} 
                        color={status === 'completed' || status === 'current' ? 'currentColor' : getStepIconColor(status)}
                        strokeWidth={2}
                      />
                    </div>
                    
                    {/* Step Content */}
                    <div className="ml-4">
                      <div className={`
                        text-sm font-medium transition-colors duration-200
                        ${status === 'current' ?'text-foreground' 
                          : status === 'completed' ?'text-success' :'text-muted-foreground'
                        }
                      `}>
                        {step?.title}
                      </div>
                      <div className="text-xs text-muted-foreground mt-0.5">
                        {step?.description}
                      </div>
                    </div>
                  </div>
                  {/* Connector Line */}
                  {!isLast && (
                    <div className="flex-1 mx-6">
                      <div className={`
                        h-0.5 transition-colors duration-200
                        ${status === 'completed' ? 'bg-success' : 'bg-border'}
                      `} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Mobile Progress Indicator */}
        <div className="md:hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {steps?.map((step, index) => {
                const status = getStepStatus(index);
                return (
                  <div
                    key={step?.id}
                    className={`
                      w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-200
                      ${status === 'completed' 
                        ? 'bg-success border-success' 
                        : status === 'current' ?'bg-primary border-primary' :'bg-background border-muted-foreground/30'
                      }
                    `}
                  >
                    <Icon 
                      name={getStepIcon(step, status)} 
                      size={14} 
                      color={status === 'completed' || status === 'current' ? 'white' : getStepIconColor(status)}
                      strokeWidth={2}
                    />
                  </div>
                );
              })}
            </div>
            
            {/* Current Step Info */}
            <div className="text-right">
              <div className="text-sm font-medium text-foreground">
                Step {getCurrentStepIndex() + 1} of {steps?.length}
              </div>
              <div className="text-xs text-muted-foreground">
                {steps?.[getCurrentStepIndex()]?.title}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StepProgressIndicator;