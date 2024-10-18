import '@/styles/globals.css';

import type { AppProps } from 'next/app';

import { Providers } from '@/components/providers';
import { ThemeProvider } from '@/components/ui/theme-provider';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      disableTransitionOnChange
    >
      <Providers>
        <Component {...pageProps} />
      </Providers>
    </ThemeProvider>
  );
}
