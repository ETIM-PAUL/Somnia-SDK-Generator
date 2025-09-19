import React from 'react';
import Icon from '../../../components/AppIcon';

const ContractSummary = ({ contractDetails }) => {
  const {
    address,
    name,
    selectedLanguages,
    customNaming,
    contractSize,
    verificationStatus,
    network
  } = contractDetails;

  const getLanguageIcon = (language) => {
    switch (language?.toLowerCase()) {
      case 'javascript':
        return 'FileText';
      case 'typescript':
        return 'FileCode';
      case 'python':
        return 'Package';
      case 'go':
        return 'FileCode';
      case 'rust':
        return 'FileText';
      default:
        return 'Code2';
    }
  };

  return (
    <div className="bg-card rounded-lg shadow-subtle border border-border p-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
          <Icon name="FileCode" size={20} color="var(--color-primary)" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-foreground">Contract Summary</h2>
          <p className="text-sm text-text-secondary">Generation configuration details</p>
        </div>
      </div>
      <div className="space-y-4">
        {/* Contract Address */}
        <div className="flex items-center justify-between p-3 bg-surface rounded-lg">
          <div className="flex items-center space-x-3">
            <Icon name="Hash" size={16} color="var(--color-text-secondary)" />
            <div>
              <p className="text-sm font-medium text-foreground">Contract Address</p>
              <p className="text-xs text-text-secondary font-mono">{address}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${
              verificationStatus === 'verified' ? 'bg-success' : 'bg-warning'
            }`} />
            <span className="text-xs text-text-secondary capitalize">
              {verificationStatus}
            </span>
          </div>
        </div>

        {/* Contract Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-3 bg-surface rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Icon name="Tag" size={16} color="var(--color-text-secondary)" />
              <span className="text-sm font-medium text-foreground">Contract Name</span>
            </div>
            <p className="text-sm text-text-secondary">{name}</p>
          </div>

          <div className="p-3 bg-surface rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Icon name="Globe" size={16} color="var(--color-text-secondary)" />
              <span className="text-sm font-medium text-foreground">Network</span>
            </div>
            <p className="text-sm text-text-secondary">{network}</p>
          </div>

          <div className="p-3 bg-surface rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Icon name="HardDrive" size={16} color="var(--color-text-secondary)" />
              <span className="text-sm font-medium text-foreground">Contract Size</span>
            </div>
            <p className="text-sm text-text-secondary">{contractSize}</p>
          </div>

          <div className="p-3 bg-surface rounded-lg">
            <div className="flex items-center space-x-2 mb-2">
              <Icon name="Package" size={16} color="var(--color-text-secondary)" />
              <span className="text-sm font-medium text-foreground">Package Name</span>
            </div>
            <p className="text-sm text-text-secondary">{customNaming}</p>
          </div>
        </div>

        {/* Selected Languages */}
        <div className="p-3 bg-surface rounded-lg">
          <div className="flex items-center space-x-2 mb-3">
            <Icon name="Code2" size={16} color="var(--color-text-secondary)" />
            <span className="text-sm font-medium text-foreground">Selected Languages</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {selectedLanguages?.map((language, index) => (
              <div
                key={index}
                className="flex items-center space-x-2 px-3 py-1 bg-primary/10 text-primary rounded-full"
              >
                <Icon name={getLanguageIcon(language)} size={14} />
                <span className="text-sm font-medium">{language}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContractSummary;