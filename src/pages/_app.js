import { AppWrapper } from '@/app-context';
import { UserWrapper } from '@/user-context';
import SecuredLayout from '@/components/Layout/SecuredLayout';
import '@/styles/globals.css';
import { useRouter } from 'next/router';
import { Spin } from 'antd';
import { useEffect, useState } from 'react';
import { clearStorageAndRedirect, getLoggedInUser } from '@/utils';
import { ConfigProvider, Typography } from 'antd';
import ErrorBoundary from '@/components/ErrorBoundary';
import { Inter } from 'next/font/google';
import toast, { Toaster } from 'react-hot-toast';
import ToastProvider from '@/components/toast-provider/ToastProvider';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  weights: [400, 500, 600, 700],
});

export default function App({ Component, pageProps }) {
  const router = useRouter();
  const path = router.pathname;
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true); // Mark that we're on the client side
  }, []);

  // Client-side only logic
  useEffect(() => {
    if (
      !path.endsWith('/auth/login') &&
      !path.endsWith('/auth/register') &&
      !path.endsWith('/auth/verify') &&
      !path.endsWith('/auth/password') &&
      !path.endsWith('/auth/reset-password')
    ) {
      const user = getLoggedInUser();
      if (!user?.userId) {
        clearStorageAndRedirect(window.location.pathname);
      }
    }
  }, [path]);

  if (
    path.endsWith('/auth/login') ||
    path.endsWith('/auth/register') ||
    path.endsWith('/auth/verify') ||
    path.endsWith('/auth/password') ||
    path.endsWith('/auth/reset-password')
  ) {
    return (
      <ConfigProvider
        theme={{
          token: {
            fontFamily: 'Inter',
          },
        }}
      >
        <AppWrapper>
          <Component className={inter.className} {...pageProps} />
          <ToastProvider />
        </AppWrapper>
      </ConfigProvider>
    );
  }

  if (!isClient) {
    // Render a loading state or nothing during server-side rendering
    return <Spin size="large" />;
  }

  return (
    <ErrorBoundary>
      <ConfigProvider
        theme={{
          token: {
            fontFamily: 'Inter, Roboto, Helvetica Neue, Arial, sans-serif',
          },
        }}
      >
        <UserWrapper>
          <AppWrapper>
            <SecuredLayout>
              <Component className={inter.className} {...pageProps} />
              <ToastProvider />
            </SecuredLayout>
          </AppWrapper>
        </UserWrapper>
      </ConfigProvider>
    </ErrorBoundary>
  );
}
