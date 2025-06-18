# LambdaForge - AWS Infrastructure Generator

🚀 **LambdaForge** is an intelligent AWS infrastructure generator that creates complete, production-ready cloud architectures through an intuitive web interface. Generate infrastructure-as-code, deployment scripts, and comprehensive documentation in minutes.

## ✨ Features

- **Visual Infrastructure Designer**: Interactive step-by-step wizard for selecting AWS services
- **AI-Powered Recommendations**: Smart suggestions based on your project requirements
- **Production-Ready Templates**: Generate CloudFormation templates with best practices
- **Automated Deployment Scripts**: Complete bash scripts with error handling and progress tracking
- **Security-First Approach**: Built-in security configurations and credential management
- **Cost Optimization**: Intelligent resource sizing and cost-effective configurations
- **Comprehensive Documentation**: Auto-generated README files and deployment guides

## 🔐 AWS Credentials Configuration

**Security Notice**: LambdaForge keeps your AWS credentials secure by configuring them directly in the deployment script, not in the web application.

### Choose Your Authentication Method

#### Option 1: AWS Credentials (Development/Testing)
Edit the generated `deploy.sh` file and uncomment/fill in your credentials:

```bash
# Uncomment and fill in your AWS credentials:
AWS_ACCESS_KEY_ID="YOUR_ACCESS_KEY_HERE"
AWS_SECRET_ACCESS_KEY="YOUR_SECRET_KEY_HERE"
```

#### Option 2: IAM Roles (🏆 Recommended for Production)
If running on AWS infrastructure (EC2, ECS, EKS, Lambda):
- Attach an IAM role with required permissions to your instance
- No additional configuration needed
- The deployment script automatically uses the instance's IAM role
- Most secure option - no credentials stored anywhere

**Required IAM Permissions:**
```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "cloudformation:*",
        "lambda:*",
        "apigateway:*",
        "s3:*",
        "iam:*",
        "logs:*"
      ],
      "Resource": "*"
    }
  ]
}
```

#### Option 3: AWS CLI Profile
If you have multiple AWS profiles configured:

```bash
# Edit deploy.sh and uncomment:
AWS_PROFILE="your-profile-name"
```

#### Option 4: Environment Variables
Set environment variables before running the deployment:

```bash
export AWS_ACCESS_KEY_ID="your-access-key"
export AWS_SECRET_ACCESS_KEY="your-secret-key"
export AWS_DEFAULT_REGION="us-east-1"
./deploy.sh
```

## 🚀 Quick Start

### Prerequisites
- **AWS CLI** installed and configured
- **Node.js 16+** (for web applications)
- **Bash shell** (Linux/macOS/WSL)

### 1. Generate Your Infrastructure
1. Visit the LambdaForge web interface
2. Follow the step-by-step wizard to configure your infrastructure
3. Download the generated deployment package

### 2. Configure AWS Credentials
Choose one of the authentication methods above and configure your credentials.

### 3. Deploy Infrastructure
```bash
chmod +x deploy.sh delete.sh
./deploy.sh
```

### 4. Clean Up Resources (when done)
```bash
./delete.sh
```

**⚠️ Warning**: The delete script will permanently remove all AWS resources created by this deployment.

## 🏗️ Generated Infrastructure Components

### Core Infrastructure
- **VPC with Public/Private Subnets**: Secure network architecture
- **Internet Gateway & NAT Gateway**: Proper internet connectivity
- **Security Groups**: Least-privilege access controls
- **Route Tables**: Optimized routing configuration

### Compute Services
- **AWS Lambda Functions**: Serverless compute with auto-scaling
- **EC2 Instances**: When persistent compute is needed
- **ECS/Fargate**: Container orchestration for microservices
- **Auto Scaling Groups**: Automatic capacity management

### Storage & Database
- **S3 Buckets**: Object storage with versioning and encryption
- **RDS Instances**: Managed relational databases
- **DynamoDB Tables**: NoSQL databases with on-demand scaling
- **ElastiCache**: In-memory caching for performance

### Integration & API
- **API Gateway**: RESTful API management
- **Application Load Balancer**: Traffic distribution
- **CloudFront CDN**: Global content delivery
- **SQS/SNS**: Message queuing and notifications

### Security & Monitoring
- **IAM Roles & Policies**: Fine-grained access control
- **CloudWatch**: Monitoring, logging, and alerting
- **AWS WAF**: Web application firewall
- **X-Ray**: Distributed tracing and debugging

## 🛠️ Customization

### Environment Configuration
The deployment script supports multiple environments:
- **Development**: Cost-optimized with minimal redundancy
- **Staging**: Production-like with reduced capacity
- **Production**: High availability with full redundancy

### Regional Deployment
Deploy to any AWS region by modifying the region setting in your generated configuration.

### Resource Sizing
Generated templates include intelligent resource sizing based on your project requirements.

## 🆘 Troubleshooting

### AWS Credentials Issues
1. **"Unable to locate credentials"**: Configure AWS credentials using one of the methods above
2. **"Access Denied"**: Ensure your credentials have the required IAM permissions
3. **"Invalid security token"**: Check if your temporary credentials have expired
4. **"Region not specified"**: Set AWS_DEFAULT_REGION or configure AWS CLI region

### Deployment Failures
1. **Check AWS credentials**: `aws sts get-caller-identity`
2. **Verify region configuration**: `aws configure get region`
3. **Review CloudFormation events** in AWS Console for specific errors
4. **Check deployment script output** for detailed error messages

### Common Solutions
- Ensure AWS CLI is properly configured: `aws configure list`
- Verify IAM permissions match the required policy above
- Check AWS service limits in your region
- Ensure unique resource names (S3 bucket names must be globally unique)

## 🔒 Security Best Practices

### Credential Management
- ✅ Use IAM roles when possible (most secure)
- ✅ Use temporary credentials via AWS STS
- ✅ Store credentials in deployment scripts, not web applications
- ❌ Never commit credentials to version control
- ❌ Avoid hardcoding credentials in source code

### Infrastructure Security
- All resources deployed with least-privilege access
- Security groups with minimal required ports
- Encryption enabled for data at rest and in transit
- VPC with private subnets for sensitive resources

## 📊 Cost Optimization

### Built-in Cost Controls
- **Right-sizing**: Resources sized based on actual requirements
- **Auto-scaling**: Automatic capacity adjustment
- **Reserved Instances**: Recommendations for long-term workloads
- **Spot Instances**: Cost savings for fault-tolerant workloads

### Monitoring & Alerts
- CloudWatch cost alarms
- Budget notifications
- Resource utilization monitoring
- Automatic cleanup of unused resources

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: [Full documentation](https://lambdaforge.dev/docs)
- **Issues**: [GitHub Issues](https://github.com/lambdaforge/lambdaforge/issues)
- **Community**: [Discord Community](https://discord.gg/lambdaforge)
- **Email**: support@lambdaforge.dev

---

**Built with ❤️ for the AWS community**

*LambdaForge - Making AWS infrastructure as code accessible to everyone* 