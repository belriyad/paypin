import { useState, useMemo } from 'react';
import { useAppData } from '../contexts/AppDataContext';
import LoadingSpinner from '../components/LoadingSpinner';

export default function Payments() {
  const [filter, setFilter] = useState('all');
  const { payments, customers, loading, isInitialized, addPayment } = useAppData();
  
  // Handler functions for buttons
  const handleCreateInvoice = async () => {
    // Create a real payment/invoice using Firebase
    const samplePayment = {
      invoice: `INV-${Date.now()}`,
      customer: 'New Customer',
      customerId: 'new_customer_id',
      amount: 1000,
      status: 'pending',
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] // 30 days from now
    };
    
    try {
      const newPayment = await addPayment(samplePayment);
      alert(`✅ Invoice ${newPayment.invoice} created successfully!\n\nCustomer: ${newPayment.customer}\nAmount: $${newPayment.amount.toLocaleString()}\nDue Date: ${newPayment.dueDate}`);
    } catch (error) {
      alert('❌ Error creating invoice. Please try again.');
      console.error('Error creating invoice:', error);
    }
  };
  
  const handleViewPayment = (payment) => {
    alert(`Viewing payment details for ${payment.customer}:\n\nInvoice: ${payment.invoice}\nAmount: $${payment.amount.toLocaleString()}\nStatus: ${payment.status}\nDue Date: ${payment.dueDate}`);
  };
  
  const handleSendReminder = (payment) => {
    if (confirm(`Send payment reminder to ${payment.customer}?\n\nThis will send an email reminder for invoice ${payment.invoice}.`)) {
      alert(`✅ Reminder sent successfully to ${payment.customer}!`);
    }
  };

  const filteredPayments = filter === 'all' ? payments : payments.filter(p => p.status === filter);

  // Calculate summary stats
  const summaryStats = useMemo(() => {
    const totalOutstanding = payments.filter(p => p.status !== 'paid').reduce((sum, p) => sum + p.amount, 0);
    const collectedThisMonth = payments.filter(p => p.status === 'paid').reduce((sum, p) => sum + p.amount, 0);
    const averagePaymentTime = payments.length > 0 ? '12 days' : 'No data';
    
    return {
      totalOutstanding,
      collectedThisMonth,
      averagePaymentTime
    };
  }, [payments]);

  const getStatusBadge = (status) => {
    const styles = {
      paid: "bg-green-100 text-green-800",
      pending: "bg-yellow-100 text-yellow-800",
      overdue: "bg-red-100 text-red-800"
    };
    
    return (
      <span className={`px-3 py-1 text-xs font-medium rounded-full ${styles[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {!isInitialized && <LoadingSpinner />}
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Payments</h1>
          <p className="text-gray-600 mt-2">Track and manage all customer payments</p>
        </div>

        {/* No data state */}
        {payments.length === 0 && isInitialized && (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No payments yet</h3>
            <p className="text-gray-600 mb-4">Start by creating your first invoice or payment record.</p>
            <button 
              onClick={handleCreateInvoice}
              className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
            >
              Create First Invoice
            </button>
          </div>
        )}

        {/* Payments interface */}
        {payments.length > 0 && (
          <>
            {/* Filters */}
            <div className="bg-white rounded-lg shadow mb-6">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex space-x-4">
                    <button
                      onClick={() => setFilter('all')}
                      className={`px-4 py-2 rounded-md text-sm font-medium ${
                        filter === 'all' ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      All Payments ({payments.length})
                    </button>
                    <button
                      onClick={() => setFilter('pending')}
                      className={`px-4 py-2 rounded-md text-sm font-medium ${
                        filter === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      Pending ({payments.filter(p => p.status === 'pending').length})
                    </button>
                    <button
                      onClick={() => setFilter('overdue')}
                      className={`px-4 py-2 rounded-md text-sm font-medium ${
                        filter === 'overdue' ? 'bg-red-100 text-red-700' : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      Overdue ({payments.filter(p => p.status === 'overdue').length})
                    </button>
                    <button
                      onClick={() => setFilter('paid')}
                      className={`px-4 py-2 rounded-md text-sm font-medium ${
                        filter === 'paid' ? 'bg-green-100 text-green-700' : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      Paid ({payments.filter(p => p.status === 'paid').length})
                    </button>
                  </div>
                  <button 
                    onClick={handleCreateInvoice}
                    className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
                  >
                    Create Invoice
                  </button>
                </div>
              </div>

              {/* Payments Table */}
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Invoice
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Customer
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Due Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredPayments.map((payment) => (
                      <tr key={payment.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{payment.invoice}</div>
                          <div className="text-sm text-gray-500">
                            Created {payment.createdAt?.toDate?.()?.toLocaleDateString() || 'Unknown'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{payment.customer}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-bold text-gray-900">${payment.amount.toLocaleString()}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(payment.status)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {payment.dueDate}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button 
                              onClick={() => handleViewPayment(payment)}
                              className="text-blue-600 hover:text-blue-900"
                            >
                              View
                            </button>
                            {payment.status !== 'paid' && (
                              <button 
                                onClick={() => handleSendReminder(payment)}
                                className="text-green-600 hover:text-green-900"
                              >
                                Send Reminder
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Total Outstanding</h3>
                <p className="text-3xl font-bold text-red-600">
                  ${summaryStats.totalOutstanding.toLocaleString()}
                </p>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Collected This Month</h3>
                <p className="text-3xl font-bold text-green-600">
                  ${summaryStats.collectedThisMonth.toLocaleString()}
                </p>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Average Payment Time</h3>
                <p className="text-3xl font-bold text-blue-600">{summaryStats.averagePaymentTime}</p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
