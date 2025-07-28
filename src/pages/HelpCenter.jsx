import { useState } from 'react';

export default function HelpCenter() {
  const [activeCategory, setActiveCategory] = useState('getting-started');
  const [searchQuery, setSearchQuery] = useState('');

  const helpCategories = [
    {
      id: 'getting-started',
      title: 'Getting Started',
      icon: '🚀',
      articles: [
        {
          id: 'welcome',
          title: 'Welcome to PayPing',
          content: `
PayPing is your complete payment management solution. Get started by setting up your company information and adding your first customers.

**Quick Start Steps:**
1. Complete your company profile in Settings
2. Add customers manually or upload a CSV file
3. Create payment records and send reminders
4. Track payments and generate reports

**Key Features:**
- Customer management with detailed profiles
- Automated payment reminders via email/SMS
- Real-time payment tracking and status updates
- Professional invoice and receipt templates
- Comprehensive financial reporting
- Data export and backup capabilities
          `
        },
        {
          id: 'setup',
          title: 'Initial Setup Guide',
          content: `
**Step 1: Company Information**
Navigate to Settings > Company Info and fill in:
- Company name and contact details
- Business address and website
- Logo (optional)

**Step 2: Payment Settings**
Configure your payment preferences:
- Default currency and tax rates
- Late fees and grace periods
- Automatic reminder frequency

**Step 3: Notification Settings**
Set up how you want to be notified:
- Email notifications for payments received
- Weekly summary reports
- Overdue payment alerts

**Step 4: Add Your First Customers**
Go to Customers section and either:
- Click "Add Customer" for manual entry
- Use "Upload CSV" for bulk import
          `
        }
      ]
    },
    {
      id: 'customers',
      title: 'Customer Management',
      icon: '👥',
      articles: [
        {
          id: 'add-customers',
          title: 'Adding Customers',
          content: `
**Manual Entry:**
1. Go to Customers page
2. Click "Add New Customer"
3. Fill in customer details:
   - Name (required)
   - Email address (required for reminders)
   - Phone number
   - Company name
   - Billing address

**Bulk Import via CSV:**
1. Go to Upload Customers page
2. Download the CSV template
3. Fill in your customer data
4. Upload the completed CSV file

**CSV Format Requirements:**
- Name: Customer full name
- Email: Valid email address
- Phone: Phone number with country code
- Company: Company/organization name
- Address: Full billing address

**Tips:**
- Ensure email addresses are correct for reminders
- Use consistent formatting for phone numbers
- Keep company names consistent for better reporting
          `
        },
        {
          id: 'manage-customers',
          title: 'Managing Customer Information',
          content: `
**Edit Customer Details:**
1. Go to Customers page
2. Click on customer name or "Edit" button
3. Update information as needed
4. Click "Save Changes"

**Customer Status:**
- Active: Regular customers receiving reminders
- Inactive: Customers not receiving reminders
- Toggle status using the reminder switch

**Search and Filter:**
- Use the search bar to find customers quickly
- Filter by company, payment status, or location
- Sort by name, email, or date added

**Delete Customers:**
- Only delete customers with no payment history
- Use "Delete" button in customer details
- Confirm deletion in the popup dialog

**Best Practices:**
- Keep customer information up to date
- Regularly review and clean up inactive customers
- Use consistent naming conventions
          `
        }
      ]
    },
    {
      id: 'payments',
      title: 'Payment Management',
      icon: '💰',
      articles: [
        {
          id: 'create-payments',
          title: 'Creating Payment Records',
          content: `
**Create New Payment:**
1. Go to Payments page
2. Click "Add New Payment"
3. Fill in payment details:
   - Select customer from dropdown
   - Enter payment amount
   - Set due date
   - Add description/invoice number
   - Set initial status (pending/paid/overdue)

**Payment Status Options:**
- **Pending**: Payment is due but not yet received
- **Paid**: Payment has been received and processed
- **Overdue**: Payment is past due date
- **Cancelled**: Payment has been cancelled

**Payment Information:**
- Amount: Enter exact payment amount
- Due Date: When payment is expected
- Description: Invoice number, service description, etc.
- Customer: Select from your customer list

**Tips:**
- Use clear, descriptive payment descriptions
- Set realistic due dates
- Update status promptly when payments are received
          `
        },
        {
          id: 'track-payments',
          title: 'Tracking and Managing Payments',
          content: `
**Payment Dashboard:**
View real-time statistics:
- Total payments and revenue
- Pending payment amounts
- Overdue payments requiring attention
- Recent payment activity

**Update Payment Status:**
1. Find payment in Payments list
2. Click on payment or "Edit" button
3. Change status to reflect current state
4. Add payment received date if marking as paid
5. Save changes

**Payment Reminders:**
- Automatic reminders based on your settings
- Manual reminders via Templates page
- Customize reminder frequency and content
- Track reminder history

**Filtering and Sorting:**
- Filter by status (paid, pending, overdue)
- Sort by amount, due date, or customer
- Search by customer name or description
- Export filtered results to CSV

**Best Practices:**
- Update payment status immediately when received
- Follow up on overdue payments promptly
- Keep payment descriptions detailed and consistent
- Review payment reports regularly
          `
        }
      ]
    },
    {
      id: 'templates',
      title: 'Email Templates',
      icon: '📧',
      articles: [
        {
          id: 'create-templates',
          title: 'Creating Email Templates',
          content: `
**Template Types:**
- **Payment Reminder**: For pending payments
- **Overdue Notice**: For past-due payments
- **Payment Confirmation**: When payment is received
- **Invoice**: Professional payment requests

**Create New Template:**
1. Go to Templates page
2. Click "Create New Template"
3. Choose template type
4. Fill in template details:
   - Template name (for your reference)
   - Email subject line
   - Email content/body
5. Use merge fields for personalization
6. Preview and save template

**Merge Fields Available:**
- {{customerName}}: Customer's full name
- {{companyName}}: Your company name
- {{amount}}: Payment amount
- {{dueDate}}: Payment due date
- {{description}}: Payment description
- {{customerEmail}}: Customer's email address

**Example Template:**
Subject: Payment Reminder - Invoice Due {{dueDate}}

Dear {{customerName}},

This is a friendly reminder that your payment of ${{amount}} for {{description}} is due on {{dueDate}}.

Please submit your payment at your earliest convenience.

Best regards,
{{companyName}}
          `
        },
        {
          id: 'send-reminders',
          title: 'Sending Payment Reminders',
          content: `
**Automatic Reminders:**
Configure in Settings > Notifications:
- Enable automatic reminders
- Set days before due date to send
- Choose reminder frequency
- Select template to use

**Manual Reminders:**
1. Go to Templates page
2. Select appropriate template
3. Choose customers to remind
4. Review and customize message
5. Send immediately or schedule

**Bulk Reminders:**
- Send to all customers with pending payments
- Filter by payment status or due date
- Use different templates for different situations
- Track who was reminded and when

**Reminder Best Practices:**
- Send first reminder 3-5 days before due date
- Follow up 1-2 days after due date
- Escalate tone for significantly overdue payments
- Always remain professional and courteous
- Keep reminder frequency reasonable (not daily)

**Tracking Reminders:**
- View reminder history in payment details
- See response rates and effectiveness
- Adjust timing and content based on results
          `
        }
      ]
    },
    {
      id: 'reports',
      title: 'Reports & Analytics',
      icon: '📊',
      articles: [
        {
          id: 'dashboard-overview',
          title: 'Understanding Your Dashboard',
          content: `
**Key Metrics Display:**
- **Total Customers**: All active customer records
- **Total Revenue**: All paid payments combined
- **Pending Payments**: Awaiting payment (count and amount)
- **Overdue Payments**: Past due date (count and amount)

**Recent Activity Feed:**
- Latest payment updates and status changes
- Customer additions and modifications
- System activities and important events
- Real-time updates as data changes

**Upcoming Payments:**
- Payments due in the next 7 days
- Helps prioritize follow-up activities
- Shows customer and amount details
- Click to view full payment details

**Quick Actions:**
- Add New Customer: Direct link to customer creation
- Send Reminders: Jump to reminder templates
- View Reports: Access detailed analytics

**Date Range Filtering:**
- Switch between 7, 30, 90 days, or full year
- Statistics update based on selected period
- Helps track performance over time
          `
        },
        {
          id: 'export-data',
          title: 'Exporting Data and Reports',
          content: `
**Available Exports:**
Go to Settings > Data Management for export options:

**Customer Data Export:**
- Complete customer information
- Contact details and company info
- Creation dates and activity status
- CSV format for Excel/Google Sheets

**Payment Data Export:**
- All payment records with customer details
- Payment amounts, dates, and status
- Due dates and payment received dates
- Includes customer name and email

**Email Templates Export:**
- All template content and settings
- Template names and types
- Creation and modification dates
- Backup for template library

**Financial Reports:**
- Comprehensive revenue analysis
- Payment status breakdown
- Top customers by revenue
- Monthly/quarterly summaries

**Using Exported Data:**
- Open CSV files in Excel or Google Sheets
- Create custom charts and pivot tables
- Import into accounting software
- Share with accountants or stakeholders

**Export Tips:**
- Export regularly for backup purposes
- Use date filters for specific periods
- Combine with other business data for insights
          `
        }
      ]
    },
    {
      id: 'troubleshooting',
      title: 'Troubleshooting',
      icon: '🔧',
      articles: [
        {
          id: 'common-issues',
          title: 'Common Issues and Solutions',
          content: `
**Login Problems:**
- Clear browser cache and cookies
- Try incognito/private browsing mode
- Ensure JavaScript is enabled
- Check internet connection stability

**Data Not Loading:**
- Refresh the page
- Check internet connection
- Sign out and sign back in
- Clear browser cache

**Email Reminders Not Sending:**
- Verify customer email addresses are correct
- Check email template configuration
- Ensure notification settings are enabled
- Contact support if issues persist

**CSV Upload Issues:**
- Use the provided CSV template
- Ensure all required fields are filled
- Check for special characters in data
- Save file as CSV (not Excel format)
- File size should be under 10MB

**Payment Status Not Updating:**
- Refresh the page after making changes
- Check internet connection
- Ensure you clicked "Save" after editing
- Try signing out and back in

**Performance Issues:**
- Close unnecessary browser tabs
- Clear browser cache
- Update to latest browser version
- Check available memory on device
          `
        },
        {
          id: 'data-backup',
          title: 'Data Backup and Recovery',
          content: `
**Regular Backups:**
Protect your data with regular exports:
1. Go to Settings > Data Management
2. Export all data types monthly
3. Save files to secure location
4. Keep multiple backup versions

**What to Backup:**
- Customer information and contact details
- Payment records and transaction history
- Email templates and customizations
- Company settings and preferences

**Backup Schedule:**
- Weekly: Export recent payments and customer changes
- Monthly: Full data export for comprehensive backup
- Before major updates: Complete system backup
- Before bulk imports: Backup existing data

**Recovery Process:**
If data is lost or corrupted:
1. Contact PayPing support immediately
2. Provide backup files if available
3. Do not make additional changes until resolved
4. Keep detailed records of the issue

**Data Security:**
- Your data is automatically backed up in the cloud
- Use strong, unique passwords
- Enable two-factor authentication when available
- Regular exports provide additional protection
- Never share login credentials

**Cloud Storage:**
- Data is stored securely with Firebase
- Automatic synchronization across devices
- Real-time backup of all changes
- Enterprise-grade security measures
          `
        }
      ]
    }
  ];

  const filteredCategories = helpCategories.map(category => ({
    ...category,
    articles: category.articles.filter(article =>
      searchQuery === '' ||
      article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      article.content.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(category => category.articles.length > 0);

  const activeCategory_data = filteredCategories.find(cat => cat.id === activeCategory) || filteredCategories[0];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Help Center</h1>
        <p className="mt-2 text-gray-600">Find answers and learn how to use PayPing effectively</p>
      </div>

      {/* Search Bar */}
      <div className="mb-8">
        <div className="relative">
          <input
            type="text"
            placeholder="Search help articles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <svg className="absolute left-3 top-3.5 h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Categories</h3>
            <nav className="space-y-2">
              {filteredCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`w-full text-left px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeCategory === category.id
                      ? 'bg-blue-50 text-blue-700 border-l-4 border-blue-500'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <span className="mr-2">{category.icon}</span>
                  {category.title}
                  <span className="ml-auto text-xs text-gray-500">({category.articles.length})</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                <span className="mr-2">{activeCategory_data?.icon}</span>
                {activeCategory_data?.title}
              </h2>
            </div>

            <div className="p-6">
              {activeCategory_data?.articles.length > 0 ? (
                <div className="space-y-8">
                  {activeCategory_data.articles.map((article) => (
                    <div key={article.id} className="border-b border-gray-200 pb-8 last:border-b-0">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">{article.title}</h3>
                      <div className="prose prose-sm max-w-none">
                        {article.content.split('\n').map((paragraph, index) => {
                          if (paragraph.trim() === '') return null;
                          
                          if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
                            return (
                              <h4 key={index} className="font-semibold text-gray-900 mt-4 mb-2">
                                {paragraph.replace(/\*\*/g, '')}
                              </h4>
                            );
                          }
                          
                          if (paragraph.startsWith('- ')) {
                            return (
                              <li key={index} className="ml-4 text-gray-700">
                                {paragraph.substring(2)}
                              </li>
                            );
                          }
                          
                          return (
                            <p key={index} className="text-gray-700 mb-2">
                              {paragraph}
                            </p>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47-.881-6.08-2.33" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No articles found</h3>
                  <p className="mt-1 text-sm text-gray-500">Try adjusting your search terms.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="mt-12 bg-blue-50 rounded-lg p-6">
        <h3 className="text-lg font-medium text-blue-900 mb-4">Quick Links</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <a href="/dashboard" className="text-blue-700 hover:text-blue-800 font-medium">
            📊 Dashboard
          </a>
          <a href="/customers" className="text-blue-700 hover:text-blue-800 font-medium">
            👥 Manage Customers
          </a>
          <a href="/payments" className="text-blue-700 hover:text-blue-800 font-medium">
            💰 Track Payments
          </a>
          <a href="/settings" className="text-blue-700 hover:text-blue-800 font-medium">
            ⚙️ Settings
          </a>
        </div>
      </div>
    </div>
  );
}
