import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import UserForm from '../components/UserForm';

function AuthPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState(null);

  const handleUserCreated = (user) => {
    login(user);
    navigate('/');
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-dark-800 to-dark-900"></div>
      
      {/* Content */}
      <div className="relative flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="text-center text-3xl font-bold">
            <span className="gradient-text">Welcome Back</span>
          </h2>
          <p className="mt-4 text-center text-lg text-gray-400">
            Monitor your services and keep your team updated
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="glass">
            <UserForm onUserCreated={handleUserCreated} />
            {error && (
              <div className="mt-4 bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AuthPage; 