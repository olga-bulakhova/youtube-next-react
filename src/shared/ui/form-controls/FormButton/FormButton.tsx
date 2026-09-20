import React, { ButtonHTMLAttributes } from 'react';

interface FormButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading?: boolean; // Флаг отправки формы
  loadingText?: string; // Текст, который покажется во время загрузки
  children: React.ReactNode; // Основной текст кнопки
}

export const FormButton = ({
  isLoading = false,
  loadingText = 'Загрузка...',
  children,
  className = '',
  disabled,
  type = 'submit', // По умолчанию кнопка формы имеет тип submit
  ...props
}: FormButtonProps) => {
  return (
    <button
      type={type}
      // Кнопка блокируется как при ручном disabled, так и во время загрузки (isLoading)
      disabled={disabled || isLoading}
      className={`cursor-pointer rounded-lg border border-zinc-700 bg-zinc-800 px-5 py-2 font-medium text-zinc-100 transition-colors hover:bg-zinc-700 hover:text-white disabled:border-zinc-800 disabled:bg-zinc-900 disabled:text-zinc-600 ${className}`}
      {...props}
    >
      {isLoading ? loadingText : children}
    </button>
  );
};
