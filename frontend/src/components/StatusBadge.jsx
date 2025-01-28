function StatusBadge({ status, className }) {
  const getStatusStyles = (status) => {
    const statusMap = {
      'operational': 'bg-primary-500/15 text-primary-300 border-primary-400/30',
      'degraded': 'bg-yellow-500/15 text-yellow-300 border-yellow-400/30',
      'partial_outage': 'bg-orange-500/15 text-orange-300 border-orange-400/30',
      'major_outage': 'bg-red-500/15 text-red-300 border-red-400/30',
      'investigating': 'bg-yellow-500/15 text-yellow-300 border-yellow-400/30',
      'identified': 'bg-blue-500/15 text-blue-300 border-blue-400/30',
      'monitoring': 'bg-purple-500/15 text-purple-300 border-purple-400/30',
      'resolved': 'bg-primary-500/15 text-primary-300 border-primary-400/30',
      'critical': 'bg-red-500/15 text-red-300 border-red-400/30',
      'major': 'bg-orange-500/15 text-orange-300 border-orange-400/30',
      'minor': 'bg-yellow-500/15 text-yellow-300 border-yellow-400/30'
    };

    return statusMap[status.toLowerCase()] || 'bg-gray-500/15 text-gray-300 border-gray-400/30';
  };

  return (
    <span className={`
      inline-flex items-center px-3 py-1 rounded-full text-xs font-medium
      border animate-hover shadow-sm backdrop-blur-sm
      ${getStatusStyles(status)} ${className}
    `}>
      {status.replace('_', ' ')}
    </span>
  );
}

export default StatusBadge; 