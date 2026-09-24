'use client';

import { YouTubePlayer } from '@/shared/ui/YouTubePlayer';
import { useAddVideoForm } from '../model/useAddVideoForm';
import { APP_ROUTES, CATEGORIES } from '@/shared/constants';
import { FormInput, FormSelect, FormCard } from '@/shared/ui/form';
import { Button } from '@/shared/ui/Button';
import { ArrowLeftIcon } from '@/shared/icons';
import Link from 'next/link';

export const AddVideoScreen = () => {
  const { videoId, onSubmit, handleSubmit, ...form } = useAddVideoForm();

  return (
    <>
      <Link
        href={APP_ROUTES.MY_VIDEOS}
        className="group flex w-fit cursor-pointer items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium text-zinc-400 transition-colors hover:text-white focus:outline-none"
      >
        <ArrowLeftIcon className="h-5 w-5 transition-transform duration-200 group-hover:-translate-x-0.5" />
        <span>Мои видео</span>
      </Link>
      <FormCard
        title="Добавить новое видео"
        subtitle="Вставьте ссылку с YouTube и выберите подходящий раздел"
        maxWidthClassName="max-w-xl"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-1">
          <FormInput
            id="videoUrl"
            label="Ссылка на видео"
            placeholder="https://youtube.com..."
            error={form.errors.videoUrl?.message}
            {...form.register('videoUrl')}
          />

          <FormSelect
            id="category"
            label="Категория видео"
            placeholder="Выберите категория..."
            options={CATEGORIES}
            error={form.errors.category?.message}
            {...form.register('category')}
          />

          <div className="mt-2">
            <Button
              isLoading={form.isSubmitting}
              loadingText="Добавление..."
              type="submit"
              className="w-full"
            >
              Добавить видео
            </Button>
          </div>
        </form>

        {videoId && (
          <div className="animate-in fade-in mt-6 border-t border-zinc-800/80 pt-6 duration-300">
            <p className="mb-3 text-center text-xs font-medium text-emerald-400">
              🎉 Видео успешно распознано и готово к просмотру!
            </p>
            <YouTubePlayer videoId={videoId} />
          </div>
        )}
      </FormCard>
    </>
  );
};
