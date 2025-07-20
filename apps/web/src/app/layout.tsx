import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';

import './globals.css';
import { ClientProviders } from '../components/providers/ClientProviders';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Floro - Nền tảng Cộng tác Trực quan Dựa trên Node',
  description:
    'Tạo, kết nối và cộng tác theo thời gian thực với canvas trực quan sáng tạo. Xây dựng quy trình phức tạp thông qua tương tác node trực quan.',
  keywords: [
    'cộng tác',
    'trực quan',
    'node-based',
    'canvas',
    'thời gian thực',
    'quy trình',
    'supabase',
    'collaboration',
    'visual',
    'real-time',
    'workflow',
  ],
  authors: [{ name: 'Đội ngũ Floro' }],
  creator: 'Đội ngũ Floro',
  publisher: 'Đội ngũ Floro',
  openGraph: {
    title: 'Floro - Nền tảng Cộng tác Trực quan Dựa trên Node',
    description:
      'Tạo, kết nối và cộng tác theo thời gian thực với canvas trực quan sáng tạo.',
    type: 'website',
    locale: 'vi_VN',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Floro - Nền tảng Cộng tác Trực quan Dựa trên Node',
    description:
      'Tạo, kết nối và cộng tác theo thời gian thực với canvas trực quan sáng tạo.',
  },
  viewport: 'width=device-width, initial-scale=1',
  robots: 'index, follow',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>): React.JSX.Element {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ClientProviders>{children}</ClientProviders>
      </body>
    </html>
  );
}
