#!/bin/bash

# LambdaForge Deployment Script
# This script deploys the LambdaForge React application to AWS

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Default values
PROJECT_NAME="lambdaforge-production"
ENVIRONMENT="Production"
AWS_REGION="us-east-1"
STACK_NAME="$PROJECT_NAME-stack"

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if required tools are installed
check_prerequisites() {
    print_status "Checking prerequisites..."
    
    # Check AWS CLI
    if ! command -v aws &> /dev/null; then
        print_error "AWS CLI is not installed. Please install it first."
        exit 1
    fi
    
    # Check Node.js
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install it first."
        exit 1
    fi
    
    # Check npm
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed. Please install it first."
        exit 1
    fi
    
    # Check AWS credentials
    if ! aws sts get-caller-identity &> /dev/null; then
        print_error "AWS credentials are not configured. Please run 'aws configure' first."
        exit 1
    fi
    
    print_success "All prerequisites are met."
}

# Function to build the React application
build_application() {
    print_status "Building React application..."
    
    if [ ! -f "package.json" ]; then
        print_error "package.json not found. Make sure you're in the LambdaForge project directory."
        exit 1
    fi
    
    # Install dependencies
    print_status "Installing dependencies..."
    npm install
    
    # Build the application
    print_status "Building production build..."
    npm run build
    
    if [ ! -d "build" ]; then
        print_error "Build directory not created. Build may have failed."
        exit 1
    fi
    
    print_success "Application built successfully."
}

# Function to deploy CloudFormation stack
deploy_infrastructure() {
    print_status "Deploying AWS infrastructure..."
    
    # Check if CloudFormation template exists
    if [ ! -f "cloudformation/lambdaforge-template.yaml" ]; then
        print_error "CloudFormation template not found at cloudformation/lambdaforge-template.yaml"
        exit 1
    fi
    
    # Deploy the stack
    print_status "Creating/updating CloudFormation stack: $STACK_NAME"
    
    aws cloudformation deploy \
        --template-file cloudformation/lambdaforge-template.yaml \
        --stack-name "$STACK_NAME" \
        --parameter-overrides \
            ProjectName="$PROJECT_NAME" \
            Environment="$ENVIRONMENT" \
        --capabilities CAPABILITY_NAMED_IAM \
        --region "$AWS_REGION" \
        --no-fail-on-empty-changeset
    
    if [ $? -eq 0 ]; then
        print_success "Infrastructure deployed successfully."
    else
        print_error "Infrastructure deployment failed."
        exit 1
    fi
}

# Function to upload build files to S3
upload_to_s3() {
    print_status "Uploading build files to S3..."
    
    # Get S3 bucket name from CloudFormation stack
    S3_BUCKET=$(aws cloudformation describe-stacks \
        --stack-name "$STACK_NAME" \
        --region "$AWS_REGION" \
        --query 'Stacks[0].Outputs[?OutputKey==`S3BucketName`].OutputValue' \
        --output text)
    
    if [ -z "$S3_BUCKET" ]; then
        print_error "Could not retrieve S3 bucket name from CloudFormation stack."
        exit 1
    fi
    
    print_status "Uploading to bucket: $S3_BUCKET"
    
    # Upload build files
    aws s3 sync build/ "s3://$S3_BUCKET" --delete --region "$AWS_REGION"
    
    if [ $? -eq 0 ]; then
        print_success "Files uploaded successfully."
    else
        print_error "File upload failed."
        exit 1
    fi
}

# Function to invalidate CloudFront cache
invalidate_cloudfront() {
    print_status "Invalidating CloudFront cache..."
    
    # Get CloudFront distribution ID from CloudFormation stack
    DISTRIBUTION_ID=$(aws cloudformation describe-stacks \
        --stack-name "$STACK_NAME" \
        --region "$AWS_REGION" \
        --query 'Stacks[0].Outputs[?OutputKey==`CloudFrontDistributionId`].OutputValue' \
        --output text)
    
    if [ -z "$DISTRIBUTION_ID" ]; then
        print_error "Could not retrieve CloudFront distribution ID from CloudFormation stack."
        exit 1
    fi
    
    print_status "Invalidating distribution: $DISTRIBUTION_ID"
    
    # Create invalidation
    INVALIDATION_ID=$(aws cloudfront create-invalidation \
        --distribution-id "$DISTRIBUTION_ID" \
        --paths "/*" \
        --query 'Invalidation.Id' \
        --output text)
    
    if [ $? -eq 0 ]; then
        print_success "CloudFront invalidation created: $INVALIDATION_ID"
    else
        print_error "CloudFront invalidation failed."
        exit 1
    fi
}

# Function to display deployment information
show_deployment_info() {
    print_status "Getting deployment information..."
    
    # Get stack outputs
    WEBSITE_URL=$(aws cloudformation describe-stacks \
        --stack-name "$STACK_NAME" \
        --region "$AWS_REGION" \
        --query 'Stacks[0].Outputs[?OutputKey==`WebsiteURL`].OutputValue' \
        --output text)
    
    API_ENDPOINT=$(aws cloudformation describe-stacks \
        --stack-name "$STACK_NAME" \
        --region "$AWS_REGION" \
        --query 'Stacks[0].Outputs[?OutputKey==`ApiEndpoint`].OutputValue' \
        --output text)
    
    echo ""
    echo "======================================"
    echo -e "${GREEN}🚀 LambdaForge Deployment Complete!${NC}"
    echo "======================================"
    echo ""
    echo -e "${BLUE}Website URL:${NC} $WEBSITE_URL"
    echo -e "${BLUE}API Endpoint:${NC} $API_ENDPOINT"
    echo -e "${BLUE}AWS Region:${NC} $AWS_REGION"
    echo -e "${BLUE}Environment:${NC} $ENVIRONMENT"
    echo ""
    echo -e "${YELLOW}Note:${NC} It may take a few minutes for the CloudFront distribution to fully propagate."
    echo -e "${YELLOW}Note:${NC} The website should be accessible at the URL above within 5-10 minutes."
    echo ""
}

# Function to show help
show_help() {
    echo "LambdaForge Deployment Script"
    echo ""
    echo "Usage: $0 [OPTIONS]"
    echo ""
    echo "Options:"
    echo "  -p, --project-name    Project name (default: lambdaforge-production)"
    echo "  -e, --environment     Environment (default: Production)"
    echo "  -r, --region          AWS region (default: us-east-1)"
    echo "  -h, --help            Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0                                    # Deploy with default settings"
    echo "  $0 -p my-lambdaforge -e Development  # Deploy with custom name and environment"
    echo "  $0 -r us-west-2                      # Deploy to different region"
    echo ""
}

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        -p|--project-name)
            PROJECT_NAME="$2"
            STACK_NAME="$PROJECT_NAME-stack"
            shift 2
            ;;
        -e|--environment)
            ENVIRONMENT="$2"
            shift 2
            ;;
        -r|--region)
            AWS_REGION="$2"
            shift 2
            ;;
        -h|--help)
            show_help
            exit 0
            ;;
        *)
            print_error "Unknown option: $1"
            show_help
            exit 1
            ;;
    esac
done

# Main deployment process
main() {
    echo ""
    echo "======================================"
    echo -e "${BLUE}🚀 LambdaForge Deployment Script${NC}"
    echo "======================================"
    echo ""
    echo -e "${BLUE}Project Name:${NC} $PROJECT_NAME"
    echo -e "${BLUE}Environment:${NC} $ENVIRONMENT"
    echo -e "${BLUE}AWS Region:${NC} $AWS_REGION"
    echo -e "${BLUE}Stack Name:${NC} $STACK_NAME"
    echo ""
    
    # Ask for confirmation
    read -p "Do you want to proceed with the deployment? (y/N): " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        print_warning "Deployment cancelled."
        exit 0
    fi
    
    # Run deployment steps
    check_prerequisites
    build_application
    deploy_infrastructure
    upload_to_s3
    invalidate_cloudfront
    show_deployment_info
    
    print_success "Deployment completed successfully! 🎉"
}

# Run main function
main 