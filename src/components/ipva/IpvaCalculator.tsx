'use client';

import { useState } from 'react';
import { IpvaCalculatorForm } from './IpvaCalculatorForm';
import { IpvaResultCard } from './IpvaResultCard';
import { IpvaExplanation } from './IpvaExplanation';
import type { IpvaResult } from '@/lib/ipva/ipvaTypes';

const FAQ_ITEMS = [
  {
    question: 'O que é a PEC do IPVA?',
    answer:
      'É uma proposta em tramitação que busca alterar regras do IPVA, incluindo limite de alíquota e critérios de base de cálculo.',
  },
  {
    question: 'O IPVA pela PEC já está valendo?',
    answer:
      'Não. Esta calculadora faz apenas uma simulação informativa. O valor oficial continua dependendo da legislação vigente do estado.',
  },
  {
    question: 'Como calcular o IPVA atual?',
    answer:
      'Em geral, o IPVA é calculado multiplicando o valor venal ou FIPE do veículo pela alíquota aplicada no estado.',
  },
  {
    question: 'O cálculo por peso é oficial?',
    answer:
      'A proposta menciona o peso como critério, mas a fórmula final pode depender da tramitação e regulamentação. Por isso, o modo avançado é experimental.',
  },
];

function FaqAccordion() {
  return (
    <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold text-slate-950">Perguntas frequentes</h2>
        <p className="text-sm leading-6 text-slate-600">
          Dúvidas comuns sobre o IPVA e a PEC.
        </p>
      </div>

      <div className="mt-4 divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-slate-50 px-4">
        {FAQ_ITEMS.map((item) => (
          <details
            key={item.question}
            className="group border-b border-slate-200 py-3 last:border-b-0 last:pb-0"
          >
            <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-medium text-slate-900 [&::-webkit-details-marker]:hidden">
              <span>{item.question}</span>
              <svg
                aria-hidden="true"
                viewBox="0 0 20 20"
                fill="none"
                className="h-4 w-4 shrink-0 text-slate-400 transition-transform duration-200 group-open:rotate-180"
              >
                <path
                  d="M5 7.5L10 12.5L15 7.5"
                  stroke="currentColor"
                  strokeWidth="1.75"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </summary>
            <p className="mt-3 text-sm leading-6 text-slate-600">{item.answer}</p>
          </details>
        ))}
      </div>
    </article>
  );
}

export function IpvaCalculator() {
  const [result, setResult] = useState<IpvaResult | null>(null);

  function handleResultChange(nextResult: IpvaResult | null) {
    setResult(nextResult);
  }

  function handleClear() {
    setResult(null);
  }

  return (
    <>
      <section
        className="grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:items-start"
        aria-label="Simulador IPVA pela PEC"
      >
        <IpvaCalculatorForm
          onResultChange={handleResultChange}
          onClear={handleClear}
        />
        <IpvaResultCard result={result} />
      </section>
      <section id="explicacao" className="mt-8 scroll-mt-24">
        <IpvaExplanation />
      </section>
      <section id="duvidas-frequentes" className="mt-8 scroll-mt-24">
        <FaqAccordion />
      </section>
    </>
  );
}
