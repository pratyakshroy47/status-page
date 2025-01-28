const statusConfig = {
  operational: {
    text: 'Operational',
    bgColor: 'bg-green-50',
    textColor: 'text-green-700',
    borderColor: 'border-green-200',
  },
  degraded: {
    text: 'Degraded',
    bgColor: 'bg-yellow-50',
    textColor: 'text-yellow-700',
    borderColor: 'border-yellow-200',
  },
  partial_outage: {
    text: 'Partial Outage',
    bgColor: 'bg-orange-50',
    textColor: 'text-orange-700',
    borderColor: 'border-orange-200',
  },
  major_outage: {
    text: 'Major Outage',
    bgColor: 'bg-red-50',
    textColor: 'text-red-700',
    borderColor: 'border-red-200',
  },
};

function StatusBadge({ status }) {
  const config = statusConfig[status];
  
  return (
    <span
      className={`
        inline-flex items-center px-3 py-1 rounded-full text-sm font-medium
        border ${config.borderColor} ${config.bgColor} ${config.textColor}
      `}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.textColor.replace('text', 'bg')} mr-2`}></span>
      {config.text}
    </span>
  );
}

export default StatusBadge;