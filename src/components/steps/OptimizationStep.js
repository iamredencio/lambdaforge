import React from 'react';
import { ChevronLeft, ChevronRight, DollarSign, TrendingUp, Zap, Brain } from 'lucide-react';

const OptimizationStep = ({ formData, updateFormData, nextStep, prevStep }) => {
  const optimizationOptions = [
    {
      id: 'cost-optimizer',
      name: 'Cost Optimizer',
      description: 'AI-powered cost analysis and optimization',
      icon: <DollarSign className="w-8 h-8 text-lambdaforge-primary" />,
      automation: 'Continuous cost monitoring with automatic right-sizing'
    },
    {
      id: 'performance-insights',
      name: 'Performance Insights',
      description: 'Real-time performance monitoring and tuning',
      icon: <TrendingUp className="w-8 h-8 text-lambdaforge-primary" />,
      automation: 'Predictive scaling based on usage patterns'
    },
    {
      id: 'auto-scaling',
      name: 'Intelligent Auto-Scaling',
      description: 'Machine learning-driven scaling decisions',
      icon: <Zap className="w-8 h-8 text-lambdaforge-primary" />,
      automation: 'Proactive scaling before traffic spikes'
    },
    {
      id: 'resource-optimizer',
      name: 'Resource Optimizer',
      description: 'Automated resource allocation and cleanup',
      icon: <Brain className="w-8 h-8 text-lambdaforge-primary" />,
      automation: 'Idle resource detection and automatic termination'
    }
  ];

  const handleServiceToggle = (serviceId) => {
    const currentSelected = formData.selectedOptimization || [];
    const isSelected = currentSelected.includes(serviceId);
    
    const newSelected = isSelected
      ? currentSelected.filter(id => id !== serviceId)
      : [...currentSelected, serviceId];
    
    updateFormData({ selectedOptimization: newSelected });
  };

  const selectedServices = formData.selectedOptimization || [];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Optimization & Analytics</h2>
        <p className="text-gray-600">
          Configure AI-powered optimization for cost efficiency and performance.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {optimizationOptions.map((service) => {
          const isSelected = selectedServices.includes(service.id);
          
          return (
            <div
              key={service.id}
              onClick={() => handleServiceToggle(service.id)}
              className={`service-card ${isSelected ? 'selected' : ''}`}
            >
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0">
                  {service.icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {service.name}
                  </h3>
                  <p className="text-gray-600 text-sm mb-3">
                    {service.description}
                  </p>
                  <div className="bg-lambdaforge-accent bg-opacity-20 p-3 rounded-lg">
                    <div className="text-xs font-medium text-lambdaforge-dark mb-1">
                      🧠 AI Automation:
                    </div>
                    <div className="text-xs text-gray-700">
                      {service.automation}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="absolute top-4 right-4">
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                  isSelected 
                    ? 'bg-lambdaforge-primary border-lambdaforge-primary' 
                    : 'border-gray-300'
                }`}>
                  {isSelected && (
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex justify-between pt-6 border-t border-gray-200">
        <button onClick={prevStep} className="btn-secondary flex items-center space-x-2">
          <ChevronLeft className="w-4 h-4" />
          <span>BACK</span>
        </button>
        <button onClick={nextStep} className="btn-primary flex items-center space-x-2">
          <span>NEXT</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default OptimizationStep; 