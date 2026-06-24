'use client';

import { useEffect, useRef, useState } from 'react';
import { formatCurrency } from '@/lib/utils/formatCurrency';
import { formatPercent } from '@/lib/utils/formatPercent';
import type { IpvaResult } from '@/lib/ipva/ipvaTypes';

const IPVA_WARNING =
  'Esta é uma simulação informativa baseada no teto de 1% proposto pela PEC do IPVA. O valor oficial do IPVA depende da legislação vigente do estado, tipo de veículo, possíveis descontos, isenções e regras específicas da Secretaria da Fazenda.';

const IPVA_ADVANCED_WARNING =
  'A simulação por peso é experimental e serve apenas para estimativa. A fórmula oficial poderá mudar conforme a tramitação e regulamentação da PEC.';

interface IpvaResultCardProps {
  result: IpvaResult | null;
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

function formatAliquota(value: number): string {
  return `${value.toFixed(2).replace('.', ',')}%`;
}

function formatFatorPeso(value: number): string {
  return value.toFixed(2).replace('.', ',');
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

export function IpvaResultCard({ result }: IpvaResultCardProps) {
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const feedbackTimerRef = useRef<number | null>(null);

  useEffect(() => {
    setFeedbackMessage(null);
  }, [result]);

  useEffect(() => {
    return () => {
      if (feedbackTimerRef.current) {
        window.clearTimeout(feedbackTimerRef.current);
      }
    };
  }, []);

  if (!result) {
    return (
      <article
        className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 lg:sticky lg:top-6"
        aria-live="polite"
        aria-atomic="true"
      >
        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-slate-950">Resultado</h2>
          <p className="text-sm leading-6 text-slate-600">
            Preencha os dados para visualizar o resultado.
          </p>
          <p className="text-sm leading-6 text-slate-500">
            O IPVA atual estimado, a simulação pela PEC e a economia aparecerão aqui.
          </p>
        </div>
      </article>
    );
  }

  const {
    valorFipe,
    uf,
    ufNome,
    aliquotaAtual,
    ipvaAtual,
    ipvaPec,
    economia,
    percentualEconomia,
    mensagemEconomiaZero,
    modoSimulacao,
    advanced,
  } = result;

  const isAdvanced = modoSimulacao === 'advanced';
  const hasNegativeEconomy = !mensagemEconomiaZero && ipvaAtual <= (isAdvanced && advanced ? advanced.ipvaPecAvancado : ipvaPec);

  const simuladoLabel = isAdvanced ? 'Teto máximo pela PEC, 1%' : 'Simulação pela PEC';
  const simuladoValue = isAdvanced ? ipvaPec : ipvaPec;

  function setTimedFeedback(message: string) {
    setFeedbackMessage(message);

    if (feedbackTimerRef.current) {
      window.clearTimeout(feedbackTimerRef.current);
    }

    feedbackTimerRef.current = window.setTimeout(() => {
      setFeedbackMessage(null);
    }, 2200);
  }

  function buildMemoryText() {
    const lines = [
      'Simulador IPVA pela PEC',
      '',
      'Dados informados:',
      `Valor FIPE informado: ${formatCurrency(valorFipe)}`,
      `UF selecionada: ${uf}`,
      `Alíquota atual estimada: ${formatAliquota(aliquotaAtual)}`,
    ];

    if (isAdvanced && advanced) {
      lines.push(`Peso informado: ${advanced.pesoVeiculo} kg`);
      lines.push(`Fator de peso aplicado: ${formatFatorPeso(advanced.fatorPeso)}`);
    }

    lines.push(
      '',
      'IPVA atual:',
      `${formatCurrency(valorFipe)} × ${formatAliquota(aliquotaAtual)} = ${formatCurrency(ipvaAtual)}`,
      '',
      'Teto máximo pela PEC:',
      `${formatCurrency(valorFipe)} × 1,00% = ${formatCurrency(ipvaPec)}`,
    );

    if (isAdvanced && advanced) {
      lines.push(
        '',
        'Simulação experimental por peso:',
        `${formatCurrency(advanced.tetoPec)} × ${formatFatorPeso(advanced.fatorPeso)} = ${formatCurrency(advanced.ipvaPecAvancado)}`,
      );
    }

    lines.push(
      '',
      'Economia estimada:',
      isAdvanced && advanced
        ? `${formatCurrency(ipvaAtual)} - ${formatCurrency(advanced.ipvaPecAvancado)} = ${formatCurrency(economia)}`
        : `${formatCurrency(ipvaAtual)} - ${formatCurrency(ipvaPec)} = ${formatCurrency(economia)}`,
      '',
      IPVA_WARNING,
    );

    if (isAdvanced) {
      lines.push('', IPVA_ADVANCED_WARNING);
    }

    return lines.join('\n');
  }

  function buildShareText() {
    const lines = [
      'Simulei meu IPVA na Calculadora Fiscal Brasil:',
      `Valor FIPE: ${formatCurrency(valorFipe)}`,
      `UF: ${uf}`,
      `IPVA atual estimado: ${formatCurrency(ipvaAtual)}`,
    ];

    if (isAdvanced && advanced) {
      lines.push(`Modo: Avançado (teto 1% + peso ${advanced.pesoVeiculo} kg)`);
      lines.push(`Simulação experimental por peso: ${formatCurrency(advanced.ipvaPecAvancado)}`);
    } else {
      lines.push(`Simulação pela PEC: ${formatCurrency(ipvaPec)}`);
    }

    lines.push(`Economia estimada: ${formatCurrency(economia)}`);
    lines.push('');
    lines.push('Simulação informativa. Consulte sempre as regras oficiais do seu estado.');

    return lines.join('\n');
  }

  async function handleCopyMemory() {
    try {
      await copyTextToClipboard(buildMemoryText());
      setTimedFeedback('Memória copiada!');
    } catch {
      setTimedFeedback('Não foi possível copiar automaticamente.');
    }
  }

  async function handleShareCalculation() {
    const shareData = {
      title: 'Simulador IPVA pela PEC',
      text: buildShareText(),
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
      await copyTextToClipboard(buildShareText());
      setTimedFeedback('Resumo copiado para compartilhamento!');
    } catch {
      setTimedFeedback('Não foi possível copiar automaticamente.');
    }
  }

  const economiaDisplay = hasNegativeEconomy
    ? 'A simulação não gera economia estimada.'
    : formatCurrency(economia);

  return (
    <article
      className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6 lg:sticky lg:top-6"
      aria-live="polite"
      aria-atomic="true"
    >
      <div className="space-y-2">
        <h2 className="text-xl font-semibold text-slate-950">Resultado da simulação</h2>
        <p className="text-sm leading-6 text-slate-600">
          Comparação entre o IPVA atual estimado e a simulação pela PEC.
        </p>
      </div>

      <div className="mt-5 space-y-4">
        <section className="rounded-3xl bg-slate-950 p-5 text-white">
          <p className="text-sm text-slate-300">Economia anual estimada</p>
          <p
            className={`mt-1 text-3xl font-semibold tracking-tight ${hasNegativeEconomy ? 'text-slate-400' : ''}`}
          >
            {economiaDisplay}
          </p>

          <div className="mt-4 grid gap-2">
            <MetricRow label="IPVA atual estimado" value={formatCurrency(ipvaAtual)} />
            <MetricRow label={simuladoLabel} value={formatCurrency(simuladoValue)} />
            {isAdvanced && advanced ? (
              <>
                <MetricRow
                  label="Simulação experimental por peso"
                  value={formatCurrency(advanced.ipvaPecAvancado)}
                />
                <MetricRow
                  label="Fator de peso aplicado"
                  value={formatFatorPeso(advanced.fatorPeso)}
                />
              </>
            ) : null}
            {percentualEconomia > 0 ? (
              <MetricRow label="Percentual de economia" value={formatPercent(percentualEconomia)} />
            ) : null}
          </div>
        </section>

        {isAdvanced ? (
          <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-900">
            {IPVA_ADVANCED_WARNING}
          </div>
        ) : null}

        {mensagemEconomiaZero ? (
          <div className="rounded-2xl border border-sky-200 bg-sky-50 px-4 py-3 text-sm leading-6 text-sky-900">
            {mensagemEconomiaZero}
          </div>
        ) : null}

        <details className="group rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:border-slate-300">
          <summary className="-mx-2 flex cursor-pointer list-none items-center justify-between gap-3 rounded-xl px-2 py-1 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-sky-200 [&::-webkit-details-marker]:hidden">
            <span>Ver memória detalhada</span>
            <DisclosureIcon />
          </summary>

          <div className="mt-4 divide-y divide-slate-200">
            <CompactRow label="Valor FIPE informado" value={formatCurrency(valorFipe)} />
            <CompactRow label="UF selecionada" value={`${uf} (${ufNome})`} />
            <CompactRow label="Alíquota atual estimada" value={formatAliquota(aliquotaAtual)} />
            <CompactRow
              label="Modo de simulação"
              value={isAdvanced ? 'Avançado' : 'Simplificado'}
            />
            {isAdvanced && advanced ? (
              <CompactRow label="Peso informado" value={`${advanced.pesoVeiculo} kg`} />
            ) : null}
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
            Compartilhar cálculo
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
            <div className="space-y-3">
              <div className="border-b border-slate-100 pb-3 last:border-b-0 last:pb-0">
                <p className="text-sm font-medium text-slate-900">IPVA atual</p>
                <p className="mt-1 text-sm leading-6 text-slate-600">
                  IPVA atual = Valor FIPE × Alíquota do estado
                </p>
                <p className="mt-2 font-mono text-sm leading-6 text-slate-900">
                  {formatCurrency(valorFipe)} × {formatAliquota(aliquotaAtual)} = {formatCurrency(ipvaAtual)}
                </p>
              </div>

              <div className="border-b border-slate-100 pb-3 last:border-b-0 last:pb-0">
                <p className="text-sm font-medium text-slate-900">Teto máximo pela PEC</p>
                <p className="mt-1 text-sm leading-6 text-slate-600">
                  Teto PEC = Valor FIPE × 1%
                </p>
                <p className="mt-2 font-mono text-sm leading-6 text-slate-900">
                  {formatCurrency(valorFipe)} × 1,00% = {formatCurrency(ipvaPec)}
                </p>
              </div>

              {isAdvanced && advanced ? (
                <div className="border-b border-slate-100 pb-3 last:border-b-0 last:pb-0">
                  <p className="text-sm font-medium text-slate-900">Simulação experimental por peso</p>
                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    IPVA experimental = Teto PEC × Fator de peso
                  </p>
                  <p className="mt-2 font-mono text-sm leading-6 text-slate-900">
                    {formatCurrency(advanced.tetoPec)} × {formatFatorPeso(advanced.fatorPeso)} = {formatCurrency(advanced.ipvaPecAvancado)}
                  </p>
                </div>
              ) : null}

              <div className="border-b border-slate-100 pb-3 last:border-b-0 last:pb-0">
                <p className="text-sm font-medium text-slate-900">Economia estimada</p>
                <p className="mt-1 text-sm leading-6 text-slate-600">
                  Economia = IPVA atual - IPVA simulado (limitado a zero)
                </p>
                <p className="mt-2 font-mono text-sm leading-6 text-slate-900">
                  {isAdvanced && advanced
                    ? `${formatCurrency(ipvaAtual)} - ${formatCurrency(advanced.ipvaPecAvancado)} = ${formatCurrency(economia)}`
                    : `${formatCurrency(ipvaAtual)} - ${formatCurrency(ipvaPec)} = ${formatCurrency(economia)}`}
                </p>
              </div>
            </div>
          </div>
        </details>

        <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm leading-6 text-amber-900">
          {IPVA_WARNING}
        </div>
      </div>
    </article>
  );
}
