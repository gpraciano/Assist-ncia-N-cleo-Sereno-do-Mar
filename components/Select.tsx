
import React from 'react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  containerClassName?: string;
  children: React.ReactNode;
}

const Select: React.FC<SelectProps> = ({ label, id, containerClassName = '', children, ...props }) => {
  return (
    <div className={`flex flex-col ${containerClassName}`}>
      <label htmlFor={id} className="mb-1.5 text-sm font-medium text-gray-300">{label}</label>
      <select
        id={id}
        className="bg-gray-700 border border-gray-600 text-white rounded-md px-3 py-2 focus:ring-2 focus:ring-sky-500 focus:outline-none transition w-full"
        {...props}
      >
        {children}
      </select>
    </div>
  );
};

export default Select;
