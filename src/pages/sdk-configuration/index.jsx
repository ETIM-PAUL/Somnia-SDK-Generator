import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import StepProgressIndicator from '../../components/ui/StepProgressIndicator';
import WorkflowNavigationControls from '../../components/ui/WorkflowNavigationControls';
import ValidationStatusBanner from '../../components/ui/ValidationStatusBanner';
import LanguageSelectionCard from './components/LanguageSelectionCard';
import ConfigurationPanel from './components/ConfigurationPanel';
import ContractAnalysisResults from './components/ContractAnalysisResults';
import GenerationSummary from './components/GenerationSummary';
import Icon from '../../components/AppIcon';
import { ContractContext } from 'context/globalState';

const SDKConfiguration = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useContext(ContractContext);
  const [selectedLanguages, setSelectedLanguages] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState(false);
  const [validationStatus, setValidationStatus] = useState(null);

  // Configuration state
  const [config, setConfig] = useState({
    packagePrefix: '@somnia/sdk',
    versionStrategy: 'patch',
    initialVersion: '1.0.0',
    autoPublish: false,
    license: 'MIT',
    registryUrl: 'https://registry.npmjs.org',
    includeTypeDefs: true,
    generateReadme: true,
    includeExamples: true,
    includeGithubActions: false,
    generateDeclarations: true,
    enableGasEstimation: true,
    optimizeForSomnia: true
  });

  // Mock contract analysis data
  const contractAnalysis = {
    contractName: 'SomniaToken',
    contractSize: '24.5',
    functionCount: 12,
    gasEfficiency: '92%',
    securityScore: '9.2/10',
    functions: [
      {
        name: 'transfer',
        signature: 'transfer(address,uint256)',
        gasEstimate: '21,000',
        visibility: 'public'
      },
      {
        name: 'approve',
        signature: 'approve(address,uint256)',
        gasEstimate: '46,000',
        visibility: 'public'
      },
      {
        name: 'balanceOf',
        signature: 'balanceOf(address)',
        gasEstimate: '2,300',
        visibility: 'view'
      },
      {
        name: 'totalSupply',
        signature: 'totalSupply()',
        gasEstimate: '2,300',
        visibility: 'view'
      },
      {
        name: 'allowance',
        signature: 'allowance(address,address)',
        gasEstimate: '2,300',
        visibility: 'view'
      },
      {
        name: 'mint',
        signature: 'mint(address,uint256)',
        gasEstimate: '51,000',
        visibility: 'public'
      }
    ],
    recommendations: [
      {
        type: 'gas',
        title: 'Batch Operations',
        description: 'Consider implementing batch transfer functions to reduce gas costs for multiple operations',
        impact: 'medium',
        savings: '~30% gas reduction'
      },
      {
        type: 'performance',
        title: 'Event Optimization',
        description: 'Optimize event emissions for better indexing performance on Somnia network',
        impact: 'low',
        savings: '~5% improvement'
      },
      {
        type: 'security',
        title: 'Access Control',
        description: 'Consider implementing role-based access control for administrative functions',
        impact: 'high',
        savings: 'Enhanced security'
      }
    ]
  };

  // Language options with features and code previews
  const languageOptions = [
    {
      name: 'JavaScript',
      compatibility: 'full',
      features: [
        { name: 'ES6+ Support', supported: true },
        { name: 'Promise-based API', supported: true },
        { name: 'TypeScript Definitions', supported: true },
        { name: 'Tree Shaking', supported: true },
        { name: 'Browser Compatible', supported: true },
        { name: 'Node.js Compatible', supported: true }
      ],
    },
    {
      name: 'TypeScript',
      compatibility: 'full',
      features: [
        { name: 'Full Type Safety', supported: true },
        { name: 'IntelliSense Support', supported: true },
        { name: 'Generic Types', supported: true },
        { name: 'Interface Definitions', supported: true },
        { name: 'Compile-time Validation', supported: true },
        { name: 'Modern Decorators', supported: true }
      ],
    },
    {
      name: 'Python',
      compatibility: 'partial',
      features: [
        { name: 'Async/Await Support', supported: true },
        { name: 'Type Hints', supported: true },
        { name: 'Dataclass Models', supported: true },
        { name: 'Exception Handling', supported: true },
        { name: 'Web3.py Integration', supported: true },
        { name: 'Jupyter Notebook', supported: false }
      ],
    }
  ];

  useEffect(() => {
    // Show success banner when component mounts
    setValidationStatus({
      type: 'success',
      title: 'Contract Validated Successfully',
      message: 'Your smart contract has been verified and is ready for SDK generation.',
      isDismissible: true,
      autoHide: true
    });
  }, []);

  const handleLanguageToggle = (language, isSelected) => {
    setSelectedLanguages(prev => {
      if (isSelected) {
        return [...prev, language];
      } else {
        return prev?.filter(lang => lang !== language);
      }
    });
  };

  const handleConfigChange = (key, value) => {
    setConfig(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleGenerate = async () => {
    if (selectedLanguages?.length === 0) {
      setValidationStatus({
        type: 'warning',
        title: 'No Languages Selected',
        message: 'Please select at least one programming language to generate SDKs.',
        isDismissible: true
      });
      return;
    }
    dispatch({ type: "SET_SELECTED_LANGS", payload: selectedLanguages });
    dispatch({ type: "SET_CONFIG", payload: config });
    navigate("/sdk-generation")
    // setIsGenerating(true);
    // setValidationStatus({
    //   type: 'loading',
    //   title: 'Generating SDKs',
    //   message: `Creating ${selectedLanguages?.length} SDK${selectedLanguages?.length > 1 ? 's' : ''} for your smart contract...`,
    //   persistent: true
    // });

    // // Simulate SDK generation process
    // setTimeout(() => {
    //   setIsGenerating(false);
    //   setValidationStatus({
    //     type: 'success',
    //     title: 'SDKs Generated Successfully',
    //     message: `${selectedLanguages?.length} SDK${selectedLanguages?.length > 1 ? 's' : ''} have been created and are ready for download.`,
    //     isDismissible: true,
    //     action: {
    //       label: 'Download SDKs',
    //       icon: 'Download',
    //       onClick: () => {
    //         // Navigate to generation/download page
    //         navigate('/generation');
    //       }
    //     }
    //   });
    // }, 3000);
  };

  const canProceed = selectedLanguages?.length > 0 && !isGenerating;

  if (!state?.name) {
    navigate("/")
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <StepProgressIndicator />
      <main className="pb-32">
        <div className="max-w-7xl mx-auto px-6 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Icon name="Settings" size={20} color="var(--color-primary)" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">SDK Configuration</h1>
                <p className="text-muted-foreground">
                  Customize your SDK generation parameters and select target programming languages
                </p>
              </div>
            </div>

            {/* Validation Status */}
            {validationStatus && (
              <ValidationStatusBanner
                type={validationStatus?.type}
                title={validationStatus?.title}
                message={validationStatus?.message}
                isDismissible={validationStatus?.isDismissible}
                persistent={validationStatus?.persistent}
                autoHide={validationStatus?.autoHide}
                action={validationStatus?.action}
                onDismiss={() => setValidationStatus(null)}
              />
            )}
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Left Column - Language Selection */}
            <div className="xl:col-span-2 space-y-8">
              {/* Language Selection */}
              <section>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-semibold text-foreground mb-2">
                      Select Programming Languages
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Choose the languages for your SDK generation. Multiple selections are supported.
                    </p>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {selectedLanguages?.length} selected
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {languageOptions?.map((language,index) => (
                    <LanguageSelectionCard
                      key={state?.name}
                      language={language?.name}
                      isSelected={selectedLanguages?.includes(language?.name)}
                      onToggle={(isSelected) => handleLanguageToggle(language?.name, isSelected)}
                      features={language?.features}
                      codePreview={state?.code.slice(0,300) + "..."}
                      compatibility={language?.compatibility}
                    />
                  ))}
                </div>
              </section>

              {/* Configuration Panel */}
              <section>
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-semibold text-foreground mb-2">
                      Advanced Configuration
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Customize package naming, publishing options, and repository structure
                    </p>
                  </div>
                </div>

                <ConfigurationPanel
                  config={config}
                  onConfigChange={handleConfigChange}
                  contractAnalysis={state}
                />
              </section>

              {/* Contract Analysis Toggle */}
              <section>
                <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <Icon name="BarChart3" size={20} color="var(--color-primary)" />
                    <div>
                      <h3 className="font-medium text-foreground">Contract Analysis Results</h3>
                      <p className="text-sm text-muted-foreground">
                        View detailed performance metrics and optimization recommendations
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowAnalysis(!showAnalysis)}
                    className="flex items-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    <span className="text-sm font-medium">
                      {showAnalysis ? 'Hide' : 'Show'} Analysis
                    </span>
                    <Icon 
                      name={showAnalysis ? "ChevronUp" : "ChevronDown"} 
                      size={16} 
                      color="currentColor"
                    />
                  </button>
                </div>

                {showAnalysis && (
                  <div className="mt-6">
                    <ContractAnalysisResults analysis={contractAnalysis} ai_Analysis={state} />
                  </div>
                )}
              </section>
            </div>

            {/* Right Column - Generation Summary */}
            <div className="xl:col-span-1">
              <div className="sticky top-32">
                <GenerationSummary
                  selectedLanguages={selectedLanguages}
                  config={config}
                  contractAnalysis={state}
                  onGenerate={handleGenerate}
                  isGenerating={isGenerating}
                />
              </div>
            </div>
          </div>
        </div>
      </main>
      <WorkflowNavigationControls
        canProceed={canProceed}
        isLoading={isGenerating}
        onNext={handleGenerate}
        onPrevious={() => navigate('/contract-upload')}
        nextLabel="Generate SDKs"
        previousLabel="Back to Upload"
        validationMessage={selectedLanguages?.length === 0 ? "Please select at least one programming language to continue" : null}
      />
    </div>
  );
};

export default SDKConfiguration;