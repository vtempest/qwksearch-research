'use client';

import { authClient } from '@/lib/auth-client';
import { useSession } from '@/lib/hooks/useSession';
import { useEffect, useRef } from 'react';

const RELOAD_FLAG_KEY = 'google-onetap-reload';
const RELOAD_TIMEOUT = 3000; // 3 seconds

export default function GoogleOneTap() {
  const { isAuthenticated, isLoading } = useSession();
  const hasInitialized = useRef(false);

  useEffect(() => {
    // Only run this effect once on mount
    if (hasInitialized.current) return;

    // Clear reload flag if it's been too long (prevents flag from persisting indefinitely)
    const reloadFlag = sessionStorage.getItem(RELOAD_FLAG_KEY);
    if (reloadFlag) {
      const timestamp = parseInt(reloadFlag, 10);
      if (Date.now() - timestamp > RELOAD_TIMEOUT) {
        sessionStorage.removeItem(RELOAD_FLAG_KEY);
      }
    }

    // Wait for session to load before showing One Tap
    if (isLoading) return;

    // Only show One Tap if user is not authenticated
    if (!isAuthenticated) {
      hasInitialized.current = true;

      // Initialize Google One Tap
      authClient.oneTap({
        fetchOptions: {
          onSuccess: () => {
            // Prevent rapid reload loops by checking if we just reloaded
            const reloadFlag = sessionStorage.getItem(RELOAD_FLAG_KEY);
            if (!reloadFlag) {
              sessionStorage.setItem(RELOAD_FLAG_KEY, Date.now().toString());
              window.location.reload();
            }
          },
          onError: (ctx) => {
            console.error('One Tap error:', ctx.error);
          },
        },
      });
    }
  }, [isAuthenticated, isLoading]);

  // One Tap is rendered by the Google SDK, not React
  return null;
}
