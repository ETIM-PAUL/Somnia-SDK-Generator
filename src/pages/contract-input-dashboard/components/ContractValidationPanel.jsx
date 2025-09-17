import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const ContractValidationPanel = ({ 
  validationResults, 
  isValidating, 
  onValidate, 
  onRetry 
}) => {
  const getStatusIcon = (status) => {
    switch (status) {
      case 'success': return 'CheckCircle2';
      case 'error': return 'AlertCircle';
      case 'warning': return 'AlertTriangle';
      case 'pending': return 'Clock';
      default: return 'Minus';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'success': return 'var(--color-success)';
      case 'error': return 'var(--color-error)';
      case 'warning': return 'var(--color-warning)';
      case 'pending': return 'var(--color-accent)';
      default: return 'var(--color-muted-foreground)';
    }
  };

  const validationChecks = [
    {
      id: 'deployment',
      label: 'Contract Deployment',
      description: 'Verify contract exists on Somnia testnet',
      status: validationResults?.deployment?.status || 'pending',
      message: validationResults?.deployment?.message || 'Checking deployment status...'
    },
    {
      id: 'verification',
      label: 'Contract Verification',
      description: 'Confirm contract is verified on blockchain',
      status: validationResults?.verification?.status || 'pending',
      message: validationResults?.verification?.message || 'Awaiting deployment check...'
    },
    {
      id: 'bytecode',
      label: 'Bytecode Matching',
      description: 'Compare provided code with deployed bytecode',
      status: validationResults?.bytecode?.status || 'pending',
      message: validationResults?.bytecode?.message || 'Awaiting code input...'
    },
    {
      id: 'size',
      label: 'Contract Size',
      description: 'Validate contract size within limits',
      status: validationResults?.size?.status || 'pending',
      message: validationResults?.size?.message || 'Checking contract size...'
    }
  ];

  const getOverallStatus = () => {
    if (!validationResults) return 'pending';
    
    const statuses = Object.values(validationResults)?.map(result => result?.status);
    
    if (statuses?.includes('error')) return 'error';
    if (statuses?.includes('warning')) return 'warning';
    if (statuses?.every(status => status === 'success')) return 'success';
    
    return 'pending';
  };

  const overallStatus = getOverallStatus();

  return (
    <div className="bg-card border border-border rounded-lg p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
            overallStatus === 'success' ? 'bg-success/10' :
            overallStatus === 'error' ? 'bg-error/10' :
            overallStatus === 'warning'? 'bg-warning/10' : 'bg-muted'
          }`}>
            <Icon 
              name={isValidating ? 'Loader2' : getStatusIcon(overallStatus)} 
              size={20} 
              color={getStatusColor(overallStatus)}
              className={isValidating ? 'animate-spin' : ''}
            />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">
              Contract Validation
            </h3>
            <p className="text-sm text-muted-foreground">
              {isValidating ? 'Running validation checks...' : 
               overallStatus === 'success' ? 'All checks passed successfully' :
               overallStatus === 'error' ? 'Validation failed - please review errors' :
               overallStatus === 'warning' ? 'Validation completed with warnings' :
               'Ready to validate contract'}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2">
          {validationResults && overallStatus === 'error' && (
            <Button
              variant="outline"
              size="sm"
              onClick={onRetry}
              iconName="RotateCcw"
              iconPosition="left"
            >
              Retry
            </Button>
          )}
          <Button
            variant={overallStatus === 'success' ? 'success' : 'default'}
            size="sm"
            onClick={onValidate}
            loading={isValidating}
            iconName={overallStatus === 'success' ? 'CheckCircle2' : 'Play'}
            iconPosition="left"
          >
            {isValidating ? 'Validating...' : 
             overallStatus === 'success' ? 'Re-validate' : 'Validate Contract'}
          </Button>
        </div>
      </div>
      {/* Validation Checks */}
      <div className="space-y-4">
        {validationChecks?.map((check, index) => (
          <div key={check?.id} className="flex items-start space-x-4 p-4 bg-muted/30 rounded-lg">
            {/* Status Icon */}
            <div className="flex-shrink-0 mt-0.5">
              <Icon 
                name={getStatusIcon(check?.status)} 
                size={18} 
                color={getStatusColor(check?.status)}
                strokeWidth={2}
              />
            </div>

            {/* Check Details */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <h4 className="text-sm font-medium text-foreground">
                  {check?.label}
                </h4>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  check?.status === 'success' ? 'bg-success/10 text-success' :
                  check?.status === 'error' ? 'bg-error/10 text-error' :
                  check?.status === 'warning'? 'bg-warning/10 text-warning' : 'bg-muted text-muted-foreground'
                }`}>
                  {check?.status === 'success' ? 'Passed' :
                   check?.status === 'error' ? 'Failed' :
                   check?.status === 'warning'? 'Warning' : 'Pending'}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mb-2">
                {check?.description}
              </p>
              <p className="text-sm text-foreground">
                {check?.message}
              </p>
            </div>
          </div>
        ))}
      </div>
      {/* Contract Metrics */}
      {validationResults && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-border">
          <div className="text-center">
            <div className="text-lg font-semibold text-foreground">
              {validationResults?.metrics?.size || '0'}
            </div>
            <div className="text-xs text-muted-foreground">
              Contract Size (KB)
            </div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-foreground">
              {validationResults?.metrics?.functions || '0'}
            </div>
            <div className="text-xs text-muted-foreground">
              Functions
            </div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-foreground">
              {validationResults?.metrics?.events || '0'}
            </div>
            <div className="text-xs text-muted-foreground">
              Events
            </div>
          </div>
          <div className="text-center">
            <div className="text-lg font-semibold text-foreground">
              {validationResults?.metrics?.gasOptimization || 'N/A'}
            </div>
            <div className="text-xs text-muted-foreground">
              Gas Score
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContractValidationPanel;