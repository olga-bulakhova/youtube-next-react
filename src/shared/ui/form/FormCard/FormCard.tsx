import React from 'react';

interface FormCardProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
  className?: string;
  maxWidthClassName?: string;
}

export const FormCard = ({
  children,
  title,
  subtitle,
  className = '',
  maxWidthClassName = 'max-w-md',
}: FormCardProps) => {
  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <div
        className={`w-full ${maxWidthClassName} rounded-2xl border border-zinc-800 bg-zinc-900/50 p-4 shadow-xl backdrop-blur-sm md:p-8`}
      >
        <div className="mb-6 text-center">
          <h1 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
            {title}
          </h1>
          {subtitle && <p className="mt-1 text-sm text-zinc-400">{subtitle}</p>}
        </div>

        {children}
      </div>
    </div>
  );
};
