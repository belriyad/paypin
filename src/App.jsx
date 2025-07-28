import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
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
import OnboardingWizard from './pages/OnboardingWizard';
import HelpCenter from './pages/HelpCenter';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AppDataProvider, useAppData } from './contexts/AppDataContext';
import './App.css';

function AppContent() {
  const { user, loading: authLoading } = useAuth();
  const { loading: dataLoading, error, isInitialized, clearError } = useAppData();

  // Check if user needs onboarding
  const needsOnboarding = user && isInitialized && !localStorage.getItem('payping_onboarding_complete');

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
      {!needsOnboarding && <Navbar />}
      <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/demo" element={<Demo />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          
          {/* Onboarding Route */}
          <Route path="/onboarding" element={
            <ProtectedRoute>
              <OnboardingWizard />
            </ProtectedRoute>
          } />
          
          {/* Protected Routes with Onboarding Check */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              {needsOnboarding ? <Navigate to="/onboarding" replace /> : <Dashboard />}
            </ProtectedRoute>
          } />
          <Route path="/upload-customers" element={
            <ProtectedRoute>
              {needsOnboarding ? <Navigate to="/onboarding" replace /> : <UploadCustomers />}
            </ProtectedRoute>
          } />
          <Route path="/templates" element={
            <ProtectedRoute>
              {needsOnboarding ? <Navigate to="/onboarding" replace /> : <Templates />}
            </ProtectedRoute>
          } />
          <Route path="/payments" element={
            <ProtectedRoute>
              {needsOnboarding ? <Navigate to="/onboarding" replace /> : <Payments />}
            </ProtectedRoute>
          } />
          <Route path="/settings" element={
            <ProtectedRoute>
              {needsOnboarding ? <Navigate to="/onboarding" replace /> : <Settings />}
            </ProtectedRoute>
          } />
          <Route path="/customers" element={
            <ProtectedRoute>
              {needsOnboarding ? <Navigate to="/onboarding" replace /> : <Customers />}
            </ProtectedRoute>
          } />
          <Route path="/help" element={
            <ProtectedRoute>
              {needsOnboarding ? <Navigate to="/onboarding" replace /> : <HelpCenter />}
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
