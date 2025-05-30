import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string; // e.g., 'text-blue-500'
  className?: string; // For additional custom styling on the wrapper
}

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  color = 'text-blue-600', // Default color
  className = '',
}) => {
  const sizeClasses = {
    sm: 'h-6 w-6 border-2',
    md: 'h-8 w-8 border-4',
    lg: 'h-12 w-12 border-4',
  };

  const spinnerClasses = `
    animate-spin 
    rounded-full 
    border-solid 
    border-current 
    border-r-transparent 
    align-[-0.125em] 
    motion-reduce:animate-[spin_1.5s_linear_infinite]
  `;

  return (
    <div
      className={`inline-block ${sizeClasses[size]} ${color} ${spinnerClasses} ${className}`}
      role="status"
      aria-live="polite"
      aria-label="Loading..."
    >
      <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
        Loading...
      </span>
    </div>
  );
};

export default LoadingSpinner;
