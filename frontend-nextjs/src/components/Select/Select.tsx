import React from 'react';

interface SelectOption {
  value: string | number;
  label: string;
}

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  options: SelectOption[];
  // value, onChange, placeholder, disabled, name, id are inherited
  // className is also inherited
}

const Select: React.FC<SelectProps> = ({
  options,
  placeholder,
  className = '',
  ...props
}) => {
  const baseStyles =
    'block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm disabled:opacity-50 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors duration-150';

  return (
    <select
      className={`${baseStyles} ${className}`}
      {...props}
    >
      {placeholder && (
        <option value="" disabled selected>
          {placeholder}
        </option>
      )}
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  );
};

export default Select;
