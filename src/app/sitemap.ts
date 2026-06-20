import type { MetadataRoute } from 'next';
import { CALCULATOR_ROUTE_LIST } from '@/lib/seo/calculatorRoutes';
import { absoluteUrl } from '@/lib/site/url';

const SITEMAP_PRIORITY_BY_SLUG: Record<string, number> = {
  'calculadora-fiscal': 1,
  'calculadora-icms': 0.9,
  'calculadora-icms-st': 0.9,
  'calculadora-ipi': 0.85,
  'calculadora-pis-cofins': 0.85,
  'calculadora-difal': 0.85,
  'calculadora-fcp': 0.8,
  'calculadora-ibs-cbs': 0.85,
};

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const routes = [
    {
      url: absoluteUrl('/'),
      priority: 1,
    },
    ...CALCULATOR_ROUTE_LIST.map((route) => ({
      url: absoluteUrl(route.path),
      priority: SITEMAP_PRIORITY_BY_SLUG[route.slug] ?? 0.8,
    })),
  ];

  return routes.map((route) => ({
    url: route.url,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: route.priority,
  }));
}
