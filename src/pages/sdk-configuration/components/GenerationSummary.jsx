import React from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const GenerationSummary = ({ 
  selectedLanguages, 
  config, 
  contractAnalysis, 
  onGenerate, 
  isGenerating 
}) => {
  const getEstimatedTime = () => {
    const baseTime = 30; // seconds
    const languageMultiplier = selectedLanguages?.length * 15;
    const configComplexity = (config?.autoPublish ? 20 : 0) + 
                           (config?.includeExamples ? 10 : 0) + 
                           (config?.generateDeclarations ? 15 : 0);
    
    return Math.ceil((baseTime + languageMultiplier + configComplexity) / 60);
  };

  const getPackageNames = () => {
    return selectedLanguages?.map(lang => {
      const prefix = config?.packagePrefix || '@your-org/somnia-sdk';
      const contractName = contractAnalysis?.name?.toLowerCase() || 'contract';
      return `${prefix}-${contractName}-${lang?.toLowerCase()}`;
    });
  };

  const summaryItems = [
    {
      label: 'Selected Languages',
      value: selectedLanguages?.join(', '),
      icon: 'Code'
    },
    {
      label: 'Package Names',
      value: getPackageNames()?.length,
      icon: 'Package',
      details: getPackageNames()
    },
    {
      label: 'Estimated Time',
      value: `~${getEstimatedTime()} min`,
      icon: 'Clock'
    },
    {
      label: 'Auto-publish',
      value: config?.autoPublish ? 'Enabled' : 'Disabled',
      icon: 'Upload'
    }
  ];

  const features = [
    { name: 'TypeScript Definitions', enabled: config?.includeTypeDefs || config?.generateDeclarations },
    { name: 'Documentation', enabled: config?.generateReadme },
    { name: 'Usage Examples', enabled: config?.includeExamples },
    { name: 'GitHub Actions', enabled: config?.includeGithubActions },
    { name: 'Gas Estimation', enabled: config?.enableGasEstimation },
    { name: 'Somnia Optimization', enabled: config?.optimizeForSomnia }
  ];

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
          <Icon name="FileCheck" size={20} color="var(--color-primary)" />
        </div>
        <div>
          <h3 className="text-lg font-semibold text-foreground">Generation Summary</h3>
          <p className="text-sm text-muted-foreground">
            Review your configuration before generating SDKs
          </p>
        </div>
      </div>
      {/* Summary Items */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        {summaryItems?.map((item, index) => (
          <div key={index} className="flex items-start space-x-3 p-3 bg-muted/50 rounded-lg">
            <Icon 
              name={item?.icon} 
              size={16} 
              color="var(--color-primary)" 
              strokeWidth={2}
              className="mt-0.5 flex-shrink-0"
            />
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium text-foreground mb-1">
                {item?.label}
              </div>
              <div className="text-sm text-muted-foreground">
                {item?.value}
              </div>
              {item?.details && (
                <div className="mt-2 space-y-1">
                  {item?.details?.map((detail, idx) => (
                    <div key={idx} className="text-xs font-mono bg-background px-2 py-1 rounded">
                      {detail}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      {/* Features */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-foreground mb-3">Included Features</h4>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {features?.map((feature, index) => (
            <div key={index} className="flex items-center space-x-2">
              <Icon 
                name={feature?.enabled ? "CheckCircle2" : "Circle"} 
                size={14} 
                color={feature?.enabled ? "var(--color-success)" : "var(--color-muted-foreground)"}
                strokeWidth={2}
              />
              <span className={`text-xs ${
                feature?.enabled ? 'text-foreground' : 'text-muted-foreground'
              }`}>
                {feature?.name}
              </span>
            </div>
          ))}
        </div>
      </div>
      {/* Contract Info */}
      <div className="bg-primary/5 border border-primary/20 rounded-lg p-4 mb-6">
        <div className="flex items-center space-x-2 mb-2">
          <Icon name="FileCode" size={16} color="var(--color-primary)" />
          <span className="text-sm font-medium text-primary">Contract Information</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div>
            <span className="text-muted-foreground">Name:</span>
            <div className="font-mono text-foreground">
              {contractAnalysis?.name || 'SomniaToken'}
            </div>
          </div>
          <div>
            <span className="text-muted-foreground">Size:</span>
            <div className="font-mono text-foreground">
              {contractAnalysis?.size || '24.5'} KB
            </div>
          </div>
          <div>
            <span className="text-muted-foreground">Functions:</span>
            <div className="font-mono text-foreground">
              {contractAnalysis?.function || '12'}
            </div>
          </div>
        </div>
      </div>
      {/* Generation Button */}
      <div className="flex flex-col sm:flex-row items-center justify-between space-y-3 sm:space-y-0 sm:space-x-4">
        <div className="text-sm text-muted-foreground">
          {selectedLanguages?.length === 0 
            ? 'Please select at least one language to continue'
            : `Ready to generate ${selectedLanguages?.length} SDK${selectedLanguages?.length > 1 ? 's' : ''}`
          }
        </div>
        
        <Button
          variant="default"
          size="lg"
          onClick={onGenerate}
          disabled={selectedLanguages?.length === 0 || isGenerating}
          loading={isGenerating}
          iconName="Download"
          iconPosition="right"
          className="w-full sm:w-auto"
        >
          {isGenerating ? 'Generating SDKs...' : 'Generate SDKs'}
        </Button>
      </div>
      {/* Progress Indicator */}
      {isGenerating && (
        <div className="mt-4 p-4 bg-accent/10 border border-accent/20 rounded-lg">
          <div className="flex items-center space-x-3 mb-2">
            <Icon name="Loader2" size={16} color="var(--color-accent)" className="animate-spin" />
            <span className="text-sm font-medium text-accent">
              Generating your SDKs...
            </span>
          </div>
          <div className="w-full bg-accent/20 rounded-full h-2">
            <div className="bg-accent h-2 rounded-full animate-pulse" style={{ width: '45%' }} />
          </div>
          <div className="text-xs text-accent/80 mt-1">
            This may take a few minutes depending on your configuration
          </div>
        </div>
      )}
    </div>
  );
};

export default GenerationSummary;