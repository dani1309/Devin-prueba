import { useCallback, useEffect, useRef, useState } from 'react';

const TOAST_DURATION_MS = 2400;

export interface ToastMessage {
  id: number;
  text: string;
  tone: 'info' | 'error';
}

export function useToast() {
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const timeoutRef = useRef<number | undefined>(undefined);

  const notify = useCallback((text: string, tone: ToastMessage['tone'] = 'info') => {
    window.clearTimeout(timeoutRef.current);
    setToast({ id: Date.now(), text, tone });
    timeoutRef.current = window.setTimeout(() => setToast(null), TOAST_DURATION_MS);
  }, []);

  useEffect(() => () => window.clearTimeout(timeoutRef.current), []);

  return { toast, notify };
}

export type Notify = ReturnType<typeof useToast>['notify'];
