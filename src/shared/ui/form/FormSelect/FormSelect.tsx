import { forwardRef, SelectHTMLAttributes } from 'react';

interface SelectOption {
  value: string;
  label: string;
}

interface FormSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options: readonly SelectOption[] | SelectOption[];
  placeholder?: string;
  error?: string;
}

export const FormSelect = forwardRef<HTMLSelectElement, FormSelectProps>(
  (
    { label, options, placeholder, error, className = '', id, ...props },
    ref,
  ) => {
    return (
      <div className="relative flex flex-col gap-1.5 pb-5">
        <label htmlFor={id} className="pl-4 text-sm font-medium text-gray-200">
          {label}
        </label>
        <select
          id={id}
          ref={ref}
          className={`h-10 w-full rounded-full border border-zinc-800 bg-zinc-900/50 px-4 pr-10 text-sm text-zinc-100 placeholder-zinc-500 transition-colors focus:border-zinc-700 focus:bg-zinc-900 focus:outline-none ${
            error
              ? 'border-red-500 focus:ring-red-500/50'
              : 'border-zinc-700 focus:border-emerald-500 focus:ring-emerald-500/50'
          } ${className}`}
          {...props}
        >
          {placeholder && (
            <option value="" disabled className="text-gray-500">
              {placeholder}
            </option>
          )}
          {options.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-zinc-900">
              {opt.label}
            </option>
          ))}
        </select>
        {error && (
          <p className="absolute top-17.5 left-0 pl-4 text-xs text-red-500">
            {error}
          </p>
        )}
      </div>
    );
  },
);

FormSelect.displayName = 'FormSelect';
