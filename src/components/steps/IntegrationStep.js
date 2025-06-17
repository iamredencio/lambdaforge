import React from 'react';
import { ChevronLeft, ChevronRight, Globe, Workflow, MessageSquare, Calendar } from 'lucide-react';

const IntegrationStep = ({ formData, updateFormData, nextStep, prevStep }) => {
  const integrationOptions = [
    {
      id: 'api-gateway',
      name: 'API Gateway',
      description: 'REST and WebSocket APIs for your applications',
      icon: <Globe className="w-8 h-8 text-lambdaforge-primary" />,
      automation: 'Lambda-powered API monitoring and automatic throttling'
    },
    {
      id: 'eventbridge',
      name: 'EventBridge',
      description: 'Serverless event bus for application integration',
      icon: <Workflow className="w-8 h-8 text-lambdaforge-primary" />,
      automation: 'Event-driven Lambda orchestration and workflow management'
    },
    {
      id: 'sns-notifications',
      name: 'SNS Notifications',
      description: 'Messaging service for notifications and alerts',
      icon: <MessageSquare className="w-8 h-8 text-lambdaforge-primary" />,
      automation: 'Smart notification routing based on Lambda analysis'
    },
    {
      id: 'step-functions',
      name: 'Step Functions',
      description: 'Visual workflow orchestration',
      icon: <Calendar className="w-8 h-8 text-lambdaforge-primary" />,
      automation: 'Lambda-driven workflow optimization and error handling'
    }
  ];

  const handleServiceToggle = (serviceId) => {
    const currentSelected = formData.selectedIntegration || [];
    const isSelected = currentSelected.includes(serviceId);
    
    const newSelected = isSelected
      ? currentSelected.filter(id => id !== serviceId)
      : [...currentSelected, serviceId];
    
    updateFormData({ selectedIntegration: newSelected });
  };

  const selectedServices = formData.selectedIntegration || [];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Integration Services</h2>
        <p className="text-gray-600">
          Configure API management, event processing, and communication services.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {integrationOptions.map((service) => {
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
                      🔗 Automation:
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

export default IntegrationStep; 