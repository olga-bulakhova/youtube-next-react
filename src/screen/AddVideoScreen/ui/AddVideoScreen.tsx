'use client';

import { YouTubePlayer } from '@/shared/ui/YouTubePlayer';
import { useAddVideoForm } from '../model/useAddVideoForm';
import { CATEGORIES } from '@/shared/constants';
import { FormInput, FormSelect, FormButton } from '@/shared/ui/form-controls';

export const AddVideoScreen = () => {
  const { videoId, onSubmit, handleSubmit, ...form } = useAddVideoForm();

  return (
    <div className="mx-auto max-w-lg px-4 pt-8 md:min-w-xl">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mb-6 flex flex-col gap-4"
      >
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
          placeholder="Выберите категорию..."
          options={CATEGORIES}
          error={form.errors.category?.message}
          {...form.register('category')}
        />

        <FormButton isLoading={form.isSubmitting} loadingText="Добавление...">
          Добавить видео
        </FormButton>
      </form>

      <YouTubePlayer videoId={videoId} />
    </div>
  );
};
