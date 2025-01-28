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
  const [errors, setErrors] = useState({});
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

  const validateField = (name, value) => {
    switch (name) {
      case 'email':
        if (!value.trim()) return 'Email is required';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          return 'Please enter a valid email address';
        }
        break;
      case 'password':
        if (!value.trim()) return 'Password is required';
        if (value.length < 8) {
          return 'Password must be at least 8 characters long';
        }
        if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) {
          return 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
        }
        break;
      case 'full_name':
        if (!isLogin && !value.trim()) return 'Full name is required';
        if (!isLogin && value.trim().length < 2) {
          return 'Full name must be at least 2 characters long';
        }
        break;
      case 'organization_id':
        if (!isLogin && !value) return 'Please select an organization';
        break;
    }
    return '';
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validate all fields
    const newErrors = {};
    Object.keys(formData).forEach(key => {
      if (isLogin && !['email', 'password'].includes(key)) return;
      newErrors[key] = validateField(key, formData[key]);
    });

    setErrors(newErrors);

    if (Object.values(newErrors).some(error => error)) {
      setLoading(false);
      return;
    }

    try {
      const trimmedData = {
        ...formData,
        email: formData.email.trim(),
        full_name: formData.full_name.trim(),
      };

      if (isLogin) {
        const user = await loginUser({
          email: trimmedData.email,
          password: trimmedData.password
        });
        onUserCreated(user);
      } else {
        const user = await createUser(trimmedData);
        onUserCreated(user);
      }
    } catch (err) {
      setError(err.response?.data?.detail || `Failed to ${isLogin ? 'login' : 'register'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-300">
            Email Address
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className={`input ${errors.email ? 'border-red-500' : ''}`}
            placeholder="you@example.com"
            required
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-400">{errors.email}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300">
            Password
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className={`input ${errors.password ? 'border-red-500' : ''}`}
            placeholder="••••••••"
            required
          />
          {errors.password && (
            <p className="mt-1 text-sm text-red-400">{errors.password}</p>
          )}
        </div>

        {!isLogin && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-300">
                Full Name
              </label>
              <input
                type="text"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                className={`input ${errors.full_name ? 'border-red-500' : ''}`}
                placeholder="John Doe"
                required
              />
              {errors.full_name && (
                <p className="mt-1 text-sm text-red-400">{errors.full_name}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300">
                Organization
              </label>
              <select
                name="organization_id"
                value={formData.organization_id}
                onChange={handleChange}
                className={`input ${errors.organization_id ? 'border-red-500' : ''}`}
                required
              >
                <option value="">Select an organization</option>
                {organizations.map(org => (
                  <option key={org.id} value={org.id}>
                    {org.name}
                  </option>
                ))}
              </select>
              {errors.organization_id && (
                <p className="mt-1 text-sm text-red-400">{errors.organization_id}</p>
              )}
            </div>
          </>
        )}

        {error && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading || Object.values(errors).some(error => error)}
          className="btn-primary w-full"
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
            onClick={() => {
              setIsLogin(!isLogin);
              setErrors({});
              setError(null);
            }}
            className="text-primary-400 hover:text-primary-300 text-sm font-medium transition-colors"
          >
            {isLogin ? "Don't have an account? Register" : "Already have an account? Sign in"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default UserForm; 