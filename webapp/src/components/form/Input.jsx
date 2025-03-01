import React from 'react';

const Input = ({ 
  label, 
  error, 
  name, 
  type = 'text',
  required = false,
  ...props 
}) => {
  const inputClasses = `
    w-full px-4 py-2 rounded border
    ${error 
      ? 'border-red-500 focus:ring-red-500' 
      : 'border-gray-300 focus:ring-blue-500'
    }
    focus:outline-none focus:ring-2 transition-colors
  `;

  return (
    <div className="mb-4">
      {label && (
        <label htmlFor={name} className="block mb-2 text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        id={name}
        name={name}
        type={type}
        className={inputClasses}
        aria-invalid={error ? 'true' : 'false'}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-500" role="alert" data-test-id={`${name}-error`}>
          {error}
        </p>
      )}
    </div>
  );
};

export default React.memo(Input);