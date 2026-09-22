import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { UiProvider } from '@/shared/context';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'Youtube Clone',
  description: 'Youtube Clone',
};


export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
 return (
   <html
     lang="ru"
     className={`${geistSans.variable} ${geistMono.variable} dark h-full antialiased`}
   >
     <body className="h-full bg-black text-white">
       <UiProvider>{children}</UiProvider>
     </body>
   </html>
 );
}
