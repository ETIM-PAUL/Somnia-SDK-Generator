import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Button from './Button';

const WorkflowNavigationControls = ({ 
  canProceed = true, 
  isLoading = false, 
  onNext, 
  onPrevious,
  nextLabel,
  previousLabel,
  validationMessage 
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const steps = [
    {
      path: '/contract-input-dashboard',
      nextPath: '/sdk-configuration',
      nextLabel: 'Configure SDK',
      canGoBack: false
    },
    {
      path: '/sdk-configuration',
      nextPath: '/generation',
      previousPath: '/contract-input-dashboard',
      nextLabel: 'Generate SDK',
      previousLabel: 'Back to Contract Input',
      canGoBack: true
    }
  ];

  const currentStep = steps?.find(step => step?.path === location?.pathname);
  
  if (!currentStep) return null;

  const handleNext = () => {
    if (onNext) {
      onNext();
    } else if (currentStep?.nextPath) {
      navigate(currentStep?.nextPath);
    }
  };

  const handlePrevious = () => {
    if (onPrevious) {
      onPrevious();
    } else if (currentStep?.previousPath) {
      navigate(currentStep?.previousPath);
    }
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 bg-background border-t border-border">
      <div className="px-6 py-4">
        {/* Validation Message */}
        {validationMessage && !canProceed && (
          <div className="mb-4 p-3 rounded-lg bg-warning/10 border border-warning/20">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded-full bg-warning flex-shrink-0" />
              <span className="text-sm text-warning-foreground">
                {validationMessage}
              </span>
            </div>
          </div>
        )}

        {/* Navigation Controls */}
        <div className="flex items-center justify-between max-w-4xl mx-auto">
          {/* Previous Button */}
          <div className="flex-1">
            {currentStep?.canGoBack && (
              <Button
                variant="outline"
                onClick={handlePrevious}
                iconName="ArrowLeft"
                iconPosition="left"
                disabled={isLoading}
                className="w-full sm:w-auto"
              >
                {previousLabel || currentStep?.previousLabel || 'Previous'}
              </Button>
            )}
          </div>

          {/* Step Indicator (Mobile) */}
          <div className="flex-1 flex justify-center sm:hidden">
            <div className="text-xs text-muted-foreground">
              Step {steps?.findIndex(s => s?.path === location?.pathname) + 1} of {steps?.length}
            </div>
          </div>

          {/* Next Button */}
          <div className="flex-1 flex justify-end">
            {currentStep?.nextPath && (
              <Button
                variant={canProceed ? "default" : "outline"}
                onClick={handleNext}
                iconName="ArrowRight"
                iconPosition="right"
                disabled={!canProceed || isLoading}
                loading={isLoading}
                className="w-full sm:w-auto"
              >
                {nextLabel || currentStep?.nextLabel || 'Next'}
              </Button>
            )}
          </div>
        </div>

        {/* Progress Bar (Mobile) */}
        <div className="mt-4 sm:hidden">
          <div className="w-full bg-muted rounded-full h-1">
            <div 
              className="bg-primary h-1 rounded-full transition-all duration-300"
              style={{ 
                width: `${((steps?.findIndex(s => s?.path === location?.pathname) + 1) / steps?.length) * 100}%` 
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkflowNavigationControls;