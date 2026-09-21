import React, { forwardRef, InputHTMLAttributes } from 'react';

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  ({ label, error, type = 'text', className = '', id, ...props }, ref) => {
    return (
      <div className="relative flex flex-col gap-1.5 pb-5">
        <label htmlFor={id} className="text-sm font-medium text-gray-200">
          {label}
        </label>
        <input
          id={id}
          ref={ref}
          autoComplete="off"
          type={type}
          // 🟢 ИСПРАВЛЕНО: Заменили focus:ring-blue-500/50 на focus:ring-emerald-500/50 и добавили плавное изменение рамки focus:border-emerald-500
          className={`rounded-lg border bg-zinc-900 p-2 text-white placeholder-gray-500 transition-all focus:ring-2 focus:outline-none ${
            error
              ? 'border-red-500 focus:ring-red-500/50'
              : 'border-zinc-700 focus:border-emerald-500 focus:ring-emerald-500/50'
          } ${className}`}
          {...props}
        />
        {error && (
          <p className="absolute top-17.5 left-0 text-xs text-red-500">
            {error}
          </p>
        )}
      </div>
    );
  },
);

FormInput.displayName = 'FormInput';
