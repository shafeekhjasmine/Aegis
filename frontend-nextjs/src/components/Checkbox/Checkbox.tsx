import React from 'react';

interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'className'> {
  label?: string;
  // checked, onChange, disabled, name, id are inherited
  wrapperClassName?: string; // Renamed to avoid conflict with input's className
}

const Checkbox: React.FC<CheckboxProps> = ({
  label,
  checked,
  onChange,
  disabled = false,
  name,
  id,
  wrapperClassName = '',
  ...props // Collects any other native input props like 'aria-label'
}) => {
  const checkboxId = id || name; // Ensure there's an id for the label's htmlFor

  return (
    <div className={`flex items-center ${wrapperClassName}`}>
      <input
        id={checkboxId}
        name={name}
        type="checkbox"
        checked={checked}
        onChange={onChange}
        disabled={disabled}
        className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150"
        {...props}
      />
      {label && (
        <label
          htmlFor={checkboxId}
          className={`ml-2 block text-sm text-gray-900 ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {label}
        </label>
      )}
    </div>
  );
};

export default Checkbox;
