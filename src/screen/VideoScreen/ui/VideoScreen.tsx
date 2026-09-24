'use client';

import { IVideoItem } from '@/app/api/videos/_storage/types';
import { YouTubePlayer } from '@/shared/ui/YouTubePlayer';
import Link from 'next/link';
import { TrashIcon, AddIcon } from '@/shared/icons';
import { Button } from '@/shared/ui/Button';
import { BackButton } from '@/shared/ui/BackButton';
import { useVideoCollection } from '../model/useVideoCollection';

type VideoScreenProps = {
  video: IVideoItem;
  isAddedToMyCollection: boolean;
  isAuthorized: boolean;
};

export const VideoScreen = ({
  video,
  isAddedToMyCollection,
  isAuthorized,
}: VideoScreenProps) => {
  const {
    isInCollection,
    isAdding,
    isDeleting,
    handleAddToCollection,
    handleDeleteFromCollection,
  } = useVideoCollection({ video, isAddedToMyCollection, isAuthorized });

  if (!video) return null;

  return (
    <div className="mx-auto w-full max-w-7xl px-4 pb-6">
      <BackButton className="mb-4" />

      <YouTubePlayer videoId={video.videoId} autoplay />

      <div className="mt-4 flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
        <div className="flex-1">
          <h2 className="mb-2 text-xl font-bold text-white sm:text-2xl">
            {video.title}
          </h2>
          <Link
            href={video.authorUrl || '#'}
            className="block w-fit text-sm text-zinc-400 hover:text-zinc-200 hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            {video.authorName}
          </Link>
        </div>

        {isAuthorized && (
          <div className="flex items-center gap-2">
            {isInCollection ? (
              <Button
                onClick={handleDeleteFromCollection}
                isLoading={isDeleting}
                loadingText="Удаление..."
                variant="danger"
                icon={<TrashIcon className="h-4 w-4" />}
                className="text-xs sm:text-sm"
              >
                Удалить из коллекции
              </Button>
            ) : (
              <Button
                onClick={handleAddToCollection}
                isLoading={isAdding}
                loadingText="Добавление..."
                variant="emerald"
                icon={<AddIcon className="h-4 w-4" />}
                className="text-xs sm:text-sm"
              >
                Добавить к себе
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
