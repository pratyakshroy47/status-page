import { useState, useEffect } from 'react';
import { createUser, loginUser, getOrganizations } from '../services/api';

function UserForm({ onUserCreated }) {
  const [isLogin, setIsLogin] = useState(true);
  const [organizations, setOrganizations] = useState([]);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    full_name: '',
    organization_id: '',
    is_active: true,
    is_superuser: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch organizations when component mounts
  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        const data = await getOrganizations();
        setOrganizations(data);
        if (data.length > 0) {
          // Set default organization
          setFormData(prev => ({
            ...prev,
            organization_id: data[0].id
          }));
        }
      } catch (err) {
        console.error('Failed to fetch organizations:', err);
        setError('Failed to load organizations');
      }
    };

    fetchOrganizations();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      let user;
      if (isLogin) {
        // Login with credentials
        user = await loginUser({
          email: formData.email,
          password: formData.password
        });
      } else {
        // Create new user
        if (!formData.organization_id) {
          setError('Please select an organization');
          return;
        }
        user = await createUser(formData);
      }

      if (onUserCreated) {
        onUserCreated(user);
      }
    } catch (err) {
      console.error('Error:', err);
      if (err.response?.status === 401) {
        setError('Invalid email or password');
      } else {
        setError(err.response?.data?.detail || `Failed to ${isLogin ? 'login' : 'register'}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-form">
      <div className="mb-6 text-center">
        <h2 className="text-2xl font-bold text-white mb-2">
          {isLogin ? 'Welcome Back' : 'Create Account'}
        </h2>
        <p className="text-gray-400">
          {isLogin ? 'Sign in to your account' : 'Register a new account'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="auth-input-wrapper">
          <label htmlFor="email" className="form-label">
            Email address
          </label>
          <input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="input"
            placeholder="Enter your email"
            required
          />
        </div>

        <div className="auth-input-wrapper">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className="input"
            placeholder="Enter your password"
            required
          />
        </div>

        {!isLogin && (
          <>
            <div className="auth-input-wrapper">
              <label htmlFor="fullName" className="form-label">
                Full Name
              </label>
              <input
                id="fullName"
                type="text"
                value={formData.full_name}
                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                className="input"
                placeholder="Enter your full name"
                required
              />
            </div>

            <div className="auth-input-wrapper">
              <label htmlFor="organization" className="form-label">
                Organization
              </label>
              <select
                id="organization"
                value={formData.organization_id}
                onChange={(e) => setFormData({ ...formData, organization_id: e.target.value })}
                className="input"
                required
              >
                <option value="">Select an organization</option>
                {organizations.map((org) => (
                  <option key={org.id} value={org.id}>
                    {org.name}
                  </option>
                ))}
              </select>
            </div>
          </>
        )}

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="auth-button"
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </span>
          ) : (
            isLogin ? 'Sign in' : 'Create Account'
          )}
        </button>

        <div className="text-center">
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            className="text-primary-400 hover:text-primary-300 text-sm font-medium transition-colors"
          >
            {isLogin ? "Don't have an account? Register" : "Already have an account? Sign in"}
          </button>
        </div>

        {/* Add social login buttons if needed */}
      </form>
    </div>
  );
}

export default UserForm; 