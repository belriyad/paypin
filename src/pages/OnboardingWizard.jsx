import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppData } from '../contexts/AppDataContext';
import SampleDataService from '../services/sampleDataService';
import LoadingSpinner from '../components/LoadingSpinner';

export default function OnboardingWizard() {
  const navigate = useNavigate();
  const { addCustomer, addPayment, addTemplate, updateSettings } = useAppData();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [companyInfo, setCompanyInfo] = useState({
    name: '',
    email: '',
    phone: '',
    website: ''
  });

  const totalSteps = 3;

  const handleCompanyInfoSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateSettings('company', companyInfo);
      setCurrentStep(2);
    } catch (error) {
      alert('Error saving company information. Please try again.');
    }
  };

  const handleSampleDataChoice = async (choice) => {
    setLoading(true);
    
    if (choice === 'sample') {
      try {
        await SampleDataService.initializeSampleData(addCustomer, addPayment, addTemplate);
        setCurrentStep(3);
      } catch (error) {
        alert('Error creating sample data. Please try again.');
      }
    } else {
      setCurrentStep(3);
    }
    setLoading(false);
  };

  const completeOnboarding = () => {
    // Mark onboarding as complete in localStorage
    localStorage.setItem('payping_onboarding_complete', 'true');
    navigate('/dashboard');
  };

  const ProgressBar = () => (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-blue-600">Setup Progress</span>
        <span className="text-sm font-medium text-blue-600">{currentStep}/{totalSteps}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div 
          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
          style={{ width: `${(currentStep / totalSteps) * 100}%` }}
        ></div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="large" />
          <p className="mt-4 text-lg text-gray-600">Setting up your workspace...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome to PayPing!</h1>
            <p className="text-gray-600">Let's get your payment management system set up in just a few steps.</p>
          </div>

          <ProgressBar />

          {/* Step 1: Company Information */}
          {currentStep === 1 && (
            <div>
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Company Information</h2>
                <p className="text-gray-600">Tell us about your business to personalize your experience.</p>
              </div>

              <form onSubmit={handleCompanyInfoSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Company Name *</label>
                  <input
                    type="text"
                    required
                    value={companyInfo.name}
                    onChange={(e) => setCompanyInfo({...companyInfo, name: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Your Company Name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Business Email *</label>
                  <input
                    type="email"
                    required
                    value={companyInfo.email}
                    onChange={(e) => setCompanyInfo({...companyInfo, email: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="contact@yourcompany.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={companyInfo.phone}
                    onChange={(e) => setCompanyInfo({...companyInfo, phone: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Website</label>
                  <input
                    type="url"
                    value={companyInfo.website}
                    onChange={(e) => setCompanyInfo({...companyInfo, website: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="https://yourcompany.com"
                  />
                </div>

                <div className="pt-4">
                  <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-md hover:bg-blue-700 font-medium transition-colors"
                  >
                    Continue
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Step 2: Sample Data Choice */}
          {currentStep === 2 && (
            <div>
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-2">Get Started Quickly</h2>
                <p className="text-gray-600">Would you like us to create some sample data to help you explore the features?</p>
              </div>

              <div className="space-y-4">
                <div 
                  onClick={() => handleSampleDataChoice('sample')}
                  className="border-2 border-gray-200 rounded-lg p-6 cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors"
                >
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-lg font-medium text-gray-900">Yes, create sample data</h3>
                      <p className="text-gray-600 mt-1">We'll add sample customers, payments, and templates so you can immediately see how PayPing works.</p>
                      <div className="mt-3 text-sm text-blue-600">
                        • 5 sample customers • 5 sample payments • 3 email templates
                      </div>
                    </div>
                  </div>
                </div>

                <div 
                  onClick={() => handleSampleDataChoice('blank')}
                  className="border-2 border-gray-200 rounded-lg p-6 cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors"
                >
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-lg font-medium text-gray-900">Start with a clean slate</h3>
                      <p className="text-gray-600 mt-1">Begin with an empty workspace and add your own customers and data.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Completion */}
          {currentStep === 3 && (
            <div className="text-center">
              <div className="mb-6">
                <svg className="w-16 h-16 text-green-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">All Set!</h2>
                <p className="text-gray-600">Your PayPing workspace is ready. Let's start managing your payments!</p>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <h3 className="text-lg font-medium text-blue-900 mb-2">Quick Tips to Get Started:</h3>
                <ul className="text-left text-blue-800 space-y-1 text-sm">
                  <li>• View your dashboard for an overview of payments and customers</li>
                  <li>• Add new customers in the Customers section</li>
                  <li>• Create and manage payment reminders in Templates</li>
                  <li>• Track all payments in the Payments section</li>
                  <li>• Update your company settings anytime in Settings</li>
                </ul>
              </div>

              <button
                onClick={completeOnboarding}
                className="bg-blue-600 text-white py-3 px-8 rounded-md hover:bg-blue-700 font-medium transition-colors"
              >
                Go to Dashboard
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
