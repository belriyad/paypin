import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import { PageLoader, ErrorDisplay } from './components/LoadingSpinner';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import Dashboard from './pages/Dashboard';
import UploadCustomers from './pages/UploadCustomers';
import Templates from './pages/Templates';
import Payments from './pages/Payments';
import Settings from './pages/Settings';
import Demo from './pages/Demo';
import Customers from './pages/Customers';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AppDataProvider, useAppData } from './contexts/AppDataContext';
import './App.css';

function AppContent() {
  const { user, loading: authLoading } = useAuth();
  const { loading: dataLoading, error, isInitialized, clearError } = useAppData();

  // Show loading while authenticating
  if (authLoading) {
    return <PageLoader message="Authenticating..." />;
  }

  // Show loading while initializing data for authenticated users
  if (user && !isInitialized && dataLoading) {
    return <PageLoader message="Loading your data..." />;
  }

  // Show error if there's a data loading error
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <ErrorDisplay
          error={error}
          onDismiss={clearError}
        />
      </div>
    );
  }

  return (
    <Router>
      <Navbar />
      <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/demo" element={<Demo />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          
          {/* Protected Routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/upload-customers" element={
            <ProtectedRoute>
              <UploadCustomers />
            </ProtectedRoute>
          } />
          <Route path="/templates" element={
            <ProtectedRoute>
              <Templates />
            </ProtectedRoute>
          } />
          <Route path="/payments" element={
            <ProtectedRoute>
              <Payments />
            </ProtectedRoute>
          } />
          <Route path="/settings" element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          } />
          <Route path="/customers" element={
            <ProtectedRoute>
              <Customers />
            </ProtectedRoute>
          } />
        </Routes>
    </Router>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppDataProvider>
        <AppContent />
      </AppDataProvider>
    </AuthProvider>
  );
}
