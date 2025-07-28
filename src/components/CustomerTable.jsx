import { useNavigate } from 'react-router-dom';
import { useAppData } from '../contexts/AppDataContext';

export default function CustomerTable() {
  const navigate = useNavigate();
  const { customers } = useAppData();
  
  // Get the 4 most recent customers
  const recentCustomers = customers
    .slice()
    .sort((a, b) => {
      // Sort by creation date (newest first)
      const dateA = a.createdAt?.toDate?.() || new Date(0);
      const dateB = b.createdAt?.toDate?.() || new Date(0);
      return dateB - dateA;
    })
    .slice(0, 4);

  const getStatusBadge = (customer) => {
    let statusText = customer.status || 'active';
    let colorClass = "bg-green-100 text-green-800";
    
    if (customer.totalOwed > 0) {
      if (customer.status === "overdue") {
        colorClass = "bg-red-100 text-red-800";
        statusText = "overdue";
      } else {
        colorClass = "bg-yellow-100 text-yellow-800";
        statusText = "pending";
      }
    }
    
    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full ${colorClass}`}>
        {statusText.charAt(0).toUpperCase() + statusText.slice(1)}
      </span>
    );
  };

  return (
    <div className="space-y-4">
      {recentCustomers.length === 0 ? (
        <div className="text-center py-8">
          <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
          </svg>
          <p className="text-gray-500 text-sm">No customers yet</p>
          <button 
            onClick={() => navigate('/customers')}
            className="text-blue-600 hover:text-blue-800 font-medium text-sm mt-2"
          >
            Add your first customer →
          </button>
        </div>
      ) : (
        <>
          {recentCustomers.map((customer) => (
            <div key={customer.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
              <div className="flex-1">
                <p className="font-medium text-gray-900">{customer.name}</p>
                <p className="text-sm text-gray-600">{customer.email}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-gray-900">
                  {customer.totalOwed > 0 ? `$${customer.totalOwed.toLocaleString()}` : 'Paid'}
                </p>
                {getStatusBadge(customer)}
              </div>
            </div>
          ))}
        </>
      )}
      
      <div className="pt-4 border-t border-gray-200">
        <button 
          onClick={() => navigate('/customers')}
          className="w-full text-center text-blue-600 hover:text-blue-800 font-medium text-sm"
        >
          View All Customers →
        </button>
      </div>
    </div>
  );
}
