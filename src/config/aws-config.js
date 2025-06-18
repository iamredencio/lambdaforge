// AWS Configuration for LambdaForge
// ⚠️ SECURITY WARNING: This is a demo application. 
// In production, use IAM roles, AWS Cognito, or AWS IAM Identity Center instead of hardcoded credentials.

export const awsConfig = {
  // AWS Bedrock settings
  bedrock: {
    region: process.env.REACT_APP_AWS_REGION || 'us-east-1',
    modelId: 'anthropic.claude-3-sonnet-20240229-v1:0',
    maxTokens: 4000,
    temperature: 0.1,
    topP: 0.9
  },

  // AWS Credentials (DEMO ONLY - DO NOT USE IN PRODUCTION)
  // Production alternatives:
  // 1. AWS IAM Roles with AssumeRole
  // 2. AWS Cognito Identity Pools
  // 3. AWS IAM Identity Center (SSO)
  // 4. Temporary credentials via STS
  credentials: {
    accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY || ''
  },

  // Security settings
  security: {
    // Enable HTTPS only
    enforceHTTPS: true,
    // Maximum credential age in milliseconds (24 hours)
    maxCredentialAge: 24 * 60 * 60 * 1000,
    // Enable credential validation
    validateCredentials: true,
    // Sanitize user inputs
    sanitizeInputs: true
  },

  // Feature flags
  features: {
    enableAISuggestions: process.env.REACT_APP_ENABLE_AI_SUGGESTIONS !== 'false',
    enableFallbackMode: true,
    debugMode: process.env.REACT_APP_DEBUG_MODE === 'true',
    // Security features
    enableCredentialWarnings: true,
    enableInputSanitization: true
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

// Input sanitization function
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  
  // Remove potentially dangerous characters
  return input
    .replace(/[<>]/g, '') // Remove angle brackets
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .trim()
    .substring(0, 1000); // Limit length
};

// Enhanced validation function
export const validateAWSConfig = () => {
  const errors = [];
  const warnings = [];
  
  // Check region
  if (!awsConfig.availableRegions.includes(awsConfig.bedrock.region)) {
    errors.push(`Region ${awsConfig.bedrock.region} is not supported for Bedrock`);
  }
  
  // Security checks
  if (window.location.protocol === 'http:' && awsConfig.security.enforceHTTPS) {
    warnings.push('Application is running over HTTP - HTTPS recommended for production');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
};

// Security utilities
export const securityUtils = {
  // Check if credentials appear to be production-ready
  isProductionCredentials: (accessKeyId, secretAccessKey) => {
    const testPatterns = [
      /EXAMPLE/i,
      /DEMO/i,
      /TEST/i,
      /FAKE/i,
      /SAMPLE/i
    ];
    
    return !testPatterns.some(pattern => 
      pattern.test(accessKeyId) || pattern.test(secretAccessKey)
    );
  },
  
  // Mask sensitive data for logging
  maskCredentials: (credentials) => ({
    accessKeyId: credentials.accessKeyId ? 
      credentials.accessKeyId.substring(0, 4) + '***' + credentials.accessKeyId.slice(-4) : '',
    secretAccessKey: credentials.secretAccessKey ? '***masked***' : ''
  }),
  
  // Validate input format
  validateInputFormat: (input, type) => {
    switch (type) {
      case 'projectName':
        return /^[a-zA-Z0-9-_]{1,50}$/.test(input);
      case 'awsRegion':
        return awsConfig.availableRegions.includes(input);
      case 'accessKeyId':
        return /^[A-Z0-9]{16,32}$/.test(input);
      default:
        return true;
    }
  }
};

export default awsConfig; 