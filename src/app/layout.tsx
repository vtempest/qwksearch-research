export const dynamic = 'force-dynamic';

import type { Metadata } from 'next';
import './globals.css';
import { cn } from '@/lib/utils';
import Sidebar from '@/components/Sidebar';
import { Toaster } from 'sonner';
import ThemeProvider from '@/components/theme/Provider';
import configManager from '@/lib/config';
import SetupWizard from '@/components/Setup/SetupWizard';
import { ChatProvider } from '@/lib/hooks/useChat';
import GoogleOneTap from '@/components/GoogleOneTap';
import { SessionProvider } from '@/lib/hooks/useSession';

export const metadata: Metadata = {
  title: 'QwkSearch - Chat with the internet',
  description:
    'QwkSearch is an AI powered chatbot that is connected to the internet.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const setupComplete = configManager.isSetupComplete();
  const configSections = configManager.getUIConfigSections();

  return (
    <html className="h-full" lang="en" suppressHydrationWarning>
      <body className={cn('h-full', 'font-sans')}>
        <ThemeProvider>
          <SessionProvider>
            {/* {setupComplete ? ( */}
              <ChatProvider>
                <GoogleOneTap />
                <Sidebar>{children}</Sidebar>
                <Toaster
                  toastOptions={{
                    unstyled: true,
                    classNames: {
                      toast:
                        'bg-light-secondary dark:bg-dark-secondary dark:text-white/70 text-black-70 rounded-lg p-4 flex flex-row items-center space-x-2',
                    },
                  }}
                />
              </ChatProvider>
            {/* ) : (
              <SetupWizard configSections={configSections} />
            )} */}
          </SessionProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
