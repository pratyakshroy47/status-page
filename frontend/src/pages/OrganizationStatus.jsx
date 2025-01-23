import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getOrganization, getServicesByOrganization, getIncidents } from '../services/api';
import CreateIncidentForm from '../components/CreateIncidentForm';
import { useAuth } from '../contexts/AuthContext';
import { PlusIcon } from '@heroicons/react/24/outline';

function StatusBadge({ status, className }) {
  const statusClass = {
    'operational': 'bg-green-100 text-green-800',
    'degraded': 'bg-yellow-100 text-yellow-800',
    'partial_outage': 'bg-orange-100 text-orange-800',
    'major_outage': 'bg-red-100 text-red-800',
    'investigating': 'bg-yellow-100 text-yellow-800',
    'identified': 'bg-blue-100 text-blue-800',
    'monitoring': 'bg-purple-100 text-purple-800',
    'resolved': 'bg-green-100 text-green-800',
    'critical': 'bg-red-100 text-red-800',
    'major': 'bg-orange-100 text-orange-800',
    'minor': 'bg-yellow-100 text-yellow-800'
  }[status] || 'bg-gray-100 text-gray-800';

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusClass} ${className}`}>
      {status}
    </span>
  );
}

function OrganizationStatus() {
  const { user } = useAuth();
  const { subdomain } = useParams();
  const [organization, setOrganization] = useState(null);
  const [services, setServices] = useState([]);
  const [incidents, setIncidents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showIncidentForm, setShowIncidentForm] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const org = await getOrganization(subdomain);
        setOrganization(org);

        const [servicesData, incidentsData] = await Promise.all([
          getServicesByOrganization(org.id),
          getIncidents(org.id)
        ]);

        setServices(servicesData);
        setIncidents(incidentsData);
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

  if (loading) return <div className="text-center p-8">Loading...</div>;
  if (error) return <div className="text-red-500 text-center p-8">{error}</div>;
  if (!organization) return <div className="text-center p-8">Organization not found</div>;

  return (
    <div className="min-h-screen">
      {/* Header Section */}
      <div className="relative overflow-hidden bg-dark-800/50 border-b border-dark-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">
                <span className="gradient-text">{organization?.name}</span>
              </h1>
              <p className="mt-2 text-gray-400">{organization?.description}</p>
            </div>
            {user && (
              <button
                onClick={() => setShowIncidentForm(true)}
                className="btn-primary inline-flex items-center space-x-2"
              >
                <PlusIcon className="h-5 w-5" />
                <span>Report Incident</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Services Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <div key={service.id} className="card p-6 space-y-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-semibold text-white">{service.name}</h3>
                  <p className="text-sm text-gray-400 mt-1">{service.description}</p>
                </div>
                <StatusBadge status={service.status} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Active Incidents Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl font-bold mb-6">Active Incidents</h2>
        <div className="space-y-6">
          {incidents.filter(incident => !incident.resolved_at).map((incident) => {
            const service = services.find(s => s.id === incident.service_id);
            return (
              <div key={incident.id} className="card p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-white">{incident.title}</h3>
                    <div className="flex items-center space-x-3 mt-2">
                      <StatusBadge status={incident.status} />
                      <StatusBadge status={incident.impact} />
                      {service && (
                        <span className="text-sm text-gray-400">
                          Service: {service.name}
                        </span>
                      )}
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">
                    {new Date(incident.created_at).toLocaleString()}
                  </span>
                </div>
                <p className="text-gray-300">{incident.description}</p>
              </div>
            );
          })}
          {incidents.filter(incident => !incident.resolved_at).length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-400">No active incidents</p>
            </div>
          )}
        </div>
      </div>

      {/* Incident Creation Modal */}
      {showIncidentForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50">
          <div className="flex items-center justify-center min-h-screen p-4">
            <div className="bg-dark-800 rounded-lg shadow-xl max-w-2xl w-full">
              <CreateIncidentForm
                organizationId={organization?.id}
                services={services}
                onIncidentCreated={handleIncidentCreated}
                onClose={() => setShowIncidentForm(false)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default OrganizationStatus; 