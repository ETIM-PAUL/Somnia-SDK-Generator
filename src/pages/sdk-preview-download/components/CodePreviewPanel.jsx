import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Button from '../../../components/ui/Button';
import { generateSDKClass } from 'utils/sdk_generate_js';

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

  const fileName = `${state.name}.sol`;

  const mockFileStructure = {
    javascript: {
      'package.json': {
        type: 'module',
        content: `{
  "name": ${state?.config?.packagePrefix}-${state?.name.toLowerCase()}-javascript,
  "version": ${state?.config?.initialVersion},
  "description": "Generated SDK for ${state?.name} Contract deployed on Somnia blockchain",
  "main": "index.js",
  "dependencies": {
    "ethers": "^6.0.0",
    "viem": "^2.0.0"
  }
}`
      },
      'index.js': {
        type:"file",
        content: generateSDKClass(JSON.parse(state?.abi), state?.address, state?.name, `${state?.config?.packagePrefix}-${state?.name.toLowerCase()}-javascript`)?.indexJs
      },
      'contracts': {
        type: 'folder',
        children: {
          [fileName]: {
            type: 'file',
            content: `${state?.code}`
          }
        }
      },
      'README.md': {
        type:"file",
        content: generateSDKClass(JSON.parse(state?.abi), state?.address, state?.name, `${state?.config?.packagePrefix}-${state?.name.toLowerCase()}-javascript`)?.readme
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
    let content;
    
        if ( pathParts.length > 1) {
          content = current?.contracts?.children?.[pathParts[1]]
        } else if ( pathParts.length === 1){
          content = current?.[pathParts[0]];
        } else {
        return 'File not found';
      }
    
    return content?.content || 'No content available';
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
            {availableLanguages?.filter((i) => i.value.toLowerCase() === selectedLanguage.toLowerCase()).map((lang) => (
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