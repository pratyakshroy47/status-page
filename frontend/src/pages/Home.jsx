import { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { getOrganizations } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

function Home() {
  const { user } = useAuth();
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        const data = await getOrganizations();
        setOrganizations(data);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch organizations');
        setLoading(false);
      }
    };

    fetchOrganizations();
  }, []);

  if (loading) return <div className="flex justify-center p-8">Loading...</div>;
  if (error) return <div className="text-red-500 p-8">{error}</div>;

  return (
    <div className="min-h-screen">
      {/* Hero Section with Gradient */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-dark-800 to-dark-900"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <h1 className="text-5xl font-bold mb-6">
            <span className="gradient-text">Service Status</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mb-12">
            Monitor the status of our cloud services and stay informed about incidents and maintenance.
          </p>

          {!user && (
            <Link
              to="/auth"
              className="btn-primary inline-flex items-center space-x-2"
            >
              <span>Get Started</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          )}
        </div>
      </div>

      {/* Organizations Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {!user ? (
          <div className="text-center py-12">
            <p className="text-gray-300 text-lg mb-6">
              Please log in to view organization services.
            </p>
            <Link to="/auth" className="btn-primary">
              Login
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {organizations.map((org) => (
              <Link key={org.id} to={`/${org.subdomain}`} className="group">
                <div className="glass group-hover:border-primary-500/30 p-6">
                  <h2 className="text-xl font-semibold text-white mb-2">
                    {org.name}
                  </h2>
                  <p className="text-gray-400 mb-4">{org.description}</p>
                  <div className="flex items-center text-primary-400 group-hover:text-primary-300 transition-colors">
                    <span>View status</span>
                    <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {loading && (
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-400"></div>
        </div>
      )}
      
      {error && (
        <div className="text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg p-4 mx-auto max-w-md mt-8">
          {error}
        </div>
      )}
    </div>
  );
}

export default Home;