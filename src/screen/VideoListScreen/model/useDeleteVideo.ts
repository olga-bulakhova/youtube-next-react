import { useState } from 'react';
import { useRouter } from 'next/navigation'; 
import { videosApi } from '@/shared/api';

export const useDeleteVideo = () => {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const deleteVideo = async (videoId: string) => {
    if (!confirm('Вы уверены, что хотите удалить это видео?')) return;

    try {
      setDeletingId(videoId); 
      await videosApi.delete(videoId);
      router.refresh(); 
    } catch (error) {
      console.error('Ошибка при удалении видео через API:', error);
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert('Произошла непредвиденная ошибка при удалении видео.');
      }
    } finally {
      setDeletingId(null); 
    }
  };

  return {
    deleteVideo,
    deletingId,
  };
};
