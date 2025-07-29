import { createContext, useContext, useReducer, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import firebaseService from '../services/firebaseService';

const AppDataContext = createContext();

// Initial state
const initialState = {
  customers: [],
  templates: [],
  payments: [],
  settings: {
    company: {
      name: 'PayPing Solutions',
      email: 'admin@payping.com',
      phone: '+1 (555) 123-4567',
      address: '123 Business St, Suite 100',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94102',
      website: 'https://payping.com'
    },
    notifications: {
      emailReminders: true,
      smsReminders: false,
      daysBefore: 3,
      escalationDays: 7,
      sendReceipts: true,
      weeklyReports: true
    },
    subscription: {
      plan: 'free',
      status: 'active',
      startDate: new Date().toISOString(),
      features: {
        maxCustomers: 10,
        maxReminders: 25,
        templates: 3,
        users: 1
      }
    }
  },
  loading: false,
  error: null
};

// Action types
export const ACTIONS = {
  // Loading states
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  
  // Data loading
  LOAD_CUSTOMERS: 'LOAD_CUSTOMERS',
  LOAD_TEMPLATES: 'LOAD_TEMPLATES',
  LOAD_PAYMENTS: 'LOAD_PAYMENTS',
  LOAD_SETTINGS: 'LOAD_SETTINGS',
  
  // Customer actions
  ADD_CUSTOMER: 'ADD_CUSTOMER',
  UPDATE_CUSTOMER: 'UPDATE_CUSTOMER',
  DELETE_CUSTOMER: 'DELETE_CUSTOMER',
  TOGGLE_CUSTOMER_REMINDERS: 'TOGGLE_CUSTOMER_REMINDERS',
  
  // Template actions
  ADD_TEMPLATE: 'ADD_TEMPLATE',
  UPDATE_TEMPLATE: 'UPDATE_TEMPLATE',
  DELETE_TEMPLATE: 'DELETE_TEMPLATE',
  DUPLICATE_TEMPLATE: 'DUPLICATE_TEMPLATE',
  
  // Payment actions
  ADD_PAYMENT: 'ADD_PAYMENT',
  UPDATE_PAYMENT: 'UPDATE_PAYMENT',
  DELETE_PAYMENT: 'DELETE_PAYMENT',
  
  // Settings actions
  UPDATE_SETTINGS: 'UPDATE_SETTINGS',
  
  // Subscription actions
  LOAD_SUBSCRIPTION: 'LOAD_SUBSCRIPTION',
  UPDATE_SUBSCRIPTION: 'UPDATE_SUBSCRIPTION'
};

// Reducer function
function appDataReducer(state, action) {
  switch (action.type) {
    case ACTIONS.SET_LOADING:
      return {
        ...state,
        loading: action.payload
      };
      
    case ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload,
        loading: false
      };
      
    case ACTIONS.LOAD_CUSTOMERS:
      return {
        ...state,
        customers: action.payload,
        loading: false
      };
      
    case ACTIONS.LOAD_TEMPLATES:
      return {
        ...state,
        templates: action.payload,
        loading: false
      };
      
    case ACTIONS.LOAD_PAYMENTS:
      return {
        ...state,
        payments: action.payload,
        loading: false
      };
      
    case ACTIONS.LOAD_SETTINGS:
      return {
        ...state,
        settings: action.payload,
        loading: false
      };
      
    case ACTIONS.ADD_CUSTOMER:
      return {
        ...state,
        customers: [action.payload, ...state.customers]
      };
      
    case ACTIONS.UPDATE_CUSTOMER:
      return {
        ...state,
        customers: state.customers.map(customer =>
          customer.id === action.payload.id ? action.payload : customer
        )
      };
      
    case ACTIONS.DELETE_CUSTOMER:
      return {
        ...state,
        customers: state.customers.filter(customer => customer.id !== action.payload)
      };
      
    case ACTIONS.TOGGLE_CUSTOMER_REMINDERS:
      return {
        ...state,
        customers: state.customers.map(customer =>
          customer.id === action.payload.customerId
            ? { ...customer, remindersEnabled: action.payload.enabled }
            : customer
        )
      };
      
    case ACTIONS.ADD_TEMPLATE:
      return {
        ...state,
        templates: [action.payload, ...state.templates]
      };
      
    case ACTIONS.UPDATE_TEMPLATE:
      return {
        ...state,
        templates: state.templates.map(template =>
          template.id === action.payload.id ? action.payload : template
        )
      };
      
    case ACTIONS.DELETE_TEMPLATE:
      return {
        ...state,
        templates: state.templates.filter(template => template.id !== action.payload)
      };
      
    case ACTIONS.DUPLICATE_TEMPLATE:
      return {
        ...state,
        templates: [action.payload, ...state.templates]
      };
      
    case ACTIONS.ADD_PAYMENT:
      return {
        ...state,
        payments: [action.payload, ...state.payments]
      };
      
    case ACTIONS.UPDATE_PAYMENT:
      return {
        ...state,
        payments: state.payments.map(payment =>
          payment.id === action.payload.id ? action.payload : payment
        )
      };
      
    case ACTIONS.DELETE_PAYMENT:
      return {
        ...state,
        payments: state.payments.filter(payment => payment.id !== action.payload)
      };
      
    case ACTIONS.UPDATE_SETTINGS:
      return {
        ...state,
        settings: {
          ...state.settings,
          [action.payload.section]: {
            ...state.settings[action.payload.section],
            ...action.payload.data
          }
        }
      };
      
    case ACTIONS.LOAD_SUBSCRIPTION:
      return {
        ...state,
        settings: {
          ...state.settings,
          subscription: action.payload
        }
      };
      
    case ACTIONS.UPDATE_SUBSCRIPTION:
      return {
        ...state,
        settings: {
          ...state.settings,
          subscription: {
            ...state.settings.subscription,
            ...action.payload
          }
        }
      };
      
    default:
      return state;
  }
}

// Custom hook to use the context
export function useAppData() {
  const context = useContext(AppDataContext);
  if (!context) {
    throw new Error('useAppData must be used within an AppDataProvider');
  }
  return context;
}

// Provider component
export function AppDataProvider({ children }) {
  const [state, dispatch] = useReducer(appDataReducer, initialState);
  const { user } = useAuth();
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize data when user is authenticated
  useEffect(() => {
    if (!user) {
      setIsInitialized(false);
      return;
    }

    const initializeData = async () => {
      try {
        dispatch({ type: ACTIONS.SET_LOADING, payload: true });
        
        // Load all data in parallel
        const [customers, templates, payments, settings] = await Promise.all([
          firebaseService.getCustomers(),
          firebaseService.getTemplates(),
          firebaseService.getPayments(),
          firebaseService.getSettings()
        ]);

        dispatch({ type: ACTIONS.LOAD_CUSTOMERS, payload: customers });
        dispatch({ type: ACTIONS.LOAD_TEMPLATES, payload: templates });
        dispatch({ type: ACTIONS.LOAD_PAYMENTS, payload: payments });
        dispatch({ type: ACTIONS.LOAD_SETTINGS, payload: settings });
        
        setIsInitialized(true);
      } catch (error) {
        console.error('Error initializing data:', error);
        dispatch({ type: ACTIONS.SET_ERROR, payload: error.message });
      }
    };

    initializeData();
  }, [user]);

  // Set up real-time listeners when user is authenticated
  useEffect(() => {
    if (!user || !isInitialized) return;

    const unsubscribeCustomers = firebaseService.onCustomersSnapshot((customers) => {
      dispatch({ type: ACTIONS.LOAD_CUSTOMERS, payload: customers });
    });

    const unsubscribeTemplates = firebaseService.onTemplatesSnapshot((templates) => {
      dispatch({ type: ACTIONS.LOAD_TEMPLATES, payload: templates });
    });

    const unsubscribePayments = firebaseService.onPaymentsSnapshot((payments) => {
      dispatch({ type: ACTIONS.LOAD_PAYMENTS, payload: payments });
    });

    return () => {
      unsubscribeCustomers();
      unsubscribeTemplates();
      unsubscribePayments();
    };
  }, [user, isInitialized]);

  // Helper functions with Firebase integration
  const addCustomer = async (customerData) => {
    try {
      dispatch({ type: ACTIONS.SET_LOADING, payload: true });
      const newCustomer = await firebaseService.addCustomer(customerData);
      dispatch({ type: ACTIONS.ADD_CUSTOMER, payload: newCustomer });
      dispatch({ type: ACTIONS.SET_LOADING, payload: false });
      return newCustomer;
    } catch (error) {
      console.error('Error adding customer:', error);
      dispatch({ type: ACTIONS.SET_ERROR, payload: error.message });
      throw error;
    }
  };

  const updateCustomer = async (id, updates) => {
    try {
      const updatedCustomer = await firebaseService.updateCustomer(id, updates);
      dispatch({ type: ACTIONS.UPDATE_CUSTOMER, payload: updatedCustomer });
      return updatedCustomer;
    } catch (error) {
      console.error('Error updating customer:', error);
      dispatch({ type: ACTIONS.SET_ERROR, payload: error.message });
      throw error;
    }
  };

  const deleteCustomer = async (id) => {
    try {
      await firebaseService.deleteCustomer(id);
      dispatch({ type: ACTIONS.DELETE_CUSTOMER, payload: id });
    } catch (error) {
      console.error('Error deleting customer:', error);
      dispatch({ type: ACTIONS.SET_ERROR, payload: error.message });
      throw error;
    }
  };

  const toggleCustomerReminders = async (customerId, enabled) => {
    try {
      await firebaseService.updateCustomer(customerId, { remindersEnabled: enabled });
      dispatch({ type: ACTIONS.TOGGLE_CUSTOMER_REMINDERS, payload: { customerId, enabled } });
    } catch (error) {
      console.error('Error toggling customer reminders:', error);
      dispatch({ type: ACTIONS.SET_ERROR, payload: error.message });
      throw error;
    }
  };

  const addTemplate = async (templateData) => {
    try {
      dispatch({ type: ACTIONS.SET_LOADING, payload: true });
      const newTemplate = await firebaseService.addTemplate(templateData);
      dispatch({ type: ACTIONS.ADD_TEMPLATE, payload: newTemplate });
      dispatch({ type: ACTIONS.SET_LOADING, payload: false });
      return newTemplate;
    } catch (error) {
      console.error('Error adding template:', error);
      dispatch({ type: ACTIONS.SET_ERROR, payload: error.message });
      throw error;
    }
  };

  const updateTemplate = async (id, updates) => {
    try {
      const updatedTemplate = await firebaseService.updateTemplate(id, updates);
      dispatch({ type: ACTIONS.UPDATE_TEMPLATE, payload: updatedTemplate });
      return updatedTemplate;
    } catch (error) {
      console.error('Error updating template:', error);
      dispatch({ type: ACTIONS.SET_ERROR, payload: error.message });
      throw error;
    }
  };

  const deleteTemplate = async (id) => {
    try {
      await firebaseService.deleteTemplate(id);
      dispatch({ type: ACTIONS.DELETE_TEMPLATE, payload: id });
    } catch (error) {
      console.error('Error deleting template:', error);
      dispatch({ type: ACTIONS.SET_ERROR, payload: error.message });
      throw error;
    }
  };

  const duplicateTemplate = async (id) => {
    try {
      const duplicatedTemplate = await firebaseService.duplicateTemplate(id);
      dispatch({ type: ACTIONS.DUPLICATE_TEMPLATE, payload: duplicatedTemplate });
      return duplicatedTemplate;
    } catch (error) {
      console.error('Error duplicating template:', error);
      dispatch({ type: ACTIONS.SET_ERROR, payload: error.message });
      throw error;
    }
  };

  const updateSettings = async (section, data) => {
    try {
      const updatedSettings = await firebaseService.updateSettings(section, data);
      dispatch({ type: ACTIONS.UPDATE_SETTINGS, payload: { section, data } });
      return updatedSettings;
    } catch (error) {
      console.error('Error updating settings:', error);
      dispatch({ type: ACTIONS.SET_ERROR, payload: error.message });
      throw error;
    }
  };

  // Subscription functions
  const getSubscription = async () => {
    try {
      const subscription = await firebaseService.getUserSubscription();
      dispatch({ type: ACTIONS.LOAD_SUBSCRIPTION, payload: subscription });
      return subscription;
    } catch (error) {
      console.error('Error getting subscription:', error);
      dispatch({ type: ACTIONS.SET_ERROR, payload: error.message });
      throw error;
    }
  };

  const updateSubscription = async (subscriptionData) => {
    try {
      const updatedSubscription = await firebaseService.updateSubscription(subscriptionData);
      dispatch({ type: ACTIONS.UPDATE_SUBSCRIPTION, payload: subscriptionData });
      return updatedSubscription;
    } catch (error) {
      console.error('Error updating subscription:', error);
      dispatch({ type: ACTIONS.SET_ERROR, payload: error.message });
      throw error;
    }
  };

  // Create updateUserSettings as alias for updateSettings for backward compatibility
  const updateUserSettings = updateSettings;

  const addPayment = async (paymentData) => {
    try {
      dispatch({ type: ACTIONS.SET_LOADING, payload: true });
      const newPayment = await firebaseService.addPayment(paymentData);
      dispatch({ type: ACTIONS.ADD_PAYMENT, payload: newPayment });
      dispatch({ type: ACTIONS.SET_LOADING, payload: false });
      return newPayment;
    } catch (error) {
      console.error('Error adding payment:', error);
      dispatch({ type: ACTIONS.SET_ERROR, payload: error.message });
      throw error;
    }
  };

  const updatePayment = async (id, updates) => {
    try {
      const updatedPayment = await firebaseService.updatePayment(id, updates);
      dispatch({ type: ACTIONS.UPDATE_PAYMENT, payload: updatedPayment });
      return updatedPayment;
    } catch (error) {
      console.error('Error updating payment:', error);
      dispatch({ type: ACTIONS.SET_ERROR, payload: error.message });
      throw error;
    }
  };

  const deletePayment = async (id) => {
    try {
      await firebaseService.deletePayment(id);
      dispatch({ type: ACTIONS.DELETE_PAYMENT, payload: id });
    } catch (error) {
      console.error('Error deleting payment:', error);
      dispatch({ type: ACTIONS.SET_ERROR, payload: error.message });
      throw error;
    }
  };

  const exportData = async () => {
    try {
      const data = await firebaseService.exportAllData();
      const dataStr = JSON.stringify(data, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `payping-backup-${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      URL.revokeObjectURL(url);
      return data;
    } catch (error) {
      console.error('Error exporting data:', error);
      dispatch({ type: ACTIONS.SET_ERROR, payload: error.message });
      throw error;
    }
  };

  const bulkImportCustomers = async (customers) => {
    try {
      dispatch({ type: ACTIONS.SET_LOADING, payload: true });
      const result = await firebaseService.bulkImportCustomers(customers);
      // Refresh customers data
      const updatedCustomers = await firebaseService.getCustomers();
      dispatch({ type: ACTIONS.LOAD_CUSTOMERS, payload: updatedCustomers });
      dispatch({ type: ACTIONS.SET_LOADING, payload: false });
      return result;
    } catch (error) {
      console.error('Error importing customers:', error);
      dispatch({ type: ACTIONS.SET_ERROR, payload: error.message });
      throw error;
    }
  };

  const clearError = () => {
    dispatch({ type: ACTIONS.SET_ERROR, payload: null });
  };

  const value = {
    // State
    ...state,
    isInitialized,
    
    // Actions
    addCustomer,
    updateCustomer,
    deleteCustomer,
    toggleCustomerReminders,
    addTemplate,
    updateTemplate,
    deleteTemplate,
    duplicateTemplate,
    addPayment,
    updatePayment,
    deletePayment,
    updateSettings,
    updateUserSettings,
    getSubscription,
    updateSubscription,
    exportData,
    bulkImportCustomers,
    clearError
  };

  return (
    <AppDataContext.Provider value={value}>
      {children}
    </AppDataContext.Provider>
  );
}
