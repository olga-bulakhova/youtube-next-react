import React, { ButtonHTMLAttributes } from 'react';
import { Button } from '@/shared/ui/Button';

interface FormButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean;
  loadingText?: string;
  children: React.ReactNode;
}

export const FormButton = ({
  isLoading = false,
  loadingText = 'Загрузка...',
  children,
  className = '',
  type = 'submit',
  ...props
}: FormButtonProps) => {
  return (
    <Button
      type={type}
      isLoading={isLoading}
      loadingText={loadingText}
      className={`min-w-34 px-5 py-2 ${className}`}
      {...props}
    >
      {children}
    </Button>
  );
};
