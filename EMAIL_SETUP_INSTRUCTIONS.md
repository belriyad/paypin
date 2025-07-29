# Email Setup Instructions for PayPing

## 📧 Real Email Integration with EmailJS

PayPing now supports sending real emails to customers! By default, the system will simulate email sending. To enable real email functionality, follow these steps:

## 🚀 Quick Setup

### Step 1: Create EmailJS Account
1. Go to [https://emailjs.com](https://emailjs.com)
2. Sign up for a free account
3. Verify your email address

### Step 2: Connect Your Email Service
1. In your EmailJS dashboard, click **"Add New Service"**
2. Choose your email provider:
   - **Gmail** (recommended for personal/small business)
   - **Outlook/Hotmail**
   - **Yahoo Mail**
   - **Custom SMTP** (for business email)

3. Follow the connection wizard:
   - For Gmail: Allow EmailJS to access your account
   - For others: Enter your email credentials

### Step 3: Create Email Template
1. Go to **"Email Templates"** in EmailJS dashboard
2. Click **"Create New Template"**
3. Use this template structure:

```html
Subject: {{subject}}

To: {{to_email}}
From: {{from_name}} <{{from_email}}>

{{message}}

---
Sent via PayPing Payment Management System
```

4. Save the template and note the **Template ID**

### Step 4: Get Your Configuration Keys
1. In EmailJS dashboard, note these values:
   - **Service ID**: Found in your service settings
   - **Template ID**: From the template you just created
   - **Public Key**: Found in Account → API Keys

### Step 5: Update PayPing Configuration
1. Open your `.env` file in the PayPing project
2. Replace the placeholder values:

```env
# EmailJS Configuration
VITE_EMAILJS_SERVICE_ID=service_your_actual_id
VITE_EMAILJS_TEMPLATE_ID=template_your_actual_id  
VITE_EMAILJS_PUBLIC_KEY=your_actual_public_key
```

3. Save the file and restart your development server

## ✅ Testing Your Setup

### Test Email Configuration
1. Go to **Templates** in PayPing
2. Create or edit an email template
3. Click **"Save & Test"**
4. Check if you receive the test email

### Test Payment Reminders
1. Go to **Dashboard**
2. Click **"Send Reminders"**
3. Verify customers receive actual emails

## 📋 Template Variables

When creating email templates, you can use these variables:

| Variable | Description | Example |
|----------|-------------|---------|
| `{customer_name}` | Customer's full name | John Doe |
| `{invoice_number}` | Invoice or payment ID | INV-001 |
| `{amount}` | Payment amount (formatted) | $1,250.00 |
| `{due_date}` | Payment due date | July 30, 2025 |
| `{days_overdue}` | Days past due date | 5 |
| `{company_name}` | Your company name | PayPing Solutions |
| `{company_email}` | Your company email | support@payping.com |
| `{company_phone}` | Your company phone | (555) 123-4567 |

## 🎯 Example Email Templates

### Payment Reminder Template
```
Subject: Payment Reminder - Invoice {invoice_number}

Dear {customer_name},

This is a friendly reminder that your payment for Invoice {invoice_number} is due.

Payment Details:
- Amount Due: {amount}
- Due Date: {due_date}
- Days Overdue: {days_overdue}

Please submit your payment at your earliest convenience. If you have any questions, please contact us.

Thank you for your business!

Best regards,
{company_name}
{company_email}
{company_phone}
```

### Payment Receipt Template
```
Subject: Payment Received - Thank You!

Dear {customer_name},

Thank you for your payment! We have received your payment for Invoice {invoice_number}.

Payment Confirmation:
- Amount Paid: {amount}
- Payment Date: {payment_date}
- Invoice Number: {invoice_number}

We appreciate your prompt payment and continued business.

Best regards,
{company_name}
{company_email}
```

## 🔧 Troubleshooting

### Common Issues

**"EmailJS not configured" message**
- Check that all three environment variables are set correctly
- Restart your development server after updating .env
- Verify the values match your EmailJS dashboard

**Emails not sending**
- Check your EmailJS service status in dashboard
- Verify your email service connection is active
- Check browser console for error messages
- Test with EmailJS's test feature first

**Template variables not working**
- Ensure you're using curly braces: `{variable_name}`
- Check spelling of variable names
- Variables are case-sensitive

**Rate limiting errors**
- Free EmailJS accounts have monthly limits
- Add delays between bulk email sends
- Consider upgrading to paid plan for higher limits

### Getting Help

1. **EmailJS Documentation**: [https://www.emailjs.com/docs/](https://www.emailjs.com/docs/)
2. **PayPing Help Center**: Use the Help section in the app
3. **Console Logs**: Check browser console for detailed error messages

## 🏢 Production Recommendations

### For Business Use
1. **Use Business Email**: Connect your company's email service
2. **Custom Domain**: Use your own domain for professional appearance
3. **Email Templates**: Create branded templates with your logo
4. **Monitoring**: Set up email delivery monitoring
5. **Backup Service**: Consider multiple email services for reliability

### Security Best Practices
1. **Environment Variables**: Never commit .env files to version control
2. **API Keys**: Keep your EmailJS keys secure
3. **Email Limits**: Monitor usage to prevent abuse
4. **Content Filtering**: Validate email content before sending

## 📊 Usage Limits

### EmailJS Free Tier
- 200 emails per month
- Standard support
- Basic analytics

### Paid Tiers
- Higher email limits
- Priority support
- Advanced features
- Custom domains

## 🎉 Success!

Once configured, PayPing will:
- ✅ Send real payment reminders to customers
- ✅ Deliver professional-looking emails
- ✅ Track email delivery status
- ✅ Support bulk reminder sending
- ✅ Provide detailed sending logs

Your customers will receive professional payment reminders directly in their inbox, improving payment collection and communication efficiency!

---

*For technical support, check the browser console for detailed error messages or refer to the EmailJS documentation.*
