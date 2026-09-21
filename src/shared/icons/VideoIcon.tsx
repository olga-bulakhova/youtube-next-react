import React from 'react';

interface VideoIconProps {
  className?: string;
}

export const VideoIcon = ({ className = 'h-6 w-6' }: VideoIconProps) => {
  return (
    <svg
      // 🌟 ИСПРАВЛЕНО: Вместо fill-current используем stroke-current для контурных иконок.
      // По умолчанию задаем базовый цвет через text-white
      className={`${className} fill-none stroke-current text-white`}
      viewBox="0 0 24 24"
      id="Layer_1"
      xmlns="http://w3.org"
    >
      <title>Ваши видео</title>

      {/* 
        🌟 ИСПРАВЛЕНО: Сохранена оригинальная геометрия из линий.
        strokeWidth подогнан под стандарты, а strokeLinecap гарантирует аккуратные стыки.
      */}
      <rect
        x="1.5"
        y="10.09"
        width="15.27"
        height="11.45"
        strokeWidth="2"
        strokeMiterlimit="10"
      />
      <polygon
        points="16.77 14.86 21.55 10.09 22.5 10.09 22.5 21.55 21.55 21.55 16.77 16.77 16.77 14.86"
        strokeWidth="2"
        strokeMiterlimit="10"
        strokeLinejoin="round"
      />
      <circle
        cx="5.32"
        cy="6.27"
        r="3.82"
        strokeWidth="2"
        strokeMiterlimit="10"
      />
      <circle
        cx="12.95"
        cy="6.27"
        r="3.82"
        strokeWidth="2"
        strokeMiterlimit="10"
      />
    </svg>
  );
};
