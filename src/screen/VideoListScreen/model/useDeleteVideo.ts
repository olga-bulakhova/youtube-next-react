import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { videosApi } from '@/shared/api';
import { useUi } from '@/shared/context/UiContext';

const DELETE_UI_MESSAGES = {
  CONFIRM: {
    TITLE: 'Удаление видео',
    MESSAGE:
      'Вы уверены, что хотите навсегда удалить это видео из вкладки «Мои видео»?',
  },
  SUCCESS: 'Видео успешно удалено из вашей коллекции',
  ERROR: {
    UNKNOWN: 'Произошла непредвиденная ошибка при удалении',
  },
} as const;

export const useDeleteVideo = () => {
  const router = useRouter();
  const { showToast, askConfirm } = useUi();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const executeDelete = async (videoId: string) => {
    try {
      setDeletingId(videoId);
      await videosApi.delete(videoId);

      showToast(DELETE_UI_MESSAGES.SUCCESS, 'success');
      router.refresh();
    } catch (error) {
      console.error('Ошибка при удалении видео через API:', error);
      if (error instanceof Error) {
        showToast(error.message, 'error');
      } else {
        showToast(DELETE_UI_MESSAGES.ERROR.UNKNOWN, 'error');
      }
    } finally {
      setDeletingId(null);
    }
  };

  const deleteVideo = (videoId: string) => {
    askConfirm(
      DELETE_UI_MESSAGES.CONFIRM.TITLE,
      DELETE_UI_MESSAGES.CONFIRM.MESSAGE,
      () => executeDelete(videoId),
    );
  };

  return {
    deleteVideo,
    deletingId,
  };
};
