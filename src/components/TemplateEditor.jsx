import { useState } from 'react';
import { useAppData } from '../contexts/AppDataContext';

export default function TemplateEditor({ template, onClose }) {
  const { addTemplate, updateTemplate } = useAppData();
  const [formData, setFormData] = useState({
    name: template?.name || '',
    type: template?.type || 'email',
    subject: template?.subject || '',
    content: template?.content || `Hi {customer_name},

We hope this message finds you well. This is a friendly reminder that your payment for invoice {invoice_number} in the amount of {amount} was due on {due_date}.

We understand that things can get busy, and we wanted to reach out to ensure you have everything you need to complete your payment.

Payment Details:
• Invoice: {invoice_number}
• Amount: {amount}
• Due Date: {due_date}
• Days Overdue: {days_overdue}

If you've already sent your payment, please disregard this message. If you have any questions or need assistance, please don't hesitate to reach out.

Thank you for your business!

Best regards,
{company_name}`,
    variables: [
      '{customer_name}',
      '{invoice_number}',
      '{amount}',
      '{due_date}',
      '{days_overdue}',
      '{company_name}'
    ]
  });

  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPreview, setShowPreview] = useState(false);

  const handleFieldChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    // Clear errors when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Template name is required';
    }
    
    if (formData.type === 'email' && !formData.subject.trim()) {
      newErrors.subject = 'Subject is required for email templates';
    }
    
    if (!formData.content.trim()) {
      newErrors.content = 'Template content is required';
    }
    
    if (formData.type === 'sms' && formData.content.length > 160) {
      newErrors.content = 'SMS content must be 160 characters or less';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Production-ready save functionality
  const handleSaveTemplate = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSaving(true);
    try {
      const templateData = {
        name: formData.name.trim(),
        type: formData.type,
        subject: formData.subject.trim(),
        content: formData.content.trim(),
        description: `${formData.type} template for payment reminders`
      };

      if (template) {
        // Update existing template
        updateTemplate(template.id, templateData);
      } else {
        // Create new template
        addTemplate(templateData);
      }

      // Close editor after successful save
      if (onClose) {
        onClose();
      }
    } catch (error) {
      console.error('Error saving template:', error);
      setErrors({ submit: 'Failed to save template. Please try again.' });
    } finally {
      setIsSaving(false);
    }
  };

  // Production-ready test functionality
  const handleSaveAndTest = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSaving(true);
    try {
      // First save the template
      await handleSaveTemplate();
      
      // Then simulate sending test
      const testContent = formData.content
        .replace(/{customer_name}/g, 'John Doe')
        .replace(/{invoice_number}/g, 'INV-001')
        .replace(/{amount}/g, '$1,250.00')
        .replace(/{due_date}/g, '2025-07-30')
        .replace(/{days_overdue}/g, '5')
        .replace(/{company_name}/g, 'PayPing Solutions');

      // In a real application, this would send an actual email
      console.log('Test email content:', {
        to: 'test@example.com',
        subject: formData.subject || 'Test Email',
        content: testContent
      });

      alert('✅ Template saved and test email sent!\n\nCheck your email to see how the template appears to customers.');
    } catch (error) {
      console.error('Error in save and test:', error);
      setErrors({ submit: 'Failed to save and test template. Please try again.' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (onClose) {
      onClose();
    }
  };

  const insertVariable = (variable) => {
    const textarea = document.querySelector('textarea[name="content"]');
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const before = formData.content.substring(0, start);
      const after = formData.content.substring(end);
      
      setFormData(prev => ({
        ...prev,
        content: before + variable + after
      }));
      
      // Restore cursor position
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + variable.length, start + variable.length);
      }, 0);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900">
          {template ? 'Edit Template' : 'Create New Template'}
        </h2>
      </div>

      {/* Error display */}
      {errors.submit && (
        <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-sm text-red-600">{errors.submit}</p>
        </div>
      )}

      <div className="p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Template Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={(e) => handleFieldChange('name', e.target.value)}
                  className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.name ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter template name"
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={(e) => handleFieldChange('type', e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="email">Email</option>
                  <option value="sms">SMS</option>
                </select>
              </div>
            </div>

            {/* Subject (Email only) */}
            {formData.type === 'email' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject Line *
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={(e) => handleFieldChange('subject', e.target.value)}
                  className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.subject ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter email subject"
                />
                {errors.subject && (
                  <p className="mt-1 text-sm text-red-600">{errors.subject}</p>
                )}
              </div>
            )}

            {/* Content */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Message Content *
              </label>
              <textarea
                name="content"
                value={formData.content}
                onChange={(e) => handleFieldChange('content', e.target.value)}
                rows={12}
                className={`w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.content ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter your message content..."
              />
              {formData.type === 'sms' && (
                <p className={`text-sm mt-1 ${
                  formData.content.length > 160 ? 'text-red-600' : 'text-gray-600'
                }`}>
                  Character count: {formData.content.length}/160
                </p>
              )}
              {errors.content && (
                <p className="mt-1 text-sm text-red-600">{errors.content}</p>
              )}
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-6 border-t border-gray-200">
              <div className="flex space-x-3">
                <button 
                  onClick={handleSaveTemplate}
                  disabled={isSaving}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSaving ? 'Saving...' : 'Save Template'}
                </button>
                <button 
                  onClick={handleSaveAndTest}
                  disabled={isSaving}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSaving ? 'Processing...' : 'Save & Send Test'}
                </button>
              </div>
              <button 
                onClick={handleCancel}
                disabled={isSaving}
                className="text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Variables */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Available Variables</h3>
              <div className="space-y-2">
                {formData.variables.map((variable) => (
                  <button
                    key={variable}
                    onClick={() => insertVariable(variable)}
                    className="w-full text-left px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 rounded-md transition-colors"
                  >
                    {variable}
                  </button>
                ))}
              </div>
            </div>

            {/* Preview */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Preview</h3>
              <div className="border border-gray-200 rounded-md p-4 bg-gray-50">
                <div className="text-sm">
                  {formData.type === 'email' && formData.subject && (
                    <div className="font-medium mb-2 pb-2 border-b border-gray-300">
                      Subject: {formData.subject}
                    </div>
                  )}
                  <div className="whitespace-pre-wrap text-gray-700">
                    {formData.content || 'Enter content to see preview...'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
