import { SessionProvider } from 'next-auth/react';
import Navigation from '../components/Navigation';
import { Toaster } from "@/components/ui/toaster"
import '../styles/globals.css';

function MyApp({ Component, pageProps: { session, ...pageProps } }) {
  return (
    <SessionProvider session={session}>
      <Navigation />
      <Component {...pageProps} />
      <Toaster />
    </SessionProvider>
  );
}

export default MyApp;