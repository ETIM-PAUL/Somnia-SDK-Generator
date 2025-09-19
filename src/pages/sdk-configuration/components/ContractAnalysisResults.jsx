import React from 'react';
import Icon from '../../../components/AppIcon';

const ContractAnalysisResults = ({ analysis, ai_Analysis }) => {
  console.log(ai_Analysis)
  const performanceMetrics = [
    {
      label: 'Finality Time',
      value: '<1s',
      icon: 'Clock',
      status: 'excellent',
      description: 'Somnia sub-second finality'
    },
    {
      label: 'Gas Efficiency',
      value: analysis?.gasEfficiency || '92%',
      icon: 'Zap',
      status: 'good',
      description: 'Optimized for low costs'
    },
    {
      label: 'Function Coverage',
      value: `${ai_Analysis?.functions?.length$}/${ai_Analysis?.functions?.length}`,
      icon: 'CheckCircle2',
      status: 'excellent',
      description: 'All functions accessible'
    },
    {
      label: 'Security Score',
      value: ai_Analysis?.analysis?.securityScore || '9.2/10',
      icon: 'Shield',
      status: 'excellent',
      description: 'High security rating'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'excellent': return 'text-success';
      case 'good': return 'text-primary';
      case 'warning': return 'text-warning';
      case 'error': return 'text-error';
      default: return 'text-muted-foreground';
    }
  };

  const getStatusBg = (status) => {
    switch (status) {
      case 'excellent': return 'bg-success/10 border-success/20';
      case 'good': return 'bg-primary/10 border-primary/20';
      case 'warning': return 'bg-warning/10 border-warning/20';
      case 'error': return 'bg-error/10 border-error/20';
      default: return 'bg-muted border-border';
    }
  };

  const getImpactColor = (impact) => {
    switch (impact) {
      case 'high': return 'text-error';
      case 'medium': return 'text-warning';
      case 'low': return 'text-success';
      default: return 'text-muted-foreground';
    }
  };


  return (
    <div className="space-y-6">
      {/* Performance Metrics */}
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center space-x-2">
          <Icon name="BarChart3" size={20} color="var(--color-primary)" />
          <span>Performance Metrics</span>
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {performanceMetrics?.map((metric, index) => (
            <div 
              key={index}
              className={`p-4 rounded-lg border ${getStatusBg(metric?.status)}`}
            >
              <div className="flex items-center justify-between mb-2">
                <Icon 
                  name={metric?.icon} 
                  size={18} 
                  color={`var(--color-${metric?.status === 'excellent' ? 'success' : metric?.status === 'good' ? 'primary' : 'warning'})`}
                />
                <span className={`text-xs font-medium ${getStatusColor(metric?.status)}`}>
                  {metric?.status?.toUpperCase()}
                </span>
              </div>
              <div className="text-2xl font-bold text-foreground mb-1">
                {metric?.value}
              </div>
              <div className="text-xs text-muted-foreground mb-1">
                {metric?.label}
              </div>
              <div className="text-xs text-muted-foreground">
                {metric?.description}
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Function Signatures */}
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center space-x-2">
          <Icon name="Code" size={20} color="var(--color-primary)" />
          <span>Function Signatures</span>
        </h3>
        
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted">
                <tr>
                  <th className="text-left p-3 text-sm font-medium text-muted-foreground">Function</th>
                  <th className="text-left p-3 text-sm font-medium text-muted-foreground">Signature</th>
                  <th className="text-left p-3 text-sm font-medium text-muted-foreground">Gas Estimate</th>
                  <th className="text-left p-3 text-sm font-medium text-muted-foreground">Visibility</th>
                </tr>
              </thead>
              <tbody>
                {ai_Analysis?.analysis?.function_details?.map((func, index) => (
                  <tr key={index} className="border-t border-border hover:bg-muted/50">
                    <td className="p-3">
                      <span className="font-medium text-foreground">{func?.name}</span>
                    </td>
                    <td className="p-3">
                      <code className="text-sm bg-muted px-2 py-1 rounded text-foreground">
                        {func?.signature}
                      </code>
                    </td>
                    <td className="p-3">
                      <span className="text-sm text-muted-foreground">{func?.gasEstimate}</span>
                    </td>
                    <td className="p-3">
                      <span className={`
                        text-xs px-2 py-1 rounded-full font-medium
                        ${func?.visibility === 'view' ?'bg-success/10 text-success border border-success/20' :'bg-primary/10 text-primary border border-primary/20'
                        }
                      `}>
                        {func?.visibility}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {/* Optimization Recommendations */}
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center space-x-2">
          <Icon name="Lightbulb" size={20} color="var(--color-primary)" />
          <span>Optimization Recommendations</span>
        </h3>
        
        <div className="space-y-3">
          {ai_Analysis?.analysis?.optimization_recommendations?.map((rec, index) => (
            <div key={index} className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <div className={`
                  w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0
                  ${Number(rec?.impact_percentage) < 3 ?'bg-warning/10 border border-warning/20'
                    : Number(rec?.impact_percentage) <=5 ?'bg-primary/10 border border-primary/20' :'bg-error/10 border border-error/20'
                  }
                `}>
                  <Icon 
                    name={Number(rec?.impact_percentage) < 3 ? 'Zap' : Number(rec?.impact_percentage) <= 5 ? 'TrendingUp' : 'Shield'} 
                    size={16} 
                    color={`var(--color-${Number(rec?.impact_percentage) < 3 ? 'warning' : Number(rec?.impact_percentage) <= 5 ? 'primary' : 'error'})`}
                  />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-medium text-foreground">{rec?.title}</h4>
                    <div className="flex items-center space-x-2">
                      <span className={`text-xs font-medium ${getImpactColor(rec?.impact)}`}>
                        {rec?.impact?.toUpperCase()} IMPACT
                      </span>
                      <span className="text-xs text-success font-medium">
                        {rec?.impact_percentage}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {rec?.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Optimization Recommendations */}
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center space-x-2">
          <Icon name="Lightbulb" size={20} color="var(--color-primary)" />
          <span>Security Recommendations</span>
        </h3>
        
        <div className="space-y-3">
          {ai_Analysis?.analysis?.security_recommendations?.map((rec, index) => (
            <div key={index} className="bg-card border border-border rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <div className={`
                  w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0
                  ${'bg-primary/10 border border-primary/20'}
                `}>
                  <Icon 
                    name={'Shield'} 
                    size={16} 
                    color={`var(--color-primary)`}
                  />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-medium text-foreground">{rec?.title}</h4>
                    <div className="flex items-center space-x-2">
                      <span className={`text-xs font-medium ${getImpactColor(rec?.impact)}`}>
                        {rec?.impact?.toUpperCase()} IMPACT
                      </span>
                      <span className="text-xs text-success font-medium">
                        {rec?.impact_percentage}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {rec?.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ContractAnalysisResults;