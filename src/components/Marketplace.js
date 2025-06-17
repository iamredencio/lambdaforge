import React from 'react';
import { X, Server, Database, Globe, Shield, Zap, TrendingUp, Rocket } from 'lucide-react';

const Marketplace = ({ isOpen, onClose, onSelectPackage }) => {
  const marketplacePackages = [
    {
      id: 'lambdaforge-app',
      title: 'LambdaForge Platform',
      description: 'Deploy the LambdaForge infrastructure automation platform itself with React frontend and serverless backend',
      icon: <Rocket className="w-8 h-8 text-aws-orange" />,
      features: ['React Frontend', 'S3 Static Hosting', 'CloudFront CDN', 'Lambda API', 'DynamoDB', 'CI/CD Pipeline'],
      estimatedCost: '$65-145/month',
      deployTime: '12-18 minutes',
      formData: {
        projectName: 'lambdaforge-production',
        selectedInfrastructure: ['s3-bucket', 'cloudfront-distribution', 'route53-dns'],
        selectedCompute: ['lambda-functions'],
        selectedIntegration: ['api-gateway', 'cloudfront-cdn'],
        selectedSecurity: ['iam-roles', 'ssl-certificates', 'waf-protection'],
        selectedMonitoring: ['cloudwatch', 'alarms', 'x-ray-tracing'],
        selectedDeployment: ['codepipeline', 'codebuild', 'cloudformation'],
        selectedOptimization: ['cost-optimizer', 'performance-insights', 'auto-scaling']
      }
    },
    {
      id: 'ecommerce-platform',
      title: 'E-Commerce Platform',
      description: 'Complete serverless e-commerce solution with auto-scaling, payment processing, and analytics',
      icon: <Globe className="w-8 h-8 text-aws-orange" />,
      features: ['Lambda Functions', 'DynamoDB', 'S3 Bucket', 'API Gateway', 'CloudFront'],
      estimatedCost: '$89-185/month',
      deployTime: '8-12 minutes',
      formData: {
        projectName: 'serverless-ecommerce',
        selectedInfrastructure: ['s3-bucket', 'dynamodb'],
        selectedCompute: ['lambda-functions'],
        selectedIntegration: ['api-gateway'],
        selectedSecurity: ['iam-roles', 'kms-encryption'],
        selectedMonitoring: ['cloudwatch', 'x-ray-tracing'],
        selectedDeployment: ['codepipeline', 'cloudformation'],
        selectedOptimization: ['cost-optimizer', 'auto-scaling']
      }
    },
    {
      id: 'data-analytics',
      title: 'Data Analytics Pipeline',
      description: 'Real-time data processing with machine learning insights and automated reporting',
      icon: <TrendingUp className="w-8 h-8 text-aws-orange" />,
      features: ['Lambda Functions', 'Kinesis', 'S3 Data Lake', 'Redshift', 'QuickSight'],
      estimatedCost: '$245-520/month',
      deployTime: '15-22 minutes',
      formData: {
        projectName: 'data-analytics-pipeline',
        selectedInfrastructure: ['s3-bucket', 'rds-database'],
        selectedCompute: ['lambda-functions', 'fargate-serverless'],
        selectedIntegration: ['eventbridge', 'step-functions'],
        selectedSecurity: ['iam-roles', 'kms-encryption'],
        selectedMonitoring: ['cloudwatch', 'x-ray-tracing'],
        selectedDeployment: ['codepipeline', 'cloudformation'],
        selectedOptimization: ['cost-optimizer', 'performance-insights']
      }
    },
    {
      id: 'web-application',
      title: 'Scalable Web Application',
      description: 'Modern web app with CDN, auto-scaling, and global deployment capabilities',
      icon: <Server className="w-8 h-8 text-aws-orange" />,
      features: ['EC2 Auto Scaling', 'Load Balancer', 'RDS', 'CloudFront', 'Route 53'],
      estimatedCost: '$127-285/month',
      deployTime: '10-15 minutes',
      formData: {
        projectName: 'scalable-web-app',
        selectedInfrastructure: ['s3-bucket', 'rds-database', 'vpc-networking'],
        selectedCompute: ['ec2-instances', 'lambda-functions'],
        selectedIntegration: ['api-gateway'],
        selectedSecurity: ['iam-roles', 'security-groups'],
        selectedMonitoring: ['cloudwatch', 'alarms'],
        selectedDeployment: ['codepipeline', 'codedeploy'],
        selectedOptimization: ['cost-optimizer', 'auto-scaling']
      }
    },
    {
      id: 'microservices',
      title: 'Microservices Architecture',
      description: 'Container-based microservices with service mesh and automated CI/CD',
      icon: <Database className="w-8 h-8 text-aws-orange" />,
      features: ['ECS Fargate', 'Service Discovery', 'Load Balancing', 'Auto Scaling'],
      estimatedCost: '$342-685/month',
      deployTime: '18-25 minutes',
      formData: {
        projectName: 'microservices-platform',
        selectedInfrastructure: ['s3-bucket', 'dynamodb', 'vpc-networking'],
        selectedCompute: ['ecs-containers', 'fargate-serverless', 'lambda-functions'],
        selectedIntegration: ['api-gateway', 'eventbridge'],
        selectedSecurity: ['iam-roles', 'security-groups', 'kms-encryption'],
        selectedMonitoring: ['cloudwatch', 'x-ray-tracing', 'alarms'],
        selectedDeployment: ['codepipeline', 'codebuild', 'codedeploy'],
        selectedOptimization: ['cost-optimizer', 'auto-scaling', 'performance-insights']
      }
    },
    {
      id: 'iot-platform',
      title: 'IoT Data Platform',
      description: 'Complete IoT solution for device management, data ingestion, and real-time analytics',
      icon: <Zap className="w-8 h-8 text-aws-orange" />,
      features: ['IoT Core', 'Kinesis', 'Lambda', 'DynamoDB', 'Timestream'],
      estimatedCost: '$198-425/month',
      deployTime: '12-18 minutes',
      formData: {
        projectName: 'iot-data-platform',
        selectedInfrastructure: ['s3-bucket', 'dynamodb'],
        selectedCompute: ['lambda-functions', 'fargate-serverless'],
        selectedIntegration: ['eventbridge', 'sns-notifications'],
        selectedSecurity: ['iam-roles', 'kms-encryption', 'secrets-manager'],
        selectedMonitoring: ['cloudwatch', 'x-ray-tracing', 'cloudtrail'],
        selectedDeployment: ['codepipeline', 'cloudformation'],
        selectedOptimization: ['cost-optimizer', 'resource-optimizer']
      }
    },
    {
      id: 'backup-disaster',
      title: 'Backup & Disaster Recovery',
      description: 'Automated backup solution with cross-region replication and instant recovery',
      icon: <Shield className="w-8 h-8 text-aws-orange" />,
      features: ['Cross-Region Backup', 'Point-in-Time Recovery', 'Automated Testing'],
      estimatedCost: '$45-125/month',
      deployTime: '5-8 minutes',
      formData: {
        projectName: 'backup-disaster-recovery',
        selectedInfrastructure: ['s3-bucket', 'ebs-volumes'],
        selectedCompute: ['lambda-functions'],
        selectedIntegration: ['sns-notifications', 'step-functions'],
        selectedSecurity: ['iam-roles', 'kms-encryption'],
        selectedMonitoring: ['cloudwatch', 'alarms', 'cloudtrail'],
        selectedDeployment: ['cloudformation'],
        selectedOptimization: ['cost-optimizer', 'resource-optimizer']
      }
    }
  ];

  const handleSelectPackage = (packageData) => {
    onSelectPackage(packageData.formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-aws-squid text-white p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">AWS Deployment Marketplace</h2>
            <p className="text-aws-gray-300 mt-1">Pre-configured infrastructure packages for rapid deployment</p>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:text-aws-gray-300 transition-colors duration-200 p-1 rounded-lg hover:bg-aws-gray-700"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr">
            {marketplacePackages.map((pkg) => (
              <div
                key={pkg.id}
                className="bg-white border border-aws-gray-200 rounded-lg hover:shadow-lg hover:border-aws-smile transition-all duration-200 group flex flex-col h-full"
              >
                {/* Card Content - Flex grow to push button to bottom */}
                <div className="p-6 flex-grow flex flex-col">
                  {/* Icon and Title */}
                  <div className="flex items-start space-x-3 mb-4">
                    <div className="bg-aws-gray-100 p-2 rounded-lg group-hover:bg-aws-orange-pale transition-colors duration-200">
                      <div className="w-8 h-8 text-aws-smile">
                        {pkg.icon}
                      </div>
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-aws-gray-800 group-hover:text-aws-smile transition-colors duration-200">
                        {pkg.title}
                      </h3>
                      <p className="text-sm text-aws-gray-600 mt-1 leading-relaxed">
                        {pkg.description}
                      </p>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="mb-4 flex-grow">
                    <h4 className="text-sm font-semibold text-aws-gray-700 mb-2">Includes:</h4>
                    <div className="flex flex-wrap gap-1">
                      {pkg.features.map((feature, index) => (
                        <span
                          key={index}
                          className="inline-block bg-aws-gray-100 text-aws-gray-700 text-xs px-2 py-1 rounded font-medium"
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Details */}
                  <div className="space-y-3 text-sm mb-4">
                    <div className="flex justify-between items-center">
                      <span className="text-aws-gray-600 font-medium">Est. Cost:</span>
                      <span className="font-bold text-aws-gray-800 bg-aws-gray-100 px-2 py-1 rounded">{pkg.estimatedCost}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-aws-gray-600 font-medium">Deploy Time:</span>
                      <span className="font-bold text-aws-success-600 bg-aws-success-50 px-2 py-1 rounded">{pkg.deployTime}</span>
                    </div>
                  </div>
                </div>

                {/* Action Button - Always at bottom */}
                <div className="p-6 pt-0">
                  <button 
                    onClick={() => handleSelectPackage(pkg)}
                    className="w-full bg-aws-smile text-white py-3 px-4 rounded-lg font-bold hover:bg-aws-orange-dark transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                  >
                    Deploy This Package
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Marketplace; 