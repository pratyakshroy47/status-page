import React from 'react';

export const Skeleton = ({ className = '', ...props }) => (
  <div
    className={`
      animate-pulse bg-dark-600 rounded-lg
      ${className}
    `}
    {...props}
  />
);

export const IncidentSkeleton = () => (
  <div className="bg-dark-700 rounded-lg p-6 space-y-4">
    <div className="flex justify-between">
      <div className="space-y-2">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-4 w-32" />
      </div>
      <div className="flex gap-2">
        <Skeleton className="h-6 w-20" />
        <Skeleton className="h-6 w-20" />
      </div>
    </div>
    <Skeleton className="h-20 w-full" />
    <Skeleton className="h-4 w-32" />
  </div>
);

export const ServiceSkeleton = () => (
  <div className="bg-dark-700 rounded-lg p-4 space-y-4">
    <div className="flex justify-between">
      <Skeleton className="h-6 w-32" />
      <Skeleton className="h-6 w-24" />
    </div>
    <Skeleton className="h-4 w-full" />
  </div>
); 