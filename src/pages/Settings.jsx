import { useState, useEffect } from 'react';
import { useAppData } from '../contexts/AppDataContext';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import DataExportService from '../services/dataExportService';

export default function Settings() {
  const { user, signOut } = useAuth();
  const { 
    customers, 
    payments, 
    templates, 
    settings, 
    updateSettings, 
    loading 
  } = useAppData();

  const [activeTab, setActiveTab] = useState('company');
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [isExporting, setIsExporting] = useState(false);

  const [formData, setFormData] = useState({
    company: {
      name: '',
      email: '',
      phone: '',
      website: '',
      address: '',
      logo: ''
    },
    notifications: {
      emailReminders: true,
      smsReminders: false,
      weeklyReports: true,
      overdueAlerts: true,
      paymentReceived: true
    },
    payment: {
      defaultCurrency: 'USD',
      taxRate: 0,
      lateFee: 0,
      gracePeriod: 7,
      autoReminders: true,
      reminderFrequency: 7
    },
    security: {
      twoFactorAuth: false,
      sessionTimeout: 60,
      passwordExpiry: 90
    }
  });

  useEffect(() => {
    if (settings) {
      setFormData(prevData => ({
        ...prevData,
        ...settings
      }));
    }
  }, [settings]);

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 5000);
  };

  const handleSave = async (section) => {
    setIsSaving(true);
    try {
      await updateSettings(section, formData[section]);
      showMessage('success', `${section.charAt(0).toUpperCase() + section.slice(1)} settings saved successfully!`);
    } catch (error) {
      showMessage('error', `Failed to save settings: ${error.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (section, field, value) => {
    setFormData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleExport = async (type) => {
    setIsExporting(true);
    try {
      let result;
      
      switch (type) {
        case 'customers':
          result = DataExportService.exportCustomers(customers);
          break;
        case 'payments':
          result = DataExportService.exportPayments(payments, customers);
          break;
        case 'templates':
          result = DataExportService.exportTemplates(templates);
          break;
        case 'financial':
          result = DataExportService.generateFinancialReport(payments, customers);
          break;
        default:
          throw new Error('Unknown export type');
      }
      
      showMessage('success', `Successfully exported ${result.recordCount || 'data'} records to ${result.filename}`);
    } catch (error) {
      showMessage('error', `Export failed: ${error.message}`);
    } finally {
      setIsExporting(false);
    }
  };

  const handleSignOut = async () => {
    if (window.confirm('Are you sure you want to sign out?')) {
      try {
        await signOut();
      } catch (error) {
        showMessage('error', 'Failed to sign out. Please try again.');
      }
    }
  };

  const tabs = [
    { id: 'company', label: 'Company Info', icon: '🏢' },
    { id: 'notifications', label: 'Notifications', icon: '🔔' },
    { id: 'payment', label: 'Payment Settings', icon: '💳' },
    { id: 'data', label: 'Data Management', icon: '📊' },
    { id: 'security', label: 'Security', icon: '🔒' },
    { id: 'account', label: 'Account', icon: '👤' }
  ];

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="mt-2 text-gray-600">Manage your account and application preferences</p>
      </div>

      {message.text && (
        <div className={`mb-6 p-4 rounded-md ${
          message.type === 'success' 
            ? 'bg-green-50 border border-green-200 text-green-700' 
            : 'bg-red-50 border border-red-200 text-red-700'
        }`}>
          {message.text}
        </div>
      )}

      <div className="bg-white shadow rounded-lg">
        {/* Tab Navigation */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6">
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
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* Company Info Tab */}
          {activeTab === 'company' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Company Information</h3>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
                    <input
                      type="text"
                      value={formData.company.name}
                      onChange={(e) => handleInputChange('company', 'name', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Business Email</label>
                    <input
                      type="email"
                      value={formData.company.email}
                      onChange={(e) => handleInputChange('company', 'email', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                    <input
                      type="tel"
                      value={formData.company.phone}
                      onChange={(e) => handleInputChange('company', 'phone', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
                    <input
                      type="url"
                      value={formData.company.website}
                      onChange={(e) => handleInputChange('company', 'website', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Business Address</label>
                    <textarea
                      value={formData.company.address}
                      onChange={(e) => handleInputChange('company', 'address', e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                
                <div className="mt-6">
                  <button
                    onClick={() => handleSave('company')}
                    disabled={isSaving}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
                  >
                    {isSaving ? <LoadingSpinner size="small" /> : 'Save Company Info'}
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Data Management Tab */}
          {activeTab === 'data' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Export Data</h3>
                <p className="text-gray-600 mb-6">Download your data in CSV format for backup or analysis.</p>
                
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">Customer Data</h4>
                        <p className="text-sm text-gray-600">{customers.length} customers</p>
                      </div>
                      <button
                        onClick={() => handleExport('customers')}
                        disabled={isExporting || customers.length === 0}
                        className="bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 text-sm"
                      >
                        Export CSV
                      </button>
                    </div>
                  </div>
                  
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">Payment Data</h4>
                        <p className="text-sm text-gray-600">{payments.length} payments</p>
                      </div>
                      <button
                        onClick={() => handleExport('payments')}
                        disabled={isExporting || payments.length === 0}
                        className="bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 text-sm"
                      >
                        Export CSV
                      </button>
                    </div>
                  </div>
                  
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">Email Templates</h4>
                        <p className="text-sm text-gray-600">{templates.length} templates</p>
                      </div>
                      <button
                        onClick={() => handleExport('templates')}
                        disabled={isExporting || templates.length === 0}
                        className="bg-blue-600 text-white px-3 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 text-sm"
                      >
                        Export CSV
                      </button>
                    </div>
                  </div>
                  
                  <div className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-gray-900">Financial Report</h4>
                        <p className="text-sm text-gray-600">Complete analysis</p>
                      </div>
                      <button
                        onClick={() => handleExport('financial')}
                        disabled={isExporting || payments.length === 0}
                        className="bg-green-600 text-white px-3 py-2 rounded-md hover:bg-green-700 disabled:opacity-50 text-sm"
                      >
                        Generate Report
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Data Statistics</h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600">{customers.length}</div>
                    <div className="text-sm text-gray-600">Total Customers</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">{payments.length}</div>
                    <div className="text-sm text-gray-600">Total Payments</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-purple-600">{templates.length}</div>
                    <div className="text-sm text-gray-600">Email Templates</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-orange-600">
                      ${payments.filter(p => p.status === 'paid').reduce((sum, p) => sum + (p.amount || 0), 0).toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-600">Total Revenue</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Account Tab */}
          {activeTab === 'account' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Account Information</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="flex items-center space-x-4">
                    {user?.photoURL && (
                      <img
                        src={user.photoURL}
                        alt="Profile"
                        className="w-16 h-16 rounded-full"
                      />
                    )}
                    <div>
                      <h4 className="font-medium text-gray-900">{user?.displayName || 'User'}</h4>
                      <p className="text-gray-600">{user?.email}</p>
                      <p className="text-sm text-gray-500">
                        Member since: {user?.metadata?.creationTime ? 
                          new Date(user.metadata.creationTime).toLocaleDateString() : 'Unknown'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Account Actions</h3>
                <div className="space-y-4">
                  <button
                    onClick={handleSignOut}
                    className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
                  >
                    Sign Out
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Other tabs placeholders */}
          {activeTab === 'notifications' && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Notification Preferences</h3>
              <p className="text-gray-600">Notification settings will be available in a future update.</p>
            </div>
          )}

          {activeTab === 'payment' && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Payment Settings</h3>
              <p className="text-gray-600">Payment configuration options will be available in a future update.</p>
            </div>
          )}

          {activeTab === 'security' && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Security Settings</h3>
              <p className="text-gray-600">Advanced security options will be available in a future update.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
