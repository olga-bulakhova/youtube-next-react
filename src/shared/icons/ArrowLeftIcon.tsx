import React from 'react';

interface ArrowLeftIconProps {
  className?: string;
}

export const ArrowLeftIcon = ({
  className = 'h-5 w-5',
}: ArrowLeftIconProps) => {
  return (
    <svg
      className={`${className} fill-current text-white`}
      viewBox="0 0 24 24"
      xmlns="http://w3.org"
    >
      <title>Стрелка назад</title>
      <path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z" />
    </svg>
  );
};
