function IncidentCard({ incident, services }) {
  const service = services.find(s => s.id === incident.service_id);

  return (
    <div className="card p-6 animate-slide-up">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-medium text-primary-400">{incident.title}</h3>
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
      <p className="text-gray-300 mb-4">{incident.description}</p>
      <div className="text-sm text-gray-400">
        Created: {new Date(incident.created_at).toLocaleString()}
        {incident.resolved_at && (
          <span className="ml-4">
            Resolved: {new Date(incident.resolved_at).toLocaleString()}
          </span>
        )}
      </div>
    </div>
  );
} 