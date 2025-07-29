/**
 * Payment Service for PayPing Subscriptions
 * Simulates payment processing for subscription plans
 * In production, this would integrate with Stripe, PayPal, or other payment processors
 */

class PaymentService {
  constructor() {
    this.isSimulation = true;
  }

  /**
   * Process subscription payment
   * @param {Object} paymentData - Payment information
   * @param {string} paymentData.plan - Subscription plan type
   * @param {string} paymentData.billingCycle - monthly or yearly
   * @param {number} paymentData.amount - Payment amount
   * @param {Object} paymentData.customerInfo - Customer information
   * @returns {Promise<Object>} Payment result
   */
  async processSubscription(paymentData) {
    console.log('🔄 Processing subscription payment...', paymentData);
    
    // Simulate payment processing delay
    await this.delay(2000);
    
    // Simulate payment success/failure (95% success rate)
    const isSuccess = Math.random() > 0.05;
    
    if (isSuccess) {
      const transactionId = this.generateTransactionId();
      
      return {
        success: true,
        transactionId,
        paymentMethod: 'simulation',
        amount: paymentData.amount,
        currency: 'USD',
        status: 'completed',
        processedAt: new Date().toISOString(),
        subscription: {
          plan: paymentData.plan,
          billingCycle: paymentData.billingCycle,
          startDate: new Date().toISOString(),
          nextBillingDate: this.calculateNextBillingDate(paymentData.billingCycle),
          status: 'active'
        }
      };
    } else {
      throw new Error('Payment failed. Please check your payment information and try again.');
    }
  }

  /**
   * Cancel subscription
   * @param {string} subscriptionId - Subscription ID to cancel
   * @returns {Promise<Object>} Cancellation result
   */
  async cancelSubscription(subscriptionId) {
    console.log('🚫 Cancelling subscription...', subscriptionId);
    
    await this.delay(1000);
    
    return {
      success: true,
      subscriptionId,
      status: 'cancelled',
      cancelledAt: new Date().toISOString(),
      refundAmount: 0, // Pro-rated refund would be calculated here
      nextBillingDate: null
    };
  }

  /**
   * Update subscription plan
   * @param {string} subscriptionId - Current subscription ID
   * @param {Object} updateData - New subscription data
   * @returns {Promise<Object>} Update result
   */
  async updateSubscription(subscriptionId, updateData) {
    console.log('📝 Updating subscription...', subscriptionId, updateData);
    
    await this.delay(1500);
    
    const proratedAmount = this.calculateProration(updateData.currentPlan, updateData.newPlan);
    
    return {
      success: true,
      subscriptionId,
      oldPlan: updateData.currentPlan,
      newPlan: updateData.newPlan,
      proratedAmount,
      effectiveDate: new Date().toISOString(),
      nextBillingDate: this.calculateNextBillingDate(updateData.billingCycle),
      status: 'active'
    };
  }

  /**
   * Get subscription details
   * @param {string} subscriptionId - Subscription ID
   * @returns {Promise<Object>} Subscription details
   */
  async getSubscriptionDetails(subscriptionId) {
    console.log('📊 Fetching subscription details...', subscriptionId);
    
    await this.delay(500);
    
    return {
      subscriptionId,
      status: 'active',
      plan: 'professional',
      billingCycle: 'monthly',
      amount: 29,
      currency: 'USD',
      startDate: '2025-01-01T00:00:00.000Z',
      nextBillingDate: this.calculateNextBillingDate('monthly'),
      paymentMethod: {
        type: 'card',
        last4: '4242',
        brand: 'visa'
      }
    };
  }

  /**
   * Get payment history
   * @param {string} customerId - Customer ID
   * @returns {Promise<Array>} Payment history
   */
  async getPaymentHistory(customerId) {
    console.log('📜 Fetching payment history...', customerId);
    
    await this.delay(800);
    
    return [
      {
        id: 'pay_123456',
        amount: 29,
        currency: 'USD',
        status: 'succeeded',
        description: 'Professional Plan - Monthly',
        paidAt: '2025-07-01T00:00:00.000Z',
        paymentMethod: 'card'
      },
      {
        id: 'pay_123455',
        amount: 29,
        currency: 'USD',
        status: 'succeeded',
        description: 'Professional Plan - Monthly',
        paidAt: '2025-06-01T00:00:00.000Z',
        paymentMethod: 'card'
      }
    ];
  }

  // Helper methods
  
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
  generateTransactionId() {
    return 'txn_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }
  
  calculateNextBillingDate(billingCycle) {
    const now = new Date();
    const nextBilling = new Date(now);
    
    if (billingCycle === 'monthly') {
      nextBilling.setMonth(nextBilling.getMonth() + 1);
    } else if (billingCycle === 'yearly') {
      nextBilling.setFullYear(nextBilling.getFullYear() + 1);
    }
    
    return nextBilling.toISOString();
  }
  
  calculateProration(currentPlan, newPlan) {
    // Simple proration calculation
    const planPrices = {
      starter: 9,
      professional: 29,
      enterprise: 79
    };
    
    const currentPrice = planPrices[currentPlan] || 0;
    const newPrice = planPrices[newPlan] || 0;
    const daysInMonth = 30;
    const daysRemaining = 15; // Simplified calculation
    
    const currentPeriodRefund = (currentPrice / daysInMonth) * daysRemaining;
    const newPeriodCharge = (newPrice / daysInMonth) * daysRemaining;
    
    return Math.max(0, newPeriodCharge - currentPeriodRefund);
  }

  /**
   * Validate payment information
   * @param {Object} paymentInfo - Payment information to validate
   * @returns {Object} Validation result
   */
  validatePaymentInfo(paymentInfo) {
    const errors = [];
    
    if (!paymentInfo.email || !paymentInfo.email.includes('@')) {
      errors.push('Valid email address is required');
    }
    
    if (!paymentInfo.plan || !['starter', 'professional', 'enterprise'].includes(paymentInfo.plan)) {
      errors.push('Valid subscription plan is required');
    }
    
    if (!paymentInfo.billingCycle || !['monthly', 'yearly'].includes(paymentInfo.billingCycle)) {
      errors.push('Valid billing cycle is required');
    }
    
    // In real implementation, you would validate payment method details
    
    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Get plan features and limits
   * @param {string} planType - Plan type
   * @returns {Object} Plan features
   */
  getPlanFeatures(planType) {
    const plans = {
      free: {
        maxCustomers: 10,
        maxReminders: 25,
        templates: 3,
        users: 1,
        support: 'email',
        features: ['Basic dashboard', 'Email reminders', 'Basic templates']
      },
      starter: {
        maxCustomers: 25,
        maxReminders: 50,
        templates: 10,
        users: 1,
        support: 'email',
        features: ['Basic dashboard', 'Email reminders', 'Custom templates', 'Analytics']
      },
      professional: {
        maxCustomers: 500,
        maxReminders: 'unlimited',
        templates: 'unlimited',
        users: 3,
        support: 'priority_email',
        features: ['Advanced dashboard', 'Unlimited reminders', 'Custom templates', 'Advanced analytics', 'SMS notifications', 'Data export', 'Late fee automation']
      },
      enterprise: {
        maxCustomers: 'unlimited',
        maxReminders: 'unlimited',
        templates: 'unlimited',
        users: 'unlimited',
        support: 'phone_chat',
        features: ['Enterprise dashboard', 'Unlimited everything', 'White-label', 'API access', 'Custom workflows', 'Dedicated support', 'Advanced integrations']
      }
    };
    
    return plans[planType] || plans.free;
  }
}

// Create and export singleton instance
const paymentService = new PaymentService();
export default paymentService;
