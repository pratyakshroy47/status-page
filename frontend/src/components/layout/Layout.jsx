import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

function Layout({ children }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-dark-800">
      <nav className="bg-dark-700 border-b border-dark-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
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
                  <span className="text-sm text-gray-300">
                    {user.email}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="text-sm text-red-400 hover:text-red-300 transition-colors duration-200"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                location.pathname !== '/auth' && (
                  <Link
                    to="/auth"
                    className="text-sm text-primary-400 hover:text-primary-300 transition-colors duration-200"
                  >
                    Login
                  </Link>
                )
              )}
            </div>
          </div>
        </div>
      </nav>
      <main className="animate-fade-in">
        {children}
      </main>
    </div>
  );
}

export default Layout; 