'use client';

import { YouTubePlayer } from '@/shared/ui/YouTubePlayer';
import { useAddVideoForm } from '../model/useAddVideoForm';

export const CATEGORIES = [
  { value: 'music', label: 'Музыка' },
  { value: 'gaming', label: 'Видеоигры' },
  { value: 'education', label: 'Образование' },
  { value: 'blogs', label: 'Блоги' },
  { value: 'tech', label: 'Технологии и IT' },
  { value: 'comedy', label: 'Юмор' },
  { value: 'science', label: 'Наука' },
  { value: 'sports', label: 'Спорт' },
];

export const AddVideoScreen = () => {
  const { videoId, onSubmit, handleSubmit, ...form } = useAddVideoForm();

  console.log(videoId);

  return (
    <div className="mx-auto max-w-xl px-4 pt-8">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="mb-6 flex flex-col gap-4"
      >
        <div className="relative flex flex-col gap-1.5 pb-5">
          <label
            htmlFor="videoUrl"
            className="text-sm font-medium text-gray-200"
          >
            Ссылка на видео
          </label>
          <input
            id="videoUrl"
            type="text"
            autoComplete="off"
            placeholder="https://youtube.com..."
            className={`rounded-lg border bg-zinc-900 p-2 text-white placeholder-gray-500 focus:ring-2 focus:outline-none ${
              form.errors.videoUrl
                ? 'border-red-500 focus:ring-red-500/50'
                : 'border-zinc-700 focus:ring-blue-500/50'
            }`}
            {...form.register('videoUrl')}
          />

          {form.errors.videoUrl && (
            <p className="absolute bottom-0 left-0 text-xs text-red-500">
              {form.errors.videoUrl.message}
            </p>
          )}
        </div>

        <div className="relative flex flex-col gap-1.5 pb-5">
          <label
            htmlFor="category"
            className="text-sm font-medium text-gray-200"
          >
            Категория видео
          </label>
          <select
            id="category"
            className={`cursor-pointer rounded-lg border bg-zinc-900 p-2 text-white focus:ring-2 focus:outline-none ${
              form.errors.category
                ? 'border-red-500 focus:ring-red-500/50'
                : 'border-zinc-700 focus:ring-blue-500/50'
            }`}
            {...form.register('category')}
          >
            <option value="" disabled className="text-gray-500">
              Выберите категорию...
            </option>
            {CATEGORIES.map((cat) => (
              <option key={cat.value} value={cat.value} className="bg-zinc-900">
                {cat.label}
              </option>
            ))}
          </select>

          {form.errors.category && (
            <p className="absolute bottom-0 left-0 text-xs text-red-500">
              {form.errors.category.message}
            </p>
          )}
        </div>

        <button
          disabled={form.isSubmitting}
          className="cursor-pointer rounded-lg border border-zinc-700 bg-zinc-800 px-5 py-2 font-medium text-zinc-100 transition-colors hover:bg-zinc-700 hover:text-white disabled:border-zinc-800 disabled:bg-zinc-900 disabled:text-zinc-600"
        >
          {form.isSubmitting ? 'Добавление...' : 'Добавить видео'}
        </button>
      </form>

      <YouTubePlayer videoId={videoId} />
    </div>
  );
};
