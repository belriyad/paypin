import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useAppData } from '../contexts/AppDataContext';
import paymentService from '../services/paymentService';

const Subscription = () => {
  const { user } = useAuth();
  const { updateSubscription, settings } = useAppData();
  const [selectedPlan, setSelectedPlan] = useState('basic');
  const [billingCycle, setBillingCycle] = useState('monthly');
  const [loading, setLoading] = useState(false);
  const [currentSubscription, setCurrentSubscription] = useState(null);

  // Load current subscription on component mount
  useEffect(() => {
    if (settings?.subscription) {
      setCurrentSubscription(settings.subscription);
      setSelectedPlan(settings.subscription.plan || 'starter');
    }
  }, [settings]);

  const plans = {
    starter: {
      name: 'Starter',
      description: 'Perfect for freelancers and very small businesses',
      monthlyPrice: 9,
      yearlyPrice: 90,
      features: [
        'Up to 25 customers',
        '50 payment reminders/month',
        'Basic email templates',
        'Dashboard analytics',
        'Email support',
        '1 user account'
      ],
      limitations: [
        'Limited customization',
        'Basic reporting'
      ],
      recommended: false,
      color: 'border-gray-200'
    },
    professional: {
      name: 'Professional',
      description: 'Ideal for growing small businesses',
      monthlyPrice: 29,
      yearlyPrice: 290,
      features: [
        'Up to 500 customers',
        'Unlimited payment reminders',
        'Custom email templates',
        'Advanced analytics',
        'Priority email support',
        'Up to 3 user accounts',
        'Data export & backup',
        'SMS notifications',
        'Payment tracking',
        'Late fee automation'
      ],
      limitations: [],
      recommended: true,
      color: 'border-blue-500'
    },
    enterprise: {
      name: 'Enterprise',
      description: 'For established businesses with advanced needs',
      monthlyPrice: 79,
      yearlyPrice: 790,
      features: [
        'Unlimited customers',
        'Unlimited payment reminders',
        'Fully custom templates',
        'Advanced reporting & insights',
        'Phone & chat support',
        'Unlimited user accounts',
        'API access',
        'White-label options',
        'Advanced automation',
        'Integration support',
        'Custom workflows',
        'Dedicated account manager'
      ],
      limitations: [],
      recommended: false,
      color: 'border-purple-500'
    }
  };

  const handlePlanSelect = (planType) => {
    setSelectedPlan(planType);
  };

  const handleSubscribe = async (planType) => {
    setLoading(true);
    try {
      const plan = plans[planType];
      const price = billingCycle === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice;
      
      // Validate payment information
      const paymentInfo = {
        email: user.email,
        plan: planType,
        billingCycle,
        amount: price
      };
      
      const validation = paymentService.validatePaymentInfo(paymentInfo);
      if (!validation.isValid) {
        alert(`Validation failed: ${validation.errors.join(', ')}`);
        return;
      }
      
      // Process payment through payment service
      const paymentResult = await paymentService.processSubscription({
        ...paymentInfo,
        customerInfo: {
          name: user.displayName || user.email,
          email: user.email,
          userId: user.uid
        }
      });
      
      if (paymentResult.success) {
        // Update subscription in Firebase
        const subscriptionData = {
          plan: planType,
          billingCycle,
          price,
          status: 'active',
          startDate: paymentResult.subscription.startDate,
          nextBillingDate: paymentResult.subscription.nextBillingDate,
          transactionId: paymentResult.transactionId,
          features: paymentService.getPlanFeatures(planType)
        };
        
        await updateSubscription(subscriptionData);
        setCurrentSubscription(subscriptionData);
        
        alert(`🎉 Successfully subscribed to ${plan.name} plan!\n\nTransaction ID: ${paymentResult.transactionId}\nNext billing: ${new Date(paymentResult.subscription.nextBillingDate).toLocaleDateString()}`);
      }
    } catch (error) {
      console.error('Subscription error:', error);
      alert(`❌ ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const calculateSavings = (plan) => {
    const monthlyTotal = plan.monthlyPrice * 12;
    const savings = monthlyTotal - plan.yearlyPrice;
    const percentage = Math.round((savings / monthlyTotal) * 100);
    return { savings, percentage };
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900">Choose Your Plan</h1>
            <p className="mt-4 text-lg text-gray-600">
              Select the perfect plan for your business needs. Upgrade or downgrade anytime.
            </p>
            
            {/* Current Subscription Display */}
            {currentSubscription && currentSubscription.plan !== 'free' && (
              <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4 max-w-md mx-auto">
                <div className="flex items-center justify-center">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-blue-800">
                        Current Plan: <span className="capitalize">{currentSubscription.plan}</span> 
                        {currentSubscription.billingCycle && ` (${currentSubscription.billingCycle})`}
                      </p>
                      {currentSubscription.nextBillingDate && (
                        <p className="text-xs text-blue-600">
                          Next billing: {new Date(currentSubscription.nextBillingDate).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Billing Toggle */}
          <div className="flex justify-center mt-8">
            <div className="bg-gray-100 p-1 rounded-lg">
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  billingCycle === 'monthly'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingCycle('yearly')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  billingCycle === 'yearly'
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                Yearly
                <span className="ml-1 text-xs text-green-600 font-semibold">Save 17%</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {Object.entries(plans).map(([planKey, plan]) => {
            const { savings, percentage } = calculateSavings(plan);
            const currentPrice = billingCycle === 'monthly' ? plan.monthlyPrice : plan.yearlyPrice;
            
            return (
              <div
                key={planKey}
                className={`relative bg-white rounded-lg shadow-lg border-2 ${plan.color} ${
                  plan.recommended ? 'ring-2 ring-blue-500 ring-opacity-50' : ''
                } transition-all duration-200 hover:shadow-xl`}
              >
                {plan.recommended && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-blue-500 text-white px-4 py-1 rounded-full text-sm font-medium">
                      Most Popular
                    </span>
                  </div>
                )}

                <div className="p-8">
                  {/* Plan Header */}
                  <div className="text-center">
                    <h3 className="text-2xl font-bold text-gray-900">{plan.name}</h3>
                    <p className="mt-2 text-gray-600">{plan.description}</p>
                    
                    <div className="mt-6">
                      <span className="text-4xl font-bold text-gray-900">
                        ${currentPrice}
                      </span>
                      <span className="text-gray-600">
                        /{billingCycle === 'monthly' ? 'month' : 'year'}
                      </span>
                      
                      {billingCycle === 'yearly' && (
                        <div className="mt-2">
                          <span className="text-sm text-green-600 font-medium">
                            Save ${savings} ({percentage}% off)
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Features List */}
                  <div className="mt-8">
                    <ul className="space-y-3">
                      {plan.features.map((feature, index) => (
                        <li key={index} className="flex items-start">
                          <svg className="flex-shrink-0 w-5 h-5 text-green-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span className="ml-3 text-gray-700">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Action Button */}
                  <div className="mt-8">
                    <button
                      onClick={() => handleSubscribe(planKey)}
                      disabled={loading || (currentSubscription?.plan === planKey && currentSubscription?.status === 'active')}
                      className={`w-full py-3 px-4 rounded-lg text-sm font-medium transition-colors ${
                        currentSubscription?.plan === planKey && currentSubscription?.status === 'active'
                          ? 'bg-green-100 text-green-800 cursor-not-allowed'
                          : plan.recommended
                          ? 'bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-400'
                          : 'bg-gray-900 text-white hover:bg-gray-800 disabled:bg-gray-400'
                      } disabled:cursor-not-allowed`}
                    >
                      {loading ? 'Processing...' : 
                       currentSubscription?.plan === planKey && currentSubscription?.status === 'active' ? 'Current Plan' :
                       `Choose ${plan.name}`}
                    </button>
                  </div>

                  {/* Current Plan Indicator */}
                  {currentSubscription?.plan === planKey && currentSubscription?.status === 'active' && (
                    <div className="mt-4 text-center">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                        ✓ Active Plan
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* FAQ Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
            Frequently Asked Questions
          </h2>
          
          <div className="bg-white rounded-lg shadow-sm p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Can I change my plan anytime?
                </h3>
                <p className="text-gray-600">
                  Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately, and we'll prorate your billing accordingly.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Is there a free trial?
                </h3>
                <p className="text-gray-600">
                  We offer a 14-day free trial for all plans. No credit card required. You can explore all features before making a decision.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  What payment methods do you accept?
                </h3>
                <p className="text-gray-600">
                  We accept all major credit cards, PayPal, and bank transfers for annual plans. All payments are processed securely.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  What happens if I exceed my limits?
                </h3>
                <p className="text-gray-600">
                  We'll notify you when you're approaching your limits. You can upgrade your plan or purchase additional credits as needed.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Section */}
        <div className="mt-12 text-center">
          <div className="bg-gray-100 rounded-lg p-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-4">
              Need Help Choosing?
            </h3>
            <p className="text-gray-600 mb-6">
              Our team is here to help you find the perfect plan for your business needs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Schedule a Demo
              </button>
              <button className="bg-white text-gray-700 px-6 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors">
                Contact Sales
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Subscription;
