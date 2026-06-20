import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { IcmsAvailableCalculations } from '@/components/icms/IcmsAvailableCalculations';
import { IcmsCalculator } from '@/components/icms/IcmsCalculator';
import { HomeLanding } from '@/components/site/HomeLanding';
import { HomeTopbar } from '@/components/site/HomeTopbar';
import { APP_NAME } from '@/lib/site/content';
import { HOME_FAQ_ITEMS } from '@/lib/site/homeContent';
import { absoluteUrl } from '@/lib/site/url';
import {
  CALCULATOR_ROUTE_BY_SLUG,
  CALCULATOR_ROUTE_PARAMS,
} from '@/lib/seo/calculatorRoutes';

type PageParams = Promise<{ slug: string }>;

export const dynamic = 'force-static';

export function generateStaticParams() {
  return CALCULATOR_ROUTE_PARAMS;
}

export async function generateMetadata({ params }: { params: PageParams }): Promise<Metadata> {
  const { slug } = await params;
  const route = CALCULATOR_ROUTE_BY_SLUG[slug];
  const isHomeRoute = route?.slug === 'calculadora-fiscal';

  if (!route) {
    return {};
  }

  return {
    title: isHomeRoute ? { absolute: route.title } : route.title,
    description: route.description,
    alternates: {
      canonical: route.path,
    },
    keywords: route.keywords,
    robots: {
      index: true,
      follow: true,
    },
    openGraph: {
      title: isHomeRoute ? route.title : `${route.title} — ${APP_NAME}`,
      description: route.description,
      url: absoluteUrl(route.path),
      type: 'website',
      siteName: APP_NAME,
    },
  };
}

export default async function CalculatorRoutePage({ params }: { params: PageParams }) {
  const { slug } = await params;
  const route = CALCULATOR_ROUTE_BY_SLUG[slug];

  if (!route) {
    notFound();
  }

  const pageUrl = absoluteUrl(route.path);
  const homeUrl = absoluteUrl('/');
  const calculatorHomeUrl = absoluteUrl('/pt/calculadora-fiscal');
  const isHomeRoute = route.slug === 'calculadora-fiscal';
  const webApplication = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: APP_NAME,
    applicationCategory: 'BusinessApplication',
    operatingSystem: 'Web',
    inLanguage: 'pt-BR',
    description: route.description,
    url: pageUrl,
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'BRL',
    },
  };

  const breadcrumbList = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Início',
        item: isHomeRoute ? homeUrl : calculatorHomeUrl,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: route.breadcrumbLabel,
        item: pageUrl,
      },
    ],
  };

  const faqList = isHomeRoute
    ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: HOME_FAQ_ITEMS.map((item) => ({
          '@type': 'Question',
          name: item.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: item.answer,
          },
        })),
      }
    : null;

  return (
    <main id="top" className="relative">
      <HomeTopbar variant={isHomeRoute ? 'home' : 'detail'} />
      <div className="relative overflow-hidden">
        <div className="absolute inset-x-0 top-0 -z-10 h-80 bg-gradient-to-b from-sky-100 via-slate-50 to-transparent" />
        <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
          {isHomeRoute ? (
            <HomeLanding initialCalculationType={route.calculationType} />
          ) : (
            <>
              <section
                id="calculos-fiscais-disponiveis"
                className="max-w-4xl scroll-mt-24 space-y-4"
              >
                <div className="space-y-3">
                  <p className="text-xs font-semibold uppercase tracking-wide text-sky-700">
                    Calculadora Fiscal Brasil
                  </p>
                  <h1 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
                    {route.h1}
                  </h1>
                  {route.intro.map((paragraph) => (
                    <p key={paragraph} className="max-w-3xl text-sm leading-6 text-slate-600 sm:text-base">
                      {paragraph}
                    </p>
                  ))}
                </div>

                <IcmsAvailableCalculations />
              </section>

              <section id="simule-seu-calculo-fiscal" className="scroll-mt-24">
                <IcmsCalculator initialCalculationType={route.calculationType} />
              </section>
            </>
          )}
        </div>
      </div>

      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webApplication) }}
      />
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbList) }}
      />
      {faqList ? (
        <script
          type="application/ld+json"
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqList) }}
        />
      ) : null}
    </main>
  );
}
