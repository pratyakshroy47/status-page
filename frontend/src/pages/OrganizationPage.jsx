import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getOrganization, getUsers, getServicesByOrganization, getIncidents } from '../services/api';
import UserRegistrationForm from '../components/UserRegistrationForm';
import CreateIncidentForm from '../components/CreateIncidentForm';
import ServicesList from '../components/ServicesList';
import IncidentsList from '../components/IncidentsList';

function OrganizationPage() {
  const { subdomain } = useParams();
  const [organization, setOrganization] = useState(null);
  const [services, setServices] = useState([]);
  const [incidents, setIncidents] = useState([]);
  const [users, setUsers] = useState([]);
  const [showUserForm, setShowUserForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Get organization details
        const org = await getOrganization(subdomain);
        setOrganization(org);

        // Get services, incidents, and users
        const [servicesData, incidentsData, usersData] = await Promise.all([
          getServicesByOrganization(org.id),
          getIncidents(org.id),
          getUsers(org.id)
        ]);

        setServices(servicesData);
        setIncidents(incidentsData);
        setUsers(usersData);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load organization data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [subdomain]);

  const handleIncidentCreated = async () => {
    if (organization) {
      const updatedIncidents = await getIncidents(organization.id);
      setIncidents(updatedIncidents);
    }
  };

  const handleUserCreated = async () => {
    if (organization) {
      const updatedUsers = await getUsers(organization.id);
      setUsers(updatedUsers);
      setShowUserForm(false);
    }
  };

  if (loading) return <div className="text-center p-8">Loading...</div>;
  if (error) return <div className="text-red-500 text-center p-8">{error}</div>;
  if (!organization) return <div className="text-center p-8">Organization not found</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Organization Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">{organization.name}</h1>
        <p className="text-gray-600">{organization.description}</p>
      </div>

      {/* Services Section */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Services</h2>
        <ServicesList services={services} />
      </div>

      {/* Create Incident Form */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Report an Incident</h2>
        <CreateIncidentForm
          organizationId={organization.id}
          onIncidentCreated={handleIncidentCreated}
        />
      </div>

      {/* Incidents List */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4">Recent Incidents</h2>
        <IncidentsList incidents={incidents} />
      </div>

      {/* Users Section */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Users</h2>
          <button
            onClick={() => setShowUserForm(!showUserForm)}
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
          >
            {showUserForm ? 'Cancel' : 'Add User'}
          </button>
        </div>

        {showUserForm && (
          <UserRegistrationForm
            organizationId={organization.id}
            onUserCreated={handleUserCreated}
          />
        )}

        <div className="grid gap-4 mt-4">
          {users.map(user => (
            <div key={user.id} className="bg-white p-4 rounded shadow">
              <div className="font-medium">{user.full_name}</div>
              <div className="text-gray-600">{user.email}</div>
              <div className="text-sm text-gray-500">
                {user.is_superuser ? 'Admin' : 'User'}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default OrganizationPage; 