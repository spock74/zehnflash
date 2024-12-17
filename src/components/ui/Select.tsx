import React from 'react';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: string[];
}

export const Select: React.FC<SelectProps> = ({ label, options, ...props }) => {
  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-200">
        {label}
      </label>
      <select
        {...props}
        className="w-full px-3 py-2 bg-[#383838] text-white rounded-lg 
          border border-[#484848] focus:border-[#1DB954] focus:ring-1 
          focus:ring-[#1DB954] outline-none transition-colors"
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
};
