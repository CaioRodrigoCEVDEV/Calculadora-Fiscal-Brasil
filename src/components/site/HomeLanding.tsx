import Link from 'next/link';
import { IcmsCalculator } from '@/components/icms/IcmsCalculator';
import { CALCULATOR_ROUTE_LIST } from '@/lib/seo/calculatorRoutes';
import { APP_NAME, APP_SLOGAN, APP_SUBTITLE } from '@/lib/site/content';
import { HOME_BENEFITS, HOME_CONTENT_BLOCKS } from '@/lib/site/homeContent';
import type { CalculationType } from '@/lib/fiscal/constants';
import { HomeFaqAccordion } from './HomeFaqAccordion';

function buildCalculatorCtaLabel(title: string) {
  const strippedTitle = title.replace(/^Calculadora(?: de)?\s+/i, '').trim();
  return `Calcular ${strippedTitle}`;
}

const HOME_CALCULATOR_CARDS = CALCULATOR_ROUTE_LIST.filter(
  (route) => route.slug !== 'calculadora-fiscal',
);

interface HomeLandingProps {
  initialCalculationType?: CalculationType;
}

export function HomeLanding({
  initialCalculationType = 'icms_proprio',
}: HomeLandingProps) {
  return (
    <>
      <section className="max-w-4xl space-y-6">
        <div className="space-y-3">
          <h1 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl lg:text-5xl">
            {APP_NAME}
          </h1>
          <p className="max-w-3xl text-base font-medium leading-7 text-slate-700 sm:text-lg">
            {APP_SLOGAN}
          </p>
          <p className="max-w-3xl text-sm leading-6 text-slate-600 sm:text-base">
            {APP_SUBTITLE}
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <a
            href="#simule-seu-calculo-fiscal"
            className="inline-flex h-11 items-center justify-center rounded-xl bg-sky-600 px-4 text-sm font-semibold text-white transition hover:bg-sky-700 focus:outline-none focus:ring-4 focus:ring-sky-200"
          >
            Começar cálculo
          </a>
          <a
            href="#calculos-fiscais-disponiveis"
            className="inline-flex h-11 items-center justify-center rounded-xl border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-sky-200"
          >
            Ver cálculos disponíveis
          </a>
        </div>
      </section>

      <section
        id="calculos-fiscais-disponiveis"
        aria-labelledby="calculos-fiscais-disponiveis-title"
        className="scroll-mt-24 space-y-4"
      >
        <div className="space-y-2">
          <h2 id="calculos-fiscais-disponiveis-title" className="text-2xl font-semibold tracking-tight text-slate-950">
            Cálculos fiscais disponíveis
          </h2>
          <p className="text-sm leading-6 text-slate-600 sm:text-base">
            Escolha o imposto ou contribuição que deseja simular.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {HOME_CALCULATOR_CARDS.map((route) => (
            <Link
              key={route.slug}
              href={route.path}
              className="group flex h-full flex-col rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-soft focus:outline-none focus:ring-4 focus:ring-sky-200"
            >
              <h3 className="text-lg font-semibold tracking-tight text-slate-950">
                {route.title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{route.description}</p>
              <span className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-sky-700 transition group-hover:text-sky-800">
                {buildCalculatorCtaLabel(route.title)}
                <span aria-hidden="true">→</span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section aria-labelledby="por-que-usar-title" className="space-y-4">
        <div className="space-y-2">
          <h2 id="por-que-usar-title" className="text-2xl font-semibold tracking-tight text-slate-950">
            Por que usar a Calculadora Fiscal Brasil?
          </h2>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {HOME_BENEFITS.map((benefit) => (
            <article key={benefit.title} className="h-full rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="text-base font-semibold text-slate-950">{benefit.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{benefit.content}</p>
            </article>
          ))}
        </div>
      </section>

      <section
        id="simule-seu-calculo-fiscal"
        aria-labelledby="simule-seu-calculo-fiscal-title"
        className="scroll-mt-24 space-y-4"
      >
        <div className="space-y-2">
          <h2 id="simule-seu-calculo-fiscal-title" className="text-2xl font-semibold tracking-tight text-slate-950">
            Simule seu cálculo fiscal
          </h2>
          <p className="text-sm leading-6 text-slate-600 sm:text-base">
            Escolha o tipo de cálculo, preencha os dados da operação e veja o resultado com memória detalhada.
          </p>
        </div>

        <IcmsCalculator initialCalculationType={initialCalculationType} />
      </section>

      <section aria-labelledby="o-que-e-uma-calculadora-fiscal-title" className="space-y-4">
        <div className="space-y-2">
          <h2
            id="o-que-e-uma-calculadora-fiscal-title"
            className="text-2xl font-semibold tracking-tight text-slate-950"
          >
            O que é uma calculadora fiscal?
          </h2>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {HOME_CONTENT_BLOCKS.map((block) => (
            <article key={block.title} className="h-full rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="text-base font-semibold text-slate-950">{block.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{block.content}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="duvidas-frequentes" aria-labelledby="duvidas-frequentes-title" className="scroll-mt-24 space-y-4">
        <div className="space-y-2">
          <h2 id="duvidas-frequentes-title" className="text-2xl font-semibold tracking-tight text-slate-950">
            Dúvidas frequentes
          </h2>
        </div>

        <HomeFaqAccordion />
      </section>
    </>
  );
}
