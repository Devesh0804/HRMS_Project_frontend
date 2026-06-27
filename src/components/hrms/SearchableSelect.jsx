import React, { useMemo, useState } from 'react';

const SearchableSelect = ({
  label,
  name,
  value,
  onChange,
  options = [],
  required = false,
  error = '',
  disabled = false,
  placeholder = 'Search...',
  className = ''
}) => {
  const [searchText, setSearchText] = useState('');

  const selectedLabel = options.find((option) => option.value === value)?.label || '';
  const filteredOptions = useMemo(() => {
    const keyword = searchText.toLowerCase();
    return options.filter((option) => option.label.toLowerCase().includes(keyword));
  }, [options, searchText]);

  const handleSearchChange = (event) => {
    setSearchText(event.target.value);
  };

  const handleSelectChange = (event) => {
    onChange(event);
    setSearchText('');
  };

  return (
    <div className={`space-y-1 ${className}`}>
      <label htmlFor={name} className="block text-sm font-medium text-slate-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      <input
        type="text"
        value={searchText}
        onChange={handleSearchChange}
        placeholder={selectedLabel || placeholder}
        disabled={disabled}
        className={`block w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 placeholder-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500 ${error ? 'border-red-500' : ''}`}
      />
      <select
        id={name}
        name={name}
        value={value}
        onChange={handleSelectChange}
        disabled={disabled}
        className={`block w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-900 focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500 ${error ? 'border-red-500' : ''}`}
      >
        {filteredOptions.map((option, index) => (
          <option key={`${option.value}-${index}`} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
};

export default SearchableSelect;
