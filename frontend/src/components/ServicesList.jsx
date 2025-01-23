import React from 'react';

function ServicesList({ services }) {
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'operational':
        return 'bg-green-100 text-green-800';
      case 'degraded':
        return 'bg-yellow-100 text-yellow-800';
      case 'partial_outage':
        return 'bg-orange-100 text-orange-800';
      case 'major_outage':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {services.map((service) => (
        <div key={service.id} className="bg-white rounded-lg shadow p-4">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="text-lg font-medium">{service.name}</h3>
              <p className="text-gray-500 text-sm">{service.description}</p>
            </div>
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                service.status
              )}`}
            >
              {service.status.replace('_', ' ')}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ServicesList; 