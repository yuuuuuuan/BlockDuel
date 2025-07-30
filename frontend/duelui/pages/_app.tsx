import { useState, useEffect } from 'react';
import { AppProps } from 'next/app';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/toaster';
import { Web3Provider } from '../lib/blockchain/Web3Provider';
import Layout from '../components/layout/Layout';
import '../styles/globals.css';

export default function App({ Component, pageProps }: AppProps) {
  // Avoid hydration mismatch
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return (
    <ThemeProvider attribute="class" defaultTheme="dark">
      <Web3Provider>
        <Layout>
          <Component {...pageProps} />
          <Toaster />
        </Layout>
      </Web3Provider>
    </ThemeProvider>
  );
}