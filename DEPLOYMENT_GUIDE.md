# LambdaForge Deployment Guide

## Overview
LambdaForge is a React-based AWS infrastructure automation platform that can be deployed to AWS using a serverless architecture. This guide provides step-by-step instructions for deploying LambdaForge to production.

## Architecture Overview

### Frontend (React Application)
- **S3 Bucket**: Static website hosting for React build files
- **CloudFront**: CDN for global content delivery and caching
- **Route 53**: DNS management for custom domain
- **Certificate Manager**: SSL/TLS certificates for HTTPS

### Backend (API & Functions)
- **Lambda Functions**: Serverless compute for API endpoints
- **API Gateway**: RESTful API management and routing
- **DynamoDB**: NoSQL database for application data
- **Cognito**: User authentication and authorization

### Security & Monitoring
- **WAF**: Web Application Firewall for security
- **CloudWatch**: Logging and monitoring
- **X-Ray**: Distributed tracing
- **IAM**: Identity and access management

## Estimated Costs

### Production Environment
- **S3 Storage**: $5-15/month (depending on traffic)
- **CloudFront**: $20-50/month (based on data transfer)
- **Lambda Functions**: $10-30/month (based on requests)
- **API Gateway**: $15-40/month (based on API calls)
- **DynamoDB**: $5-25/month (based on read/write capacity)
- **Route 53**: $0.50/month per hosted zone
- **Certificate Manager**: Free for AWS-issued certificates
- **CloudWatch**: $5-20/month (based on logs and metrics)

**Total Estimated Cost**: $60-180/month

### Development Environment
- **Reduced Capacity**: $25-75/month
- **Single AZ Deployment**: Lower redundancy costs
- **Minimal Monitoring**: Reduced CloudWatch costs

## Prerequisites

1. **AWS Account** with appropriate permissions
2. **AWS CLI** installed and configured
3. **Node.js** v18+ and npm
4. **Domain Name** (optional, for custom domain)

## Deployment Steps

### 1. Prepare the Application

```bash
# Clone and build the application
git clone <repository-url>
cd lambdaforge
npm install
npm run build
```

### 2. AWS Infrastructure Setup

#### S3 Bucket for Static Hosting
```bash
# Create S3 bucket
aws s3 mb s3://lambdaforge-app-production

# Enable static website hosting
aws s3 website s3://lambdaforge-app-production \
  --index-document index.html \
  --error-document error.html

# Upload build files
aws s3 sync build/ s3://lambdaforge-app-production --delete
```

#### CloudFront Distribution
```bash
# Create CloudFront distribution (use AWS Console or CloudFormation)
# Configure origin as S3 bucket
# Enable compression and caching
# Set default root object to index.html
```

#### Lambda Functions for API
```bash
# Create Lambda function for API endpoints
# Deploy function code
# Configure environment variables
# Set up API Gateway integration
```

### 3. Database Setup

#### DynamoDB Tables
```bash
# Create tables for application data
aws dynamodb create-table \
  --table-name LambdaForge-Projects \
  --attribute-definitions AttributeName=id,AttributeType=S \
  --key-schema AttributeName=id,KeyType=HASH \
  --billing-mode PAY_PER_REQUEST
```

### 4. Security Configuration

#### IAM Roles and Policies
- Lambda execution role with DynamoDB access
- CloudFront origin access identity
- API Gateway execution role

#### WAF Configuration
- Rate limiting rules
- SQL injection protection
- XSS protection

### 5. Monitoring Setup

#### CloudWatch
- Application logs
- Performance metrics
- Custom dashboards
- Alarms for error rates and latency

#### X-Ray Tracing
- Enable tracing for Lambda functions
- Configure sampling rules
- Set up service map

## Environment Variables

### Lambda Functions
```
AWS_REGION=us-east-1
DYNAMODB_TABLE_PREFIX=LambdaForge-
CORS_ORIGIN=https://your-domain.com
LOG_LEVEL=info
```

### React Application
```
REACT_APP_API_ENDPOINT=https://api.your-domain.com
REACT_APP_AWS_REGION=us-east-1
REACT_APP_COGNITO_USER_POOL_ID=us-east-1_xxxxxxxxx
REACT_APP_COGNITO_CLIENT_ID=xxxxxxxxxxxxxxxxxx
```

## CI/CD Pipeline

### CodePipeline Setup
1. **Source Stage**: GitHub/CodeCommit integration
2. **Build Stage**: CodeBuild for npm build
3. **Deploy Stage**: S3 deployment and CloudFront invalidation

### CodeBuild Configuration
```yaml
version: 0.2
phases:
  pre_build:
    commands:
      - npm install
  build:
    commands:
      - npm run build
  post_build:
    commands:
      - aws s3 sync build/ s3://$S3_BUCKET --delete
      - aws cloudfront create-invalidation --distribution-id $CLOUDFRONT_ID --paths "/*"
```

## Custom Domain Setup

### Route 53 Configuration
1. Create hosted zone for your domain
2. Create A record pointing to CloudFront distribution
3. Configure CNAME for www subdomain

### SSL Certificate
1. Request certificate in Certificate Manager
2. Validate domain ownership
3. Associate certificate with CloudFront distribution

## Monitoring and Maintenance

### Health Checks
- CloudWatch synthetic monitoring
- API endpoint health checks
- Frontend availability monitoring

### Backup Strategy
- DynamoDB point-in-time recovery
- S3 versioning for static assets
- Lambda function versioning

### Security Updates
- Regular dependency updates
- AWS service updates
- Security patch management

## Troubleshooting

### Common Issues
1. **CORS Errors**: Check API Gateway CORS configuration
2. **404 Errors**: Verify CloudFront behavior settings
3. **Slow Loading**: Check CloudFront caching rules
4. **API Timeouts**: Review Lambda function timeout settings

### Debugging Tools
- CloudWatch Logs for Lambda functions
- X-Ray traces for request flow
- CloudFront access logs
- API Gateway execution logs

## Cost Optimization

### Strategies
1. **S3 Intelligent Tiering**: Automatic cost optimization
2. **CloudFront Caching**: Reduce origin requests
3. **Lambda Provisioned Concurrency**: Only for high-traffic functions
4. **DynamoDB On-Demand**: Pay per request for variable workloads

### Monitoring Costs
- AWS Cost Explorer for detailed analysis
- Budget alerts for cost thresholds
- Resource tagging for cost allocation

## Scaling Considerations

### Traffic Growth
- CloudFront automatically scales
- Lambda scales automatically up to account limits
- DynamoDB auto-scaling for consistent performance

### Geographic Distribution
- Multiple CloudFront edge locations
- Cross-region replication for DynamoDB
- Multi-region Lambda deployments

## Security Best Practices

1. **Least Privilege**: Minimal IAM permissions
2. **Encryption**: At rest and in transit
3. **Regular Audits**: AWS Config and CloudTrail
4. **WAF Rules**: Updated threat protection
5. **Secrets Management**: AWS Secrets Manager for sensitive data

This deployment guide provides a comprehensive approach to deploying LambdaForge in a production-ready, scalable, and secure manner on AWS. 