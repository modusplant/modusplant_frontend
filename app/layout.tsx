import { Nanum_Myeongjo } from 'next/font/google';
import localFont from 'next/font/local';
import AuthInitializer from '@/components/_layout/authInitializer';
import AuthGuard from '@/components/_layout/authGuard';
import ConditionalLayout from '@/components/_layout/conditionalLayout';
import QueryProvider from '@/components/_layout/queryProvider';
import ModalProvider from '@/components/_layout/modalProvider';
import { getInitialAuthState } from '@/lib/utils/getInitialAuthState';
import { layoutMetadata } from '@/lib/metadata/layout';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from '@vercel/analytics/next';
import './globals.css';

export { layoutMetadata as metadata };

// Emphasis 폰트: Nanum Myeongjo (제목, 강조)
const nanumMyeongjo = Nanum_Myeongjo({
  weight: ['400', '700', '800'],
  subsets: ['latin'],
  variable: '--font-nanum-myeongjo',
  display: 'swap',
});

// Body 폰트: Pretendard (본문, 일반 텍스트)
const pretendard = localFont({
  src: [
    {
      path: '../public/fonts/Pretendard-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
    {
      path: '../public/fonts/Pretendard-Medium.woff2',
      weight: '500',
      style: 'normal',
    },
    {
      path: '../public/fonts/Pretendard-SemiBold.woff2',
      weight: '600',
      style: 'normal',
    },
    {
      path: '../public/fonts/Pretendard-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
  ],
  variable: '--font-pretendard',
  display: 'swap',
  fallback: [
    '-apple-system',
    'BlinkMacSystemFont',
    'system-ui',
    'Roboto',
    'sans-serif',
  ],
});

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const initialUser = await getInitialAuthState();

  return (
    <html lang="ko">
      <body
        className={`${pretendard.className} ${nanumMyeongjo.variable} antialiased`}
      >
        <QueryProvider>
          <AuthInitializer initialUser={initialUser} />
          <ConditionalLayout initialUser={initialUser}>
            <AuthGuard>{children}</AuthGuard>
          </ConditionalLayout>
          <ModalProvider />
        </QueryProvider>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
