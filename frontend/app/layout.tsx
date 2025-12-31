import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Klaew Klad - Digital Twin Flood Warning System',
  description: 'Satellite-driven flood impact forecasting for Hat Yai, powered by Huawei MindSpore',
  keywords: ['flood warning', 'digital twin', 'Hat Yai', 'MindSpore', 'AI', 'Huawei ICT Competition'],
  authors: [{ name: 'Klaew Klad Team' }],
  openGraph: {
    title: 'Klaew Klad - Digital Twin Flood Warning System',
    description: 'AI-powered flood prediction and evacuation planning for Hat Yai, Thailand',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="th">
      <body className={inter.className}>{children}</body>
    </html>
  );
}
