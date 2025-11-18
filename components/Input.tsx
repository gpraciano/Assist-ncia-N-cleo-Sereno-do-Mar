
import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  containerClassName?: string;
}

const Input: React.FC<InputProps> = ({ label, id, containerClassName = '', ...props }) => {
  return (
    <div className={`flex flex-col ${containerClassName}`}>
      <label htmlFor={id} className="mb-1.5 text-sm font-medium text-gray-300">{label}</label>
      <input
        id={id}
        className="bg-gray-700 border border-gray-600 text-white rounded-md px-3 py-2 focus:ring-2 focus:ring-sky-500 focus:outline-none transition w-full"
        {...props}
      />
    </div>
  );
};

export default Input;
