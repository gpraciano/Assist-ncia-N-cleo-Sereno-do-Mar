import React from 'react';

interface DatalistInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  id: string; // Used for both the input's list attribute and the datalist's id
  options: string[];
  containerClassName?: string;
}

const DatalistInput: React.FC<DatalistInputProps> = ({ label, id, options, containerClassName = '', ...props }) => {
  const inputId = props.name || id; // Ensure input has a unique id for the label
  return (
    <div className={`flex flex-col ${containerClassName}`}>
      <label htmlFor={inputId} className="mb-1.5 text-sm font-medium text-gray-300">{label}</label>
      <input
        id={inputId}
        list={id}
        className="bg-gray-700 border border-gray-600 text-white rounded-md px-3 py-2 focus:ring-2 focus:ring-sky-500 focus:outline-none transition w-full"
        {...props}
      />
      <datalist id={id}>
        {options.map((option, index) => (
          <option key={index} value={option} />
        ))}
      </datalist>
    </div>
  );
};

export default DatalistInput;
