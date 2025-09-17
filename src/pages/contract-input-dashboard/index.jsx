import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/ui/Header';
import StepProgressIndicator from '../../components/ui/StepProgressIndicator';
import WorkflowNavigationControls from '../../components/ui/WorkflowNavigationControls';
import ValidationStatusBanner from '../../components/ui/ValidationStatusBanner';
import ContractAddressInput from './components/ContractAddressInput';
import ContractCodeInput from './components/ContractCodeInput';
import ContractValidationPanel from './components/ContractValidationPanel';
import ValidationToast from './components/ValidationToast';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';
import { doesContractCodeMatch, isContractVerified } from 'utils';

const ContractInputDashboard = () => {
  const navigate = useNavigate();
  
  // Form state
  const [contractAddress, setContractAddress] = useState('');
  const [contractCode, setContractCode] = useState('');
  const [uploadedFileName, setUploadedFileName] = useState('');
  
  // Validation state
  const [addressValidation, setAddressValidation] = useState({ isValid: false, message: '' });
  const [validationResults, setValidationResults] = useState(null);
  const [isValidating, setIsValidating] = useState(false);
  const [isAddressValidating, setIsAddressValidating] = useState(false);
  
  // UI state
  const [toast, setToast] = useState({ show: false, type: 'info', title: '', message: '' });
  const [bannerMessage, setBannerMessage] = useState(null);

  // Mock validation function
  const performContractValidation = useCallback(async () => {
    if (!contractAddress || !contractCode) {
      showToast('error', 'Validation Error', 'Please provide both contract address and code');
      return;
    }

    setIsValidating(true);
    setBannerMessage({ type: 'loading', title: 'Validating Contract', message: 'Running comprehensive validation checks...' });

    try {
      // Simulate API calls with delays
      await new Promise(resolve => setTimeout(resolve, 1000));

      const contractDetails = await isContractVerified(contractAddress);
      console.log("details", contractDetails)
      // const isCodeMatch = await doesContractCodeMatch(contractAddress, contractCode, contractDetails.compilerVersion);
      
      // Mock validation results
      const mockResults = {
        deployment: {
          status: contractDetails?.contractAddress?.toLowerCase() === contractAddress?.toLowerCase() ? 'success' : 'error',
          message: contractDetails?.contractAddress?.toLowerCase() === contractAddress?.toLowerCase() ?'Contract successfully deployed on Somnia testnet' :'Contract not found on Somnia testnet'
        },
        verification: {
          status: contractDetails?.verified ? 'success' : 'warning',
          message: contractDetails?.verified
            ? 'Contract source code verified' :'Contract verification pending - source code may not match'
        },
        bytecode: {
          status: contractDetails?.abi !== "" ? 'success' : 'error',
          message: contractDetails?.abi
            ? 'Bytecode matches deployed contract' :'Bytecode mismatch detected'
        },
        size: {
          status: contractCode?.length < 10000 ? 'success' : 'warning',
          message: contractCode?.length < 10000 
            ? `Contract size: ${(contractCode?.length / 1024)?.toFixed(2)}KB (within limits)` 
            : 'Contract size exceeds recommended limits'
        },
        metrics: {
          size: (contractCode?.length / 1024)?.toFixed(2),
          functions: (contractCode?.match(/function/g) || [])?.length,
          events: (contractCode?.match(/event/g) || [])?.length,
          gasOptimization: contractCode?.includes('pragma solidity') ? 'A+' : 'B'
        }
      };

      setValidationResults(mockResults);

      // Check overall validation status
      const hasErrors = Object.values(mockResults)?.some(result => result?.status === 'error');
      const hasWarnings = Object.values(mockResults)?.some(result => result?.status === 'warning');

      if (hasErrors) {
        setBannerMessage({ 
          type: 'error', 
          title: 'Validation Failed', 
          message: 'Contract validation failed. Please review the errors and try again.' 
        });
        showToast('error', 'Validation Failed', 'Please fix the errors before proceeding');
      } else if (hasWarnings) {
        setBannerMessage({ 
          type: 'warning', 
          title: 'Validation Completed with Warnings', 
          message: 'Contract validation completed but some warnings were found.' 
        });
        showToast('warning', 'Validation Warning', 'Contract validated with warnings');
      } else {
        setBannerMessage({ 
          type: 'success', 
          title: 'Validation Successful', 
          message: 'Contract successfully validated and ready for SDK generation.' 
        });
        showToast('success', 'Validation Successful', 'Contract is ready for SDK generation');
      }

    } catch (error) {
      console.log("error", error);
      setBannerMessage({ 
        type: 'error', 
        title: 'Validation Error', 
        message: 'Failed to validate contract. Please check your network connection and try again.' 
      });
      showToast('error', 'Network Error', 'Failed to connect to Somnia testnet');
    } finally {
      setIsValidating(false);
    }
  }, [contractAddress, contractCode]);

  const showToast = (type, title, message, action = null) => {
    setToast({ show: true, type, title, message, action });
  };

  const handleAddressValidation = useCallback((isValid, message) => {
    setAddressValidation({ isValid, message });
  }, []);

  const handleFileUpload = useCallback((fileName, content) => {
    setUploadedFileName(fileName);
    showToast('success', 'File Uploaded', `Successfully loaded ${fileName}`);
  }, []);

  const handleRetryValidation = () => {
    setValidationResults(null);
    setBannerMessage(null);
    performContractValidation();
  };

  const canProceedToNext = () => {
    return validationResults && 
           !Object.values(validationResults)?.some(result => result?.status === 'error') &&
           addressValidation?.isValid &&
           contractCode?.length > 0;
  };

  const handleNext = () => {
    if (canProceedToNext()) {
      navigate('/sdk-configuration');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <StepProgressIndicator />
      <main className="flex-1 px-6 py-8 pb-24">
        <div className="max-w-6xl mx-auto space-y-8">
          {/* Page Header */}
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center w-16 h-16 mx-auto bg-primary/10 rounded-2xl">
              <Icon name="FileCode" size={32} color="var(--color-primary)" strokeWidth={2} />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">
                Contract Input Dashboard
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Provide your verified smart contract details to begin SDK generation for Somnia network integration
              </p>
            </div>
          </div>

          {/* Status Banner */}
          {bannerMessage && (
            <ValidationStatusBanner
              type={bannerMessage?.type}
              title={bannerMessage?.title}
              message={bannerMessage?.message}
              isVisible={true}
              isDismissible={true}
              onDismiss={() => setBannerMessage(null)}
              persistent={bannerMessage?.type === 'error'}
              action={null}
            />
          )}

          {/* Main Content Grid */}
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left Column - Input Forms */}
            <div className="lg:col-span-2 space-y-8">
              {/* Contract Address Section */}
              <div className="bg-card border border-border rounded-lg p-6">
                <div className="flex items-center space-x-3 mb-6">
                  <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                    <Icon name="Link" size={18} color="var(--color-primary)" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-foreground">
                      Smart Contract Address
                    </h2>
                    <p className="text-sm text-muted-foreground">
                      Enter the deployed contract address on Somnia testnet
                    </p>
                  </div>
                </div>

                <ContractAddressInput
                  value={contractAddress}
                  onChange={setContractAddress}
                  onValidation={handleAddressValidation}
                  isValidating={isAddressValidating}
                />

                {/* Sample Addresses */}
                <div className="mt-4 p-4 bg-muted/30 rounded-lg">
                  <div className="text-sm font-medium text-foreground mb-2">
                    Sample Addresses for Testing:
                  </div>
                  <div className="space-y-2">
                    {[
                      '0x02e9456bA8A56e82464f53cfc8eecA6928d73a07',
                      '0x1234567890123456789012345678901234567890',
                      '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd'
                    ]?.map((address) => (
                      <button
                        key={address}
                        onClick={() => setContractAddress(address)}
                        className="flex items-center space-x-2 text-xs text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <Icon name="Copy" size={12} />
                        <span className="font-mono">{address}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Contract Code Section */}
              <div className="bg-card border border-border rounded-lg p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
                      <Icon name="Code2" size={18} color="var(--color-primary)" />
                    </div>
                    <div>
                      <h2 className="text-xl font-semibold text-foreground">
                        Smart Contract Code
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        Paste your contract code or upload a Solidity file
                      </p>
                    </div>
                  </div>
                  
                  {uploadedFileName && (
                    <div className="flex items-center space-x-2 text-sm text-success">
                      <Icon name="CheckCircle2" size={16} color="var(--color-success)" />
                      <span>{uploadedFileName}</span>
                    </div>
                  )}
                </div>

                <ContractCodeInput
                  value={contractCode}
                  onChange={setContractCode}
                  onFileUpload={handleFileUpload}
                />
              </div>
            </div>

            {/* Right Column - Validation Panel */}
            <div className="lg:col-span-1">
              <div className="sticky top-32">
                <ContractValidationPanel
                  validationResults={validationResults}
                  isValidating={isValidating}
                  onValidate={performContractValidation}
                  onRetry={handleRetryValidation}
                />
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-card border border-border rounded-lg p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Icon name="Zap" size={20} color="var(--color-accent)" />
                <div>
                  <h3 className="text-lg font-semibold text-foreground">
                    Quick Actions
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Common development tasks and utilities
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Button
                  variant="outline"
                  size="sm"
                  iconName="FileText"
                  iconPosition="left"
                  onClick={() => showToast('info', 'Documentation', 'Opening Somnia SDK documentation...')}
                >
                  Documentation
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  iconName="Github"
                  iconPosition="left"
                  onClick={() => showToast('info', 'Examples', 'Loading contract examples...')}
                >
                  Examples
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
      {/* Navigation Controls */}
      <WorkflowNavigationControls
        canProceed={canProceedToNext()}
        isLoading={isValidating}
        onNext={handleNext}
        onPrevious={() => navigate(-1)}
        nextLabel="Continue to SDK Configuration"
        previousLabel="Back"
        validationMessage={!canProceedToNext() ? 'Please complete contract validation before proceeding' : ''}
      />
      {/* Toast Notifications */}
      <ValidationToast
        type={toast?.type}
        title={toast?.title}
        message={toast?.message}
        isVisible={toast?.show}
        onClose={() => setToast({ ...toast, show: false })}
        action={toast?.action}
      />
    </div>
  );
};

export default ContractInputDashboard;