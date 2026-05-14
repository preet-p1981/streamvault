'use client';

import { createContext, useCallback, useContext, useState, ReactNode } from 'react';

interface ToastMessage {
  id: number;
  text: string;
}
interface ToastContextValue {
  toast: (text: string) => void;
}

const ToastContext = createContext<ToastContextValue>({ toast: () => {} });

export function useToast() {
  return useContext(ToastContext);
}

export default function ToastProvider({ children }: { children: ReactNode }) {
  const [messages, setMessages] = useState<ToastMessage[]>([]);

  const toast = useCallback((text: string) => {
    const id = Date.now() + Math.random();
    setMessages((m) => [...m, { id, text }]);
    setTimeout(() => {
      setMessages((m) => m.filter((msg) => msg.id !== id));
    }, 3000);
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="fixed bottom-20 md:bottom-6 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
        {messages.map((m) => (
          <div
            key={m.id}
            className="toast-in bg-[#1a1a1a] border border-white/10 text-white px-4 py-2 rounded shadow-lg text-sm"
          >
            {m.text}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
