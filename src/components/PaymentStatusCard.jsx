import { useNavigate } from 'react-router-dom';
import { useAppData } from '../contexts/AppDataContext';

export default function PaymentStatusCard() {
  const navigate = useNavigate();
  const { payments } = useAppData();
  
  // Get the 4 most recent payments
  const recentPayments = payments
    .slice()
    .sort((a, b) => {
      // Sort by creation date (newest first)
      const dateA = a.createdAt?.toDate?.() || new Date(0);
      const dateB = b.createdAt?.toDate?.() || new Date(0);
      return dateB - dateA;
    })
    .slice(0, 4);

  const getStatusBadge = (status) => {
    const styles = {
      paid: "bg-green-100 text-green-800",
      pending: "bg-yellow-100 text-yellow-800",
      overdue: "bg-red-100 text-red-800"
    };
    
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${styles[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className="space-y-4">
      {recentPayments.length === 0 ? (
        <div className="text-center py-8">
          <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <p className="text-gray-500 text-sm">No payment activity yet</p>
          <button 
            onClick={() => navigate('/payments')}
            className="text-blue-600 hover:text-blue-800 font-medium text-sm mt-2"
          >
            Create your first payment →
          </button>
        </div>
      ) : (
        <>
          {recentPayments.map((payment) => (
            <div key={payment.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
              <div className="flex-1">
                <p className="font-medium text-gray-900">{payment.customer}</p>
                <p className="text-sm text-gray-600">
                  {payment.createdAt?.toDate?.()?.toLocaleDateString() || 'Unknown date'}
                </p>
              </div>
              <div className="text-right">
                <p className="font-bold text-gray-900">${payment.amount.toLocaleString()}</p>
                {getStatusBadge(payment.status)}
              </div>
            </div>
          ))}
        </>
      )}
      
      <div className="pt-4 border-t border-gray-200">
        <button 
          onClick={() => navigate('/payments')}
          className="w-full text-center text-blue-600 hover:text-blue-800 font-medium text-sm"
        >
          View All Payments →
        </button>
      </div>
    </div>
  );
}
