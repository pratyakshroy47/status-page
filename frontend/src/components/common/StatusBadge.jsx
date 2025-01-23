const statusConfig = {
  operational: {
    text: 'Operational',
    bgColor: 'bg-green-100',
    textColor: 'text-green-800',
  },
  degraded: {
    text: 'Degraded',
    bgColor: 'bg-yellow-100',
    textColor: 'text-yellow-800',
  },
  partial_outage: {
    text: 'Partial Outage',
    bgColor: 'bg-orange-100',
    textColor: 'text-orange-800',
  },
  major_outage: {
    text: 'Major Outage',
    bgColor: 'bg-red-100',
    textColor: 'text-red-800',
  },
};

function StatusBadge({ status }) {
  const config = statusConfig[status];
  
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${config.bgColor} ${config.textColor}`}
    >
      {config.text}
    </span>
  );
}

export default StatusBadge; 