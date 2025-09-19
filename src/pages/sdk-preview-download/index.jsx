import React, { useState, useEffect, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import Header from '../../components/ui/Header';
import ProgressIndicator from '../../components/ui/ProgressIndicator';
import CodePreviewPanel from './components/CodePreviewPanel';
import DownloadManager from './components/DownloadManager';
import NotificationToast, { useNotifications } from '../../components/ui/NotificationToast';
import DocumentationPreview from './components/DocumentationPreview';
import { ContractContext } from 'context/globalState';

const SDKPreviewAndDownload = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { state, dispatch } = useContext(ContractContext);

  const { notifications, addNotification, removeNotification, success, error, warning } = useNotifications();
console.log(state)
  // State management
  const [activeTab, setActiveTab] = useState('code-preview');
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  const [downloadProgress, setDownloadProgress] = useState({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationComplete, setGenerationComplete] = useState(true);
  const [npmPublishConfig, setNpmPublishConfig] = useState({
    enabled: false,
    registry: 'https://registry.npmjs.org',
    scope: '@somnia',
    version: '1.0.0',
    access: 'public'
  });

  // Mock SDK generation data
  const [sdkData] = useState({
    contractAddress: state?.address,
    contractName: state?.name,
    generatedAt: new Date()?.toISOString(),
    languages: state?.selectedLanguages ?? ['javascript', ' typescript', 'python'],
    optimizationApplied: state?.config.enableGasEstimation,
    securityScore: state?.analysis?.security_score,
    gasOptimization: 32.4
  });

  const mainTabs = [
    { id: 'code-preview', label: 'Code Preview', icon: 'Code2' },
    // { id: 'optimization', label: 'Optimization Analysis', icon: 'Zap' },
    { id: 'documentation', label: 'Documentation', icon: 'BookOpen' },
    // { id: 'performance', label: 'Performance Metrics', icon: 'BarChart3' },
    { id: 'download', label: 'Download & Publish', icon: 'Download' }
  ];

  // Initialize from URL params or previous state
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const tab = urlParams?.get('tab');
    const lang = urlParams?.get('language');
    
    if (tab && mainTabs?.find(t => t?.id === tab)) {
      setActiveTab(tab);
    }
    if (lang) {
      setSelectedLanguage(lang);
    }

    // Show success notification if coming from generation
    if (location?.state?.generationComplete) {
      success('SDK generation completed successfully! Review your code and download when ready.');
    }
  }, [location]);

  // Handle language change
  const handleLanguageChange = (language) => {
    setSelectedLanguage(language);
    const url = new URL(window.location);
    url?.searchParams?.set('language', language);
    window.history?.replaceState({}, '', url);
  };

  // Handle tab change
  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    const url = new URL(window.location);
    url?.searchParams?.set('tab', tabId);
    window.history?.replaceState({}, '', url);
  };

  // Handle download
  const handleDownload = async (packages, config) => {
    setIsGenerating(true);
    
    try {
      // Simulate download process
      for (const pkg of packages) {
        setDownloadProgress(prev => ({
          ...prev,
          [pkg?.id]: { status: 'downloading', progress: 0 }
        }));

        // Simulate progress
        for (let i = 0; i <= 100; i += 10) {
          await new Promise(resolve => setTimeout(resolve, 100));
          setDownloadProgress(prev => ({
            ...prev,
            [pkg?.id]: { status: 'downloading', progress: i }
          }));
        }

        setDownloadProgress(prev => ({
          ...prev,
          [pkg?.id]: { status: 'completed', progress: 100 }
        }));
      }

      success(`Successfully downloaded ${packages?.length} package(s)!`);

      // Handle NPM publishing if enabled
      if (config?.publishToNpm) {
        warning('NPM publishing initiated. Check your email for authentication link.');
      }

    } catch (err) {
      error('Download failed. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Handle navigation
  const handleNavigation = (path) => {
    navigate(path);
  };

  // Handle regeneration
  const handleRegenerate = () => {
    navigate('/sdk-generation', { 
      state: { 
        regenerate: true,
        contractAddress: sdkData?.contractAddress 
      }
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Progress Indicator */}
        <div className="mb-8">
          <ProgressIndicator
            currentStep={4}
            totalSteps={4}
            stepLabels={['Input', 'Validate', 'Generate', 'Complete']}
            processingStatus="completed"
            completionPercentage={100}
          />
        </div>

        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">SDK Preview & Download</h1>
              <p className="text-text-secondary">
                Review your generated SDK, analyze optimizations, and download packages
              </p>
              <div className="flex items-center space-x-4 mt-3 text-sm text-text-secondary">
                <div className="flex items-center space-x-2">
                  <Icon name="Package" size={16} />
                  <span>Contract: {sdkData?.contractName}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Icon name="Clock" size={16} />
                  <span>Generated: {new Date(sdkData.generatedAt)?.toLocaleString()}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Icon name="CheckCircle" size={16} color="var(--color-success)" />
                  <span className="text-success">Optimized</span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3 mt-4 md:mt-0">
              <Button
                variant="outline"
                onClick={handleRegenerate}
                iconName="RefreshCw"
                iconPosition="left"
              >
                Regenerate
              </Button>
              <Button
                variant="default"
                onClick={() => handleTabChange('download')}
                iconName="Download"
                iconPosition="left"
              >
                Download SDK
              </Button>
            </div>
          </div>
        </div>

        {/* Main Tabs */}
        <div className="mb-8">
          <div className="border-b border-border">
            <div className="flex space-x-1 overflow-x-auto">
              {mainTabs?.map((tab) => (
                <button
                  key={tab?.id}
                  onClick={() => handleTabChange(tab?.id)}
                  className={`flex items-center space-x-2 px-4 py-3 text-sm font-medium whitespace-nowrap transition-smooth ${
                    activeTab === tab?.id
                      ? 'text-primary border-b-2 border-primary bg-primary/5' :'text-text-secondary hover:text-foreground hover:bg-muted'
                  }`}
                >
                  <Icon name={tab?.icon} size={16} />
                  <span>{tab?.label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Tab Content */}
        <div className="space-y-8">
          {activeTab === 'code-preview' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-foreground">Generated SDK Code</h2>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-text-secondary">Language:</span>
                  <select
                    value={selectedLanguage}
                    onChange={(e) => handleLanguageChange(e?.target?.value)}
                    className="px-3 py-1 border border-border rounded-md text-sm focus:ring-primary focus:border-primary"
                  >
                    {sdkData?.languages?.map((lang) => (
                      <option key={lang} value={lang}>
                        {lang?.charAt(0)?.toUpperCase() + lang?.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <CodePreviewPanel
                selectedLanguage={selectedLanguage}
                onLanguageChange={handleLanguageChange}
                isLoading={false}
                state={state}
              />
            </div>
          )}

          {/* {activeTab === 'optimization' && (
            <OptimizationAnalysisPanel
              isLoading={false}
            />
          )} */}

          {activeTab === 'documentation' && (
            <DocumentationPreview
              selectedLanguage={selectedLanguage}
              isLoading={false}
            />
          )}

          {/* {activeTab === 'performance' && (
            <PerformanceMetrics
              isLoading={false}
            />
          )} */}

          {activeTab === 'download' && (
            <DownloadManager
              downloadProgress={downloadProgress}
              onDownload={handleDownload}
              isGenerating={isGenerating}
            />
          )}
        </div>

        {/* Quick Actions */}
        <div className="mt-12 bg-surface rounded-lg p-6">
          <h3 className="text-lg font-medium text-foreground mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button
              variant="outline"
              onClick={() => handleNavigation('/sdk-generation')}
              iconName="ArrowLeft"
              iconPosition="left"
              fullWidth
            >
              Back to Generation
            </Button>
            <Button
              variant="outline"
              onClick={() => handleTabChange('code-preview')}
              iconName="Code2"
              iconPosition="left"
              fullWidth
            >
              Review Code
            </Button>
            <Button
              variant="default"
              onClick={() => handleTabChange('download')}
              iconName="Download"
              iconPosition="left"
              fullWidth
            >
              Download All
            </Button>
          </div>
        </div>
      </div>
      {/* Notifications */}
      <NotificationToast
        notifications={notifications}
        onDismiss={removeNotification}
        position="top-right"
      />
    </div>
  );
};

export default SDKPreviewAndDownload;