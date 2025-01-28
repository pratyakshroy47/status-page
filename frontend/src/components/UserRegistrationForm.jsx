import { useState } from 'react';
import { createUser } from '../services/api';

function UserRegistrationForm({ organizationId, onUserCreated }) {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    full_name: '',
    is_active: true,
    is_superuser: false,
    organization_id: organizationId,
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const validateField = (name, value, isNewUser = true) => {
    switch (name) {
      case 'email':
        if (!value.trim()) return 'Email is required';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          return 'Please enter a valid email address';
        }
        break;
      case 'password':
        if (!value.trim()) return 'Password is required';
        // Only apply strict password rules for new users
        if (isNewUser) {
          if (value.length < 8) {
            return 'Password must be at least 8 characters long';
          }
          if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) {
            return 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
          }
        } else {
          // For existing users, just check if password is not empty
          if (value.length < 1) {
            return 'Password is required';
          }
        }
        break;
      case 'full_name':
        if (!value.trim()) return 'Full name is required';
        if (value.trim().length < 2) {
          return 'Full name must be at least 2 characters long';
        }
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
      if (!['email', 'password', 'full_name'].includes(key)) return;
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

      const user = await createUser(trimmedData);
      onUserCreated(user);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to create user');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-dark-800 rounded-lg shadow-xl">
      <h2 className="text-xl font-semibold text-white mb-6">Create New User</h2>

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

        <div className="flex items-center mt-4">
          <input
            type="checkbox"
            checked={formData.is_superuser}
            onChange={(e) => setFormData({ ...formData, is_superuser: e.target.checked })}
            className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
          />
          <label className="ml-2 block text-sm text-gray-300">
            Admin User
          </label>
        </div>

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
              Creating User...
            </span>
          ) : (
            'Create User'
          )}
        </button>
      </form>
    </div>
  );
}

export default UserRegistrationForm; 