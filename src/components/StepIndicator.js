import React from 'react';
import { Check } from 'lucide-react';

const StepIndicator = ({ steps, currentStep }) => {
  return (
    <div className="bg-white border border-aws-gray-200 rounded-lg shadow-card p-3 sm:p-4 mb-6">
      {/* Mobile View - Progress Bar */}
      <div className="block md:hidden">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium text-aws-gray-700">
            Step {currentStep} of {steps.length}
          </span>
          <span className="text-xs text-aws-gray-500">
            {Math.round((currentStep / steps.length) * 100)}% Complete
          </span>
        </div>
        <div className="w-full bg-aws-gray-200 rounded-full h-2 mb-3">
          <div 
            className="bg-aws-orange h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / steps.length) * 100}%` }}
          />
        </div>
        <div className="text-center">
          <span className="text-lg font-semibold text-aws-orange">
            {steps[currentStep - 1].name}
          </span>
        </div>
      </div>

      {/* Tablet/Laptop View - Ultra Compact All Steps */}
      <div className="hidden md:block xl:hidden">
        <div className="flex items-center justify-between px-1">
          {steps.map((step, index) => (
            <React.Fragment key={`tablet-${step.id}`}>
              <div className="flex flex-col items-center flex-shrink-0" style={{ width: '45px' }}>
                <div
                  className={`flex items-center justify-center w-6 h-6 text-xs font-bold rounded-full transition-all duration-200 ${
                    step.id < currentStep
                      ? 'bg-green-600 text-white'
                      : step.id === currentStep
                      ? 'bg-aws-orange text-white'
                      : 'bg-white border border-aws-gray-300 text-aws-gray-600'
                  }`}
                  style={{ fontSize: '10px' }}
                >
                  {step.id < currentStep ? (
                    <Check className="w-3 h-3" />
                  ) : (
                    <span>{step.id}</span>
                  )}
                </div>
                <span
                  className={`mt-1 font-medium text-center ${
                    step.id === currentStep
                      ? 'text-aws-orange'
                      : step.id < currentStep
                      ? 'text-green-600'
                      : 'text-aws-gray-600'
                  }`}
                  style={{ 
                    fontSize: '8px',
                    lineHeight: '1.0',
                    width: '45px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}
                  title={step.name}
                >
                  {step.name.length > 6 ? step.name.substring(0, 6) + '..' : step.name}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div className="flex items-center flex-shrink-0" style={{ width: '4px' }}>
                  <div
                    className={`h-0.5 w-full transition-all duration-300 ${
                      step.id < currentStep ? 'bg-green-600' : 'bg-aws-gray-300'
                    }`}
                  />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Large Desktop View - Enhanced Layout */}
      <div className="hidden xl:block">
        <div className="flex items-center justify-center">
          {steps.map((step, index) => (
            <React.Fragment key={`desktop-${step.id}`}>
              <div className="flex flex-col items-center flex-shrink-0">
                <div
                  className={`flex items-center justify-center w-10 h-10 text-sm font-bold rounded-full transition-all duration-200 shadow-sm ${
                    step.id < currentStep
                      ? 'bg-green-600 text-white shadow-green-200'
                      : step.id === currentStep
                      ? 'bg-aws-orange text-white shadow-orange-200'
                      : 'bg-white border-2 border-aws-gray-300 text-aws-gray-600'
                  }`}
                >
                  {step.id < currentStep ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <span>{step.id}</span>
                  )}
                </div>
                <span
                  className={`mt-3 text-sm font-semibold text-center whitespace-nowrap ${
                    step.id === currentStep
                      ? 'text-aws-orange'
                      : step.id < currentStep
                      ? 'text-green-600'
                      : 'text-aws-gray-600'
                  }`}
                >
                  {step.name}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div className="flex items-center mx-3 flex-shrink-0">
                  <div
                    className={`h-1 w-12 rounded-full transition-all duration-300 ${
                      step.id < currentStep ? 'bg-green-600' : 'bg-aws-gray-300'
                    }`}
                  />
                </div>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StepIndicator; 