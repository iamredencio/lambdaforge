import React from 'react';
import { Info, ChevronLeft, ChevronRight, Zap, Rocket } from 'lucide-react';

const AWSRequiredStep = ({ formData, updateFormData, nextStep, prevStep, currentStep, totalSteps }) => {
  const handleInputChange = (field, value) => {
    updateFormData({ [field]: value });
  };

  const fillTestData = () => {
    const testData = {
      projectName: 'demo-ecommerce-platform',
      awsRegion: 'us-east-1',
      environment: 'Development',
      awsAccessKeyId: 'AKIAIOSFODNN7EXAMPLE',
      awsSecretAccessKey: 'wJalrXUtnFEMI/K7MDENG/bPxRfiCYzEXAMPLEKEY',
      vpcCidrBlock: '10.0.0.0/16'
    };
    updateFormData(testData);
  };

  const deployLambdaForge = () => {
    const lambdaForgeConfig = {
      projectName: 'lambdaforge-production',
      awsRegion: 'us-east-1',
      environment: 'Production',
      awsAccessKeyId: '', // User needs to fill this
      awsSecretAccessKey: '', // User needs to fill this
      vpcCidrBlock: '10.0.0.0/16',
      
      // Infrastructure for React App with AWS
      selectedInfrastructure: ['s3-bucket', 'cloudfront-distribution', 'route53-dns'],
      
      // Serverless compute for API and functions
      selectedCompute: ['lambda-functions'],
      
      // Integration services for React app
      selectedIntegration: ['api-gateway', 'cloudfront-cdn'],
      
      // Security for production app
      selectedSecurity: ['iam-roles', 'ssl-certificates', 'waf-protection'],
      
      // Monitoring for production
      selectedMonitoring: ['cloudwatch', 'alarms', 'x-ray-tracing'],
      
      // CI/CD pipeline for React app
      selectedDeployment: ['codepipeline', 'codebuild', 'cloudformation'],
      
      // Optimization for React app
      selectedOptimization: ['cost-optimizer', 'performance-insights', 'auto-scaling']
    };
    updateFormData(lambdaForgeConfig);
  };

  const awsRegions = [
    'us-east-1', 'us-east-2', 'us-west-1', 'us-west-2',
    'eu-west-1', 'eu-west-2', 'eu-west-3', 'eu-central-1',
    'ap-southeast-1', 'ap-southeast-2', 'ap-northeast-1', 'ap-northeast-2',
    'ca-central-1', 'sa-east-1'
  ];

  const environments = ['Development', 'Staging', 'Production'];

  const isValid = formData.projectName && formData.awsAccessKeyId && formData.awsSecretAccessKey && formData.vpcCidrBlock;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900">AWS Required Configuration</h2>
          <div className="flex items-center space-x-3">
            <button
              onClick={deployLambdaForge}
              className="flex items-center space-x-2 bg-aws-smile text-white px-4 py-2 rounded-lg font-medium hover:bg-aws-orange-dark transition-all duration-200 shadow-sm"
            >
              <Rocket className="w-4 h-4" />
              <span className="text-sm">Deploy LambdaForge</span>
            </button>
            <button
              onClick={fillTestData}
              className="flex items-center space-x-2 bg-aws-blue text-white px-4 py-2 rounded-lg font-medium hover:bg-aws-blue-dark transition-all duration-200 shadow-sm"
            >
              <Zap className="w-4 h-4" />
              <span className="text-sm">Test Mode</span>
            </button>
          </div>
        </div>
        <div className="flex items-start space-x-3 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div className="text-blue-800">
            <p className="mb-2">
              Please fill in all required fields to proceed. These values will be used in your AWS Lambda 
              infrastructure configuration and deployment automation.
            </p>
            <p className="text-sm font-medium">
              💡 <span className="text-aws-orange">Deploy LambdaForge</span> button configures this form to deploy the LambdaForge platform itself. 
              You'll still need to provide your AWS credentials.
            </p>
          </div>
        </div>
      </div>

      {/* Form Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Project Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Project Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            className="form-input"
            placeholder="Enter project name"
            value={formData.projectName}
            onChange={(e) => handleInputChange('projectName', e.target.value)}
          />
        </div>

        {/* AWS Region */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            AWS Region <span className="text-red-500">*</span>
          </label>
          <select
            className="form-select"
            value={formData.awsRegion}
            onChange={(e) => handleInputChange('awsRegion', e.target.value)}
          >
            {awsRegions.map(region => (
              <option key={region} value={region}>{region}</option>
            ))}
          </select>
        </div>

        {/* Environment */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Environment <span className="text-red-500">*</span>
          </label>
          <select
            className="form-select"
            value={formData.environment}
            onChange={(e) => handleInputChange('environment', e.target.value)}
          >
            {environments.map(env => (
              <option key={env} value={env}>{env}</option>
            ))}
          </select>
        </div>

        {/* AWS Access Key ID */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            AWS Access Key ID <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            className="form-input"
            placeholder="Enter AWS Access Key ID"
            value={formData.awsAccessKeyId}
            onChange={(e) => handleInputChange('awsAccessKeyId', e.target.value)}
          />
        </div>

        {/* AWS Secret Access Key */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            AWS Secret Access Key <span className="text-red-500">*</span>
          </label>
          <input
            type="password"
            className="form-input"
            placeholder="Enter AWS Secret Access Key"
            value={formData.awsSecretAccessKey}
            onChange={(e) => handleInputChange('awsSecretAccessKey', e.target.value)}
          />
        </div>

        {/* VPC CIDR Block */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            VPC CIDR Block <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            className="form-input"
            placeholder="e.g., 10.0.0.0/16"
            value={formData.vpcCidrBlock}
            onChange={(e) => handleInputChange('vpcCidrBlock', e.target.value)}
          />
          <p className="text-sm text-gray-500 mt-1">
            CIDR block for the AWS VPC that will be created for your infrastructure.
          </p>
        </div>
      </div>

      {/* Lambda Architecture Preview */}
      <div className="bg-aws-gray-50 border border-aws-gray-200 p-6 rounded-lg">
        <h3 className="text-lg font-semibold mb-4 text-aws-blue">🚀 Lambda-Powered Infrastructure</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="bg-white border border-aws-gray-200 p-4 rounded-lg shadow-sm">
            <div className="font-medium text-aws-blue">Infrastructure Analyzer</div>
            <div className="text-aws-gray-600 mt-1">AI-powered architecture recommendations</div>
          </div>
          <div className="bg-white border border-aws-gray-200 p-4 rounded-lg shadow-sm">
            <div className="font-medium text-aws-blue">Resource Provisioner</div>
            <div className="text-aws-gray-600 mt-1">Automated AWS resource creation</div>
          </div>
          <div className="bg-white border border-aws-gray-200 p-4 rounded-lg shadow-sm">
            <div className="font-medium text-aws-blue">Cost Optimizer</div>
            <div className="text-aws-gray-600 mt-1">Real-time cost monitoring & optimization</div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex justify-between pt-6 border-t border-gray-200">
        <button
          onClick={prevStep}
          disabled={currentStep === 1}
          className="btn-secondary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>BACK</span>
        </button>

        <button
          onClick={nextStep}
          disabled={!isValid}
          className="btn-primary flex items-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span>NEXT</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default AWSRequiredStep; 