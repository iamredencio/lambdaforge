import React, { useState, useEffect, useCallback } from 'react';
import { X, CheckCircle, AlertTriangle, DollarSign, ArrowRight } from 'lucide-react';

const SuggestionConfirmationDialog = ({ 
  isOpen, 
  onClose, 
  suggestion, 
  currentFormData, 
  onConfirm,
  onValidate,
  onEstimateCost 
}) => {
  const [validation, setValidation] = useState(null);
  const [costImpact, setCostImpact] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [previewChanges, setPreviewChanges] = useState({});

  const validateAndEstimate = useCallback(async () => {
    setIsLoading(true);
    try {
      const [validationResult, costResult] = await Promise.all([
        onValidate(suggestion, currentFormData),
        onEstimateCost(suggestion, currentFormData)
      ]);
      
      setValidation(validationResult);
      setCostImpact(costResult);
    } catch (error) {
      console.error('Validation error:', error);
    } finally {
      setIsLoading(false);
    }
  }, [onValidate, onEstimateCost, suggestion, currentFormData]);

  const calculatePreviewChanges = useCallback(() => {
    if (!suggestion?.applyData) return;

    const changes = {};
    Object.keys(suggestion.applyData).forEach(key => {
      const current = currentFormData[key] || [];
      const proposed = suggestion.applyData[key] || [];
      
      if (Array.isArray(proposed)) {
        const newItems = proposed.filter(item => !current.includes(item));
        if (newItems.length > 0) {
          changes[key] = {
            current: current.length,
            added: newItems,
            total: [...new Set([...current, ...proposed])].length
          };
        }
      }
    });
    
    setPreviewChanges(changes);
  }, [suggestion, currentFormData]);

  useEffect(() => {
    if (isOpen && suggestion) {
      validateAndEstimate();
      calculatePreviewChanges();
    }
  }, [isOpen, suggestion, validateAndEstimate, calculatePreviewChanges]);

  const handleConfirm = () => {
    onConfirm(suggestion);
    onClose();
  };

  const getServiceDisplayName = (key) => {
    const displayNames = {
      selectedInfrastructure: 'Infrastructure Services',
      selectedCompute: 'Compute Services',
      selectedIntegration: 'Integration Services',
      selectedSecurity: 'Security Services',
      selectedMonitoring: 'Monitoring Services',
      selectedDeployment: 'Deployment Services',
      selectedOptimization: 'Optimization Services'
    };
    return displayNames[key] || key;
  };

  const formatServiceName = (serviceName) => {
    return serviceName
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  if (!isOpen || !suggestion) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-aws-blue text-white p-6 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="text-2xl">{suggestion.icon}</span>
            <div>
              <h2 className="text-xl font-bold">Apply AI Suggestion</h2>
              <p className="text-aws-gray-200">{suggestion.title}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:text-aws-gray-300 transition-colors duration-200"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          {/* Description */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-aws-blue mb-2">Description</h3>
            <p className="text-aws-gray-600">{suggestion.description}</p>
            {suggestion.reasoning && (
              <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">{suggestion.reasoning}</p>
              </div>
            )}
          </div>

          {/* Impact & Confidence */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="p-4 bg-aws-gray-50 rounded-lg">
              <h4 className="font-semibold text-aws-blue mb-2">Impact Level</h4>
              <span className={`px-3 py-1 text-sm font-medium rounded ${
                suggestion.impact === 'Critical' ? 'bg-red-100 text-red-800' :
                suggestion.impact === 'High' ? 'bg-orange-100 text-orange-800' :
                suggestion.impact === 'Medium' ? 'bg-blue-100 text-blue-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {suggestion.impact}
              </span>
            </div>
            <div className="p-4 bg-aws-gray-50 rounded-lg">
              <h4 className="font-semibold text-aws-blue mb-2">AI Confidence</h4>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="font-semibold">{suggestion.confidence}%</span>
              </div>
            </div>
          </div>

          {/* Cost Impact */}
          {costImpact && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-aws-blue mb-3">Cost Impact</h3>
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="w-5 h-5 text-green-600" />
                    <span className="font-semibold text-green-800">
                      {costImpact.description}
                    </span>
                  </div>
                  <div className="text-sm text-green-600">
                    Annual: {costImpact.yearlyImpact < 0 ? 'Save' : 'Cost'} $
                    {Math.abs(costImpact.yearlyImpact)}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Preview Changes */}
          {Object.keys(previewChanges).length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-aws-blue mb-3">Preview Changes</h3>
              <div className="space-y-3">
                {Object.entries(previewChanges).map(([key, change]) => (
                  <div key={key} className="p-4 bg-aws-gray-50 border border-aws-gray-200 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-aws-blue">
                        {getServiceDisplayName(key)}
                      </h4>
                      <div className="flex items-center space-x-2 text-sm text-aws-gray-600">
                        <span>{change.current} services</span>
                        <ArrowRight className="w-4 h-4" />
                        <span className="font-semibold text-green-600">
                          {change.total} services
                        </span>
                      </div>
                    </div>
                    <div className="space-y-1">
                      {change.added.map((service, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-sm text-aws-gray-700">
                            Add: {formatServiceName(service)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Validation Results */}
          {validation && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-aws-blue mb-3">Validation</h3>
              {validation.isValid ? (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-500" />
                    <span className="text-green-800 font-medium">
                      No conflicts detected. Safe to apply.
                    </span>
                  </div>
                </div>
              ) : (
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-start space-x-2">
                    <AlertTriangle className="w-5 h-5 text-yellow-500 mt-0.5" />
                    <div>
                      <div className="font-medium text-yellow-800 mb-1">
                        Potential conflicts detected:
                      </div>
                      <ul className="text-sm text-yellow-700 space-y-1">
                        {validation.conflicts.map((conflict, index) => (
                          <li key={index}>• {conflict}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Action Steps */}
          {suggestion.recommendations && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-aws-blue mb-3">Implementation Steps</h3>
              <ol className="space-y-2">
                {suggestion.recommendations.map((step, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-aws-orange text-white text-xs font-bold rounded-full flex items-center justify-center">
                      {index + 1}
                    </span>
                    <span className="text-aws-gray-700">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-aws-gray-50 px-6 py-4 flex items-center justify-between">
          <button
            onClick={onClose}
            className="flex items-center space-x-2 px-4 py-2 text-aws-gray-600 hover:text-aws-gray-800 transition-colors duration-200"
          >
            <X className="w-4 h-4" />
            <span>Cancel</span>
          </button>
          
          <div className="flex items-center space-x-3">
            {isLoading ? (
              <div className="flex items-center space-x-2 text-aws-gray-600">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-aws-orange"></div>
                <span>Validating...</span>
              </div>
            ) : (
              <button
                onClick={handleConfirm}
                disabled={validation && !validation.isValid}
                className={`flex items-center space-x-2 px-6 py-2 rounded-lg font-medium transition-all duration-200 ${
                  validation && !validation.isValid
                    ? 'bg-aws-gray-300 text-aws-gray-500 cursor-not-allowed'
                    : 'bg-aws-orange text-white hover:bg-aws-orange-dark shadow-lg hover:shadow-xl'
                }`}
              >
                <CheckCircle className="w-4 h-4" />
                <span>Apply Suggestion</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SuggestionConfirmationDialog; 