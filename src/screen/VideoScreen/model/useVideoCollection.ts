'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useDeleteVideo } from '@/shared/hooks/useDeleteVideo';
import { videosApi } from '@/shared/api';
import { APP_ROUTES } from '@/shared/constants';
import { IVideoItem } from '@/app/api/videos/_storage/types';

interface UseVideoCollectionProps {
  video: IVideoItem;
  isAddedToMyCollection: boolean;
  isAuthorized: boolean;
}

export const useVideoCollection = ({
  video,
  isAddedToMyCollection,
  isAuthorized,
}: UseVideoCollectionProps) => {
  const router = useRouter();
  const [isInCollection, setIsInCollection] = useState(isAddedToMyCollection);
  const [isAdding, setIsAdding] = useState(false);


  const { deleteVideo, deletingId } = useDeleteVideo(() => {
    setIsInCollection(false);
    router.push(APP_ROUTES.MY_VIDEOS);
  });

  const isDeleting = deletingId === video.videoId;

  const handleAddToCollection = async () => {
    if (!isAuthorized) {
      router.push(APP_ROUTES.AUTH.LOGIN);
      return;
    }

    setIsAdding(true);
    try {
      await videosApi.add({
        videoId: video.videoId,
        category: video.category || 'blogs',
      });

      setIsInCollection(true);
      router.refresh(); 
    } catch (error) {
      console.error('Не удалось добавить видео в коллекцию:', error);
    } finally {
      setIsAdding(false);
    }
  };

  return {
    isInCollection,
    isAdding,
    isDeleting,
    handleAddToCollection,
    handleDeleteFromCollection: () => deleteVideo(video.videoId),
  };
};
