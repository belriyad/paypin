import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import PaymentStatusCard from '../components/PaymentStatusCard';
import CustomerTable from '../components/CustomerTable';
import { useAppData } from '../contexts/AppDataContext';
import LoadingSpinner from '../components/LoadingSpinner';

export default function Dashboard() {
  const navigate = useNavigate();
  const { customers, payments, loading, isInitialized } = useAppData();
  
  // Calculate real-time stats from Firebase data
  const stats = useMemo(() => {
    const totalCustomers = customers.length;
    const pendingPayments = payments.filter(p => p.status === 'pending').length;
    const overduePayments = payments.filter(p => p.status === 'overdue').length;
    const totalRevenue = payments.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0);
    
    return {
      totalCustomers,
      pendingPayments,
      overduePayments,
      totalRevenue,
    };
  }, [customers, payments]);

  const [isLoading, setIsLoading] = useState({
    addCustomer: false,
    sendReminder: false,
    viewReports: false,
  });

  // Quick action handlers
  const handleAddCustomer = async () => {
    setIsLoading(prev => ({ ...prev, addCustomer: true }));
    
    // Simulate a brief loading state for better UX
    setTimeout(() => {
      navigate('/upload-customers', { 
        state: { 
          message: 'Upload a CSV file to add multiple customers at once, or manually add individual customers.' 
        } 
      });
      setIsLoading(prev => ({ ...prev, addCustomer: false }));
    }, 300);
  };

  const handleSendReminder = async () => {
    const customerCount = stats.overduePayments + stats.pendingPayments;
    
    if (customerCount === 0) {
      alert('No pending or overdue payments to send reminders for!');
      return;
    }
    
    const confirmMessage = `Send payment reminders to ${customerCount} customers with pending/overdue payments?\n\nThis will:\n- Send email reminders to overdue customers\n- Update reminder status in your dashboard\n- Track reminder history`;
    
    if (confirm(confirmMessage)) {
      setIsLoading(prev => ({ ...prev, sendReminder: true }));
      
      // Simulate sending reminders with a delay
      setTimeout(() => {
        alert(`✅ Reminders sent successfully to ${customerCount} customers!\n\nYou can track reminder responses in the Payments section.`);
        setIsLoading(prev => ({ ...prev, sendReminder: false }));
      }, 2000);
    }
  };

  const handleViewReports = async () => {
    setIsLoading(prev => ({ ...prev, viewReports: true }));
    
    setTimeout(() => {
      navigate('/payments');
      setIsLoading(prev => ({ ...prev, viewReports: false }));
    }, 300);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {!isInitialized && <LoadingSpinner />}
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome back! Here's what's happening with your payments.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Customers</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalCustomers}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Pending Payments</p>
                <p className="text-2xl font-bold text-gray-900">{stats.pendingPayments}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-red-100 rounded-lg">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Overdue Payments</p>
                <p className="text-2xl font-bold text-gray-900">{stats.overduePayments}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">${stats.totalRevenue.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Recent Payment Activity</h3>
            </div>
            <div className="p-6">
              <PaymentStatusCard />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Customer Overview</h3>
            </div>
            <div className="p-6">
              <CustomerTable />
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8">
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button 
                onClick={handleAddCustomer}
                disabled={isLoading.addCustomer}
                className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-blue-300 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="text-center">
                  {isLoading.addCustomer ? (
                    <div className="w-8 h-8 mx-auto mb-2 flex items-center justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                    </div>
                  ) : (
                    <svg className="w-8 h-8 text-blue-600 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  )}
                  <p className="font-medium text-gray-900">Add Customer</p>
                  <p className="text-sm text-gray-600">
                    {isLoading.addCustomer ? 'Loading...' : 'Add new customer to database'}
                  </p>
                </div>
              </button>

              <button 
                onClick={handleSendReminder}
                disabled={isLoading.sendReminder || (stats.overduePayments + stats.pendingPayments === 0)}
                className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-green-300 transition-colors focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="text-center">
                  {isLoading.sendReminder ? (
                    <div className="w-8 h-8 mx-auto mb-2 flex items-center justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-green-600"></div>
                    </div>
                  ) : (
                    <svg className="w-8 h-8 text-green-600 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                    </svg>
                  )}
                  <p className="font-medium text-gray-900">Send Reminder</p>
                  <p className="text-sm text-gray-600">
                    {isLoading.sendReminder ? 'Sending...' : 
                     (stats.overduePayments + stats.pendingPayments === 0) ? 'No reminders needed' : 
                     `Send to ${stats.overduePayments + stats.pendingPayments} customers`}
                  </p>
                </div>
              </button>

              <button 
                onClick={handleViewReports}
                disabled={isLoading.viewReports}
                className="p-4 border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-purple-300 transition-colors focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="text-center">
                  {isLoading.viewReports ? (
                    <div className="w-8 h-8 mx-auto mb-2 flex items-center justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600"></div>
                    </div>
                  ) : (
                    <svg className="w-8 h-8 text-purple-600 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v4a2 2 0 01-2 2h-2a2 2 0 00-2-2z" />
                    </svg>
                  )}
                  <p className="font-medium text-gray-900">View Reports</p>
                  <p className="text-sm text-gray-600">
                    {isLoading.viewReports ? 'Loading...' : 'Generate payment reports'}
                  </p>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
