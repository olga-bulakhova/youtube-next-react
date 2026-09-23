import React from 'react';

interface SearchIconProps {
  className?: string;
}

export const SearchIcon = ({ className = 'h-4 w-4' }: SearchIconProps) => {
  return (
    <svg
      xmlns="http://w3.org"
      fill="none"
      viewBox="0 0 24 24"
      strokeWidth={1.5}
      stroke="currentColor"
      className={className}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.604 10.604Z"
      />
    </svg>
  );
};
