import React from 'react';
import { useApp } from '../../context/AppContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const ToastRegion: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      {toasts.map(toast => {
        let bg = 'bg-slate-900 text-white dark:bg-slate-800 border-slate-700';
        let Icon = Info;
        if (toast.type === 'success') {
          bg = 'bg-emerald-600 text-white border-emerald-500';
          Icon = CheckCircle2;
        } else if (toast.type === 'error') {
          bg = 'bg-rose-600 text-white border-rose-500';
          Icon = AlertCircle;
        } else if (toast.type === 'warning') {
          bg = 'bg-amber-600 text-white border-amber-500';
          Icon = AlertCircle;
        }

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center justify-between p-3.5 rounded-xl shadow-lg border text-sm transition-all duration-200 transform translate-y-0 ${bg}`}
          >
            <div className="flex items-center gap-2.5">
              <Icon className="w-5 h-5 shrink-0" />
              <span className="font-medium">{toast.message}</span>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="p-1 hover:opacity-75 transition-opacity"
              aria-label="Закрыть уведомление"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
