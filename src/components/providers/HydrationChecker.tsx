'use client';

import { useEffect } from 'react';
import { useAppStore } from '@/lib/store';

export default function HydrationChecker() {
  const checkHydrationDate = useAppStore((state) => state.checkHydrationDate);

  useEffect(() => {
    checkHydrationDate();
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }
  }, [checkHydrationDate]);

  return null;
}
