import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import OrganizationStatus from './pages/OrganizationStatus';
import AuthPage from './pages/AuthPage';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ToastProvider } from './contexts/ToastContext';
import ErrorBoundary from './components/ErrorBoundary';

// Wrap PrivateRoute in a component that has access to router hooks
function PrivateRouteWrapper({ children }) {
  const { user } = useAuth();
  const location = useLocation();

  if (!user) {
    // Redirect to auth page but save the location they were trying to access
    return <Navigate to="/auth" state={{ from: location.pathname }} replace />;
  }

  return children;
}

function AuthRouteWrapper({ children }) {
  const { user } = useAuth();
  const location = useLocation();

  if (user) {
    return <Navigate to="/" replace />;
  }

  return children;
}

function App() {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <AuthProvider>
          <Router>
            <Layout>
              <Routes>
                <Route 
                  path="/auth" 
                  element={
                    <AuthRouteWrapper>
                      <AuthPage />
                    </AuthRouteWrapper>
                  } 
                />
                <Route path="/" element={<Home />} />
                <Route 
                  path="/:subdomain" 
                  element={
                    <PrivateRouteWrapper>
                      <OrganizationStatus />
                    </PrivateRouteWrapper>
                  } 
                />
              </Routes>
            </Layout>
          </Router>
        </AuthProvider>
      </ToastProvider>
    </ErrorBoundary>
  );
}

export default App; 