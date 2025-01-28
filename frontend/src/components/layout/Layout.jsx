import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

function Layout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await logout();
      // Redirect to home page after logout
      navigate('/', { replace: true });
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // Prevent showing login link on auth page
  const showLoginLink = !location.pathname.includes('/auth');

  return (
    <div className="min-h-screen bg-dark-800">
      <nav className="bg-dark-700 border-b border-dark-600 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link 
                to="/" 
                className="flex items-center px-2 py-2 text-primary-400 hover:text-primary-300 transition-colors duration-200"
              >
                <span className="text-xl font-semibold">Service Status</span>
              </Link>
            </div>

            <div className="flex items-center space-x-4">
              {user ? (
                <div className="flex items-center space-x-4">
                  <span className="text-gray-300">
                    {user.full_name}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="text-sm text-primary-400 hover:text-primary-300 transition-colors duration-200"
                  >
                    Logout
                  </button>
                </div>
              ) : showLoginLink && (
                <Link
                  to="/auth"
                  className="text-sm text-primary-400 hover:text-primary-300 transition-colors duration-200"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      <main className="animate-fade-in max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>

      <footer className="bg-dark-700 border-t border-dark-600 py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-400">
            © {new Date().getFullYear()} Service Status. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default Layout; 