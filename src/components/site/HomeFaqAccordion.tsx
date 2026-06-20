'use client';

import { useState } from 'react';
import { HOME_FAQ_ITEMS } from '@/lib/site/homeContent';

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 20 20"
      fill="none"
      className={`h-4 w-4 shrink-0 text-slate-400 transition-transform duration-200 ${
        open ? 'rotate-180' : ''
      }`}
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

export function HomeFaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      {HOME_FAQ_ITEMS.map((item, index) => {
        const open = openIndex === index;
        const buttonId = `home-faq-button-${index}`;
        const panelId = `home-faq-panel-${index}`;

        return (
          <div key={item.question} className="border-b border-slate-200 last:border-b-0">
            <button
              id={buttonId}
              type="button"
              className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left text-sm font-semibold text-slate-900 transition hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-sky-200 sm:px-6"
              aria-expanded={open}
              aria-controls={panelId}
              onClick={() => setOpenIndex(open ? null : index)}
            >
              <span>{item.question}</span>
              <ChevronIcon open={open} />
            </button>

            <div
              id={panelId}
              role="region"
              aria-labelledby={buttonId}
              hidden={!open}
              className="px-5 pb-4 text-sm leading-6 text-slate-600 sm:px-6"
            >
              {item.answer}
            </div>
          </div>
        );
      })}
    </div>
  );
}
