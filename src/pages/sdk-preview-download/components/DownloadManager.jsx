import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const DownloadManager = ({ 
  availablePackages = [],
  downloadProgress = {},
  onDownload = () => {},
  state,
  isGenerating = false 
}) => {
  const [selectedPackages, setSelectedPackages] = useState(new Set());
  const [publishToNpm, setPublishToNpm] = useState(false);
  const [npmConfig, setNpmConfig] = useState({
    registry: 'https://registry.npmjs.org',
    scope: '@somnia',
    version: '1.0.0'
  });

  const defaultPackages = [
    {
      id: 'javascript-sdk',
      name: 'JavaScript SDK',
      description: 'Complete JavaScript/Node.js SDK package',
      format: 'npm',
      size: 'proposed size - 2.4 MB',
      icon: 'FileText',
      language: 'javascript',
      files: ['package.json', 'index.js', 'contracts/', 'README.md']
    },
    // {
    //   id: 'typescript-sdk',
    //   name: 'TypeScript SDK',
    //   description: 'TypeScript SDK with full type definitions',
    //   format: 'npm',
    //   size: '3.1 MB',
    //   icon: 'FileCode',
    //   language: 'typescript',
    //   files: ['package.json', 'index.ts', 'contracts/', 'README.md', 'types/']
    // },
    // {
    //   id: 'python-sdk',
    //   name: 'Python SDK',
    //   description: 'Python package with pip installation support',
    //   format: 'pip',
    //   size: '1.8 MB',
    //   icon: 'Package',
    //   language: 'python',
    //   files: ['setup.py', 'somnia_sdk/', 'README.md', 'requirements.txt']
    // },
    {
      id: 'documentation',
      name: 'Documentation',
      description: 'Complete API documentation and examples',
      format: 'zip',
      size: 'proposed size - 5.2 MB',
      icon: 'BookOpen',
      language: 'markdown',
      files: ['docs/', 'examples/', 'README.md']
    }
  ];

  const packages = availablePackages?.length > 0 ? availablePackages : defaultPackages;

  const togglePackageSelection = (packageId) => {
    const newSelected = new Set(selectedPackages);
    if (newSelected?.has(packageId)) {
      newSelected?.delete(packageId);
    } else {
      newSelected?.add(packageId);
    }
    setSelectedPackages(newSelected);
  };

  const handleDownloadSelected = () => {
    const selectedPackagesList = packages?.filter(pkg => selectedPackages?.has(pkg?.id));
    onDownload(selectedPackagesList, { publishToNpm, npmConfig });
  };

  const handleDownloadAll = () => {
    onDownload(packages, { publishToNpm, npmConfig });
  };

  const getDownloadStatus = (packageId) => {
    return downloadProgress?.[packageId] || { status: 'ready', progress: 0 };
  };

  const renderPackageCard = (pkg) => {
    const isSelected = selectedPackages?.has(pkg?.id);
    const downloadStatus = getDownloadStatus(pkg?.id);
    const isDownloading = downloadStatus?.status === 'downloading';
    const isCompleted = downloadStatus?.status === 'completed';

    return (
      <div
        key={pkg?.id}
        className={`border rounded-lg p-4 transition-smooth cursor-pointer ${
          isSelected 
            ? 'border-primary bg-primary/5' :'border-border hover:border-primary/50 hover:bg-muted/50'
        }`}
        onClick={() => !isDownloading && togglePackageSelection(pkg?.id)}
      >
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center space-x-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              isSelected ? 'bg-primary text-primary-foreground' : 'bg-surface'
            }`}>
              <Icon 
                name={pkg?.icon} 
                size={20} 
                color={isSelected ? 'white' : 'var(--color-text-secondary)'} 
              />
            </div>
            <div>
              <h3 className="font-medium text-foreground">{pkg?.name}</h3>
              <p className="text-sm text-text-secondary">{pkg?.description}</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {isCompleted && (
              <Icon name="CheckCircle" size={16} color="var(--color-success)" />
            )}
            <span className="text-xs text-text-secondary bg-surface px-2 py-1 rounded">
              {pkg?.size}
            </span>
          </div>
        </div>
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center space-x-4">
            <span className="text-text-secondary">Format: {pkg?.format?.toUpperCase()}</span>
            <span className="text-text-secondary">Files: {pkg?.files?.length}</span>
          </div>
          {isDownloading && (
            <div className="flex items-center space-x-2">
              <div className="w-16 h-1 bg-border rounded-full overflow-hidden">
                <div 
                  className="h-full bg-primary transition-all duration-300"
                  style={{ width: `${downloadStatus?.progress}%` }}
                />
              </div>
              <span className="text-xs text-text-secondary">{downloadStatus?.progress}%</span>
            </div>
          )}
        </div>
        {isSelected && (
          <div className="mt-3 pt-3 border-t border-border">
            <div className="flex flex-wrap gap-1">
              {pkg?.files?.map((file, index) => (
                <span 
                  key={index}
                  className="text-xs bg-primary/10 text-primary px-2 py-1 rounded"
                >
                  {file}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  if (isGenerating) {
    return (
      <div className="bg-card rounded-lg shadow-subtle border border-border p-6">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <h3 className="text-lg font-medium text-foreground mb-2">Preparing Downloads</h3>
          <p className="text-text-secondary">Packaging your generated SDK files...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg shadow-subtle border border-border">
      {/* Header */}
      <div className="border-b border-border p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-semibold text-foreground">Download SDK Packages</h2>
            <p className="text-text-secondary mt-1">
              Select the packages you need for your project
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              onClick={handleDownloadSelected}
              disabled={selectedPackages?.size === 0}
              iconName="Download"
              iconPosition="left"
            >
              Download Selected ({selectedPackages?.size})
            </Button>
            <Button
              variant="default"
              onClick={handleDownloadAll}
              iconName="Package"
              iconPosition="left"
            >
              Download All
            </Button>
          </div>
        </div>

        {/* NPM Publishing Options */}
        <div className="bg-surface hidden rounded-lg p-4">
          <div className="flex items-center space-x-3 mb-3">
            <input
              type="checkbox"
              id="publish-npm"
              checked={state?.auto_publish}
              onChange={(e) => setPublishToNpm(e?.target?.checked)}
              className="w-4 h-4 text-primary border-border rounded focus:ring-primary"
            />
            <label htmlFor="publish-npm" className="text-sm font-medium text-foreground">
              Publish to NPM Registry
            </label>
          </div>
          
          {publishToNpm && (
            <div className="grid hidden grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1">
                  Registry URL
                </label>
                <input
                  type="url"
                  value={npmConfig?.registry}
                  onChange={(e) => setNpmConfig({...npmConfig, registry: e?.target?.value})}
                  className="w-full px-3 py-2 text-sm border border-border rounded-md focus:ring-primary focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1">
                  Package Scope
                </label>
                <input
                  type="text"
                  value={npmConfig?.scope}
                  onChange={(e) => setNpmConfig({...npmConfig, scope: e?.target?.value})}
                  className="w-full px-3 py-2 text-sm border border-border rounded-md focus:ring-primary focus:border-primary"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1">
                  Version
                </label>
                <input
                  type="text"
                  value={npmConfig?.version}
                  onChange={(e) => setNpmConfig({...npmConfig, version: e?.target?.value})}
                  className="w-full px-3 py-2 text-sm border border-border rounded-md focus:ring-primary focus:border-primary"
                />
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Package List */}
      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {packages?.map(renderPackageCard)}
        </div>
      </div>
    </div>
  );
};

export default DownloadManager;