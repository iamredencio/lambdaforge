import React from 'react';
import { Check } from 'lucide-react';

const StepIndicator = ({ steps, currentStep }) => {
  return (
    <div className="bg-white border border-aws-gray-200 rounded-lg shadow-card p-3 sm:p-6 mb-6">
      {/* Mobile View - Compact Progress Bar */}
      <div className="block sm:hidden">
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

      {/* Tablet View - Compact Circles */}
      <div className="hidden sm:block lg:hidden">
        <div className="flex items-center justify-center space-x-2 overflow-x-auto pb-2">
          {steps.map((step, index) => (
            <React.Fragment key={step.id}>
              <div className="flex flex-col items-center flex-shrink-0">
                <div
                  className={`flex items-center justify-center w-8 h-8 text-xs font-bold rounded-full transition-all duration-200 ${
                    step.id < currentStep
                      ? 'bg-green-600 text-white'
                      : step.id === currentStep
                      ? 'bg-aws-orange text-white'
                      : 'bg-aws-gray-300 text-aws-gray-600'
                  }`}
                >
                  {step.id < currentStep ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    <span>{step.id}</span>
                  )}
                </div>
                <span
                  className={`mt-1 text-xs font-medium text-center ${
                    step.id === currentStep
                      ? 'text-aws-orange'
                      : step.id < currentStep
                      ? 'text-green-600'
                      : 'text-aws-gray-500'
                  }`}
                  style={{ maxWidth: '60px', lineHeight: '1.2' }}
                >
                  {step.name}
                </span>
              </div>
              {index < steps.length - 1 && (
                <div
                  className={`h-0.5 w-4 flex-shrink-0 ${
                    step.id < currentStep ? 'bg-green-600' : 'bg-aws-gray-300'
                  }`}
                />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Desktop View - Full Layout */}
      <div className="hidden lg:block">
        <div className="flex items-center justify-center">
          {steps.map((step, index) => (
            <React.Fragment key={step.id}>
              <div className="flex flex-col items-center flex-shrink-0">
                <div
                  className={`flex items-center justify-center w-12 h-12 text-sm font-bold rounded-full transition-all duration-200 shadow-sm ${
                    step.id < currentStep
                      ? 'bg-green-600 text-white shadow-green-200'
                      : step.id === currentStep
                      ? 'bg-aws-orange text-white shadow-orange-200'
                      : 'bg-white border-2 border-aws-gray-300 text-aws-gray-600'
                  }`}
                >
                  {step.id < currentStep ? (
                    <Check className="w-6 h-6" />
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
                <div className="flex items-center mx-4 flex-shrink-0">
                  <div
                    className={`h-1 w-16 rounded-full transition-all duration-300 ${
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