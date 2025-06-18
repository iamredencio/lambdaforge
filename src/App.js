import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useParams } from 'react-router-dom';
import Header from './components/Header';
import StepIndicator from './components/StepIndicator';
import Marketplace from './components/Marketplace';
import AIArchitectureSuggestions from './components/AIArchitectureSuggestions';
import SecurityProvider from './components/SecurityProvider';
import SecurityWarning from './components/SecurityWarning';
import AWSRequiredStep from './components/steps/AWSRequiredStep';
import InfrastructureStep from './components/steps/InfrastructureStep';
import ComputeStep from './components/steps/ComputeStep';
import IntegrationStep from './components/steps/IntegrationStep';
import SecurityStep from './components/steps/SecurityStep';
import MonitoringStep from './components/steps/MonitoringStep';
import DeploymentStep from './components/steps/DeploymentStep';
import OptimizationStep from './components/steps/OptimizationStep';
import GenerateStep from './components/steps/GenerateStep';
import './App.css';

const steps = [
  { id: 1, name: 'AWS Required', component: AWSRequiredStep },
  { id: 2, name: 'Infrastructure', component: InfrastructureStep },
  { id: 3, name: 'Compute', component: ComputeStep },
  { id: 4, name: 'Integration', component: IntegrationStep },
  { id: 5, name: 'Security', component: SecurityStep },
  { id: 6, name: 'Monitoring', component: MonitoringStep },
  { id: 7, name: 'Deployment', component: DeploymentStep },
  { id: 8, name: 'Optimization', component: OptimizationStep },
  { id: 9, name: 'Generate', component: GenerateStep },
];

function AppContent() {
  const navigate = useNavigate();
  const { stepId } = useParams();
  const [currentStep, setCurrentStep] = useState(1);
  
  // Sync URL parameter with current step
  useEffect(() => {
    const urlStep = parseInt(stepId);
    if (urlStep && urlStep >= 1 && urlStep <= steps.length && urlStep !== currentStep) {
      setCurrentStep(urlStep);
    }
  }, [stepId, currentStep]);

  // Sync current step with URL when step changes programmatically
  useEffect(() => {
    const urlStep = parseInt(stepId);
    if (urlStep !== currentStep) {
      navigate(`/step/${currentStep}`, { replace: true });
    }
  }, [currentStep, stepId, navigate]);

  const [isMarketplaceOpen, setIsMarketplaceOpen] = useState(false);
  const [environments, setEnvironments] = useState([
    { id: 'dev', name: 'Development', status: 'active', cost: 45 },
    { id: 'staging', name: 'Staging', status: 'inactive', cost: 0 },
    { id: 'prod', name: 'Production', status: 'inactive', cost: 0 }
  ]);
  const [activeEnvironment, setActiveEnvironment] = useState('dev');
  
  const [formData, setFormData] = useState({
    // AWS Configuration
    projectName: '',
    awsRegion: 'us-east-1',
    environment: 'Development',
    vpcCidrBlock: '10.0.0.0/16',
    
    // Infrastructure
    selectedInfrastructure: [],
    
    // Compute
    selectedCompute: [],
    
    // Integration
    selectedIntegration: [],
    
    // Security
    selectedSecurity: [],
    
    // Monitoring
    selectedMonitoring: [],
    
    // Deployment
    selectedDeployment: [],
    
    // Optimization
    selectedOptimization: [],
  });

  const updateFormData = (newData) => {
    setFormData(prev => ({ ...prev, ...newData }));
  };

  const handleMarketplaceSelect = (packageData) => {
    setFormData(prev => ({ ...prev, ...packageData }));
    setCurrentStep(9); // Jump to Generate step
    navigate('/step/9');
  };

  const handleAISuggestion = (suggestionData) => {
    setFormData(prev => ({ ...prev, ...suggestionData }));
  };

  const resetAllData = () => {
    // Reset form data to initial state
    setFormData({
      // AWS Configuration
      projectName: '',
      awsRegion: 'us-east-1',
      environment: 'Development',
      vpcCidrBlock: '10.0.0.0/16',
      
      // Infrastructure
      selectedInfrastructure: [],
      
      // Compute
      selectedCompute: [],
      
      // Integration
      selectedIntegration: [],
      
      // Security
      selectedSecurity: [],
      
      // Monitoring
      selectedMonitoring: [],
      
      // Deployment
      selectedDeployment: [],
      
      // Optimization
      selectedOptimization: [],
    });

    // Reset environments
    setEnvironments([
      { id: 'dev', name: 'Development', status: 'active', cost: 45 },
      { id: 'staging', name: 'Staging', status: 'inactive', cost: 0 },
      { id: 'prod', name: 'Production', status: 'inactive', cost: 0 }
    ]);
    setActiveEnvironment('dev');

    // Clear undo history
    localStorage.removeItem('lambdaforge-applied-suggestions');

    // Go to first step
    setCurrentStep(1);
    navigate('/step/1');
  };

  const goToHome = () => {
    setCurrentStep(1);
    navigate('/step/1');
  };

  const createEnvironment = (envType) => {
    const newEnv = {
      id: `${envType}-${Date.now()}`,
      name: envType.charAt(0).toUpperCase() + envType.slice(1),
      status: 'deploying',
      cost: 0
    };
    setEnvironments(prev => [...prev, newEnv]);
    
    // Simulate deployment
    setTimeout(() => {
      setEnvironments(prev => prev.map(env => 
        env.id === newEnv.id 
          ? { ...env, status: 'active', cost: Math.floor(Math.random() * 200) + 50 }
          : env
      ));
    }, 5000);
  };

  const nextStep = () => {
    if (currentStep < steps.length) {
      const newStep = currentStep + 1;
      setCurrentStep(newStep);
      navigate(`/step/${newStep}`);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      const newStep = currentStep - 1;
      setCurrentStep(newStep);
      navigate(`/step/${newStep}`);
    }
  };

  const CurrentStepComponent = steps[currentStep - 1].component;

  return (
    <div className="min-h-screen bg-aws-gray-25">
      <Header 
        onMarketplaceOpen={() => setIsMarketplaceOpen(true)}
        onReset={resetAllData}
        onHomeClick={goToHome}
      />
        <Marketplace 
          isOpen={isMarketplaceOpen}
          onClose={() => setIsMarketplaceOpen(false)}
          onSelectPackage={handleMarketplaceSelect}
        />
        <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <StepIndicator steps={steps} currentStep={currentStep} />
          
          {/* Security Warning - Show on all steps */}
          <SecurityWarning />
          
          {/* AI Suggestions - Show after step 2 */}
          {currentStep > 2 && (
            <AIArchitectureSuggestions 
              formData={formData}
              onApplySuggestion={handleAISuggestion}
            />
          )}
          
          {/* Environment Management Panel - Show on Generate step */}
          {currentStep === 9 && (
            <div className="bg-white border border-aws-gray-200 rounded-lg p-6 mb-6 shadow-card">
              <h3 className="text-lg font-bold text-aws-gray-800 mb-4 flex items-center">
                🌍 Environment Management
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {environments.map((env) => (
                  <div 
                    key={env.id}
                    className={`border rounded-lg p-4 cursor-pointer transition-all duration-200 ${
                      activeEnvironment === env.id 
                        ? 'border-aws-smile bg-aws-orange-pale shadow-md' 
                        : 'border-aws-gray-200 hover:border-aws-gray-300 hover:shadow-sm'
                    }`}
                    onClick={() => setActiveEnvironment(env.id)}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-bold text-aws-gray-800">{env.name}</h4>
                      <span className={`px-2 py-1 text-xs font-medium rounded ${
                        env.status === 'active' ? 'bg-aws-success-50 text-aws-success-700' :
                        env.status === 'deploying' ? 'bg-aws-warning-50 text-aws-warning-700' :
                        'bg-aws-gray-100 text-aws-gray-600'
                      }`}>
                        {env.status}
                      </span>
                    </div>
                    <div className="text-sm text-aws-gray-600 font-medium">
                      Cost: ${env.cost}/month
                    </div>
                    {env.status === 'inactive' && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          createEnvironment(env.name.toLowerCase());
                        }}
                        className="mt-2 w-full px-3 py-1 bg-aws-smile text-white text-xs font-bold rounded hover:bg-aws-orange-dark transition-colors duration-200 shadow-sm"
                      >
                        Deploy to {env.name}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <div className="bg-white border border-aws-gray-200 rounded-lg shadow-card p-8">
            <Routes>
              <Route path="/" element={<Navigate to="/step/1" replace />} />
              <Route 
                path="/step/:stepId" 
                element={
                  <CurrentStepComponent
                    formData={formData}
                    updateFormData={updateFormData}
                    nextStep={nextStep}
                    prevStep={prevStep}
                    currentStep={currentStep}
                    totalSteps={steps.length}
                    environments={environments}
                    activeEnvironment={activeEnvironment}
                    onCreateEnvironment={createEnvironment}
                  />
                } 
              />
            </Routes>
          </div>
        </div>
      </div>
    );
}

function App() {
  return (
    <Router>
      <SecurityProvider>
        <AppContent />
      </SecurityProvider>
    </Router>
  );
}

export default App; 