'use client'; // [0.3]

import React, { createContext, useContext, useState } from 'react';

type ToastType = 'success' | 'error' | 'info';

interface ToastState {
  message: string;
  type: ToastType;
}

interface ConfirmState {
  title: string;
  message: string;
  onConfirm: () => void;
}

interface UiContextType {
  showToast: (message: string, type?: ToastType) => void;
  askConfirm: (title: string, message: string, onConfirm: () => void) => void;
}

const UiContext = createContext<UiContextType | undefined>(undefined);

export const UiProvider = ({ children }: { children: React.ReactNode }) => {
  const [toast, setToast] = useState<ToastState | null>(null);
  const [confirm, setConfirm] = useState<ConfirmState | null>(null);

  const showToast = (message: string, type: ToastType = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500); // Скрывать через 3.5 секунды
  };

  const askConfirm = (
    title: string,
    message: string,
    onConfirm: () => void,
  ) => {
    setConfirm({
      title,
      message,
      onConfirm: () => {
        onConfirm();
        setConfirm(null);
      },
    });
  };

  return (
    <UiContext.Provider value={{ showToast, askConfirm }}>
      {children}

      {/* 🥞 КРАСИВЫЙ TOAST УВЕДОМЛЕНИЕ */}
      {toast && (
        <div
          className={`animate-slide-in fixed right-5 bottom-5 z-50 flex items-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium text-white shadow-2xl ${
            toast.type === 'success'
              ? 'border-emerald-500/30 bg-zinc-900 text-emerald-400'
              : toast.type === 'error'
                ? 'border-red-500/30 bg-zinc-900 text-red-400'
                : 'border-zinc-700 bg-zinc-900 text-zinc-300'
          }`}
        >
          <div
            className={`h-2 w-2 animate-pulse rounded-full ${
              toast.type === 'success'
                ? 'bg-emerald-500'
                : toast.type === 'error'
                  ? 'bg-red-500'
                  : 'bg-zinc-500'
            }`}
          />
          {toast.message}
        </div>
      )}

      {/* ⚠️ КРАСИВОЕ ОКНО ПОДТВЕРЖДЕНИЯ (CONFIRM MODAL) */}
      {confirm && (
        <div className="animate-fade-in fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
          <div className="w-full max-w-sm overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 p-6 shadow-2xl">
            <h3 className="text-base font-semibold text-zinc-100">
              {confirm.title}
            </h3>
            <p className="mt-2 text-sm text-zinc-400">{confirm.message}</p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setConfirm(null)}
                className="cursor-pointer rounded-xl bg-zinc-800 px-4 py-2 text-xs font-medium text-zinc-300 transition-colors hover:bg-zinc-700"
              >
                Отмена
              </button>
              <button
                onClick={confirm.onConfirm}
                className="cursor-pointer rounded-xl bg-red-600 px-4 py-2 text-xs font-medium text-white transition-colors hover:bg-red-500"
              >
                Удалить
              </button>
            </div>
          </div>
        </div>
      )}
    </UiContext.Provider>
  );
};

export const useUi = () => {
  const context = useContext(UiContext);
  if (!context)
    throw new Error('useUi должен использоваться внутри UiProvider');
  return context;
};
