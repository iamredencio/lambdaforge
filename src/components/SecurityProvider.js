import React, { createContext, useContext, useEffect, useState } from 'react';
import { sanitizeInput, validateAWSConfig, securityUtils } from '../config/aws-config';

const SecurityContext = createContext();

export const useSecurityContext = () => {
  const context = useContext(SecurityContext);
  if (!context) {
    throw new Error('useSecurityContext must be used within a SecurityProvider');
  }
  return context;
};

export const SecurityProvider = ({ children }) => {
  const [securityStatus, setSecurityStatus] = useState({
    isSecure: false,
    warnings: [],
    errors: [],
    lastCheck: null
  });

  // Security check on mount and periodically
  useEffect(() => {
    const performSecurityCheck = () => {
      const validation = validateAWSConfig();
      
      setSecurityStatus({
        isSecure: validation.isValid,
        warnings: [], // Don't show warnings in UI
        errors: validation.errors || [],
        lastCheck: new Date().toISOString()
      });

      // Log security status for debugging (not shown to user)
      if (validation.warnings.length > 0) {
        console.log('🔒 Security checks completed:', validation.warnings);
      }
      
      if (validation.errors.length > 0) {
        console.error('🚨 Security errors detected:', validation.errors);
      }
    };

    // Initial check
    performSecurityCheck();

    // Periodic security checks every 5 minutes (silent)
    const interval = setInterval(performSecurityCheck, 5 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  // Content Security Policy enforcement
  useEffect(() => {
    // Add CSP meta tag if not present
    if (!document.querySelector('meta[http-equiv="Content-Security-Policy"]')) {
      const csp = document.createElement('meta');
      csp.httpEquiv = 'Content-Security-Policy';
      csp.content = `
        default-src 'self';
        script-src 'self' 'unsafe-inline' 'unsafe-eval' https://fonts.googleapis.com;
        style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
        font-src 'self' https://fonts.gstatic.com;
        img-src 'self' data: https:;
        connect-src 'self' https://*.amazonaws.com https://*.amazon.com;
        frame-ancestors 'none';
        base-uri 'self';
        form-action 'self';
      `.replace(/\s+/g, ' ').trim();
      document.head.appendChild(csp);
    }
  }, []);

  // Secure input sanitization
  const sanitizeFormData = (data) => {
    const sanitized = {};
    
    Object.keys(data).forEach(key => {
      if (typeof data[key] === 'string') {
        sanitized[key] = sanitizeInput(data[key]);
      } else if (Array.isArray(data[key])) {
        sanitized[key] = data[key].map(item => 
          typeof item === 'string' ? sanitizeInput(item) : item
        );
      } else {
        sanitized[key] = data[key];
      }
    });
    
    return sanitized;
  };

  // Validate form inputs
  const validateFormInput = (field, value) => {
    // Basic validation
    if (!value || value.trim() === '') {
      return { isValid: false, error: 'Field is required' };
    }

    // Specific field validation
    switch (field) {
      case 'projectName':
        if (!securityUtils.validateInputFormat(value, 'projectName')) {
          return { 
            isValid: false, 
            error: 'Project name must contain only letters, numbers, hyphens, and underscores (max 50 chars)' 
          };
        }
        break;
      
      case 'awsAccessKeyId':
        if (!securityUtils.validateInputFormat(value, 'accessKeyId')) {
          return { 
            isValid: false, 
            error: 'Invalid AWS Access Key ID format' 
          };
        }
        break;
      
      case 'awsRegion':
        if (!securityUtils.validateInputFormat(value, 'awsRegion')) {
          return { 
            isValid: false, 
            error: 'Invalid AWS region' 
          };
        }
        break;
      
      default:
        // No specific validation for this field
        break;
    }

    return { isValid: true, error: null };
  };

  // Security event logging
  const logSecurityEvent = (event, details = {}) => {
    const securityLog = {
      timestamp: new Date().toISOString(),
      event,
      details: {
        ...details,
        userAgent: navigator.userAgent,
        url: window.location.href,
        referrer: document.referrer
      }
    };

    // In production, send to security monitoring service
    console.log('🔐 Security Event:', securityLog);
  };

  // Check for suspicious activity
  const detectSuspiciousActivity = (formData) => {
    const suspiciousPatterns = [
      /<script/i,
      /javascript:/i,
      /on\w+=/i,
      /eval\(/i,
      /document\./i,
      /window\./i
    ];

    const suspiciousFields = [];
    
    Object.entries(formData).forEach(([key, value]) => {
      if (typeof value === 'string') {
        suspiciousPatterns.forEach(pattern => {
          if (pattern.test(value)) {
            suspiciousFields.push(key);
            logSecurityEvent('SUSPICIOUS_INPUT_DETECTED', {
              field: key,
              pattern: pattern.toString(),
              value: value.substring(0, 100) // Log first 100 chars only
            });
          }
        });
      }
    });

    return suspiciousFields;
  };

  const securityContextValue = {
    securityStatus,
    sanitizeFormData,
    validateFormInput,
    logSecurityEvent,
    detectSuspiciousActivity,
    utils: securityUtils
  };

  return (
    <SecurityContext.Provider value={securityContextValue}>
      {children}
    </SecurityContext.Provider>
  );
};

export default SecurityProvider; 