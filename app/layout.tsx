import type { Metadata } from 'next';
import { surveyConfig } from '@/config';
import './globals.css';

const cleanTitle = surveyConfig.surveyTitle.replace(/\n/g, ' ');

export const metadata: Metadata = {
  title: cleanTitle,
  description: surveyConfig.metaDescription || cleanTitle,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ko">
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/sunn-us/SUIT/fonts/variable/woff2/SUIT-Variable.css"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
