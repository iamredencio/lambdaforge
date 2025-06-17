import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Brain, Lightbulb, TrendingUp, Shield, DollarSign, Zap, CheckCircle, RefreshCw } from 'lucide-react';
import AIService from '../services/aiService';
import SuggestionConfirmationDialog from './SuggestionConfirmationDialog';
import UndoManager from './UndoManager';

const AIArchitectureSuggestions = ({ formData, onApplySuggestion }) => {
  const [suggestions, setSuggestions] = useState([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedSuggestion, setSelectedSuggestion] = useState(null);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [aiError, setAiError] = useState(null);
  const undoManagerRef = useRef();

  const generateSuggestions = useCallback(async () => {
    setIsAnalyzing(true);
    setAiError(null);
    
    try {
      // Use real AWS Bedrock AI service
      const aiRecommendations = await AIService.generateArchitectureRecommendations(formData);
      setSuggestions(aiRecommendations);
    } catch (error) {
      console.error('AI Service Error:', error);
      setAiError('Failed to generate AI recommendations. Using fallback suggestions.');
      
      // Fallback to rule-based suggestions
      const fallbackSuggestions = await AIService.getFallbackRecommendations(formData);
      setSuggestions(fallbackSuggestions);
    } finally {
      setIsAnalyzing(false);
    }
  }, [formData]);

  useEffect(() => {
    if (formData.projectName || formData.selectedInfrastructure?.length > 0) {
      generateSuggestions();
    }
  }, [formData, generateSuggestions]);

  const handleSuggestionClick = (suggestion) => {
    setSelectedSuggestion(suggestion);
    setIsConfirmDialogOpen(true);
  };

  const handleConfirmSuggestion = (suggestion) => {
    // Store previous form data for undo functionality
    const previousFormData = { ...formData };
    
    // Apply the suggestion
    onApplySuggestion(suggestion.applyData);
    
    // Add to undo history
    if (undoManagerRef.current) {
      undoManagerRef.current.addAppliedSuggestion(suggestion, previousFormData);
    }
    
    // Remove the applied suggestion from the list
    setSuggestions(prev => prev.filter(s => s.id !== suggestion.id));
    
    setIsConfirmDialogOpen(false);
    setSelectedSuggestion(null);
  };

  const handleUndo = (previousFormData) => {
    onApplySuggestion(previousFormData);
    // Regenerate suggestions after undo
    setTimeout(() => {
      generateSuggestions();
    }, 500);
  };

  const handleClearHistory = () => {
    // Regenerate suggestions when history is cleared
    generateSuggestions();
  };

  const validateSuggestion = async (suggestion, currentFormData) => {
    return await AIService.validateRecommendation(suggestion, currentFormData);
  };

  const estimateCost = async (suggestion, currentFormData) => {
    return await AIService.estimateCostImpact(suggestion, currentFormData);
  };

  const refreshSuggestions = () => {
    generateSuggestions();
  };

  const getImpactColor = (impact) => {
    switch (impact) {
      case 'Critical': return 'text-red-600 bg-red-50 border-red-200';
      case 'High': return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'Medium': return 'text-blue-600 bg-blue-50 border-blue-200';
      default: return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'security': return <Shield className="w-4 h-4" />;
      case 'cost': return <DollarSign className="w-4 h-4" />;
      case 'performance': return <TrendingUp className="w-4 h-4" />;
      case 'architecture': return <Zap className="w-4 h-4" />;
      case 'monitoring': return <Brain className="w-4 h-4" />;
      default: return <Lightbulb className="w-4 h-4" />;
    }
  };

  if (suggestions.length === 0 && !isAnalyzing && !aiError) {
    return (
      <UndoManager
        ref={undoManagerRef}
        formData={formData}
        onUndo={handleUndo}
        onClearHistory={handleClearHistory}
      />
    );
  }

  return (
    <>
      <UndoManager
        ref={undoManagerRef}
        formData={formData}
        onUndo={handleUndo}
        onClearHistory={handleClearHistory}
      />
      
      <div className="bg-white border border-aws-gray-200 rounded-lg p-6 mb-6 shadow-card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-aws-gray-800 flex items-center">
            <Brain className="w-5 h-5 mr-2 text-aws-smile" />
            AWS Bedrock AI Suggestions
            {aiError && (
              <span className="ml-2 px-2 py-1 bg-aws-warning-50 text-aws-warning-700 text-xs font-medium rounded">
                Fallback Mode
              </span>
            )}
          </h3>
          <div className="flex items-center space-x-2">
            {isAnalyzing && (
              <div className="flex items-center text-sm text-aws-gray-600">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-aws-orange mr-2"></div>
                Analyzing...
              </div>
            )}
            <button
              onClick={refreshSuggestions}
              disabled={isAnalyzing}
              className="flex items-center space-x-1 px-3 py-1 text-sm text-aws-gray-600 hover:text-aws-gray-800 border border-aws-gray-300 rounded-lg hover:bg-aws-gray-100 transition-all duration-200"
            >
              <RefreshCw className={`w-4 h-4 ${isAnalyzing ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>
        </div>

        {aiError && (
          <div className="mb-4 p-3 bg-aws-warning-50 border border-aws-warning-200 rounded-lg">
            <p className="text-sm text-aws-warning-700">{aiError}</p>
          </div>
        )}

        {isAnalyzing ? (
          <div className="text-center py-8">
            <div className="animate-pulse">
              <Brain className="w-12 h-12 text-aws-smile mx-auto mb-4" />
              <p className="text-aws-gray-700">AWS Bedrock AI is analyzing your architecture...</p>
              <p className="text-sm text-aws-gray-600 mt-2">
                Using Claude 3 Sonnet for intelligent recommendations
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {suggestions.map((suggestion) => (
              <div key={suggestion.id} className="border border-aws-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-start space-x-3">
                    <span className="text-2xl">{suggestion.icon}</span>
                    <div className="flex-1">
                      <h4 className="font-bold text-aws-gray-800">{suggestion.title}</h4>
                      <p className="text-sm text-aws-gray-600 mt-1">{suggestion.description}</p>
                      {suggestion.reasoning && (
                        <p className="text-xs text-aws-gray-600 mt-2 italic">
                          💡 {suggestion.reasoning}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-1 text-xs font-medium rounded border ${getImpactColor(suggestion.impact)}`}>
                      {suggestion.impact}
                    </span>
                    <div className="flex items-center text-xs text-aws-gray-500">
                      <CheckCircle className="w-3 h-3 mr-1" />
                      {suggestion.confidence}%
                    </div>
                  </div>
                </div>

                {suggestion.recommendations && (
                  <div className="mb-3">
                    <h5 className="text-sm font-medium text-aws-gray-700 mb-2">Implementation Steps:</h5>
                    <ul className="text-sm text-aws-gray-600 space-y-1">
                      {suggestion.recommendations.slice(0, 2).map((rec, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-aws-orange mr-2">•</span>
                          {rec}
                        </li>
                      ))}
                      {suggestion.recommendations.length > 2 && (
                        <li className="text-xs text-aws-gray-500 ml-3">
                          +{suggestion.recommendations.length - 2} more steps...
                        </li>
                      )}
                    </ul>
                  </div>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-sm">
                    <div className="flex items-center text-green-600">
                      <DollarSign className="w-4 h-4 mr-1" />
                      <span>Impact: {suggestion.savings}</span>
                    </div>
                    <div className="flex items-center text-aws-gray-500">
                      {getTypeIcon(suggestion.type)}
                      <span className="ml-1 capitalize">{suggestion.type}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="px-4 py-2 bg-aws-orange text-white text-sm font-medium rounded-lg hover:bg-aws-orange-dark transition-colors duration-200"
                  >
                    Review & Apply
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <SuggestionConfirmationDialog
        isOpen={isConfirmDialogOpen}
        onClose={() => {
          setIsConfirmDialogOpen(false);
          setSelectedSuggestion(null);
        }}
        suggestion={selectedSuggestion}
        currentFormData={formData}
        onConfirm={handleConfirmSuggestion}
        onValidate={validateSuggestion}
        onEstimateCost={estimateCost}
      />
    </>
  );
};

export default AIArchitectureSuggestions; 