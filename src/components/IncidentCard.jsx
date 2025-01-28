import React from 'react';
import StatusBadge from './StatusBadge';
import { formatDate } from '../utils/dateUtils';

function IncidentCard({ incident, service, onUpdate }) {
  if (!incident) return null;

  const handleUpdateClick = (e) => {
    e.stopPropagation(); // Prevent event bubbling
    onUpdate?.(incident);
  };

  return (
    <div className="card p-6 animate-slide-up bg-dark-700 rounded-lg shadow-lg">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-medium text-primary-400">
            {incident.title || 'Untitled Incident'}
          </h3>
          {service && (
            <p className="text-sm text-gray-400 mt-1">
              Service: {service.name}
            </p>
          )}
        </div>
        <div className="flex gap-2">
          <StatusBadge status={incident.status} />
          <StatusBadge status={incident.impact} />
        </div>
      </div>

      <p className="text-gray-300 mb-4 whitespace-pre-wrap">
        {incident.description || 'No description provided'}
      </p>

      <div className="flex flex-wrap gap-4 text-sm text-gray-400">
        <span>Created: {formatDate(incident.created_at)}</span>
        {incident.resolved_at && (
          <span>Resolved: {formatDate(incident.resolved_at)}</span>
        )}
      </div>

      {onUpdate && (
        <button
          onClick={handleUpdateClick}
          className="mt-4 btn-secondary w-full"
        >
          Update Incident
        </button>
      )}
    </div>
  );
}

export default React.memo(IncidentCard); 