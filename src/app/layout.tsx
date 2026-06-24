import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import './globals.css';
import { HomeTopbar } from '@/components/site/HomeTopbar';
import { APP_NAME, CALCULATOR_PAGE_DESCRIPTION } from '@/lib/site/content';
import {
  BRAND_APPLE_ICON_PATH,
  BRAND_ICON_192_PATH,
  BRAND_ICON_32_PATH,
  BRAND_LOGO_HEIGHT,
  BRAND_LOGO_PATH,
  BRAND_LOGO_WIDTH,
} from '@/lib/site/brand';
import { SITE_URL } from '@/lib/site/url';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  applicationName: APP_NAME,
  title: {
    default: `${APP_NAME} — ICMS, ICMS-ST, IPI, PIS, COFINS, DIFAL, FCP, IBS e CBS`,
    template: `%s — ${APP_NAME}`,
  },
  description: CALCULATOR_PAGE_DESCRIPTION,
  manifest: '/manifest.webmanifest',
  keywords: [
    'calculadora fiscal brasil',
    'calculadora fiscal',
    'calculadora fiscal online',
    'simulador de impostos',
    'calculadora de impostos',
    'calculadora ICMS',
    'calculadora ICMS-ST',
    'calculadora PIS/COFINS',
    'calculadora FCP',
    'calculadora IBS/CBS',
    'cálculo de IPI',
    'cálculo de DIFAL',
    'cálculo de substituição tributária',
    'memória de cálculo fiscal',
  ],
  icons: {
    icon: [
      { url: BRAND_ICON_32_PATH, sizes: '32x32', type: 'image/png' },
      { url: BRAND_ICON_192_PATH, sizes: '192x192', type: 'image/png' },
    ],
    apple: [{ url: BRAND_APPLE_ICON_PATH, sizes: '180x180', type: 'image/png' }],
  },
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: `${APP_NAME} — ICMS, ICMS-ST, IPI, PIS, COFINS, DIFAL, FCP, IBS e CBS`,
    description: CALCULATOR_PAGE_DESCRIPTION,
    type: 'website',
    siteName: APP_NAME,
    images: [
      {
        url: BRAND_LOGO_PATH,
        width: BRAND_LOGO_WIDTH,
        height: BRAND_LOGO_HEIGHT,
        alt: APP_NAME,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${APP_NAME} — ICMS, ICMS-ST, IPI, PIS, COFINS, DIFAL, FCP, IBS e CBS`,
    description: CALCULATOR_PAGE_DESCRIPTION,
    images: [BRAND_LOGO_PATH],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body>
        <HomeTopbar />
        <main id="top" className="relative">
          {children}
        </main>
      </body>
    </html>
  );
}
