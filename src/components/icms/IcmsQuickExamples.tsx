'use client';

import type { IcmsExample } from '@/lib/fiscal/examples';

interface IcmsQuickExamplesProps {
  examples: IcmsExample[];
  activeExampleId: string | null;
  onSelectExample: (example: IcmsExample) => void;
}

export function IcmsQuickExamples({
  examples,
  activeExampleId,
  onSelectExample,
}: IcmsQuickExamplesProps) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between gap-3">
        <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-500">
          Exemplos prontos
        </h3>
        <p className="text-xs text-slate-500">Clique para preencher automaticamente.</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {examples.map((example) => {
          const active = activeExampleId === example.id;

          return (
            <button
              key={example.id}
              type="button"
              title={example.subtitle}
              aria-pressed={active}
              onClick={() => onSelectExample(example)}
              className={`inline-flex shrink-0 items-center rounded-full border px-3 py-2 text-sm font-medium transition focus:outline-none focus:ring-4 focus:ring-sky-200 ${
                active
                  ? 'border-sky-600 bg-sky-600 text-white shadow-sm'
                  : 'border-slate-200 bg-white text-slate-700 hover:border-sky-300 hover:bg-sky-50'
              }`}
            >
              {example.title}
            </button>
          );
        })}
      </div>
    </div>
  );
}
