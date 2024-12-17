import React from 'react';

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label: string;
}

export const TextArea: React.FC<TextAreaProps> = ({ label, ...props }) => {
  return (
    <div className="space-y-1">
      <label className="block text-sm font-medium text-gray-200">
        {label}
      </label>
      <textarea
        {...props}
        rows={4}
        className="w-full px-3 py-2 bg-[#383838] text-white rounded-lg 
          border border-[#484848] focus:border-[#1DB954] focus:ring-1 
          focus:ring-[#1DB954] outline-none transition-colors resize-none"
      />
    </div>
  );
};
