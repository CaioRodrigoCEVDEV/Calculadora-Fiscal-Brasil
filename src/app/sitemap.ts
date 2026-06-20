import type { MetadataRoute } from 'next';
import { CALCULATOR_ROUTE_LIST } from '@/lib/seo/calculatorRoutes';
import { absoluteUrl } from '@/lib/site/url';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  return CALCULATOR_ROUTE_LIST.map((route) => ({
    url: absoluteUrl(route.path),
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: route.slug === 'calculadora-fiscal' ? 1 : 0.9,
  }));
}
