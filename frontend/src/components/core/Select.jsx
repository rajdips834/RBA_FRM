import React from "react";
import { ChevronDown } from "lucide-react";

const Select = ({ label, value, onChange, name, options, className = "" }) => (
  <div className={`relative ${className}`}>
    {label && (
      <label className="block text-xs font-medium text-slate-400 mb-1">
        {label}
      </label>
    )}
    <div className="relative">
      <select
        name={name}
        value={value}
        onChange={onChange}
        className="w-full border border-slate-600 rounded-lg shadow-sm py-2 pl-3 pr-10 focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm text-slate-200 appearance-none"
        style={{ backgroundColor: "#233045" }}
      >
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
            style={{ backgroundColor: "#233045" }}
          >
            {option.label}
          </option>
        ))}
      </select>
      <ChevronDown
        size={16}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
      />
    </div>
  </div>
);

export default Select;
