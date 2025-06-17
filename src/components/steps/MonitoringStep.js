import React from 'react';
import { ChevronLeft, ChevronRight, BarChart3, Activity, Bell, Eye } from 'lucide-react';

const MonitoringStep = ({ formData, updateFormData, nextStep, prevStep }) => {
  const monitoringOptions = [
    {
      id: 'cloudwatch',
      name: 'CloudWatch',
      description: 'Monitoring and observability for AWS resources',
      icon: <BarChart3 className="w-8 h-8 text-lambdaforge-primary" />,
      automation: 'Lambda-powered anomaly detection and auto-scaling'
    },
    {
      id: 'x-ray-tracing',
      name: 'X-Ray Tracing',
      description: 'Distributed tracing for microservices',
      icon: <Activity className="w-8 h-8 text-lambdaforge-primary" />,
      automation: 'Performance analysis and bottleneck identification'
    },
    {
      id: 'cloudtrail',
      name: 'CloudTrail',
      description: 'API call logging and compliance auditing',
      icon: <Eye className="w-8 h-8 text-lambdaforge-primary" />,
      automation: 'Security event analysis and threat detection'
    },
    {
      id: 'alarms',
      name: 'CloudWatch Alarms',
      description: 'Automated alerting and notifications',
      icon: <Bell className="w-8 h-8 text-lambdaforge-primary" />,
      automation: 'Intelligent alerting with noise reduction'
    }
  ];

  const handleServiceToggle = (serviceId) => {
    const currentSelected = formData.selectedMonitoring || [];
    const isSelected = currentSelected.includes(serviceId);
    
    const newSelected = isSelected
      ? currentSelected.filter(id => id !== serviceId)
      : [...currentSelected, serviceId];
    
    updateFormData({ selectedMonitoring: newSelected });
  };

  const selectedServices = formData.selectedMonitoring || [];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Monitoring & Observability</h2>
        <p className="text-gray-600">
          Configure monitoring, logging, and alerting for your infrastructure.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {monitoringOptions.map((service) => {
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
                      📊 Automation:
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

export default MonitoringStep; 