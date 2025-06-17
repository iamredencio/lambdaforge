// AWS Configuration for LambdaForge
export const awsConfig = {
  // AWS Bedrock settings
  bedrock: {
    region: process.env.REACT_APP_AWS_REGION || 'us-east-1',
    modelId: 'anthropic.claude-3-sonnet-20240229-v1:0',
    maxTokens: 4000,
    temperature: 0.1,
    topP: 0.9
  },

  // AWS Credentials (for demo purposes - in production use IAM roles)
  credentials: {
    accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY || ''
  },

  // Feature flags
  features: {
    enableAISuggestions: process.env.REACT_APP_ENABLE_AI_SUGGESTIONS !== 'false',
    enableFallbackMode: true,
    debugMode: process.env.REACT_APP_DEBUG_MODE === 'true'
  },

  // Available Bedrock regions
  availableRegions: [
    'us-east-1',
    'us-west-2',
    'eu-west-1',
    'ap-southeast-1',
    'ap-northeast-1'
  ],

  // Supported models
  supportedModels: [
    {
      id: 'anthropic.claude-3-sonnet-20240229-v1:0',
      name: 'Claude 3 Sonnet',
      provider: 'Anthropic',
      description: 'Balanced performance and speed for architecture analysis'
    },
    {
      id: 'anthropic.claude-3-haiku-20240307-v1:0',
      name: 'Claude 3 Haiku',
      provider: 'Anthropic',
      description: 'Fast and efficient for quick suggestions'
    }
  ]
};

// Validation function
export const validateAWSConfig = () => {
  const errors = [];
  
  if (!awsConfig.credentials.accessKeyId) {
    errors.push('AWS Access Key ID is required for AI suggestions');
  }
  
  if (!awsConfig.credentials.secretAccessKey) {
    errors.push('AWS Secret Access Key is required for AI suggestions');
  }
  
  if (!awsConfig.availableRegions.includes(awsConfig.bedrock.region)) {
    errors.push(`Region ${awsConfig.bedrock.region} is not supported for Bedrock`);
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

export default awsConfig; 