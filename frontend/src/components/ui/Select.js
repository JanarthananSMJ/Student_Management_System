import React, { useRef } from 'react';

export default function Select({
  label,
  error,
  children,
  className = '',
  containerClassName = '',
  placeholder,
  id,
  ...rest
}) {
  const generatedId = useRef(`select-${Math.random().toString(36).slice(2, 9)}`);
  const selectId = id || generatedId.current;
  return (
    <div className={`flex flex-col gap-1 ${containerClassName}`}>
      {label && (
        <label htmlFor={selectId} className="text-sm font-medium text-gray-700">
          {label}
        </label>
      )}
      <select
        id={selectId}
        className={`w-full rounded-lg border bg-white px-3 py-2 text-sm text-gray-900 outline-none transition-colors focus:border-primary-500 focus:ring-2 focus:ring-primary-100 ${
          error ? 'border-red-400' : 'border-gray-300'
        } ${className}`}
        {...rest}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {children}
      </select>
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
}
