import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PaymentStatusCard from '../components/PaymentStatusCard';
import CustomerTable from '../components/CustomerTable';
import { useAppData } from '../contexts/AppDataContext';
import LoadingSpinner from '../components/LoadingSpinner';

export default function Dashboard() {
  const navigate = useNavigate();
  const { customers, payments, loading, isInitialized, settings } = useAppData();
  const [dateRange, setDateRange] = useState('30'); // 30 days default
  const [recentActivity, setRecentActivity] = useState([]);
  
  // Calculate real-time stats from Firebase data with date filtering
  const stats = useMemo(() => {
    const totalCustomers = customers.length;
    
    // Filter payments by date range
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - parseInt(dateRange));
    
    const filteredPayments = payments.filter(payment => {
      const paymentDate = payment.createdAt?.toDate ? payment.createdAt.toDate() : new Date(payment.createdAt);
      return paymentDate >= cutoffDate;
    });
    
    const pendingPayments = payments.filter(p => p.status === 'pending').length;
    const overduePayments = payments.filter(p => p.status === 'overdue').length;
    const paidPayments = payments.filter(p => p.status === 'paid').length;
    
    const totalRevenue = payments.filter(p => p.status === 'paid').reduce((sum, p) => sum + (p.amount || 0), 0);
    const pendingAmount = payments.filter(p => p.status === 'pending').reduce((sum, p) => sum + (p.amount || 0), 0);
    const overdueAmount = payments.filter(p => p.status === 'overdue').reduce((sum, p) => sum + (p.amount || 0), 0);
    
    return {
      totalCustomers,
      totalPayments: filteredPayments.length,
      pendingPayments,
      overduePayments,
      paidPayments,
      totalRevenue,
      pendingAmount,
      overdueAmount,
      filteredPayments,
    };
  }, [customers, payments, dateRange]);

  // Generate recent activity feed
  useEffect(() => {
    if (payments.length > 0 && customers.length > 0) {
      const activity = [];
      
      // Recent payments sorted by update date
      const recentPayments = payments
        .sort((a, b) => {
          const dateA = a.updatedAt?.toDate ? a.updatedAt.toDate() : new Date(a.updatedAt || 0);
          const dateB = b.updatedAt?.toDate ? b.updatedAt.toDate() : new Date(b.updatedAt || 0);
          return dateB - dateA;
        })
        .slice(0, 10);

      recentPayments.forEach(payment => {
        const customer = customers.find(c => c.id === payment.customerId);
        activity.push({
          id: payment.id,
          type: 'payment',
          action: getActivityAction(payment.status),
          customer: customer?.name || 'Unknown Customer',
          amount: payment.amount || 0,
          status: payment.status,
          date: payment.updatedAt?.toDate ? payment.updatedAt.toDate() : new Date(payment.updatedAt || 0)
        });
      });

      setRecentActivity(activity);
    }
  }, [payments, customers]);

  const getActivityAction = (status) => {
    switch (status) {
      case 'paid': return 'Payment received';
      case 'pending': return 'Payment pending';
      case 'overdue': return 'Payment overdue';
      default: return 'Payment updated';
    }
  };

  const [isLoading, setIsLoading] = useState({
    addCustomer: false,
    sendReminder: false,
    viewReports: false,
  });

  // Quick action handlers
  const handleAddCustomer = async () => {
    setIsLoading(prev => ({ ...prev, addCustomer: true }));
    
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
      alert('No customers with pending or overdue payments to remind.');
      return;
    }

    setIsLoading(prev => ({ ...prev, sendReminder: true }));
    
    setTimeout(() => {
      navigate('/templates', { 
        state: { 
          message: `Ready to send reminders to ${customerCount} customers with pending or overdue payments.` 
        } 
      });
      setIsLoading(prev => ({ ...prev, sendReminder: false }));
    }, 300);
  };

  const handleViewReports = async () => {
    setIsLoading(prev => ({ ...prev, viewReports: true }));
    
    setTimeout(() => {
      alert('Advanced reporting feature coming soon! For now, you can view detailed payment information in the Payments section.');
      setIsLoading(prev => ({ ...prev, viewReports: false }));
    }, 500);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount || 0);
  };

  const formatDate = (date) => {
    if (!date) return 'Unknown';
    const dateObj = date.toDate ? date.toDate() : new Date(date);
    return dateObj.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getUpcomingPayments = () => {
    const today = new Date();
    const nextWeek = new Date();
    nextWeek.setDate(today.getDate() + 7);
    
    return payments.filter(payment => {
      if (payment.status === 'paid') return false;
      
      const dueDate = payment.dueDate?.toDate ? payment.dueDate.toDate() : new Date(payment.dueDate || 0);
      return dueDate >= today && dueDate <= nextWeek;
    });
  };

  if (loading || !isInitialized) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <LoadingSpinner />
      </div>
    );
  }

  const upcomingPayments = getUpcomingPayments();
  const companyName = settings?.company?.name || 'Your Company';

  return (
    <div className="space-y-6">
      {/* Header with date range filter */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome back to {companyName}!</h1>
          <p className="mt-1 text-sm text-gray-600">Here's what's happening with your payments today.</p>
        </div>
        
        <div className="mt-4 sm:mt-0">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="block w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
            <option value="365">Last year</option>
          </select>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <PaymentStatusCard
          title="Total Customers"
          value={stats.totalCustomers.toString()}
          icon="👥"
          bgColor="bg-blue-50"
          textColor="text-blue-700"
        />
        <PaymentStatusCard
          title="Total Revenue"
          value={formatCurrency(stats.totalRevenue)}
          icon="💰"
          bgColor="bg-green-50"
          textColor="text-green-700"
        />
        <PaymentStatusCard
          title="Pending Payments"
          value={`${stats.pendingPayments} (${formatCurrency(stats.pendingAmount)})`}
          icon="⏳"
          bgColor="bg-yellow-50"
          textColor="text-yellow-700"
        />
        <PaymentStatusCard
          title="Overdue Payments"
          value={`${stats.overduePayments} (${formatCurrency(stats.overdueAmount)})`}
          icon="⚠️"
          bgColor="bg-red-50"
          textColor="text-red-700"
        />
      </div>

      {/* Quick Actions */}
      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <button
              onClick={handleAddCustomer}
              disabled={isLoading.addCustomer}
              className="relative flex items-center justify-center px-4 py-3 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {isLoading.addCustomer ? (
                <LoadingSpinner size="small" />
              ) : (
                <>
                  <span className="mr-2">👤</span>
                  Add New Customer
                </>
              )}
            </button>
            
            <button
              onClick={handleSendReminder}
              disabled={isLoading.sendReminder}
              className="relative flex items-center justify-center px-4 py-3 border border-transparent text-sm font-medium rounded-md text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 disabled:opacity-50"
            >
              {isLoading.sendReminder ? (
                <LoadingSpinner size="small" />
              ) : (
                <>
                  <span className="mr-2">📧</span>
                  Send Reminders
                </>
              )}
            </button>
            
            <button
              onClick={handleViewReports}
              disabled={isLoading.viewReports}
              className="relative flex items-center justify-center px-4 py-3 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
            >
              {isLoading.viewReports ? (
                <LoadingSpinner size="small" />
              ) : (
                <>
                  <span className="mr-2">📊</span>
                  View Reports
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Two-column layout for tables and activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Recent Activity</h3>
            <div className="space-y-3">
              {recentActivity.length > 0 ? (
                recentActivity.slice(0, 8).map((activity) => (
                  <div key={activity.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                      <p className="text-sm text-gray-600">{activity.customer}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">{formatCurrency(activity.amount)}</p>
                      <p className="text-xs text-gray-500">{formatDate(activity.date)}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">No recent activity</p>
              )}
            </div>
            {recentActivity.length > 8 && (
              <div className="mt-4 text-center">
                <button
                  onClick={() => navigate('/payments')}
                  className="text-blue-600 hover:text-blue-500 text-sm font-medium"
                >
                  View all activity →
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Upcoming Payments */}
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">Upcoming Payments (Next 7 Days)</h3>
            <div className="space-y-3">
              {upcomingPayments.length > 0 ? (
                upcomingPayments.slice(0, 6).map((payment) => {
                  const customer = customers.find(c => c.id === payment.customerId);
                  const dueDate = payment.dueDate?.toDate ? payment.dueDate.toDate() : new Date(payment.dueDate || 0);
                  
                  return (
                    <div key={payment.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-b-0">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{customer?.name || 'Unknown Customer'}</p>
                        <p className="text-sm text-gray-600">Due: {dueDate.toLocaleDateString()}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">{formatCurrency(payment.amount)}</p>
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          payment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {payment.status}
                        </span>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-gray-500 text-center py-4">No upcoming payments</p>
              )}
            </div>
            {upcomingPayments.length > 6 && (
              <div className="mt-4 text-center">
                <button
                  onClick={() => navigate('/payments')}
                  className="text-blue-600 hover:text-blue-500 text-sm font-medium"
                >
                  View all payments →
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Customers Table */}
      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Recent Customers</h3>
            <button
              onClick={() => navigate('/customers')}
              className="text-blue-600 hover:text-blue-500 text-sm font-medium"
            >
              View all customers →
            </button>
          </div>
          <CustomerTable customers={customers.slice(0, 5)} compact={true} />
        </div>
      </div>
    </div>
  );
}
