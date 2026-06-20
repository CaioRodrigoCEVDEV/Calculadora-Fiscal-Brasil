import type { MetadataRoute } from 'next';
import { APP_NAME, APP_SHORT_NAME, CALCULATOR_PAGE_DESCRIPTION } from '@/lib/site/content';
import { BRAND_ICON_192_PATH, BRAND_ICON_512_PATH } from '@/lib/site/brand';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: APP_NAME,
    short_name: APP_SHORT_NAME,
    description: CALCULATOR_PAGE_DESCRIPTION,
    start_url: '/pt/calculadora-fiscal',
    scope: '/',
    display: 'standalone',
    background_color: '#ffffff',
    theme_color: '#0284c7',
    icons: [
      {
        src: BRAND_ICON_192_PATH,
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: BRAND_ICON_512_PATH,
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}
