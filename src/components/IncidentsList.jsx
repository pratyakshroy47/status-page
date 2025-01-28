import React from 'react';
import StatusBadge from './StatusBadge';
import { formatDate } from '../utils/dateUtils';

function IncidentsList({ incidents, services, isLoading, error }) {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-400"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-400">{error}</p>
      </div>
    );
  }

  if (!incidents?.length) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-400">No incidents reported</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {incidents.map((incident) => {
        const service = services?.find(s => s.id === incident.service_id);
        
        return (
          <div key={incident.id} className="bg-dark-700 rounded-lg shadow-lg p-6 space-y-4">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <h3 className="text-lg font-medium text-white">{incident.title}</h3>
                {service && (
                  <p className="text-sm text-gray-400">
                    Service: {service.name}
                  </p>
                )}
              </div>
              <div className="flex gap-2">
                <StatusBadge status={incident.status} />
                <StatusBadge status={incident.impact} />
              </div>
            </div>

            <p className="text-gray-300 whitespace-pre-wrap">
              {incident.description}
            </p>

            <div className="flex flex-wrap gap-4 text-sm text-gray-400">
              <span>Created: {formatDate(incident.created_at)}</span>
              {incident.resolved_at && (
                <span>Resolved: {formatDate(incident.resolved_at)}</span>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default IncidentsList; 