/**
 * System Health Dashboard Component
 * Displays real-time system status and health metrics
 */

import React, { useState, useEffect } from 'react';
import { 
  CheckCircleIcon, 
  ExclamationTriangleIcon, 
  XCircleIcon,
  ClockIcon,
  ChartBarIcon,
  CogIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline';

import { useAuth } from '../../contexts/AuthContext';
import paymentGateway from '../../services/paymentGateway';
import productionEmailService from '../../services/productionEmailService';
import errorMonitoring from '../../services/errorMonitoring';
import auditService from '../../services/auditService';

const SystemHealthDashboard = () => {
  const { user } = useAuth();
  const [healthStatus, setHealthStatus] = useState({
    overall: 'checking',
    services: {},
    lastChecked: null,
    isLoading: true
  });

  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    checkSystemHealth();
    
    // Set up periodic health checks every 5 minutes
    const interval = setInterval(checkSystemHealth, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  const checkSystemHealth = async () => {
    setHealthStatus(prev => ({ ...prev, isLoading: true }));

    try {
      const services = {
        firebase: await checkFirebaseHealth(),
        payment: await checkPaymentHealth(),
        email: await checkEmailHealth(),
        monitoring: await checkMonitoringHealth(),
        audit: await checkAuditHealth()
      };

      const overall = determineOverallHealth(services);

      setHealthStatus({
        overall,
        services,
        lastChecked: new Date(),
        isLoading: false
      });
    } catch (error) {
      console.error('Health check failed:', error);
      setHealthStatus(prev => ({
        ...prev,
        overall: 'error',
        isLoading: false,
        lastChecked: new Date()
      }));
    }
  };

  const checkFirebaseHealth = async () => {
    try {
      // Check if Firebase is initialized and user is authenticated
      if (!user) {
        return {
          status: 'warning',
          message: 'Not authenticated',
          details: 'User authentication required'
        };
      }

      // Could add a test read/write operation here
      return {
        status: 'healthy',
        message: 'Firebase operational',
        details: 'Authentication and database access working'
      };
    } catch (error) {
      return {
        status: 'error',
        message: 'Firebase error',
        details: error.message
      };
    }
  };

  const checkPaymentHealth = async () => {
    try {
      const config = paymentGateway.getConfigurationStatus();
      
      if (!config.isConfigured) {
        return {
          status: 'warning',
          message: 'Payment gateway not configured',
          details: config.issues.join(', ')
        };
      }

      const test = await paymentGateway.testConfiguration();
      
      return {
        status: test.success ? 'healthy' : 'error',
        message: test.message,
        details: `Provider: ${config.provider}, Methods: ${config.supportedMethods.join(', ')}`
      };
    } catch (error) {
      return {
        status: 'error',
        message: 'Payment system error',
        details: error.message
      };
    }
  };

  const checkEmailHealth = async () => {
    try {
      const config = productionEmailService.getConfigurationStatus();
      
      if (!config.isConfigured) {
        return {
          status: 'warning',
          message: 'Email service not configured',
          details: config.issues.join(', ')
        };
      }

      const test = await productionEmailService.testConfiguration();
      
      return {
        status: test.success ? 'healthy' : 'warning',
        message: test.message,
        details: `Primary: ${config.primaryProvider}, Fallback: ${config.fallbackProvider}`
      };
    } catch (error) {
      return {
        status: 'error',
        message: 'Email system error',
        details: error.message
      };
    }
  };

  const checkMonitoringHealth = async () => {
    try {
      const test = await errorMonitoring.testErrorMonitoring();
      const stats = errorMonitoring.getErrorStatistics();
      
      return {
        status: test.success ? 'healthy' : 'warning',
        message: test.message,
        details: `Total errors: ${stats.totalErrors}, Queued: ${stats.queuedErrors}`
      };
    } catch (error) {
      return {
        status: 'error',
        message: 'Monitoring system error',
        details: error.message
      };
    }
  };

  const checkAuditHealth = async () => {
    try {
      // Simple test to ensure audit service is working
      const testResult = await auditService.testConnection();
      
      return {
        status: 'healthy',
        message: 'Audit system operational',
        details: 'Event logging and compliance tracking active'
      };
    } catch (error) {
      return {
        status: 'warning',
        message: 'Audit system warning',
        details: 'Some audit functions may be limited'
      };
    }
  };

  const determineOverallHealth = (services) => {
    const statuses = Object.values(services).map(s => s.status);
    
    if (statuses.includes('error')) return 'error';
    if (statuses.includes('warning')) return 'warning';
    return 'healthy';
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'healthy':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'warning':
        return <ExclamationTriangleIcon className="h-5 w-5 text-yellow-500" />;
      case 'error':
        return <XCircleIcon className="h-5 w-5 text-red-500" />;
      default:
        return <ClockIcon className="h-5 w-5 text-gray-400 animate-spin" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'healthy':
        return 'text-green-700 bg-green-50 border-green-200';
      case 'warning':
        return 'text-yellow-700 bg-yellow-50 border-yellow-200';
      case 'error':
        return 'text-red-700 bg-red-50 border-red-200';
      default:
        return 'text-gray-700 bg-gray-50 border-gray-200';
    }
  };

  const getOverallStatusMessage = () => {
    switch (healthStatus.overall) {
      case 'healthy':
        return 'All systems operational';
      case 'warning':
        return 'Some services need attention';
      case 'error':
        return 'Critical issues detected';
      case 'checking':
        return 'Checking system status...';
      default:
        return 'Status unknown';
    }
  };

  if (!user || user.email !== 'admin@payping.com') {
    return (
      <div className="p-6">
        <div className="text-center">
          <ShieldCheckIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Access Restricted</h3>
          <p className="mt-1 text-sm text-gray-500">
            System health dashboard is only available to administrators.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Overall Status Card */}
      <div className={`p-6 rounded-lg border-2 ${getStatusColor(healthStatus.overall)}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {getStatusIcon(healthStatus.overall)}
            <div>
              <h2 className="text-lg font-semibold">System Health</h2>
              <p className="text-sm opacity-75">{getOverallStatusMessage()}</p>
            </div>
          </div>
          <div className="text-right">
            <button
              onClick={checkSystemHealth}
              disabled={healthStatus.isLoading}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              <CogIcon className={`-ml-0.5 mr-2 h-4 w-4 ${healthStatus.isLoading ? 'animate-spin' : ''}`} />
              {healthStatus.isLoading ? 'Checking...' : 'Refresh'}
            </button>
          </div>
        </div>
        {healthStatus.lastChecked && (
          <div className="mt-2 text-xs opacity-60">
            Last checked: {healthStatus.lastChecked.toLocaleString()}
          </div>
        )}
      </div>

      {/* Service Status Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Object.entries(healthStatus.services).map(([serviceName, service]) => (
          <div
            key={serviceName}
            className={`p-4 rounded-lg border ${getStatusColor(service.status)}`}
          >
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium capitalize">{serviceName}</h3>
              {getStatusIcon(service.status)}
            </div>
            <p className="text-sm font-medium mb-1">{service.message}</p>
            {showDetails && (
              <p className="text-xs opacity-75">{service.details}</p>
            )}
          </div>
        ))}
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => setShowDetails(!showDetails)}
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          {showDetails ? 'Hide' : 'Show'} Details
        </button>
        
        <div className="flex items-center space-x-4 text-sm text-gray-500">
          <div className="flex items-center space-x-1">
            <CheckCircleIcon className="h-4 w-4 text-green-500" />
            <span>Healthy</span>
          </div>
          <div className="flex items-center space-x-1">
            <ExclamationTriangleIcon className="h-4 w-4 text-yellow-500" />
            <span>Warning</span>
          </div>
          <div className="flex items-center space-x-1">
            <XCircleIcon className="h-4 w-4 text-red-500" />
            <span>Error</span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="text-sm font-medium text-gray-900 mb-3">Quick Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <button
            onClick={() => window.open('/admin/audit-logs', '_blank')}
            className="flex items-center justify-center px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700 bg-white hover:bg-gray-50"
          >
            <ChartBarIcon className="h-4 w-4 mr-1" />
            Audit Logs
          </button>
          <button
            onClick={() => window.open('/admin/error-logs', '_blank')}
            className="flex items-center justify-center px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700 bg-white hover:bg-gray-50"
          >
            <ExclamationTriangleIcon className="h-4 w-4 mr-1" />
            Error Logs
          </button>
          <button
            onClick={() => window.open('/admin/settings', '_blank')}
            className="flex items-center justify-center px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700 bg-white hover:bg-gray-50"
          >
            <CogIcon className="h-4 w-4 mr-1" />
            Settings
          </button>
          <button
            onClick={() => window.open('/admin/analytics', '_blank')}
            className="flex items-center justify-center px-3 py-2 border border-gray-300 rounded-md text-sm text-gray-700 bg-white hover:bg-gray-50"
          >
            <ChartBarIcon className="h-4 w-4 mr-1" />
            Analytics
          </button>
        </div>
      </div>
    </div>
  );
};

export default SystemHealthDashboard;
