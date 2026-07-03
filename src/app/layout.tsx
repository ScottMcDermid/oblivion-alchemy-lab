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
  title: 'Oblivion Alchemy Lab',
  description:
    'Plan and calculate potions and poisons in The Elder Scrolls IV: Oblivion. Select ingredients, configure your alchemy skill, and see exact potion results with accurate UESP formulas.',
  openGraph: {
    title: 'Oblivion Alchemy Lab',
    description:
      'Plan and calculate potions and poisons in The Elder Scrolls IV: Oblivion. Select ingredients, configure your alchemy skill, and see exact potion results with accurate UESP formulas.',
    url: 'https://alchemy.oblivion.tools',
    siteName: 'Oblivion Alchemy Lab',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Oblivion Alchemy Lab',
    description:
      'Plan and calculate potions and poisons in The Elder Scrolls IV: Oblivion. Select ingredients, configure your alchemy skill, and see exact potion results with accurate UESP formulas.',
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
    <html lang="en" suppressHydrationWarning>
      <body id="root" className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
