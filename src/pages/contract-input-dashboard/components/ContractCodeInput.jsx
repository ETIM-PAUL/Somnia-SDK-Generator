import React, { useState, useRef } from 'react';
import Button from '../../../components/ui/Button';
import Icon from '../../../components/AppIcon';

const ContractCodeInput = ({ value, onChange, onFileUpload }) => {
  const [activeTab, setActiveTab] = useState('paste');
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e?.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e?.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e?.preventDefault();
    setIsDragOver(false);
    
    const files = Array.from(e?.dataTransfer?.files);
    const validFile = files?.find(file => 
      file?.name?.endsWith('.sol') || 
      file?.name?.endsWith('.txt') || 
      file?.type === 'text/plain'
    );

    if (validFile) {
      handleFileRead(validFile);
    }
  };

  const handleFileSelect = (e) => {
    const file = e?.target?.files?.[0];
    if (file) {
      handleFileRead(file);
    }
  };

  const handleFileRead = (file) => {
    setIsUploading(true);
    setUploadProgress(0);

    const reader = new FileReader();
    
    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return 90;
        }
        return prev + 10;
      });
    }, 100);

    reader.onload = (e) => {
      setTimeout(() => {
        setUploadProgress(100);
        setTimeout(() => {
          const content = e?.target?.result;
          onChange(content);
          if (onFileUpload) {
            onFileUpload(file?.name, content);
          }
          setIsUploading(false);
          setUploadProgress(0);
          clearInterval(progressInterval);
        }, 500);
      }, 500);
    };

    reader.onerror = () => {
      setIsUploading(false);
      setUploadProgress(0);
      clearInterval(progressInterval);
    };

    reader?.readAsText(file);
  };

  const handleBrowseClick = () => {
    fileInputRef?.current?.click();
  };

  const formatCode = (code) => {
    if (!code) return '';
    return code;
  };

  return (
    <div className="space-y-4">
      {/* Tab Navigation */}
      <div className="flex space-x-1 bg-muted rounded-lg p-1">
        <button
          onClick={() => setActiveTab('paste')}
          className={`flex-1 flex items-center justify-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
            activeTab === 'paste' ?'bg-background text-foreground shadow-sm' :'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Icon name="Code2" size={16} color="currentColor" />
          <span>Paste Code</span>
        </button>
        <button
          onClick={() => setActiveTab('upload')}
          className={`flex-1 flex items-center justify-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
            activeTab === 'upload' ?'bg-background text-foreground shadow-sm' :'text-muted-foreground hover:text-foreground'
          }`}
        >
          <Icon name="Upload" size={16} color="currentColor" />
          <span>Upload File</span>
        </button>
      </div>
      {/* Paste Code Tab */}
      {activeTab === 'paste' && (
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">
            Smart Contract Code
          </label>
          <div className="relative">
            <textarea
              value={value}
              onChange={(e) => onChange(e?.target?.value)}
              placeholder={`pragma solidity ^0.8.0;

contract MyContract {
    // Paste your smart contract code here
    
    function example() public pure returns (string memory) {
        return "Hello, Somnia!";
    }
}`}
              className="w-full h-64 px-4 py-3 text-sm font-mono bg-background border border-border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
              style={{ fontFamily: 'JetBrains Mono, monospace' }}
            />
            {value && (
              <div className="absolute top-2 right-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onChange('')}
                  iconName="X"
                  className="h-6 w-6 p-0"
                />
              </div>
            )}
          </div>
          <div className="text-xs text-muted-foreground">
            Supports Solidity (.sol) smart contracts
          </div>
        </div>
      )}
      {/* Upload File Tab */}
      {activeTab === 'upload' && (
        <div className="space-y-4">
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-200 ${
              isDragOver
                ? 'border-primary bg-primary/5' :'border-border hover:border-primary/50'
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".sol,.txt"
              onChange={handleFileSelect}
              className="hidden"
            />

            {isUploading ? (
              <div className="space-y-4">
                <Icon name="Loader2" size={32} color="var(--color-primary)" className="animate-spin mx-auto" />
                <div className="space-y-2">
                  <div className="text-sm font-medium text-foreground">
                    Uploading contract file...
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {uploadProgress}% complete
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <Icon name="Upload" size={32} color="var(--color-muted-foreground)" className="mx-auto" />
                <div className="space-y-2">
                  <div className="text-sm font-medium text-foreground">
                    Drop your contract file here
                  </div>
                  <div className="text-xs text-muted-foreground">
                    or click to browse files
                  </div>
                </div>
                <Button
                  variant="outline"
                  onClick={handleBrowseClick}
                  iconName="FolderOpen"
                  iconPosition="left"
                >
                  Browse Files
                </Button>
              </div>
            )}
          </div>

          <div className="text-xs text-muted-foreground space-y-1">
            <div className="flex items-center space-x-2">
              <Icon name="FileCode" size={14} color="var(--color-muted-foreground)" />
              <span>Supported formats: .sol, .txt (max 2MB)</span>
            </div>
            <div className="flex items-center space-x-2">
              <Icon name="Shield" size={14} color="var(--color-muted-foreground)" />
              <span>Files are processed locally and not stored on our servers</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ContractCodeInput;