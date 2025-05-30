import React from 'react';

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  // type, value, onChange, placeholder, disabled, name, id are inherited
  // className is also inherited
}

const Input: React.FC<InputProps> = ({
  type = 'text',
  className = '',
  ...props
}) => {
  const baseStyles =
    'block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm disabled:opacity-50 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors duration-150';

  return (
    <input
      type={type}
      className={`${baseStyles} ${className}`}
      {...props}
    />
  );
};

export default Input;
