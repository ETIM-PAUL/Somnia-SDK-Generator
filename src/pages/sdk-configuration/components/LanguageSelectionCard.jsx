import React from 'react';
import Icon from '../../../components/AppIcon';
import { Checkbox } from '../../../components/ui/Checkbox';

const LanguageSelectionCard = ({ 
  language, 
  isSelected, 
  onToggle, 
  features, 
  codePreview,
  compatibility 
}) => {
  const getLanguageIcon = (lang) => {
    switch (lang?.toLowerCase()) {
      case 'javascript': return 'FileCode';
      case 'typescript': return 'FileCode2';
      case 'python': return 'FileText';
      default: return 'Code';
    }
  };

  const getLanguageColor = (lang) => {
    switch (lang?.toLowerCase()) {
      case 'javascript': return '#F7DF1E';
      case 'typescript': return '#3178C6';
      case 'python': return '#3776AB';
      default: return 'var(--color-primary)';
    }
  };

  return (
    <div className={`
      relative rounded-lg border-2 transition-all duration-200 cursor-pointer
      ${isSelected 
        ? 'border-primary bg-primary/5 shadow-md' 
        : 'border-border bg-card hover:border-primary/50 hover:shadow-sm'
      }
    `}>
      {/* Selection Checkbox */}
      <div className="absolute top-4 right-4 z-10">
        <Checkbox
          checked={isSelected}
          onChange={(e) => onToggle(e?.target?.checked)}
          size="default"
        />
      </div>
      <div className="p-6" onClick={() => onToggle(!isSelected)}>
        {/* Language Header */}
        <div className="flex items-center space-x-3 mb-4">
          <div 
            className="w-10 h-10 rounded-lg flex items-center justify-center"
            style={{ backgroundColor: `${getLanguageColor(language)}20` }}
          >
            <Icon 
              name={getLanguageIcon(language)} 
              size={20} 
              color={getLanguageColor(language)}
              strokeWidth={2}
            />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">{language}</h3>
            <div className="flex items-center space-x-2 mt-1">
              <div className={`
                px-2 py-1 rounded-full text-xs font-medium
                ${compatibility === 'full' ?'bg-success/10 text-success border border-success/20' 
                  : compatibility === 'partial' ?'bg-warning/10 text-warning border border-warning/20' :'bg-muted text-muted-foreground border border-border'
                }
              `}>
                {compatibility === 'full' ? 'Full Compatibility' : 
                 compatibility === 'partial' ? 'Partial Support' : 'Basic Support'}
              </div>
            </div>
          </div>
        </div>

        {/* Features List */}
        <div className="mb-4">
          <h4 className="text-sm font-medium text-foreground mb-2">Features</h4>
          <div className="space-y-1">
            {features?.map((feature, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Icon 
                  name={feature?.supported ? "Check" : "X"} 
                  size={14} 
                  color={feature?.supported ? "var(--color-success)" : "var(--color-muted-foreground)"}
                  strokeWidth={2}
                />
                <span className={`text-xs ${
                  feature?.supported ? 'text-foreground' : 'text-muted-foreground'
                }`}>
                  {feature?.name}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Code Preview */}
        <div className="bg-muted rounded-lg p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-muted-foreground">Preview</span>
            <Icon name="Code" size={12} color="var(--color-muted-foreground)" />
          </div>
          <pre className="text-xs text-foreground font-mono overflow-x-auto">
            <code>{codePreview}</code>
          </pre>
        </div>

        {/* Somnia Integration Badge */}
        <div className="mt-4 flex items-center space-x-2">
          <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
          <span className="text-xs text-success font-medium">
            Somnia Sub-second Finality Ready
          </span>
        </div>
      </div>
    </div>
  );
};

export default LanguageSelectionCard;