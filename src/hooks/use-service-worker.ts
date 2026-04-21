'use client';

import { useEffect } from 'react';

export function useServiceWorker() {
  useEffect(() => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return;

    navigator.serviceWorker
      .register('/sw.js')
      .then((registration) => {
        // Check for updates on every page load
        registration.update();

        // If new SW is already waiting (installed but not yet active), activate it
        if (registration.waiting) {
          registration.waiting.postMessage('SKIP_WAITING');
        }

        // When a new SW installs, send SKIP_WAITING so it takes over immediately
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (!newWorker) return;
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              newWorker.postMessage('SKIP_WAITING');
            }
          });
        });
      })
      .catch(() => {
        // SW registration failed — non-critical
      });
  }, []);
}
