import React from 'react';

const statusStyles = {
  active: 'bg-green-100 text-green-700',
  inactive: 'bg-gray-100 text-gray-600',
  graduated: 'bg-blue-100 text-blue-700',
  suspended: 'bg-red-100 text-red-700',
  pending: 'bg-amber-100 text-amber-700',
  admin: 'bg-primary-100 text-primary-700',
  staff: 'bg-blue-100 text-blue-700',
  student: 'bg-teal-100 text-teal-700',
};

export default function Badge({ status, children, className = '' }) {
  const key = (status || '').toString().toLowerCase();
  const style = statusStyles[key] || 'bg-gray-100 text-gray-600';
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${style} ${className}`}
    >
      {children || status || 'unknown'}
    </span>
  );
}
