import { useAppData } from '../contexts/AppDataContext';

/**
 * Sample data service for new users
 * Creates realistic demo data for first-time users
 */
export class SampleDataService {
  
  static generateSampleCustomers() {
    return [
      {
        name: "Acme Corporation",
        email: "billing@acme-corp.com", 
        phone: "+1 (555) 123-4567",
        company: "Acme Corporation",
        totalOwed: 2500.00,
        overdueAmount: 0,
        status: "current",
        remindersEnabled: true,
        paymentHistory: 12,
        lastPayment: "2025-07-15"
      },
      {
        name: "TechStart Inc",
        email: "finance@techstart.io",
        phone: "+1 (555) 234-5678", 
        company: "TechStart Inc",
        totalOwed: 1800.00,
        overdueAmount: 1800.00,
        status: "overdue",
        remindersEnabled: true,
        paymentHistory: 8,
        lastPayment: "2025-06-10"
      },
      {
        name: "Design Studio Pro",
        email: "payments@designstudio.com",
        phone: "+1 (555) 345-6789",
        company: "Design Studio Pro", 
        totalOwed: 950.00,
        overdueAmount: 950.00,
        status: "overdue",
        remindersEnabled: false,
        paymentHistory: 5,
        lastPayment: "2025-06-20"
      },
      {
        name: "BuildMore LLC",
        email: "admin@buildmore.net",
        phone: "+1 (555) 456-7890",
        company: "BuildMore LLC",
        totalOwed: 0,
        overdueAmount: 0,
        status: "current",
        remindersEnabled: true,
        paymentHistory: 15,
        lastPayment: "2025-07-25"
      },
      {
        name: "Startup Ventures",
        email: "accounting@startupventures.com", 
        phone: "+1 (555) 567-8901",
        company: "Startup Ventures",
        totalOwed: 3200.00,
        overdueAmount: 0,
        status: "current",
        remindersEnabled: true,
        paymentHistory: 3,
        lastPayment: "2025-07-20"
      }
    ];
  }

  static generateSamplePayments() {
    return [
      {
        invoice: "INV-2025-001",
        customer: "Acme Corporation",
        customerId: "acme_corp_001",
        amount: 2500.00,
        status: "paid",
        dueDate: "2025-07-30"
      },
      {
        invoice: "INV-2025-002", 
        customer: "TechStart Inc",
        customerId: "techstart_002",
        amount: 1800.00,
        status: "overdue", 
        dueDate: "2025-07-15"
      },
      {
        invoice: "INV-2025-003",
        customer: "Design Studio Pro", 
        customerId: "design_studio_003",
        amount: 950.00,
        status: "overdue",
        dueDate: "2025-07-10"
      },
      {
        invoice: "INV-2025-004",
        customer: "BuildMore LLC",
        customerId: "buildmore_004", 
        amount: 3200.00,
        status: "paid",
        dueDate: "2025-07-25"
      },
      {
        invoice: "INV-2025-005",
        customer: "Startup Ventures",
        customerId: "startup_005",
        amount: 1200.00,
        status: "pending",
        dueDate: "2025-08-05"
      }
    ];
  }

  static generateSampleTemplates() {
    return [
      {
        name: "Payment Reminder - Friendly",
        type: "email",
        subject: "Payment Reminder: Invoice {invoice_number}",
        content: `Hi {customer_name},

I hope this email finds you well. This is a friendly reminder that your invoice {invoice_number} for ${amount} is due on {due_date}.

Payment Details:
• Invoice: {invoice_number}  
• Amount: ${amount}
• Due Date: {due_date}

You can make payment through [your preferred payment method]. If you have any questions about this invoice, please don't hesitate to reach out.

Thank you for your business!

Best regards,
{company_name}`,
        description: "Polite and professional payment reminder",
        usage: 45
      },
      {
        name: "Overdue Payment Notice",
        type: "email", 
        subject: "OVERDUE: Invoice {invoice_number} - Immediate Action Required",
        content: `Dear {customer_name},

Our records indicate that invoice {invoice_number} for ${amount} is now overdue by {days_overdue} days.

Invoice Details:
• Invoice Number: {invoice_number}
• Original Due Date: {due_date} 
• Amount Due: ${amount}
• Days Overdue: {days_overdue}

Please arrange payment immediately to avoid any service disruptions. If you have questions about this invoice or need to discuss payment arrangements, please contact us right away.

Best regards,
{company_name}
{company_phone}`,
        description: "Firm notice for overdue payments",
        usage: 23
      },
      {
        name: "Payment Confirmation",
        type: "email",
        subject: "Payment Received - Thank You!",
        content: `Dear {customer_name},

Thank you! We have successfully received your payment for invoice {invoice_number}.

Payment Summary:
• Invoice: {invoice_number}
• Amount Paid: ${amount}
• Payment Date: {payment_date}
• Payment Method: {payment_method}

Your account is now current. We appreciate your prompt payment and continued business partnership.

If you need a receipt or have any questions, please let us know.

Best regards,
{company_name}`,
        description: "Confirmation message for received payments", 
        usage: 67
      }
    ];
  }

  /**
   * Initialize sample data for new users
   * @param {Function} addCustomer - Function to add customers
   * @param {Function} addPayment - Function to add payments  
   * @param {Function} addTemplate - Function to add templates
   */
  static async initializeSampleData(addCustomer, addPayment, addTemplate) {
    try {
      console.log('🚀 Initializing sample data for new user...');

      // Add sample customers
      const customers = this.generateSampleCustomers();
      for (const customer of customers) {
        await addCustomer(customer);
      }

      // Add sample payments  
      const payments = this.generateSamplePayments();
      for (const payment of payments) {
        await addPayment(payment);
      }

      // Add sample templates
      const templates = this.generateSampleTemplates();
      for (const template of templates) {
        await addTemplate(template);
      }

      console.log('✅ Sample data initialization complete!');
      return {
        customersAdded: customers.length,
        paymentsAdded: payments.length, 
        templatesAdded: templates.length
      };

    } catch (error) {
      console.error('❌ Error initializing sample data:', error);
      throw error;
    }
  }
}

export default SampleDataService;
