import React, { useState, useEffect } from 'react';
import { Undo, RotateCcw, CheckCircle } from 'lucide-react';

const UndoManager = React.forwardRef(({ formData, onUndo, onClearHistory }, ref) => {
  const [appliedSuggestions, setAppliedSuggestions] = useState([]);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    // Load applied suggestions from localStorage
    const saved = localStorage.getItem('lambdaforge-applied-suggestions');
    if (saved) {
      try {
        setAppliedSuggestions(JSON.parse(saved));
      } catch (error) {
        console.error('Failed to load undo history:', error);
      }
    }
  }, []);

  useEffect(() => {
    // Save applied suggestions to localStorage
    localStorage.setItem('lambdaforge-applied-suggestions', JSON.stringify(appliedSuggestions));
  }, [appliedSuggestions]);

  const addAppliedSuggestion = (suggestion, previousFormData) => {
    const appliedSuggestion = {
      id: `applied-${Date.now()}`,
      suggestion,
      previousFormData,
      appliedAt: new Date().toISOString(),
      timestamp: Date.now()
    };
    
    setAppliedSuggestions(prev => [appliedSuggestion, ...prev.slice(0, 9)]); // Keep last 10
  };

  const undoSuggestion = (appliedSuggestion) => {
    // Revert to previous form data
    onUndo(appliedSuggestion.previousFormData);
    
    // Remove from applied suggestions
    setAppliedSuggestions(prev => 
      prev.filter(item => item.id !== appliedSuggestion.id)
    );
  };

  const clearAllHistory = () => {
    setAppliedSuggestions([]);
    onClearHistory();
  };

  const formatTimeAgo = (timestamp) => {
    const now = Date.now();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    
    if (minutes < 1) return 'Just now';
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    return new Date(timestamp).toLocaleDateString();
  };

  // Expose methods to parent component
  React.useImperativeHandle(ref, () => ({
    addAppliedSuggestion
  }));

  if (appliedSuggestions.length === 0) {
    return null;
  }

  return (
    <div className="bg-white border border-aws-gray-200 rounded-lg p-4 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Undo className="w-5 h-5 text-aws-orange" />
          <h3 className="text-lg font-semibold text-aws-blue">Applied Suggestions</h3>
          <span className="px-2 py-1 bg-aws-gray-100 text-aws-gray-600 text-xs font-medium rounded">
            {appliedSuggestions.length}
          </span>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="px-3 py-1 text-sm text-aws-gray-600 hover:text-aws-blue transition-colors duration-200"
          >
            {isExpanded ? 'Hide' : 'Show'} History
          </button>
          
          {appliedSuggestions.length > 0 && (
            <button
              onClick={clearAllHistory}
              className="px-3 py-1 text-sm text-red-600 hover:text-red-800 transition-colors duration-200"
            >
              Clear All
            </button>
          )}
        </div>
      </div>

      {isExpanded && (
        <div className="mt-4 space-y-3 max-h-64 overflow-y-auto">
          {appliedSuggestions.map((appliedSuggestion) => (
            <div 
              key={appliedSuggestion.id}
              className="flex items-center justify-between p-3 bg-aws-gray-50 border border-aws-gray-200 rounded-lg hover:shadow-sm transition-shadow duration-200"
            >
              <div className="flex items-center space-x-3">
                <span className="text-lg">{appliedSuggestion.suggestion.icon}</span>
                <div className="flex-1">
                  <h4 className="font-medium text-aws-blue text-sm">
                    {appliedSuggestion.suggestion.title}
                  </h4>
                  <p className="text-xs text-aws-gray-600">
                    Applied {formatTimeAgo(appliedSuggestion.timestamp)} • 
                    <span className="ml-1 capitalize">{appliedSuggestion.suggestion.type}</span>
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <button
                  onClick={() => undoSuggestion(appliedSuggestion)}
                  className="flex items-center space-x-1 px-2 py-1 text-xs text-aws-gray-600 hover:text-red-600 hover:bg-red-50 rounded transition-all duration-200"
                  title="Undo this suggestion"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>Undo</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {!isExpanded && appliedSuggestions.length > 0 && (
        <div className="mt-3 flex items-center justify-between text-sm text-aws-gray-600">
          <span>
            Last applied: {appliedSuggestions[0].suggestion.title}
          </span>
          <button
            onClick={() => undoSuggestion(appliedSuggestions[0])}
            className="flex items-center space-x-1 px-2 py-1 text-xs hover:text-red-600 hover:bg-red-50 rounded transition-all duration-200"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Undo Last</span>
          </button>
        </div>
      )}
    </div>
  );
});

export default UndoManager; 