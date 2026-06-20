'use client';

import { useEffect, useRef, useState } from 'react';
import { formatCurrency } from '@/lib/utils/formatCurrency';
import { APP_NAME, FISCAL_WARNING } from '@/lib/site/content';
import type { IcmsCalculationView } from '@/lib/fiscal/types';

interface IcmsResultCardProps {
  calculation: IcmsCalculationView | null;
}

function MetricRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-white/10 py-2 last:border-b-0 last:pb-0">
      <span className="text-sm text-slate-300">{label}</span>
      <span className="text-sm font-semibold text-white">{value}</span>
    </div>
  );
}

function CompactRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 py-2 text-sm">
      <span className="text-slate-500">{label}</span>
      <span className="text-right font-medium text-slate-950">{value}</span>
    </div>
  );
}

function MessageBanner({
  tone,
  children,
}: {
  tone: 'info' | 'warning';
  children: string;
}) {
  const classes =
    tone === 'warning'
      ? 'border-amber-200 bg-amber-50 text-amber-900'
      : 'border-sky-200 bg-sky-50 text-sky-900';

  return <div className={`rounded-2xl border px-4 py-3 text-sm leading-6 ${classes}`}>{children}</div>;
}

function DisclosureIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 20 20"
      fill="none"
      className="h-4 w-4 shrink-0 text-slate-500 transition-transform duration-200 group-open:rotate-180"
    >
      <path
        d="M5 7.5L10 12.5L15 7.5"
        stroke="currentColor"
        strokeWidth="1.75"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

async function copyTextToClipboard(text: string) {
  if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.setAttribute('readonly', 'true');
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.select();

  const success = document.execCommand('copy');
  document.body.removeChild(textarea);

  if (!success) {
    throw new Error('copy_failed');
  }
}

export function IcmsResultCard({ calculation }: IcmsResultCardProps) {
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const feedbackTimerRef = useRef<number | null>(null);

  useEffect(() => {
    setFeedbackMessage(null);
  }, [calculation]);

  useEffect(() => {
    return () => {
      if (feedbackTimerRef.current) {
        window.clearTimeout(feedbackTimerRef.current);
      }
    };
  }, []);

  if (!calculation) {
    return (
      <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 lg:sticky lg:top-6" aria-live="polite" aria-atomic="true">
        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-slate-950">Resultado</h2>
          <p className="text-sm leading-6 text-slate-600">
            Preencha os dados para visualizar o resultado.
          </p>
          <p className="text-sm leading-6 text-slate-500">
            O resumo, os impostos calculados e a memória de cálculo aparecerão aqui.
          </p>
        </div>
      </article>
    );
  }

  const { result, memory } = calculation;

  function setTimedFeedback(message: string) {
    setFeedbackMessage(message);

    if (feedbackTimerRef.current) {
      window.clearTimeout(feedbackTimerRef.current);
    }

    feedbackTimerRef.current = window.setTimeout(() => {
      setFeedbackMessage(null);
    }, 2200);
  }

  async function handleCopyMemory() {
    try {
      await copyTextToClipboard(memory.copyText);
      setTimedFeedback('Memória copiada!');
    } catch {
      setTimedFeedback('Não foi possível copiar automaticamente.');
    }
  }

  async function handleShareCalculation() {
    const shareData = {
      title: APP_NAME,
      text: memory.shareText,
    };

    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share(shareData);
        setTimedFeedback('Resumo pronto para compartilhar!');
        return;
      } catch (error) {
        if (error instanceof DOMException && error.name === 'AbortError') {
          return;
        }
      }
    }

    try {
      await copyTextToClipboard(memory.shareText);
      setTimedFeedback('Resumo copiado para compartilhamento!');
    } catch {
      setTimedFeedback('Não foi possível copiar automaticamente.');
    }
  }

  return (
    <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 lg:sticky lg:top-6" aria-live="polite" aria-atomic="true">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold text-slate-950">Resultado</h2>
        <p className="text-sm leading-6 text-slate-600">
          Resumo rápido da operação e memória de cálculo.
        </p>
      </div>

      <div className="mt-5 space-y-4">
        <section className="rounded-3xl bg-slate-950 p-5 text-white">
          <p className="text-sm text-slate-300">Total estimado</p>
          <p className="mt-1 text-3xl font-semibold tracking-tight">
            {formatCurrency(result.valorTotal)}
          </p>

          <div className="mt-4 grid gap-2">
            {result.summaryMetrics.map((metric) => (
              <MetricRow key={metric.label} label={metric.label} value={formatCurrency(metric.value)} />
            ))}
          </div>
        </section>

        {result.messages.map((message, index) => (
          <MessageBanner key={`${message.tone}-${index}`} tone={message.tone}>
            {message.text}
          </MessageBanner>
        ))}

        <details className="group rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:border-slate-300">
          <summary className="-mx-2 flex cursor-pointer list-none items-center justify-between gap-3 rounded-xl px-2 py-1 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-200 [&::-webkit-details-marker]:hidden">
            <span>Dados utilizados no cálculo</span>
            <DisclosureIcon />
          </summary>

          <div className="mt-4 divide-y divide-slate-200">
            {memory.inputLines.map((item) => (
              <CompactRow key={item.label} label={item.label} value={item.value} />
            ))}
          </div>
        </details>

        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <button
            type="button"
            onClick={handleCopyMemory}
            className="inline-flex h-11 w-full items-center justify-center whitespace-nowrap rounded-xl border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-sky-200 sm:w-auto sm:min-w-[200px]"
          >
            Copiar memória de cálculo
          </button>
          <button
            type="button"
            onClick={handleShareCalculation}
            className="inline-flex h-11 w-full items-center justify-center whitespace-nowrap rounded-xl bg-sky-600 px-4 text-sm font-semibold text-white transition hover:bg-sky-700 focus:outline-none focus:ring-4 focus:ring-sky-200 sm:w-auto sm:min-w-[200px]"
          >
            Compartilhar cálculo fiscal
          </button>
        </div>

        {feedbackMessage ? (
          <p className="text-sm font-medium text-sky-700" aria-live="polite">
            {feedbackMessage}
          </p>
        ) : null}

        <details className="group rounded-2xl border border-slate-200 bg-white p-4 transition hover:border-slate-300">
          <summary className="-mx-2 flex cursor-pointer list-none items-center justify-between gap-3 rounded-xl px-2 py-1 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-200 [&::-webkit-details-marker]:hidden">
            <span>Memória de cálculo</span>
            <DisclosureIcon />
          </summary>

          <div className="mt-4 space-y-4">
            {memory.sections.map((section) => (
              <div key={section.title} className="space-y-3">
                {section.lines.map((entry) => (
                  <div key={entry.title} className="border-b border-slate-100 pb-3 last:border-b-0 last:pb-0">
                    <p className="text-sm font-medium text-slate-900">{entry.title}</p>
                    <p className="mt-1 text-sm leading-6 text-slate-600">{entry.formula}</p>
                    <p className="mt-2 font-mono text-sm leading-6 text-slate-900">{entry.calculation}</p>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </details>

        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-900">
          {memory.fiscalWarning}
        </div>
      </div>
    </article>
  );
}
