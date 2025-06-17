import React from 'react';
import { ChevronLeft, ChevronRight, Database, HardDrive, FileText, Layers, Network } from 'lucide-react';

const InfrastructureStep = ({ formData, updateFormData, nextStep, prevStep, currentStep, totalSteps }) => {
    const infrastructureOptions = [
    {
      id: 's3-bucket',
      name: 'S3 Bucket',
      description: 'Object storage for any type of data',
      icon: <HardDrive className="w-8 h-8 text-aws-orange" />,
      lambdaIntegration: 'Event-driven processing, automated backups via Lambda'
    },
    {
      id: 'dynamodb',
      name: 'DynamoDB',
      description: 'Fully managed NoSQL database service',
      icon: <Database className="w-8 h-8 text-aws-orange" />,
      lambdaIntegration: 'DynamoDB Streams trigger Lambda functions for real-time data processing'
    },
    {
      id: 'rds-database',
      name: 'RDS Database',
      description: 'Managed relational database service',
      icon: <Database className="w-8 h-8 text-aws-orange" />,
      lambdaIntegration: 'Lambda functions for database maintenance, monitoring, and automated scaling'
    },
    {
      id: 'ebs-volumes',
      name: 'EBS Volumes',
      description: 'Block storage volumes for EC2 instances',
      icon: <Layers className="w-8 h-8 text-aws-orange" />,
      lambdaIntegration: 'Automated volume snapshots and cleanup via scheduled Lambda functions'
    },
    {
      id: 'efs-filesystem',
      name: 'EFS File System',
      description: 'Elastic file system for use with EC2 instances',
      icon: <FileText className="w-8 h-8 text-aws-orange" />,
      lambdaIntegration: 'Lambda functions for file processing and automated backups'
    },
    {
      id: 'vpc-networking',
      name: 'VPC Networking',
      description: 'Virtual Private Cloud with subnets and security groups',
      icon: <Network className="w-8 h-8 text-aws-orange" />,
      lambdaIntegration: 'Lambda-powered network monitoring and automated security rule updates'
    }
  ];

  const handleServiceToggle = (serviceId) => {
    const currentSelected = formData.selectedInfrastructure || [];
    const isSelected = currentSelected.includes(serviceId);
    
    const newSelected = isSelected
      ? currentSelected.filter(id => id !== serviceId)
      : [...currentSelected, serviceId];
    
    updateFormData({ selectedInfrastructure: newSelected });
  };

  const selectedServices = formData.selectedInfrastructure || [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">AWS Infrastructure Options</h2>
        <p className="text-gray-600">
          Configure AWS infrastructure services for your application. Each service will be managed and 
          optimized by Lambda functions for automated operations.
        </p>
      </div>

      {/* Service Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {infrastructureOptions.map((service) => {
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
                  <div className="bg-aws-gray-50 border border-aws-gray-200 p-3 rounded-lg">
                    <div className="text-xs font-medium text-aws-orange mb-1">
                      🚀 Lambda Integration:
                    </div>
                    <div className="text-xs text-aws-gray-700">
                      {service.lambdaIntegration}
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Selection Indicator */}
              <div className="absolute top-4 right-4">
                <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                  isSelected 
                    ? 'bg-aws-orange border-aws-orange' 
                    : 'border-aws-gray-300'
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

      {/* Selected Services Summary */}
      {selectedServices.length > 0 && (
        <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
          <h3 className="text-lg font-semibold text-green-800 mb-2">
            Selected Infrastructure Services ({selectedServices.length})
          </h3>
          <div className="flex flex-wrap gap-2">
            {selectedServices.map(serviceId => {
              const service = infrastructureOptions.find(s => s.id === serviceId);
              return (
                <span
                  key={serviceId}
                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800"
                >
                  {service?.name}
                </span>
              );
            })}
          </div>
        </div>
      )}

      {/* Lambda Automation Preview */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 rounded-lg text-white">
        <h3 className="text-lg font-semibold mb-3">🤖 Automated Infrastructure Management</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div className="bg-white bg-opacity-20 p-3 rounded">
            <div className="font-medium">Resource Provisioner Lambda</div>
            <div className="text-blue-100">Automatically creates and configures selected services</div>
          </div>
          <div className="bg-white bg-opacity-20 p-3 rounded">
            <div className="font-medium">Health Monitor Lambda</div>
            <div className="text-blue-100">Continuous monitoring and auto-healing capabilities</div>
          </div>
          <div className="bg-white bg-opacity-20 p-3 rounded">
            <div className="font-medium">Cost Optimizer Lambda</div>
            <div className="text-blue-100">Analyzes usage patterns and optimizes costs automatically</div>
          </div>
          <div className="bg-white bg-opacity-20 p-3 rounded">
            <div className="font-medium">Backup Manager Lambda</div>
            <div className="text-blue-100">Scheduled backups and retention policy management</div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-6 border-t border-gray-200">
        <button
          onClick={prevStep}
          className="btn-secondary flex items-center space-x-2"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>BACK</span>
        </button>

        <button
          onClick={nextStep}
          className="btn-primary flex items-center space-x-2"
        >
          <span>NEXT</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default InfrastructureStep; 