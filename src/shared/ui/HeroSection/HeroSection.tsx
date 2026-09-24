import React from 'react';
import { APP_ROUTES } from '@/shared/constants/routes';
import { IUserCookie } from '@/app/api/auth/_storage/types';
import { Button } from '../Button';

interface HeroSectionProps {
  user: IUserCookie | null;
}

export const HeroSection = ({ user }: HeroSectionProps) => {
  return (
    <div className="relative mb-6 flex flex-col items-center justify-center overflow-hidden border-b border-zinc-800/50 px-4 py-4 md:py-10">
      <div className="pointer-events-none absolute top-1/2 left-1/2 h-[250px] w-[250px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-emerald-500/10 blur-[80px] sm:h-[400px] sm:w-[400px] sm:blur-[100px]" />
      <div className="animate-in fade-in slide-in-from-bottom-4 relative z-10 mx-auto max-w-2xl text-center duration-700 ease-out">
        <h1 className="text-2xl leading-tight font-extrabold tracking-tight text-white sm:text-4xl md:text-5xl">
          К чёрту рекомендации <br className="hidden sm:inline" />
          <span className="mt-1 block bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">
            Смотри то, что выбрал сам
          </span>
        </h1>

        <p className="mx-auto mt-4 max-w-lg text-xs leading-relaxed text-zinc-400 sm:text-sm">
          {user ? (
            <>
              Привет,{' '}
              <span className="font-medium text-emerald-400">
                {user.username}
              </span>
              ! Твой личный видео-хаб полностью активен. Добавляй новые ролики и
              управляй своей коллекцией без кликбейта и рекламы.
            </>
          ) : (
            <>
              Очисти свой фокус. Наш хаб полностью изолирует тебя от кликбейта,
              навязчивого шума и чужих трендов. Только твоя личная коллекция
              знаний и видео.
            </>
          )}
        </p>

        {!user && (
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button
              href={APP_ROUTES.AUTH.REGISTER}
              variant="success"
              className="w-full text-xs sm:w-auto"
            >
              Создать свой хаб бесплатно
            </Button>

            <Button
              href={APP_ROUTES.AUTH.LOGIN}
              variant="base"
              className="w-full bg-zinc-900/30 text-xs backdrop-blur-sm sm:w-auto"
            >
              Уже есть аккаунт? Войти
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};
