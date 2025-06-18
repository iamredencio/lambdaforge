import React, { useState } from 'react';
import { AlertTriangle, Shield, X, Eye, EyeOff, Lock } from 'lucide-react';
import { useSecurityContext } from './SecurityProvider';

const SecurityWarning = () => {
  const { securityStatus } = useSecurityContext();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  // Don't show if no warnings/errors or if dismissed
  if ((securityStatus.warnings.length === 0 && securityStatus.errors.length === 0) || isDismissed) {
    return null;
  }

  const hasErrors = securityStatus.errors.length > 0;
  const hasWarnings = securityStatus.warnings.length > 0;

  return (
    <div className={`mb-6 border rounded-lg shadow-sm ${
      hasErrors 
        ? 'bg-red-50 border-red-200' 
        : 'bg-yellow-50 border-yellow-200'
    }`}>
      {/* Header */}
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3">
            <div className={`flex-shrink-0 ${
              hasErrors ? 'text-red-600' : 'text-yellow-600'
            }`}>
              {hasErrors ? (
                <AlertTriangle className="w-6 h-6" />
              ) : (
                <Shield className="w-6 h-6" />
              )}
            </div>
            
            <div className="flex-1">
              <h3 className={`text-lg font-semibold ${
                hasErrors ? 'text-red-800' : 'text-yellow-800'
              }`}>
                {hasErrors ? '🚨 Security Issues Detected' : '⚠️ Security Warnings'}
              </h3>
              
              <p className={`mt-1 text-sm ${
                hasErrors ? 'text-red-700' : 'text-yellow-700'
              }`}>
                {hasErrors 
                  ? 'Critical security issues need immediate attention'
                  : 'Security recommendations for better protection'
                }
              </p>

              {/* Quick summary */}
              <div className="mt-2 flex items-center space-x-4 text-sm">
                {hasErrors && (
                  <span className="flex items-center text-red-700">
                    <AlertTriangle className="w-4 h-4 mr-1" />
                    {securityStatus.errors.length} error{securityStatus.errors.length !== 1 ? 's' : ''}
                  </span>
                )}
                {hasWarnings && (
                  <span className="flex items-center text-yellow-700">
                    <Shield className="w-4 h-4 mr-1" />
                    {securityStatus.warnings.length} warning{securityStatus.warnings.length !== 1 ? 's' : ''}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className={`px-3 py-1 text-sm font-medium rounded ${
                hasErrors
                  ? 'text-red-700 hover:text-red-900'
                  : 'text-yellow-700 hover:text-yellow-900'
              }`}
            >
              {isExpanded ? (
                <>
                  <EyeOff className="w-4 h-4 inline mr-1" />
                  Hide Details
                </>
              ) : (
                <>
                  <Eye className="w-4 h-4 inline mr-1" />
                  Show Details
                </>
              )}
            </button>
            
            <button
              onClick={() => setIsDismissed(true)}
              className={`p-1 rounded hover:bg-opacity-20 ${
                hasErrors
                  ? 'text-red-600 hover:bg-red-600'
                  : 'text-yellow-600 hover:bg-yellow-600'
              }`}
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Expanded Details */}
      {isExpanded && (
        <div className={`border-t px-4 py-4 ${
          hasErrors ? 'border-red-200 bg-red-25' : 'border-yellow-200 bg-yellow-25'
        }`}>
          {/* Errors */}
          {hasErrors && (
            <div className="mb-4">
              <h4 className="text-red-800 font-semibold mb-2 flex items-center">
                <AlertTriangle className="w-4 h-4 mr-2" />
                Critical Issues
              </h4>
              <ul className="space-y-1">
                {securityStatus.errors.map((error, index) => (
                  <li key={index} className="flex items-start text-red-700 text-sm">
                    <span className="text-red-500 mr-2">•</span>
                    {error}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Warnings */}
          {hasWarnings && (
            <div className="mb-4">
              <h4 className="text-yellow-800 font-semibold mb-2 flex items-center">
                <Shield className="w-4 h-4 mr-2" />
                Security Recommendations
              </h4>
              <ul className="space-y-1">
                {securityStatus.warnings.map((warning, index) => (
                  <li key={index} className="flex items-start text-yellow-700 text-sm">
                    <span className="text-yellow-500 mr-2">•</span>
                    {warning}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Security Best Practices */}
          <div className="bg-white bg-opacity-50 rounded-lg p-4 mt-4">
            <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
              <Lock className="w-4 h-4 mr-2" />
              Security Best Practices
            </h4>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Use IAM roles instead of hardcoded credentials in production</li>
              <li>• Enable AWS CloudTrail for audit logging</li>
              <li>• Use HTTPS for all communications</li>
              <li>• Regularly rotate access keys and secrets</li>
              <li>• Implement least privilege access policies</li>
              <li>• Monitor for suspicious activity with AWS GuardDuty</li>
            </ul>
          </div>

          {/* Last Check Time */}
          {securityStatus.lastCheck && (
            <div className="mt-4 text-xs text-gray-600">
              Last security check: {new Date(securityStatus.lastCheck).toLocaleString()}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SecurityWarning; 