import '@/styles/globals.css';

import type { AppProps } from 'next/app';
import localFont from 'next/font/local';
const roboto = localFont({ src: './fonts/Roboto-Regular.ttf' });

import { Providers } from '@/components/providers';
import { ThemeProvider } from '@/components/ui/theme-provider';
import { AuthProvider } from '@/context/authContext';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
    >
      <Providers>
        <main className={roboto.className}>
          <AuthProvider>
            <Component {...pageProps} />
          </AuthProvider>
        </main>
      </Providers>
    </ThemeProvider>
  );
}
