import type { Metadata, Viewport } from 'next';
import './globals.css';
export const viewport: Viewport = {width:'device-width',initialScale:1,viewportFit:'cover'};
export const metadata: Metadata = {
  title:'Joackim DATE — Développeur & Designer',
  description:'Deux regards, une même exigence. Le portfolio de Joackim DATE, développeur Full-Stack et graphiste à Lomé.',
  robots:{index:false,follow:false},
  icons:{icon:'/favicon.svg'},
};
export default function RootLayout({children}:{children:React.ReactNode}) {
  return <html lang="fr"><body>{children}</body></html>;
}
