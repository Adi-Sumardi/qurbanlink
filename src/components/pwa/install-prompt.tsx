'use client';

import { useState, useEffect } from 'react';
import { Download, X, Smartphone } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [dismissed, setDismissed] = useState(false);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    // Kalau sudah berjalan sebagai PWA standalone, tidak perlu prompt
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setInstalled(true);
      return;
    }

    const stored = localStorage.getItem('pwa-install-dismissed');
    if (stored) {
      setDismissed(true);
      return;
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handler);
    window.addEventListener('appinstalled', () => setInstalled(true));
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  if (!deferredPrompt || dismissed || installed) return null;

  const handleInstall = async () => {
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
    }
  };

  const handleDismiss = () => {
    setDismissed(true);
    localStorage.setItem('pwa-install-dismissed', '1');
  };

  return (
    <div className="fixed left-0 right-0 top-0 z-50 animate-in slide-in-from-top-2 duration-300 md:left-auto md:right-4 md:top-4 md:w-80">
      <div className="flex items-center gap-3 border-b border-[rgba(190,201,194,0.3)] bg-white px-4 py-3 shadow-lg md:rounded-2xl md:border md:shadow-xl">
        {/* Icon */}
        <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#004532]">
          <Smartphone className="size-5 text-white" />
        </div>

        {/* Text */}
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold text-[#191c1e]">Install Tawzii Digital</p>
          <p className="text-xs text-[#3f4944]/60">Tambahkan ke layar utama perangkat Anda</p>
        </div>

        {/* Actions */}
        <div className="flex shrink-0 items-center gap-2">
          <button
            onClick={handleInstall}
            className="flex items-center gap-1.5 rounded-xl bg-[#004532] px-3 py-2 text-xs font-bold text-white shadow-md shadow-[#004532]/20 transition-all hover:bg-[#065f46] active:scale-95"
          >
            <Download className="size-3.5" />
            Install
          </button>
          <button
            onClick={handleDismiss}
            className="flex size-7 items-center justify-center rounded-lg text-[#3f4944]/40 transition-colors hover:bg-[#f2f4f6] hover:text-[#3f4944]"
          >
            <X className="size-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
