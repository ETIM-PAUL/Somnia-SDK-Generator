import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import ProgressSteps from './components/ProgressSteps';
import ProgressBar from './components/ProgressBar';
import ContractSummary from './components/ContractSummary';
import ActivityLogs from './components/ActivityLogs';
import EstimatedCompletion from './components/EstimatedCompletion';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const SDKGenerationProgress = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [progress, setProgress] = useState(0);
  const [processingStatus, setProcessingStatus] = useState('processing');
  const [logs, setLogs] = useState([]);
  const [isLogsExpanded, setIsLogsExpanded] = useState(false);
  const [startTime] = useState(new Date());
  const [estimatedTime, setEstimatedTime] = useState(180); // 3 minutes

  const steps = [
    {
      name: "Analysis",
      description: "Contract analysis",
      currentOperation: "Parsing contract ABI and validating structure..."
    },
    {
      name: "Generation",
      description: "Code generation",
      currentOperation: "Generating TypeScript interfaces and method wrappers..."
    },
    {
      name: "Optimization",
      description: "Somnia optimization",
      currentOperation: "Applying Somnia-specific optimizations and performance enhancements..."
    },
    {
      name: "Documentation",
      description: "Documentation creation",
      currentOperation: "Creating comprehensive API documentation and usage examples..."
    },
    {
      name: "Packaging",
      description: "Final packaging",
      currentOperation: "Packaging SDK files and preparing distribution formats..."
    }
  ];

  const contractDetails = {
    address: "0x742d35Cc6634C0532925a3b8D4C9db96C4b4d8e1",
    name: "SomniaToken",
    selectedLanguages: ["JavaScript", "TypeScript", "Python"],
    customNaming: "@somnia/token-sdk",
    contractSize: "24.5 KB",
    verificationStatus: "verified",
    network: "Somnia Testnet"
  };

  // Simulate progress updates
  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        const newProgress = Math.min(prev + Math.random() * 3, 100);
        
        // Update current step based on progress
        if (newProgress < 20) {
          setCurrentStep(1);
          setEstimatedTime(160);
        } else if (newProgress < 40) {
          setCurrentStep(2);
          setEstimatedTime(120);
        } else if (newProgress < 60) {
          setCurrentStep(3);
          setEstimatedTime(80);
        } else if (newProgress < 80) {
          setCurrentStep(4);
          setEstimatedTime(40);
        } else if (newProgress < 100) {
          setCurrentStep(5);
          setEstimatedTime(20);
        } else {
          setProcessingStatus('completed');
          setEstimatedTime(0);
          clearInterval(progressInterval);
          
          // Navigate to preview page after completion
          setTimeout(() => {
            navigate('/sdk-preview-and-download');
          }, 2000);
        }
        
        return newProgress;
      });
    }, 1000);

    return () => clearInterval(progressInterval);
  }, [navigate]);

  // Simulate log updates
  useEffect(() => {
    const logMessages = [
      { type: 'info', message: 'Starting SDK generation process...', details: 'Initializing generation pipeline' },
      { type: 'success', message: 'Contract ABI parsed successfully', details: 'Found 15 functions and 8 events' },
      { type: 'info', message: 'Analyzing contract structure...', details: 'Detecting interface patterns and dependencies' },
      { type: 'success', message: 'TypeScript interfaces generated', details: 'Created type definitions for all contract methods' },
      { type: 'info', message: 'Applying Somnia optimizations...', details: 'Implementing sub-second finality features' },
      { type: 'warning', message: 'Large contract detected', details: 'Consider splitting into multiple modules for better performance' },
      { type: 'success', message: 'JavaScript SDK generated', details: 'Created ES6 modules with full functionality' },
      { type: 'info', message: 'Generating Python bindings...', details: 'Creating pip-compatible package structure' },
      { type: 'success', message: 'Documentation generated', details: 'Created comprehensive API reference and examples' },
      { type: 'info', message: 'Packaging SDK files...', details: 'Creating distribution archives for all languages' },
      { type: 'success', message: 'SDK generation completed successfully', details: 'All packages ready for download' }
    ];

    const logInterval = setInterval(() => {
      if (logs?.length < logMessages?.length && processingStatus === 'processing') {
        const nextLog = {
          ...logMessages?.[logs?.length],
          timestamp: new Date()
        };
        setLogs(prev => [...prev, nextLog]);
      }
    }, 2000);

    return () => clearInterval(logInterval);
  }, [logs?.length, processingStatus]);

  const currentOperation = steps?.[currentStep - 1]?.currentOperation || 'Processing...';

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
              <Icon name="Zap" size={20} color="white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">SDK Generation in Progress</h1>
              <p className="text-text-secondary">
                Your SDK is being generated with Somnia optimizations
              </p>
            </div>
          </div>
          
          {processingStatus === 'completed' && (
            <div className="bg-success/10 border border-success/20 rounded-lg p-4 flex items-center space-x-3">
              <Icon name="CheckCircle" size={20} color="var(--color-success)" />
              <div>
                <p className="text-success font-medium">Generation Complete!</p>
                <p className="text-sm text-text-secondary">Redirecting to preview and download...</p>
              </div>
            </div>
          )}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Progress and Summary */}
          <div className="lg:col-span-2 space-y-6">
            {/* Progress Steps */}
            <ProgressSteps 
              currentStep={currentStep}
              steps={steps}
              processingStatus={processingStatus}
            />

            {/* Progress Bar */}
            <ProgressBar 
              progress={progress}
              estimatedTime={estimatedTime}
              currentOperation={currentOperation}
            />

            {/* Activity Logs */}
            <ActivityLogs 
              logs={logs}
              isExpanded={isLogsExpanded}
              onToggleExpanded={() => setIsLogsExpanded(!isLogsExpanded)}
            />
          </div>

          {/* Right Column - Contract Summary and Time Estimates */}
          <div className="space-y-6">
            {/* Contract Summary */}
            <ContractSummary contractDetails={contractDetails} />

            {/* Estimated Completion */}
            <EstimatedCompletion 
              startTime={startTime}
              estimatedDuration={180}
              currentProgress={progress}
              contractComplexity="medium"
            />

            {/* Process Information */}
            <div className="bg-card rounded-lg shadow-subtle border border-border p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4">Process Information</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center space-x-2">
                  <Icon name="Info" size={14} color="var(--color-primary)" />
                  <span className="text-text-secondary">Generation cannot be cancelled once started</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Icon name="Shield" size={14} color="var(--color-success)" />
                  <span className="text-text-secondary">All optimizations are automatically applied</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Icon name="Download" size={14} color="var(--color-warning)" />
                  <span className="text-text-secondary">Downloads will be available upon completion</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Actions */}
        <div className="mt-8 flex items-center justify-between">
          <Button 
            variant="outline" 
            onClick={() => navigate('/generate-sdk')}
            disabled={processingStatus === 'processing'}
            iconName="ArrowLeft"
            iconPosition="left"
          >
            Back to Configuration
          </Button>
          
          <div className="flex items-center space-x-4">
            <span className="text-sm text-text-secondary">
              Process started at {startTime?.toLocaleTimeString()}
            </span>
            {processingStatus === 'completed' && (
              <Button 
                variant="default"
                onClick={() => navigate('/sdk-preview-and-download')}
                iconName="ArrowRight"
                iconPosition="right"
              >
                View Results
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SDKGenerationProgress;