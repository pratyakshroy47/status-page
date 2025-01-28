import { useState, useEffect } from 'react';
import { createIncident, getServicesByOrganization } from '../services/api';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useAuth } from '../contexts/AuthContext';

function CreateIncidentForm({ organizationId, services, onIncidentCreated, onClose }) {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    service_id: '',
    status: 'INVESTIGATING',
    impact: 'MINOR',
    organization_id: organizationId,
    created_by_id: user?.id
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const validateField = (name, value) => {
    if (!value || value.trim() === '') {
      return `${name.charAt(0).toUpperCase() + name.slice(1)} cannot be empty`;
    }
    if (value.trim().length < 3) {
      return `${name.charAt(0).toUpperCase() + name.slice(1)} must be at least 3 characters`;
    }
    return '';
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Validate on change for text fields
    if (['title', 'description'].includes(name)) {
      const error = validateField(name, value);
      setErrors(prev => ({
        ...prev,
        [name]: error
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Validate all fields before submission
    const newErrors = {
      title: validateField('title', formData.title),
      description: validateField('description', formData.description),
      service_id: !formData.service_id ? 'Please select a service' : ''
    };

    setErrors(newErrors);

    // Check if there are any errors
    if (Object.values(newErrors).some(error => error !== '')) {
      setLoading(false);
      return;
    }

    // Trim whitespace from text fields
    const trimmedData = {
      ...formData,
      title: formData.title.trim(),
      description: formData.description.trim()
    };

    try {
      await createIncident(trimmedData);
      onIncidentCreated();
      onClose();
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to create incident');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-white">Report New Incident</h2>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-gray-300 transition-colors"
        >
          <XMarkIcon className="h-6 w-6" />
        </button>
      </div>

      {error && (
        <div className="mb-4 bg-red-500/10 border border-red-500/20 rounded-lg p-4">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-300">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className={`input ${errors.title ? 'border-red-500' : ''}`}
            required
          />
          {errors.title && (
            <p className="mt-1 text-sm text-red-400">{errors.title}</p>
          )}
        </div>
                  
        <div>
          <label className="block text-sm font-medium text-gray-300">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className={`input mt-1 ${errors.description ? 'border-red-500' : ''}`}
            rows={4}
            required
          />
          {errors.description && (
            <p className="mt-1 text-sm text-red-400">{errors.description}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300">Service</label>
          <select
            name="service_id"
            value={formData.service_id}
            onChange={handleChange}
            className={`input ${errors.service_id ? 'border-red-500' : ''}`}
            required
          >
            <option value="">Select a service</option>
            {services.map((service) => (
              <option key={service.id} value={service.id}>
                {service.name}
              </option>
            ))}
          </select>
          {errors.service_id && (
            <p className="mt-1 text-sm text-red-400">{errors.service_id}</p>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300">Status</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="input mt-1"
            >
              <option value="INVESTIGATING">Investigating</option>
              <option value="IDENTIFIED">Identified</option>
              <option value="MONITORING">Monitoring</option>
              <option value="RESOLVED">Resolved</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300">Impact</label>
            <select
              name="impact"
              value={formData.impact}
              onChange={handleChange}
              className="input mt-1"
            >
              <option value="MINOR">Minor</option>
              <option value="MAJOR">Major</option>
              <option value="CRITICAL">Critical</option>
            </select>
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={onClose}
            className="btn-secondary"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading || Object.values(errors).some(error => error !== '')}
            className="btn-primary"
          >
            {loading ? 'Creating...' : 'Create Incident'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default CreateIncidentForm; 