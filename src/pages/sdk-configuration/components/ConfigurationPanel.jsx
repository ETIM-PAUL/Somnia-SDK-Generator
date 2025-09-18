import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Input from '../../../components/ui/Input';
import { Checkbox } from '../../../components/ui/Checkbox';
import Select from '../../../components/ui/Select';

const ConfigurationPanel = ({ 
  config, 
  onConfigChange, 
  contractAnalysis 
}) => {
  const [expandedSections, setExpandedSections] = useState({
    naming: true,
    publishing: false,
    repository: false,
    optimization: false
  });

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev?.[section]
    }));
  };

  const versionOptions = [
    { value: 'patch', label: '1.0.x (Patch)' },
    { value: 'minor', label: '1.x.0 (Minor)' },
    { value: 'major', label: 'x.0.0 (Major)' }
  ];

  const licenseOptions = [
    { value: 'MIT', label: 'MIT License' },
    { value: 'Apache-2.0', label: 'Apache 2.0' },
    { value: 'GPL-3.0', label: 'GPL 3.0' },
    { value: 'BSD-3-Clause', label: 'BSD 3-Clause' }
  ];

  const ConfigSection = ({ title, icon, isExpanded, onToggle, children }) => (
    <div className="border border-border rounded-lg mb-4">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between p-4 text-left hover:bg-muted/50 transition-colors"
      >
        <div className="flex items-center space-x-3">
          <Icon name={icon} size={18} color="var(--color-primary)" strokeWidth={2} />
          <span className="font-medium text-foreground">{title}</span>
        </div>
        <Icon 
          name={isExpanded ? "ChevronUp" : "ChevronDown"} 
          size={16} 
          color="var(--color-muted-foreground)"
          strokeWidth={2}
        />
      </button>
      {isExpanded && (
        <div className="px-4 pb-4 border-t border-border">
          {children}
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Package Naming */}
      <ConfigSection
        title="Package Naming"
        icon="Package"
        isExpanded={expandedSections?.naming}
        onToggle={() => toggleSection('naming')}
      >
        <div className="space-y-4 pt-4">
          <Input
            label="Package Name Prefix"
            type="text"
            placeholder="@your-org/somnia-sdk"
            value={config?.packagePrefix}
            onChange={(e) => onConfigChange('packagePrefix', e?.target?.value)}
            description="NPM package naming convention"
          />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Version Strategy"
              options={versionOptions}
              value={config?.versionStrategy}
              onChange={(value) => onConfigChange('versionStrategy', value)}
            />
            
            <Input
              label="Initial Version"
              type="text"
              placeholder="1.0.0"
              value={config?.initialVersion}
              onChange={(e) => onConfigChange('initialVersion', e?.target?.value)}
            />
          </div>

          {/* Preview */}
          <div className="bg-muted rounded-lg p-3">
            <div className="text-xs font-medium text-muted-foreground mb-1">Package Preview</div>
            <div className="text-sm font-mono text-foreground">
              {config?.packagePrefix || '@your-org/somnia-sdk'}-contract-{contractAnalysis?.name?.toLowerCase() || 'example'}
            </div>
          </div>
        </div>
      </ConfigSection>
      {/* NPM Publishing */}
      <ConfigSection
        title="NPM Publishing"
        icon="Upload"
        isExpanded={expandedSections?.publishing}
        onToggle={() => toggleSection('publishing')}
      >
        <div className="space-y-4 pt-4">
          <Checkbox
            label="Auto-publish to NPM"
            description="Automatically publish generated SDKs to NPM registry"
            checked={config?.autoPublish}
            onChange={(e) => onConfigChange('autoPublish', e?.target?.checked)}
          />
          
          {config?.autoPublish && (
            <div className="space-y-4 pl-6 border-l-2 border-primary/20">
              <Select
                label="License"
                options={licenseOptions}
                value={config?.license}
                onChange={(value) => onConfigChange('license', value)}
              />
              
              <Input
                label="NPM Registry URL"
                type="url"
                placeholder="https://registry.npmjs.org"
                value={config?.registryUrl}
                onChange={(e) => onConfigChange('registryUrl', e?.target?.value)}
              />
              
              <Checkbox
                label="Include TypeScript definitions"
                checked={config?.includeTypeDefs}
                onChange={(e) => onConfigChange('includeTypeDefs', e?.target?.checked)}
              />
            </div>
          )}
        </div>
      </ConfigSection>
      {/* Repository Structure */}
      <ConfigSection
        title="Repository Structure"
        icon="FolderTree"
        isExpanded={expandedSections?.repository}
        onToggle={() => toggleSection('repository')}
      >
        <div className="space-y-4 pt-4">
          <Checkbox
            label="Generate README.md"
            description="Include comprehensive documentation"
            checked={config?.generateReadme}
            onChange={(e) => onConfigChange('generateReadme', e?.target?.checked)}
          />
          
          <Checkbox
            label="Include examples directory"
            description="Add usage examples and demos"
            checked={config?.includeExamples}
            onChange={(e) => onConfigChange('includeExamples', e?.target?.checked)}
          />
          
          <Checkbox
            label="Add GitHub Actions workflow"
            description="CI/CD pipeline for testing and deployment"
            checked={config?.includeGithubActions}
            onChange={(e) => onConfigChange('includeGithubActions', e?.target?.checked)}
          />
          
          <Checkbox
            label="Generate TypeScript declarations"
            description="Include .d.ts files for better IDE support"
            checked={config?.generateDeclarations}
            onChange={(e) => onConfigChange('generateDeclarations', e?.target?.checked)}
          />
        </div>
      </ConfigSection>
      {/* Gas Optimization */}
      <ConfigSection
        title="Gas Optimization"
        icon="Zap"
        isExpanded={expandedSections?.optimization}
        onToggle={() => toggleSection('optimization')}
      >
        <div className="space-y-4 pt-4">
          <div className="bg-success/10 border border-success/20 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Icon name="CheckCircle2" size={16} color="var(--color-success)" />
              <span className="text-sm font-medium text-success">
                Somnia Network Optimizations
              </span>
            </div>
            <div className="text-xs text-success/80">
              Sub-second finality integration automatically included
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="text-sm font-medium text-foreground">Contract Size</div>
              <div className="text-2xl font-bold text-primary">
                {contractAnalysis?.size || '24.5'} KB
              </div>
              <div className="text-xs text-muted-foreground">
                Within Somnia limits
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="text-sm font-medium text-foreground">Functions</div>
              <div className="text-2xl font-bold text-primary">
                {contractAnalysis?.functions || '12'}
              </div>
              <div className="text-xs text-muted-foreground">
                Public functions detected
              </div>
            </div>
          </div>
          
          <Checkbox
            label="Enable gas estimation"
            description="Include gas cost predictions for each function"
            checked={config?.enableGasEstimation}
            onChange={(e) => onConfigChange('enableGasEstimation', e?.target?.checked)}
          />
          
          <Checkbox
            label="Optimize for Somnia network"
            description="Apply Somnia-specific optimizations"
            checked={config?.optimizeForSomnia}
            onChange={(e) => onConfigChange('optimizeForSomnia', e?.target?.checked)}
          />
        </div>
      </ConfigSection>
    </div>
  );
};

export default ConfigurationPanel;