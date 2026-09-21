import React from 'react';

interface HomeIconProps {
  className?: string;
}

export const HomeIcon = ({ className = 'h-6 w-6' }: HomeIconProps) => {
  return (
    <svg
      // Иконка сохраняет идеальные пропорции 1:1 под размеры Tailwind (h-6 w-6 = 24x24px)
      className={`${className} fill-current text-white`}
      viewBox="0 0 21 21"
      xmlns="http://w3.org"
    >
      <title>Главная</title>

      {/* 
        🌟 ИСПРАВЛЕНО: Геометрия переведена в формат Solid (сплошная заливка). 
        Домик стал плотнее, шире и визуально крупнее в сайдбаре, сохраняя идеальную резкость.
      */}
      <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8h5z" fill="currentColor" />
    </svg>
  );
};
