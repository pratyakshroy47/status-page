import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Organizations
export const getOrganizations = async () => {
  const response = await api.get('/organizations');
  return response.data;
};

export const getOrganization = async (subdomain) => {
  const response = await api.get(`/organizations/${subdomain}`);
  return response.data;
};

// Services
export const getServicesByOrganization = async (organizationId) => {
  const response = await api.get(`/services/organization/${organizationId}/services`);
  return response.data;
};

export const getServiceStatusSummary = async (organizationId) => {
  const response = await api.get(`/services/organization/${organizationId}/status/summary`);
  return response.data;
};

// Incidents
export const getIncidents = async (organizationId) => {
  const response = await api.get(`/incidents/organization/${organizationId}`);
  return response.data;
};

export const createTestUser = async (organizationId) => {
  try {
    const response = await api.post('/users/test-user', {
      organization_id: organizationId
    });
    return response.data;
  } catch (error) {
    console.error('Create test user error:', error);
    throw error;
  }
};

export const createIncident = async (incidentData) => {
  try {
    const response = await api.post('/incidents/', {
      ...incidentData,
      service_id: incidentData.service_id,
      organization_id: incidentData.organization_id,
      status: incidentData.status.toUpperCase(),
      impact: incidentData.impact.toUpperCase(),
    });
    return response.data;
  } catch (error) {
    console.error('Create incident error:', error.response?.data);
    throw error;
  }
};

export const getActiveIncidents = async () => {
  const response = await api.get('/incidents/active');
  return response.data;
};

// Incident Updates
export const getIncidentUpdates = async (incidentId) => {
  const response = await api.get(`/incident-updates/incident/${incidentId}`);
  return response.data;
};

export const createIncidentUpdate = async (updateData) => {
  const response = await api.post('/incident-updates', updateData);
  return response.data;
};

// Users
export const createUser = async (userData) => {
  try {
    const response = await api.post('/users/', userData);
    return response.data;
  } catch (error) {
    console.error('Create user error:', error.response?.data);
    throw error;
  }
};

export const getUsers = async (organizationId) => {
  try {
    const response = await api.get(`/users/organization/${organizationId}`);
    return response.data;
  } catch (error) {
    console.error('Get users error:', error);
    throw error;
  }
};

export const getUserByEmail = async (email) => {
  try {
    const response = await api.get(`/users/email/${email}`);
    return response.data;
  } catch (error) {
    if (error.response?.status !== 404) {
      console.error('Get user by email error:', error);
    }
    return null;
  }
};

// Auth
export const loginUser = async (credentials) => {
  try {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  } catch (error) {
    console.error('Login error:', error.response?.data);
    throw error;
  }
};

export const getCurrentUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

export const logout = () => {
  localStorage.removeItem('user');
};

export default api; 