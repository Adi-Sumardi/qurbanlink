import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

declare global {
  interface Window {
    Pusher: typeof Pusher;
    Echo: Echo<'reverb'>;
  }
}

let echoInstance: Echo<'reverb'> | null = null;

export function getEcho(): Echo<'reverb'> {
  if (echoInstance) return echoInstance;

  if (typeof window === 'undefined') {
    throw new Error('Echo can only be initialized on the client side');
  }

  window.Pusher = Pusher;

  echoInstance = new Echo({
    broadcaster: 'reverb',
    key: process.env.NEXT_PUBLIC_REVERB_APP_KEY,
    wsHost: process.env.NEXT_PUBLIC_REVERB_HOST,
    wsPort: Number(process.env.NEXT_PUBLIC_REVERB_PORT) || 8080,
    wssPort: Number(process.env.NEXT_PUBLIC_REVERB_PORT) || 443,
    forceTLS: process.env.NEXT_PUBLIC_REVERB_SCHEME === 'https',
    enabledTransports: ['ws', 'wss'],
    authEndpoint: `${process.env.NEXT_PUBLIC_API_URL?.replace('/api/v1', '')}/broadcasting/auth`,
    auth: {
      headers: {
        Authorization: `Bearer ${typeof window !== 'undefined' ? localStorage.getItem('token') : ''}`,
      },
    },
  });

  return echoInstance;
}

export function disconnectEcho() {
  if (echoInstance) {
    echoInstance.disconnect();
    echoInstance = null;
  }
}
