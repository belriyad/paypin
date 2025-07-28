import { useState } from 'react';

export default function Settings() {
  const [activeTab, setActiveTab] = useState('company');
  const [settings, setSettings] = useState({
    company: {
      name: 'PayPing Solutions',
      email: 'admin@payping.com',
      phone: '+1 (555) 123-4567',
      address: '123 Business St, Suite 100',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94102',
      website: 'https://payping.com',
      logo: ''
    },
    notifications: {
      emailReminders: true,
      smsReminders: false,
      daysBefore: 3,
      escalationDays: 7,
      sendReceipts: true,
      weeklyReports: true
    },
    payment: {
      currency: 'USD',
      lateFeePercent: 5,
      gracePeriodDays: 5,
      autoReminders: true,
      paymentMethods: ['credit_card', 'bank_transfer', 'paypal']
    },
    branding: {
      primaryColor: '#3B82F6',
      secondaryColor: '#10B981',
      emailTemplate: 'modern',
      invoiceTemplate: 'professional'
    }
  });

  const handleInputChange = (section, field, value) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };
  
  // Handler functions for settings actions
  const handleSaveChanges = () => {
    // Validate required fields
    if (!settings.company.name.trim()) {
      alert('Please enter a company name.');
      return;
    }
    if (!settings.company.email.trim()) {
      alert('Please enter a company email.');
      return;
    }
    
    alert('✅ Settings saved successfully!\n\nYour changes have been applied:\n• Company information updated\n• Notification preferences saved\n• Payment settings configured\n• Branding preferences applied');
  };
  
  const handleResetToDefaults = () => {
    if (confirm('Are you sure you want to reset all settings to default values?\n\nThis action cannot be undone.')) {
      // Reset to default values
      setSettings({
        company: {
          name: 'PayPing Solutions',
          email: 'admin@payping.com',
          phone: '+1 (555) 123-4567',
          address: '123 Business St, Suite 100',
          city: 'San Francisco',
          state: 'CA',
          zipCode: '94102',
          website: 'https://payping.com',
          logo: ''
        },
        notifications: {
          emailReminders: true,
          smsReminders: false,
          daysBefore: 3,
          escalationDays: 7,
          sendReceipts: true,
          weeklyReports: true
        },
        payment: {
          currency: 'USD',
          lateFeePercent: 5,
          gracePeriodDays: 5,
          autoReminders: true,
          paymentMethods: ['credit_card', 'bank_transfer', 'paypal']
        },
        branding: {
          primaryColor: '#3B82F6',
          secondaryColor: '#1F2937',
          logoUrl: '',
          companyName: 'PayPing Solutions',
          tagline: 'Streamline Your Payment Process'
        }
      });
      alert('✅ Settings have been reset to default values!');
    }
  };

  const tabs = [
    { id: 'company', name: 'Company Info', icon: '🏢' },
    { id: 'notifications', name: 'Notifications', icon: '🔔' },
    { id: 'payment', name: 'Payment', icon: '💳' },
    { id: 'branding', name: 'Branding', icon: '🎨' }
  ];

  return (
    <div className="max-w-6xl mx-auto">
      <div className="bg-white rounded-lg shadow">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-1">Manage your account and payment preferences</p>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        {/* Tab Content */}
        <div className="p-6">
          {/* Company Information */}
          {activeTab === 'company' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Company Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Company Name
                    </label>
                    <input
                      type="text"
                      value={settings.company.name}
                      onChange={(e) => handleInputChange('company', 'name', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      value={settings.company.email}
                      onChange={(e) => handleInputChange('company', 'email', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={settings.company.phone}
                      onChange={(e) => handleInputChange('company', 'phone', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Website
                    </label>
                    <input
                      type="url"
                      value={settings.company.website}
                      onChange={(e) => handleInputChange('company', 'website', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                
                <div className="mt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address
                  </label>
                  <input
                    type="text"
                    value={settings.company.address}
                    onChange={(e) => handleInputChange('company', 'address', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Street address"
                  />
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    <input
                      type="text"
                      value={settings.company.city}
                      onChange={(e) => handleInputChange('company', 'city', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="City"
                    />
                    <input
                      type="text"
                      value={settings.company.state}
                      onChange={(e) => handleInputChange('company', 'state', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="State"
                    />
                    <input
                      type="text"
                      value={settings.company.zipCode}
                      onChange={(e) => handleInputChange('company', 'zipCode', e.target.value)}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="ZIP Code"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Notifications */}
          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Notification Preferences</h3>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">Email Reminders</h4>
                      <p className="text-sm text-gray-600">Send payment reminders via email</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.notifications.emailReminders}
                        onChange={(e) => handleInputChange('notifications', 'emailReminders', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">SMS Reminders</h4>
                      <p className="text-sm text-gray-600">Send payment reminders via SMS</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={settings.notifications.smsReminders}
                        onChange={(e) => handleInputChange('notifications', 'smsReminders', e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Days Before Due Date to Send Reminder
                      </label>
                      <select
                        value={settings.notifications.daysBefore}
                        onChange={(e) => handleInputChange('notifications', 'daysBefore', Number(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value={1}>1 day</option>
                        <option value={3}>3 days</option>
                        <option value={7}>7 days</option>
                        <option value={14}>14 days</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Escalation (Days Past Due)
                      </label>
                      <select
                        value={settings.notifications.escalationDays}
                        onChange={(e) => handleInputChange('notifications', 'escalationDays', Number(e.target.value))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value={3}>3 days</option>
                        <option value={7}>7 days</option>
                        <option value={14}>14 days</option>
                        <option value={30}>30 days</option>
                      </select>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Payment Settings */}
          {activeTab === 'payment' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Payment Configuration</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Default Currency
                    </label>
                    <select
                      value={settings.payment.currency}
                      onChange={(e) => handleInputChange('payment', 'currency', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="USD">USD - US Dollar</option>
                      <option value="EUR">EUR - Euro</option>
                      <option value="GBP">GBP - British Pound</option>
                      <option value="CAD">CAD - Canadian Dollar</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Late Fee Percentage
                    </label>
                    <input
                      type="number"
                      value={settings.payment.lateFeePercent}
                      onChange={(e) => handleInputChange('payment', 'lateFeePercent', Number(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      min="0"
                      max="50"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Grace Period (Days)
                    </label>
                    <input
                      type="number"
                      value={settings.payment.gracePeriodDays}
                      onChange={(e) => handleInputChange('payment', 'gracePeriodDays', Number(e.target.value))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      min="0"
                      max="30"
                    />
                  </div>
                </div>
                
                <div className="mt-6">
                  <h4 className="font-medium text-gray-900 mb-3">Accepted Payment Methods</h4>
                  <div className="space-y-2">
                    {[
                      { id: 'credit_card', name: 'Credit/Debit Cards' },
                      { id: 'bank_transfer', name: 'Bank Transfer' },
                      { id: 'paypal', name: 'PayPal' },
                      { id: 'stripe', name: 'Stripe' }
                    ].map((method) => (
                      <label key={method.id} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={settings.payment.paymentMethods.includes(method.id)}
                          onChange={(e) => {
                            const newMethods = e.target.checked
                              ? [...settings.payment.paymentMethods, method.id]
                              : settings.payment.paymentMethods.filter(m => m !== method.id);
                            handleInputChange('payment', 'paymentMethods', newMethods);
                          }}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                        <span className="ml-2 text-sm text-gray-700">{method.name}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Branding */}
          {activeTab === 'branding' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Brand Customization</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Primary Color
                    </label>
                    <div className="flex items-center space-x-3">
                      <input
                        type="color"
                        value={settings.branding.primaryColor}
                        onChange={(e) => handleInputChange('branding', 'primaryColor', e.target.value)}
                        className="h-10 w-16 border border-gray-300 rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        value={settings.branding.primaryColor}
                        onChange={(e) => handleInputChange('branding', 'primaryColor', e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Secondary Color
                    </label>
                    <div className="flex items-center space-x-3">
                      <input
                        type="color"
                        value={settings.branding.secondaryColor}
                        onChange={(e) => handleInputChange('branding', 'secondaryColor', e.target.value)}
                        className="h-10 w-16 border border-gray-300 rounded cursor-pointer"
                      />
                      <input
                        type="text"
                        value={settings.branding.secondaryColor}
                        onChange={(e) => handleInputChange('branding', 'secondaryColor', e.target.value)}
                        className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Template Style
                    </label>
                    <select
                      value={settings.branding.emailTemplate}
                      onChange={(e) => handleInputChange('branding', 'emailTemplate', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="modern">Modern</option>
                      <option value="classic">Classic</option>
                      <option value="minimal">Minimal</option>
                    </select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Invoice Template
                    </label>
                    <select
                      value={settings.branding.invoiceTemplate}
                      onChange={(e) => handleInputChange('branding', 'invoiceTemplate', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="professional">Professional</option>
                      <option value="creative">Creative</option>
                      <option value="simple">Simple</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Save Button */}
          <div className="flex justify-end pt-6 border-t border-gray-200 mt-8">
            <div className="flex space-x-3">
              <button 
                onClick={handleResetToDefaults}
                className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
              >
                Reset to Defaults
              </button>
              <button 
                onClick={handleSaveChanges}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
