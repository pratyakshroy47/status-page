import React from 'react';

function IncidentsList({ incidents }) {
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'investigating':
        return 'bg-yellow-100 text-yellow-800';
      case 'identified':
        return 'bg-blue-100 text-blue-800';
      case 'monitoring':
        return 'bg-purple-100 text-purple-800';
      case 'resolved':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getImpactColor = (impact) => {
    switch (impact.toLowerCase()) {
      case 'critical':
        return 'bg-red-100 text-red-800';
      case 'major':
        return 'bg-orange-100 text-orange-800';
      case 'minor':
        return 'bg-yellow-100 text-yellow-800';
      case 'none':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <div className="space-y-4">
      {incidents.length === 0 ? (
        <p className="text-gray-500 text-center py-4">No incidents reported</p>
      ) : (
        incidents.map((incident) => (
          <div key={incident.id} className="bg-white rounded-lg shadow p-4">
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-medium">{incident.title}</h3>
              <div className="flex gap-2">
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                    incident.status
                  )}`}
                >
                  {incident.status}
                </span>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${getImpactColor(
                    incident.impact
                  )}`}
                >
                  {incident.impact}
                </span>
              </div>
            </div>
            <p className="text-gray-600 mb-2">{incident.description}</p>
            <div className="text-sm text-gray-500">
              Created: {formatDate(incident.created_at)}
              {incident.resolved_at && (
                <span className="ml-4">
                  Resolved: {formatDate(incident.resolved_at)}
                </span>
              )}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

export default IncidentsList; 