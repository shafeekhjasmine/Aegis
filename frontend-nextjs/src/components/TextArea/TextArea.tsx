import React from 'react';

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  // value, onChange, placeholder, disabled, name, id, rows are inherited
  // className is also inherited
}

const TextArea: React.FC<TextAreaProps> = ({
  className = '',
  rows = 3,
  ...props
}) => {
  const baseStyles =
    'block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm disabled:opacity-50 disabled:bg-gray-100 disabled:cursor-not-allowed transition-colors duration-150 resize-y'; // Added resize-y, can be resize-none or resize

  return (
    <textarea
      rows={rows}
      className={`${baseStyles} ${className}`}
      {...props}
    />
  );
};

export default TextArea;
