import { BedrockRuntimeClient, InvokeModelCommand } from '@aws-sdk/client-bedrock-runtime';
import { awsConfig, validateAWSConfig } from '../config/aws-config';

// AWS Bedrock configuration
const bedrock = new BedrockRuntimeClient({
  region: awsConfig.bedrock.region,
  credentials: {
    accessKeyId: awsConfig.credentials.accessKeyId,
    secretAccessKey: awsConfig.credentials.secretAccessKey
  }
});

class AIService {
  constructor() {
    this.modelId = awsConfig.bedrock.modelId;
    this.maxTokens = awsConfig.bedrock.maxTokens;
    this.temperature = awsConfig.bedrock.temperature;
    this.topP = awsConfig.bedrock.topP;
    
    // Validate configuration on initialization
    this.configValidation = validateAWSConfig();
  }

  async generateArchitectureRecommendations(formData) {
    try {
      // Check if AI features are enabled and configured
      if (!awsConfig.features.enableAISuggestions) {
        console.log('AI suggestions disabled, using fallback mode');
        return this.getFallbackRecommendations(formData);
      }

      // Validate AWS configuration
      if (!this.configValidation.isValid) {
        console.warn('AWS configuration invalid:', this.configValidation.errors);
        if (awsConfig.features.enableFallbackMode) {
          return this.getFallbackRecommendations(formData);
        }
        throw new Error('AWS configuration invalid: ' + this.configValidation.errors.join(', '));
      }

      const prompt = this.buildArchitecturePrompt(formData);
      
      const command = new InvokeModelCommand({
        modelId: this.modelId,
        contentType: 'application/json',
        accept: 'application/json',
        body: JSON.stringify({
          anthropic_version: 'bedrock-2023-05-31',
          max_tokens: this.maxTokens,
          messages: [
            {
              role: 'user',
              content: prompt
            }
          ],
          temperature: this.temperature,
          top_p: this.topP
        })
      });

      if (awsConfig.features.debugMode) {
        console.log('Bedrock API call:', command);
      }

      const response = await bedrock.send(command);
      const responseBody = JSON.parse(new TextDecoder().decode(response.body));
      
      if (awsConfig.features.debugMode) {
        console.log('Bedrock response:', responseBody);
      }
      
      return this.parseAIResponse(responseBody.content[0].text, formData);
    } catch (error) {
      console.error('AI Service Error:', error);
      
      // Provide more specific error handling
      if (error.code === 'AccessDenied') {
        throw new Error('AWS access denied. Please check your credentials and IAM permissions for Bedrock.');
      } else if (error.code === 'ModelNotFound') {
        throw new Error('Claude 3 model not available in this region. Please check your AWS region.');
      } else if (error.code === 'ThrottlingException') {
        throw new Error('AWS Bedrock rate limit exceeded. Please try again later.');
      }
      
      // Fallback to rule-based recommendations if AI fails
      if (awsConfig.features.enableFallbackMode) {
        return this.getFallbackRecommendations(formData);
      }
      
      throw error;
    }
  }

  buildArchitecturePrompt(formData) {
    const currentServices = {
      infrastructure: formData.selectedInfrastructure || [],
      compute: formData.selectedCompute || [],
      integration: formData.selectedIntegration || [],
      security: formData.selectedSecurity || [],
      monitoring: formData.selectedMonitoring || [],
      deployment: formData.selectedDeployment || [],
      optimization: formData.selectedOptimization || []
    };

    return `You are an AWS Solutions Architect AI assistant. Analyze the following infrastructure configuration and provide specific, actionable recommendations.

PROJECT DETAILS:
- Project Name: ${formData.projectName || 'Not specified'}
- Environment: ${formData.environment || 'Development'}
- AWS Region: ${formData.awsRegion || 'us-east-1'}
- VPC CIDR: ${formData.vpcCidrBlock || 'Not specified'}

CURRENT SERVICES SELECTED:
- Infrastructure: ${currentServices.infrastructure.join(', ') || 'None'}
- Compute: ${currentServices.compute.join(', ') || 'None'}
- Integration: ${currentServices.integration.join(', ') || 'None'}
- Security: ${currentServices.security.join(', ') || 'None'}
- Monitoring: ${currentServices.monitoring.join(', ') || 'None'}
- Deployment: ${currentServices.deployment.join(', ') || 'None'}
- Optimization: ${currentServices.optimization.join(', ') || 'None'}

Please provide 3-5 specific recommendations in the following JSON format:
{
  "recommendations": [
    {
      "id": "unique-id",
      "type": "security|cost|performance|architecture|monitoring",
      "title": "Recommendation Title",
      "description": "Brief description of the recommendation",
      "impact": "Critical|High|Medium|Low",
      "confidence": 85,
      "savings": "$X/month or Risk Reduction or Operational Efficiency",
      "reasoning": "Why this recommendation is important",
      "recommendations": ["Step 1", "Step 2", "Step 3"],
      "applyData": {
        "selectedSecurity": ["service-to-add"],
        "selectedMonitoring": ["service-to-add"]
      }
    }
  ]
}

Focus on:
1. Security best practices and compliance
2. Cost optimization opportunities
3. Performance improvements
4. Serverless-first architecture when appropriate
5. Monitoring and observability gaps
6. AWS Well-Architected Framework principles

Provide only the JSON response, no additional text.`;
  }

  parseAIResponse(aiResponse, formData) {
    try {
      const parsed = JSON.parse(aiResponse);
      return parsed.recommendations.map(rec => ({
        ...rec,
        icon: this.getIconForType(rec.type),
        // Ensure applyData maintains existing selections
        applyData: this.mergeApplyData(rec.applyData, formData)
      }));
    } catch (error) {
      console.error('Failed to parse AI response:', error);
      return this.getFallbackRecommendations(formData);
    }
  }

  mergeApplyData(newData, formData) {
    const merged = {};
    
    Object.keys(newData).forEach(key => {
      if (Array.isArray(newData[key])) {
        // Merge arrays, avoiding duplicates
        const existing = formData[key] || [];
        merged[key] = [...new Set([...existing, ...newData[key]])];
      } else {
        merged[key] = newData[key];
      }
    });
    
    return merged;
  }

  getIconForType(type) {
    // Return icon components based on type
    const iconMap = {
      security: '🛡️',
      cost: '💰',
      performance: '⚡',
      architecture: '🏗️',
      monitoring: '📊'
    };
    return iconMap[type] || '💡';
  }

  getFallbackRecommendations(formData) {
    // Fallback rule-based recommendations if AI fails
    const recommendations = [];

    // Security recommendations
    if (!formData.selectedSecurity?.includes('waf-protection')) {
      recommendations.push({
        id: 'security-waf',
        type: 'security',
        title: 'Enable AWS WAF Protection',
        description: 'Add Web Application Firewall for enhanced security',
        impact: 'High',
        confidence: 95,
        savings: 'Risk Reduction',
        reasoning: 'WAF protects against common web exploits and attacks',
        recommendations: ['Enable AWS WAF', 'Configure rate limiting', 'Set up geo-blocking'],
        icon: '🛡️',
        applyData: {
          selectedSecurity: [...(formData.selectedSecurity || []), 'waf-protection']
        }
      });
    }

    // Cost optimization
    if (formData.selectedCompute?.includes('ec2-instances') && 
        !formData.selectedOptimization?.includes('auto-scaling')) {
      recommendations.push({
        id: 'cost-autoscaling',
        type: 'cost',
        title: 'Implement Auto Scaling',
        description: 'Reduce costs with automatic scaling based on demand',
        impact: 'Medium',
        confidence: 88,
        savings: '$120/month',
        reasoning: 'Auto scaling optimizes resource usage and reduces costs',
        recommendations: ['Configure Auto Scaling Groups', 'Set up CloudWatch alarms', 'Define scaling policies'],
        icon: '💰',
        applyData: {
          selectedOptimization: [...(formData.selectedOptimization || []), 'auto-scaling']
        }
      });
    }

    return recommendations;
  }

  async validateRecommendation(recommendation, currentFormData) {
    // Validate that the recommendation doesn't conflict with current setup
    const conflicts = [];
    
    if (recommendation.applyData) {
      Object.keys(recommendation.applyData).forEach(key => {
        const newServices = recommendation.applyData[key];
        const currentServices = currentFormData[key] || [];
        
        // Check for any logical conflicts
        if (key === 'selectedCompute') {
          if (newServices.includes('lambda-functions') && currentServices.includes('ec2-instances')) {
            conflicts.push('Mixing Lambda and EC2 may require additional configuration');
          }
        }
      });
    }
    
    return {
      isValid: conflicts.length === 0,
      conflicts,
      recommendation
    };
  }

  async estimateCostImpact(recommendation, currentFormData) {
    // Estimate the cost impact of applying this recommendation
    const costMap = {
      'waf-protection': 35,
      'auto-scaling': -120, // Negative means savings
      'lambda-functions': -50,
      'cloudfront-cdn': 25,
      'x-ray-tracing': 22
    };

    let totalImpact = 0;
    
    if (recommendation.applyData) {
      Object.values(recommendation.applyData).flat().forEach(service => {
        if (costMap[service]) {
          totalImpact += costMap[service];
        }
      });
    }

    return {
      monthlyImpact: totalImpact,
      yearlyImpact: totalImpact * 12,
      description: totalImpact < 0 ? `Saves $${Math.abs(totalImpact)}/month` : `Adds $${totalImpact}/month`
    };
  }
}

const aiServiceInstance = new AIService();
export default aiServiceInstance; 