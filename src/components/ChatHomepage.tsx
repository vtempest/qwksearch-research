'use client';

import { useEffect } from 'react';
import EmptyChatMessageInput from './EmptyChatMessageInput';
import Footer, { defaultFooterLinks } from './Footer';
import SettingsButtonMobile from '@/components/Settings/SettingsButtonMobile';
import { renderCanvas } from '@/components/ui/canvas';

const EmptyChat = ({ background }: { background?: string }) => {
  useEffect(() => {
    let mounted = true;

    // Only initialize canvas if mounted
    if (mounted) {
      renderCanvas();
    }

    // Cleanup function
    return () => {
      mounted = false;
      // Stop the canvas animation
      const canvas = document.getElementById("canvas");
      if (canvas) {
        const ctx = (canvas as HTMLCanvasElement).getContext("2d");
        if (ctx) {
          // @ts-ignore
          ctx.running = false;
        }
      }
    };
  }, []);

  return (
    <div className="relative min-h-screen w-full">
      {background && (
        <div className="fixed inset-0 z-0">
          <img
            src={background}
            alt="Background"
            className="w-full h-full object-cover"
          />
          {/* Overlay for better text readability */}
          {/* <div className="absolute inset-0 bg-white/80 dark:bg-black/80 backdrop-blur-sm" /> */}
        </div>
      )}

      <div className="relative z-10">
        <div className="absolute w-full flex flex-row items-center justify-end pr-5 pt-5">
          <SettingsButtonMobile />
        </div>
        <div className="flex flex-col items-center justify-center min-h-screen max-w-screen-sm mx-auto p-2 space-y-4">
          <div className="flex flex-col items-center justify-center w-full space-y-6">
            <div className="flex flex-col items-center space-y-4">
              <img
                src="/icons/qwksearch-logo.png"
                alt="QwkSearch"
                className="w-32 h-32 object-contain"
              />
              <h1 className="text-3xl font-bold text-foreground">
                QwkSearch
              </h1>
            </div>
            <EmptyChatMessageInput />
          </div>
        </div>
      </div>
      <Footer listFooterLinks={defaultFooterLinks} />
      <canvas
        className="bg-skin-base pointer-events-none absolute inset-0 mx-auto"
        id="canvas"
      ></canvas>
    </div>
  );
};

export default EmptyChat;
