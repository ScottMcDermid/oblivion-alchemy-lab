import React from 'react';
import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';

const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
});

export const metadata: Metadata = {
  title: 'Oblivion Alchemy Calculator',
  description:
    'Mix, match, and master potion creation in Oblivion with a powerful alchemy planning tool.',
  openGraph: {
    title: 'Oblivion Alchemy Calculator',
    description:
      'Mix, match, and master potion creation in Oblivion with a powerful alchemy planning tool.',
    url: 'https://alchemy.oblivion.tools',
    siteName: 'Oblivion Alchemy Calculator',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Oblivion Alchemy Calculator',
    description:
      'Mix, match, and master potion creation in Oblivion with a powerful alchemy planning tool.',
  },
  alternates: {
    canonical: 'https://alchemy.oblivion.tools',
  },
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
  },
  themeColor: '#1e1e1e',
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body id="root" className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
