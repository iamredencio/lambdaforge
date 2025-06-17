import React from 'react';
import { RefreshCw, ShoppingBag, Home } from 'lucide-react';

const Header = ({ onMarketplaceOpen, onReset, onHomeClick }) => {
  return (
    <header className="bg-aws-squid border-b border-aws-gray-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo and Title */}
          <div className="flex items-center space-x-4">
            <div className="bg-aws-smile p-2 rounded-lg shadow-md">
              <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
            </div>
            <div>
              <h1 
                className="text-2xl font-bold text-white cursor-pointer hover:text-aws-smile transition-colors duration-200"
                onClick={onHomeClick}
              >
                LambdaForge
              </h1>
              <p className="text-aws-gray-300 text-sm">Lambda-First Infrastructure: Built by AI, Managed by Serverless</p>
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center space-x-6">
            {/* API Status Indicator */}
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-aws-success-500 rounded-full animate-pulse" title="API Online"></div>
                <span className="text-sm text-aws-gray-300 font-medium">API Online</span>
              </div>
            </div>

            {/* Home Button */}
            <button 
              onClick={onHomeClick}
              className="flex items-center space-x-2 bg-aws-gray-100 border border-aws-gray-300 text-aws-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-white hover:shadow-md transition-all duration-200"
              title="Go to Home"
            >
              <Home className="w-4 h-4" />
              <span className="text-sm">Home</span>
            </button>

            {/* Marketplace */}
            <button 
              onClick={onMarketplaceOpen}
              className="flex items-center space-x-2 bg-aws-smile text-white px-4 py-2 rounded-lg font-medium hover:bg-aws-orange-dark transition-all duration-200 shadow-md hover:shadow-lg"
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="text-sm">Marketplace</span>
            </button>

            {/* Reset All */}
            <button 
              onClick={onReset}
              className="flex items-center space-x-2 bg-aws-error-50 border border-aws-error-300 text-aws-error-700 px-4 py-2 rounded-lg font-medium hover:bg-aws-error-100 transition-all duration-200"
              title="Reset all form data"
            >
              <RefreshCw className="w-4 h-4" />
              <span className="text-sm">Reset All</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 