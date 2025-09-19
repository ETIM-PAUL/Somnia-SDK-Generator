import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';

const CodePreviewPanel = ({ 
  generatedCode = {}, 
  state,
  selectedLanguage = 'javascript',
  onLanguageChange = () => {},
  isLoading = false 
}) => {
  const [expandedFiles, setExpandedFiles] = useState(new Set(['index.js']));
  const [activeFile, setActiveFile] = useState('index.js');

  const availableLanguages = [
    { value: 'javascript', label: 'JavaScript', icon: 'FileText' },
    { value: 'typescript', label: 'TypeScript', icon: 'FileCode' },
    { value: 'python', label: 'Python', icon: 'FileText' },
  ];

  const mockFileStructure = {
    javascript: {
      'package.json': {
        type: 'file',
        content: `{
  "name": ${state?.config?.packagePrefix}-${state?.name}-javascript,
  "version": ${state?.config?.packagePrefix},
  "description": "Generated SDK for ${state?.name} Contract deployed on Somnia blockchain",
  "main": "index.js",
  "dependencies": {
    "ethers": "^6.0.0",
    "axios": "^1.0.0"
  }
}`
      },
      'index.js': {
        type: 'file',
        content: `import { ethers } from 'ethers';
import { ${state?.name} } from './contracts/${state?.name}';

export class ${state?.name} {
  constructor(provider, ${state?.address}) {
    this.provider = provider;
    this.contract = new ${state?.name}(provider, contractAddress);
  }

  async initialize() {
    await this.contract.initialize();
    return this;
  }

  async getBalance(address) {
    return await this.contract.getBalance(address);
  }

  async transfer(to, amount) {
    return await this.contract.transfer(to, amount);
  }
}

export default SomniaSDK;`
      },
      'contracts/': {
        type: 'folder',
        children: {
          'SomniaContract.js': {
            type: 'file',
            content: `import { ethers } from 'ethers';

export class SomniaContract {
  constructor(provider, address) {
    this.provider = provider;
    this.address = address;
    this.contract = null;
  }

  async initialize() {
    const abi = [
      "function getBalance(address) view returns (uint256)",
      "function transfer(address, uint256) returns (bool)"
    ];
    
    this.contract = new ethers.Contract(
      this.address, 
      abi, 
      this.provider
    );
  }

  async getBalance(address) {
    return await this.contract.getBalance(address);
  }

  async transfer(to, amount) {
    const signer = this.provider.getSigner();
    const contractWithSigner = this.contract.connect(signer);
    return await contractWithSigner.transfer(to, amount);
  }
}`
          }
        }
      },
      'README.md': {
        type: 'file',
        content: `# Somnia SDK

Generated SDK for interacting with Somnia blockchain contracts.

## Installation

\`\`\`bash
npm install @somnia/sdk
\`\`\`

## Usage

\`\`\`javascript
import SomniaSDK from '@somnia/sdk';

const sdk = new SomniaSDK(provider, contractAddress);
await sdk.initialize();

const balance = await sdk.getBalance(userAddress);
console.log('Balance:', balance);
\`\`\`

## API Reference

### SomniaSDK

#### constructor(provider, contractAddress)
- \`provider\`: Ethereum provider instance
- \`contractAddress\`: Contract address on Somnia network

#### initialize()
Initializes the SDK and contract connections.

#### getBalance(address)
Returns the balance for the specified address.

#### transfer(to, amount)
Transfers tokens to the specified address.
`
      }
    }
  };

  const toggleFileExpansion = (filePath) => {
    const newExpanded = new Set(expandedFiles);
    if (newExpanded?.has(filePath)) {
      newExpanded?.delete(filePath);
    } else {
      newExpanded?.add(filePath);
    }
    setExpandedFiles(newExpanded);
  };

  const renderFileTree = (structure, basePath = '') => {
    return Object.entries(structure)?.map(([name, item]) => {
      const fullPath = basePath ? `${basePath}/${name}` : name;
      const isExpanded = expandedFiles?.has(fullPath);
      const isActive = activeFile === fullPath;

      if (item?.type === 'folder') {
        return (
          <div key={fullPath} className="select-none">
            <button
              onClick={() => toggleFileExpansion(fullPath)}
              className="flex items-center space-x-2 w-full px-2 py-1 text-left text-sm hover:bg-muted rounded transition-smooth"
            >
              <Icon 
                name={isExpanded ? 'ChevronDown' : 'ChevronRight'} 
                size={14} 
                color="var(--color-text-secondary)" 
              />
              <Icon name="Folder" size={14} color="var(--color-text-secondary)" />
              <span className="text-text-secondary">{name}</span>
            </button>
            {isExpanded && (
              <div className="ml-4 border-l border-border pl-2">
                {renderFileTree(item?.children, fullPath)}
              </div>
            )}
          </div>
        );
      }

      return (
        <button
          key={fullPath}
          onClick={() => setActiveFile(fullPath)}
          className={`flex items-center space-x-2 w-full px-2 py-1 text-left text-sm rounded transition-smooth ${
            isActive 
              ? 'bg-primary/10 text-primary border-l-2 border-primary' :'hover:bg-muted text-text-secondary'
          }`}
        >
          <Icon 
            name={name?.endsWith('.md') ? 'FileText' : 'FileCode'} 
            size={14} 
            color={isActive ? 'var(--color-primary)' : 'var(--color-text-secondary)'} 
          />
          <span>{name}</span>
        </button>
      );
    });
  };

  const getActiveFileContent = () => {
    const structure = mockFileStructure?.[selectedLanguage] || {};
    const pathParts = activeFile?.split('/');
    let current = structure;
    
    for (const part of pathParts) {
      if (current?.[part]) {
        current = current?.[part];
      } else {
        return 'File not found';
      }
    }
    
    return current?.content || 'No content available';
  };

  if (isLoading) {
    return (
      <div className="bg-card rounded-lg shadow-subtle border border-border">
        <div className="p-6 text-center">
          <div className="animate-spin w-8 h-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-text-secondary">Generating code preview...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg shadow-subtle border border-border overflow-hidden">
      {/* Language Tabs */}
      <div className="border-b border-border bg-surface">
        <div className="flex items-center justify-between p-4">
          <div className="flex space-x-1">
            {availableLanguages?.map((lang) => (
              <button
                key={lang?.value}
                onClick={() => onLanguageChange(lang?.value)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-smooth ${
                  selectedLanguage === lang?.value
                    ? 'bg-primary text-primary-foreground'
                    : 'text-text-secondary hover:text-foreground hover:bg-muted'
                }`}
              >
                <Icon name={lang?.icon} size={14} />
                <span>{lang?.label}</span>
              </button>
            ))}
          </div>
          <Button variant="outline" size="sm" iconName="Copy" iconPosition="left">
            Copy All
          </Button>
        </div>
      </div>
      <div className="flex h-96 md:h-[600px]">
        {/* File Tree */}
        <div className="w-64 border-r border-border bg-surface p-4 overflow-y-auto">
          <h4 className="text-sm font-medium text-foreground mb-3 flex items-center space-x-2">
            <Icon name="FolderOpen" size={16} />
            <span>Project Files</span>
          </h4>
          <div className="space-y-1">
            {renderFileTree(mockFileStructure?.[selectedLanguage] || {})}
          </div>
        </div>

        {/* Code Content */}
        <div className="flex-1 flex flex-col">
          {/* File Header */}
          <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-surface">
            <div className="flex items-center space-x-2">
              <Icon 
                name={activeFile?.endsWith('.md') ? 'FileText' : 'FileCode'} 
                size={16} 
                color="var(--color-text-secondary)" 
              />
              <span className="text-sm font-medium text-foreground">{activeFile}</span>
            </div>
            <Button variant="ghost" size="sm" iconName="Copy" iconSize={14}>
              Copy
            </Button>
          </div>

          {/* Code Display */}
          <div className="flex-1 overflow-auto">
            <pre className="p-4 text-sm font-mono text-foreground bg-muted/30 h-full">
              <code>{getActiveFileContent()}</code>
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodePreviewPanel;