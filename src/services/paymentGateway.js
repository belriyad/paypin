/**
 * Payment Gateway Service for PayPing
 * Integrates with Stripe for payment processing
 */

import auditService, { AUDIT_EVENTS } from './auditService.js';

// Payment configuration
const PAYMENT_CONFIG = {
  stripe: {
    publishableKey: import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY,
    secretKey: import.meta.env.VITE_STRIPE_SECRET_KEY // Only for server-side operations
  },
  currency: 'usd',
  paymentMethods: ['card', 'bank_transfer', 'paypal']
};

// Payment status constants
export const PAYMENT_STATUS = {
  PENDING: 'pending',
  PROCESSING: 'processing',
  SUCCEEDED: 'succeeded',
  FAILED: 'failed',
  CANCELED: 'canceled',
  REFUNDED: 'refunded',
  PARTIALLY_REFUNDED: 'partially_refunded'
};

class PaymentGatewayService {
  constructor() {
    this.stripe = null;
    this.isConfigured = false;
    this.initializeStripe();
  }

  /**
   * Initialize Stripe
   */
  async initializeStripe() {
    try {
      if (!PAYMENT_CONFIG.stripe.publishableKey) {
        console.warn('Stripe publishable key not configured');
        return;
      }

      // Dynamically import Stripe
      const { loadStripe } = await import('@stripe/stripe-js');
      this.stripe = await loadStripe(PAYMENT_CONFIG.stripe.publishableKey);
      
      if (this.stripe) {
        this.isConfigured = true;
        console.log('Stripe initialized successfully');
      }
    } catch (error) {
      console.error('Failed to initialize Stripe:', error);
    }
  }

  /**
   * Create payment intent
   */
  async createPaymentIntent(paymentData) {
    try {
      if (!this.isConfigured) {
        throw new Error('Payment gateway not configured');
      }

      // In production, this would call your backend API
      // For now, we'll simulate the process
      const response = await fetch('/api/create-payment-intent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: Math.round(paymentData.amount * 100), // Convert to cents
          currency: PAYMENT_CONFIG.currency,
          customerId: paymentData.customerId,
          description: paymentData.description,
          metadata: {
            invoiceId: paymentData.invoiceId,
            userId: paymentData.userId
          }
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create payment intent');
      }

      const { clientSecret, paymentIntentId } = await response.json();

      await auditService.logEvent(AUDIT_EVENTS.PAYMENT_CREATED, {
        paymentIntentId,
        amount: paymentData.amount,
        customerId: paymentData.customerId,
        currency: PAYMENT_CONFIG.currency
      });

      return {
        success: true,
        clientSecret,
        paymentIntentId,
        status: PAYMENT_STATUS.PENDING
      };
    } catch (error) {
      console.error('Error creating payment intent:', error);
      
      await auditService.logEvent(AUDIT_EVENTS.PAYMENT_CREATED, {
        success: false,
        error: error.message,
        amount: paymentData.amount,
        customerId: paymentData.customerId
      });

      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Process payment with Stripe Elements
   */
  async processPayment(clientSecret, paymentElement) {
    try {
      if (!this.stripe) {
        throw new Error('Stripe not initialized');
      }

      const { error, paymentIntent } = await this.stripe.confirmPayment({
        elements: paymentElement,
        clientSecret,
        confirmParams: {
          return_url: `${window.location.origin}/payment/success`
        }
      });

      if (error) {
        await auditService.logEvent(AUDIT_EVENTS.PAYMENT_UPDATED, {
          success: false,
          error: error.message,
          paymentIntentId: paymentIntent?.id
        });

        return {
          success: false,
          error: error.message,
          status: PAYMENT_STATUS.FAILED
        };
      }

      await auditService.logEvent(AUDIT_EVENTS.PAYMENT_UPDATED, {
        success: true,
        paymentIntentId: paymentIntent.id,
        status: paymentIntent.status
      });

      return {
        success: true,
        paymentIntent,
        status: this.mapStripeStatus(paymentIntent.status)
      };
    } catch (error) {
      console.error('Error processing payment:', error);
      return {
        success: false,
        error: error.message,
        status: PAYMENT_STATUS.FAILED
      };
    }
  }

  /**
   * Create Stripe Elements for payment form
   */
  async createPaymentElements(clientSecret, options = {}) {
    try {
      if (!this.stripe) {
        throw new Error('Stripe not initialized');
      }

      const elements = this.stripe.elements({
        clientSecret,
        appearance: {
          theme: 'stripe',
          variables: {
            colorPrimary: '#3B82F6',
            colorBackground: '#ffffff',
            colorText: '#1F2937',
            borderRadius: '8px'
          }
        },
        ...options
      });

      const paymentElement = elements.create('payment', {
        layout: 'tabs',
        paymentMethodOrder: ['card', 'paypal', 'bank_transfer']
      });

      return {
        success: true,
        elements,
        paymentElement
      };
    } catch (error) {
      console.error('Error creating payment elements:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Retrieve payment intent status
   */
  async getPaymentStatus(paymentIntentId) {
    try {
      // In production, this would call your backend API
      const response = await fetch(`/api/payment-intent/${paymentIntentId}`);
      
      if (!response.ok) {
        throw new Error('Failed to retrieve payment status');
      }

      const paymentIntent = await response.json();
      
      return {
        success: true,
        status: this.mapStripeStatus(paymentIntent.status),
        amount: paymentIntent.amount / 100,
        currency: paymentIntent.currency,
        created: paymentIntent.created,
        paymentMethod: paymentIntent.payment_method
      };
    } catch (error) {
      console.error('Error retrieving payment status:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Process refund
   */
  async processRefund(paymentIntentId, amount = null, reason = 'requested_by_customer') {
    try {
      // In production, this would call your backend API
      const response = await fetch('/api/create-refund', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paymentIntentId,
          amount: amount ? Math.round(amount * 100) : null, // Convert to cents if partial refund
          reason
        })
      });

      if (!response.ok) {
        throw new Error('Failed to process refund');
      }

      const refund = await response.json();

      await auditService.logEvent(AUDIT_EVENTS.PAYMENT_UPDATED, {
        action: 'refund',
        paymentIntentId,
        refundId: refund.id,
        amount: refund.amount / 100,
        reason
      });

      return {
        success: true,
        refund,
        status: amount ? PAYMENT_STATUS.PARTIALLY_REFUNDED : PAYMENT_STATUS.REFUNDED
      };
    } catch (error) {
      console.error('Error processing refund:', error);
      
      await auditService.logEvent(AUDIT_EVENTS.PAYMENT_UPDATED, {
        action: 'refund_failed',
        paymentIntentId,
        error: error.message
      });

      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Create customer in Stripe
   */
  async createCustomer(customerData) {
    try {
      // In production, this would call your backend API
      const response = await fetch('/api/create-customer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: customerData.email,
          name: customerData.name,
          phone: customerData.phone,
          address: customerData.address,
          metadata: {
            userId: customerData.userId,
            customerId: customerData.id
          }
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create customer');
      }

      const customer = await response.json();

      await auditService.logEvent(AUDIT_EVENTS.CUSTOMER_CREATED, {
        stripeCustomerId: customer.id,
        email: customerData.email,
        name: customerData.name
      });

      return {
        success: true,
        stripeCustomerId: customer.id,
        customer
      };
    } catch (error) {
      console.error('Error creating customer:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Set up subscription
   */
  async createSubscription(customerId, priceId, paymentMethodId) {
    try {
      // In production, this would call your backend API
      const response = await fetch('/api/create-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerId,
          priceId,
          paymentMethodId
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create subscription');
      }

      const subscription = await response.json();

      await auditService.logEvent(AUDIT_EVENTS.PAYMENT_CREATED, {
        type: 'subscription',
        subscriptionId: subscription.id,
        customerId,
        priceId
      });

      return {
        success: true,
        subscription,
        status: subscription.status
      };
    } catch (error) {
      console.error('Error creating subscription:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Generate payment link for invoices
   */
  async createPaymentLink(paymentData) {
    try {
      // Create a shareable payment link
      const paymentIntent = await this.createPaymentIntent(paymentData);
      
      if (!paymentIntent.success) {
        throw new Error(paymentIntent.error);
      }

      const paymentLink = `${window.location.origin}/pay/${paymentIntent.paymentIntentId}`;

      return {
        success: true,
        paymentLink,
        paymentIntentId: paymentIntent.paymentIntentId,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
      };
    } catch (error) {
      console.error('Error creating payment link:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Map Stripe status to internal status
   */
  mapStripeStatus(stripeStatus) {
    const statusMap = {
      'requires_payment_method': PAYMENT_STATUS.PENDING,
      'requires_confirmation': PAYMENT_STATUS.PROCESSING,
      'requires_action': PAYMENT_STATUS.PROCESSING,
      'processing': PAYMENT_STATUS.PROCESSING,
      'succeeded': PAYMENT_STATUS.SUCCEEDED,
      'canceled': PAYMENT_STATUS.CANCELED,
      'failed': PAYMENT_STATUS.FAILED
    };

    return statusMap[stripeStatus] || PAYMENT_STATUS.PENDING;
  }

  /**
   * Validate payment configuration
   */
  validateConfiguration() {
    const issues = [];

    if (!PAYMENT_CONFIG.stripe.publishableKey) {
      issues.push('Stripe publishable key not configured');
    }

    if (!this.isConfigured) {
      issues.push('Stripe not properly initialized');
    }

    return {
      isValid: issues.length === 0,
      issues,
      isConfigured: this.isConfigured,
      provider: 'stripe'
    };
  }

  /**
   * Get payment configuration status
   */
  getConfigurationStatus() {
    const validation = this.validateConfiguration();
    
    return {
      isConfigured: validation.isValid,
      provider: 'stripe',
      issues: validation.issues,
      stripeInitialized: this.isConfigured,
      supportedMethods: PAYMENT_CONFIG.paymentMethods,
      currency: PAYMENT_CONFIG.currency,
      message: validation.isValid 
        ? 'Payment gateway is ready' 
        : 'Please configure Stripe credentials'
    };
  }

  /**
   * Test payment configuration
   */
  async testConfiguration() {
    try {
      const validation = this.validateConfiguration();
      
      if (!validation.isValid) {
        return {
          success: false,
          message: 'Payment gateway not properly configured',
          issues: validation.issues
        };
      }

      // Test with minimal payment intent (would need backend)
      return {
        success: true,
        message: 'Payment gateway configuration is valid',
        provider: 'stripe'
      };
    } catch (error) {
      return {
        success: false,
        message: error.message,
        provider: 'stripe'
      };
    }
  }
}

// Create and export singleton instance
const paymentGateway = new PaymentGatewayService();
export default paymentGateway;
