import React from 'react';
import { Check } from 'lucide-react';

const StepIndicator = ({ steps, currentStep }) => {
  return (
    <div className="bg-white border border-aws-gray-200 rounded-lg shadow-card p-4 sm:p-6 mb-6">
      <div className="overflow-x-auto">
        <div className="flex items-center justify-center min-w-max px-4">
          {steps.map((step, index) => (
            <React.Fragment key={step.id}>
              {/* Step Circle and Label */}
              <div className="flex flex-col items-center flex-shrink-0">
                <div
                  className={`step-indicator ${
                    step.id < currentStep
                      ? 'completed'
                      : step.id === currentStep
                      ? 'active'
                      : 'inactive'
                  }`}
                >
                  {step.id < currentStep ? (
                    <Check className="w-5 h-5" />
                  ) : (
                    <span className="text-sm font-bold">{step.id}</span>
                  )}
                </div>
                <span
                  className={`mt-3 text-sm font-bold text-center whitespace-nowrap ${
                    step.id === currentStep
                      ? 'text-aws-smile'
                      : step.id < currentStep
                      ? 'text-aws-success-600'
                      : 'text-aws-gray-600'
                  }`}
                >
                  {step.name}
                </span>
              </div>

              {/* Connection Line */}
              {index < steps.length - 1 && (
                <div className="flex items-center mx-6 flex-shrink-0">
                  <div
                    className={`h-1 ${
                      step.id < currentStep ? 'bg-aws-success-500' : 'bg-aws-gray-300'
                    }`}
                    style={{ width: '80px' }}
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