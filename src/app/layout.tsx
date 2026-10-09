import type { Metadata, Viewport } from 'next';
import './globals.css';
import { homeEntryScript } from '@/lib/home-entry.mjs';
export const viewport: Viewport = { width: 'device-width', initialScale: 1, viewportFit: 'cover' };
export const metadata: Metadata = {
  title: 'Joackim DATE — Développeur & Designer',
  description:
    'Deux regards, une même exigence. Le portfolio de Joackim DATE, développeur Full-Stack et graphiste à Lomé.',
  robots: { index: false, follow: false },
  icons: { icon: '/favicon.svg' },
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" data-theme="dark" style={{ colorScheme: 'dark' }}>
      <head>
        <script dangerouslySetInnerHTML={{ __html: homeEntryScript }} />
        <link
          rel="preload"
          href="/fonts/portfolio-sans-regular.woff"
          as="font"
          type="font/woff"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/portfolio-sans-bold.woff"
          as="font"
          type="font/woff"
          crossOrigin="anonymous"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
