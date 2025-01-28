import React from 'react';
import StatusBadge from './StatusBadge';
import { formatDate } from '../utils/dateUtils';

function ServicesList({ services, onServiceClick }) {
  if (!services?.length) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-400">No services found</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {services.map((service) => (
        <div 
          key={service.id} 
          className="bg-dark-700 rounded-lg shadow-lg p-4 hover:bg-dark-600 transition-all duration-200 cursor-pointer"
          onClick={() => onServiceClick?.(service)}
          role="button"
          tabIndex={0}
          onKeyPress={(e) => e.key === 'Enter' && onServiceClick?.(service)}
        >
          <div className="flex justify-between items-start">
            <div className="space-y-2">
              <h3 className="text-lg font-medium text-white">{service.name}</h3>
              {service.description && (
                <p className="text-gray-400 text-sm line-clamp-2">
                  {service.description}
                </p>
              )}
            </div>
            <StatusBadge status={service.status} />
          </div>
          <div className="mt-4 text-sm text-gray-400">
            Last updated: {formatDate(service.updated_at)}
          </div>
        </div>
      ))}
    </div>
  );
}

export default ServicesList; 