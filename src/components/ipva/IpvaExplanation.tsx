'use client';

import { IPVA_HELP_CONTENT } from '@/lib/ipva/ipvaHelpContent';

function ExplanationItem({
  title,
  children,
}: {
  title: string;
  children: string;
}) {
  return (
    <details className="group border-b border-slate-200 py-3 last:border-b-0 last:pb-0">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 text-sm font-medium text-slate-900 [&::-webkit-details-marker]:hidden">
        <span>{title}</span>
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
      <p className="mt-3 text-sm leading-6 text-slate-600">{children}</p>
    </details>
  );
}

export function IpvaExplanation() {
  return (
    <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="space-y-2">
        <h2 className="text-xl font-semibold text-slate-950">Entenda o cálculo</h2>
        <p className="text-sm leading-6 text-slate-600">{IPVA_HELP_CONTENT.subtitle}</p>
      </div>

      <div className="mt-4 divide-y divide-slate-200 rounded-2xl border border-slate-200 bg-slate-50 px-4">
        {IPVA_HELP_CONTENT.items.map((item) => (
          <ExplanationItem key={item.title} title={item.title}>
            {item.content}
          </ExplanationItem>
        ))}
      </div>
    </article>
  );
}
