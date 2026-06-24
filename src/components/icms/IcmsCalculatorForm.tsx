'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useRef, useState, type ReactNode } from 'react';
import { useForm } from 'react-hook-form';
import { ICMS_EXAMPLES, type IcmsExample } from '@/lib/fiscal/examples';
import { UF_OPTIONS, type CalculationType } from '@/lib/fiscal/constants';
import { buildCalculationMemory } from '@/lib/fiscal/buildCalculationMemory';
import {
  calculateFiscal,
  calculateReverseIcmsFinal,
  normalizeFiscalValues,
} from '@/lib/fiscal/calculateFiscal';
import { icmsCalculatorSchema } from '@/lib/fiscal/schemas';
import type {
  IcmsCalculationView,
  IcmsCalculatorFormInput,
  IcmsCalculatorParsedValues,
} from '@/lib/fiscal/types';
import { IcmsQuickExamples } from './IcmsQuickExamples';
import { formatDecimal } from '@/lib/utils/formatPercent';
import { parseDecimal } from '@/lib/utils/parseDecimal';

const DEFAULT_FORM_VALUES: Omit<IcmsCalculatorFormInput, 'tipoCalculo'> = {
  valorProduto: '',
  frete: '',
  seguro: '',
  outrasDespesas: '',
  desconto: '',
  valorIcmsInformado: '',
  aliquotaIcms: '',
  valorIpiManual: '',
  aliquotaIpi: '',
  ufOrigem: '',
  ufDestino: 'SP',
  aliquotaOrigem: '',
  aliquotaInternaDestino: '',
  mva: '',
  reducaoBase: '',
  aliquotaPis: '',
  aliquotaCofins: '',
  creditoPis: '',
  creditoCofins: '',
  aliquotaFcp: '',
  aliquotaIbs: '',
  aliquotaCbs: '',
  creditoIbs: '',
  creditoCbs: '',
};

function buildDefaultValues(initialCalculationType: CalculationType): IcmsCalculatorFormInput {
  return {
    ...DEFAULT_FORM_VALUES,
    tipoCalculo: initialCalculationType,
    reducaoBase: initialCalculationType === 'icms_reverso' ? '0' : DEFAULT_FORM_VALUES.reducaoBase,
  };
}

interface IcmsCalculatorFormProps {
  onResultChange: (values: IcmsCalculationView) => void;
  onClear: () => void;
  initialCalculationType?: CalculationType;
}

function buildResult(values: IcmsCalculatorParsedValues): IcmsCalculationView {
  const normalizedValues = normalizeFiscalValues(values);
  const result = calculateFiscal(normalizedValues);
  const memory = buildCalculationMemory(normalizedValues, result);

  return {
    values: normalizedValues,
    result,
    memory,
  };
}

function FieldShell({
  id,
  label,
  required = false,
  helpText,
  error,
  children,
}: {
  id: string;
  label: string;
  required?: boolean;
  helpText?: string;
  error?: string;
  children: (ids: { helpId?: string; errorId?: string }) => ReactNode;
}) {
  const helpId = helpText ? `${id}-help` : undefined;
  const errorId = error ? `${id}-error` : undefined;

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-slate-700" htmlFor={id}>
        {label}
        {required ? <span className="ml-1 text-slate-400">*</span> : null}
      </label>
      {children({ helpId, errorId })}
      {helpText ? (
        <p id={helpId} className="text-xs leading-5 text-slate-500">
          {helpText}
        </p>
      ) : null}
      {error ? (
        <p id={errorId} className="text-sm text-rose-600">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function IcmsCalculatorForm({
  onResultChange,
  onClear,
  initialCalculationType = 'icms_proprio',
}: IcmsCalculatorFormProps) {
  const defaultValues = buildDefaultValues(initialCalculationType);

  const {
    register,
    reset,
    watch,
    setValue,
    clearErrors,
    formState: { errors },
  } = useForm<IcmsCalculatorFormInput>({
    resolver: zodResolver(icmsCalculatorSchema),
    defaultValues,
    mode: 'onChange',
  });

  const onResultChangeRef = useRef(onResultChange);
  const onClearRef = useRef(onClear);
  const feedbackTimerRef = useRef<number | null>(null);
  const [exampleFeedback, setExampleFeedback] = useState<string | null>(null);
  const [activeExampleId, setActiveExampleId] = useState<string | null>(null);

  useEffect(() => {
    onResultChangeRef.current = onResultChange;
  }, [onResultChange]);

  useEffect(() => {
    onClearRef.current = onClear;
  }, [onClear]);

  useEffect(() => {
    return () => {
      if (feedbackTimerRef.current) {
        window.clearTimeout(feedbackTimerRef.current);
      }
    };
  }, []);

  const tipoCalculo = watch('tipoCalculo');
  const valorProduto = watch('valorProduto');
  const frete = watch('frete');
  const seguro = watch('seguro');
  const outrasDespesas = watch('outrasDespesas');
  const desconto = watch('desconto');
  const valorIcmsInformado = watch('valorIcmsInformado');
  const aliquotaIcms = watch('aliquotaIcms');
  const valorIpiManual = watch('valorIpiManual');
  const aliquotaIpi = watch('aliquotaIpi');
  const ufOrigem = watch('ufOrigem');
  const ufDestino = watch('ufDestino');
  const aliquotaOrigem = watch('aliquotaOrigem');
  const aliquotaInternaDestino = watch('aliquotaInternaDestino');
  const mva = watch('mva');
  const reducaoBase = watch('reducaoBase');
  const aliquotaPis = watch('aliquotaPis');
  const aliquotaCofins = watch('aliquotaCofins');
  const creditoPis = watch('creditoPis');
  const creditoCofins = watch('creditoCofins');
  const aliquotaFcp = watch('aliquotaFcp');
  const aliquotaIbs = watch('aliquotaIbs');
  const aliquotaCbs = watch('aliquotaCbs');
  const creditoIbs = watch('creditoIbs');
  const creditoCbs = watch('creditoCbs');

  const isIcmsProprio = tipoCalculo === 'icms_proprio';
  const isIcmsSt = tipoCalculo === 'icms_st';
  const isIcmsCompleto = tipoCalculo === 'icms_e_icms_st';
  const isIcmsReverse = tipoCalculo === 'icms_reverso';
  const isIpi = tipoCalculo === 'ipi';
  const isPisCofins = tipoCalculo === 'pis_cofins';
  const isDifal = tipoCalculo === 'difal';
  const isFcp = tipoCalculo === 'fcp';
  const isIbsCbs = tipoCalculo === 'ibs_cbs';

  const showIcmsFiscalFields = isIcmsProprio || isIcmsSt || isIcmsCompleto || isDifal;
  const showIcmsReverseFields = isIcmsReverse;
  const showUfDestino = isIcmsSt || isIcmsCompleto || isDifal;
  const showIpiManualField = isIcmsSt || isIcmsCompleto;
  const showIpiRateField = isIcmsSt || isIcmsCompleto || isIpi;

  useEffect(() => {
    clearErrors();
  }, [tipoCalculo, clearErrors]);

  useEffect(() => {
    const formValuesForParse = {
      tipoCalculo,
      valorProduto,
      frete: isFcp ? '' : frete,
      seguro: isFcp ? '' : seguro,
      outrasDespesas: isFcp ? '' : outrasDespesas,
      desconto: isFcp ? '' : desconto,
      valorIcmsInformado,
      aliquotaIcms,
      valorIpiManual: isIpi || isFcp ? '' : valorIpiManual,
      aliquotaIpi,
      ufOrigem,
      ufDestino,
      aliquotaOrigem,
      aliquotaInternaDestino: isDifal || isIcmsSt || isIcmsCompleto ? aliquotaInternaDestino : '',
      mva,
      reducaoBase: isDifal || isIcmsSt || isIcmsCompleto || isIcmsReverse ? reducaoBase : '',
      aliquotaPis,
      aliquotaCofins,
      creditoPis,
      creditoCofins,
      aliquotaFcp: isFcp || isDifal ? aliquotaFcp : '',
      aliquotaIbs,
      aliquotaCbs,
      creditoIbs,
      creditoCbs,
    };

    const parsed = icmsCalculatorSchema.safeParse(formValuesForParse);

    if (parsed.success) {
      onResultChangeRef.current(buildResult(parsed.data as IcmsCalculatorParsedValues));
      return;
    }

    onClearRef.current();
  }, [
    tipoCalculo,
    valorProduto,
    frete,
    seguro,
    outrasDespesas,
    desconto,
    valorIcmsInformado,
    aliquotaIcms,
    valorIpiManual,
    aliquotaIpi,
    ufOrigem,
    ufDestino,
    aliquotaOrigem,
    aliquotaInternaDestino,
    mva,
    reducaoBase,
    aliquotaPis,
    aliquotaCofins,
    creditoPis,
    creditoCofins,
    aliquotaFcp,
    aliquotaIbs,
    aliquotaCbs,
    creditoIbs,
    creditoCbs,
  ]);

  useEffect(() => {
    if (!isIcmsReverse) {
      return;
    }

    if (reducaoBase.trim().length > 0) {
      syncReverseFinalFromReduction(reducaoBase);
    }
  }, [isIcmsReverse, valorProduto, aliquotaIcms, reducaoBase]);

  function flashFeedback(message: string) {
    setExampleFeedback(message);

    if (feedbackTimerRef.current) {
      window.clearTimeout(feedbackTimerRef.current);
    }

    feedbackTimerRef.current = window.setTimeout(() => {
      setExampleFeedback(null);
    }, 2200);
  }

  function handleReset() {
    reset(defaultValues);
    clearErrors();
    setActiveExampleId(null);
    setExampleFeedback(null);
    onClearRef.current();
  }

  function handleExampleSelect(example: IcmsExample) {
    reset(example.values);
    clearErrors();
    setActiveExampleId(example.id);
    flashFeedback('Exemplo carregado.');
  }

  const inputClassName =
    'mt-1 h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-base text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-sky-400 focus:ring-4 focus:ring-sky-100';
  const selectClassName =
    'mt-1 h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-base text-slate-900 shadow-sm outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100';
  const sectionClassName = 'space-y-4 border-b border-slate-100 pb-5 last:border-b-0 last:pb-0';

  function syncReverseFinalFromReduction(nextReduction: string) {
    if (nextReduction.trim().length === 0) {
      return;
    }

    const base = parseDecimal(valorProduto);
    const aliquota = parseDecimal(aliquotaIcms);
    const reduction = parseDecimal(nextReduction);

    if (base <= 0 || aliquota <= 0) {
      return;
    }

    const finalValue = calculateReverseIcmsFinal(base, aliquota, reduction);

    setValue('valorIcmsInformado', formatDecimal(finalValue, 2), {
      shouldDirty: true,
      shouldTouch: false,
      shouldValidate: false,
    });
  }

  const pageExamples = ICMS_EXAMPLES.filter(
    (e) => e.values.tipoCalculo === initialCalculationType,
  );

  return (
    <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <form className="space-y-5" onSubmit={(event) => event.preventDefault()} noValidate>
        {pageExamples.length > 0 ? (
          <section className={sectionClassName}>
            <div className="space-y-4">
              <IcmsQuickExamples
                examples={pageExamples}
                activeExampleId={activeExampleId}
                onSelectExample={handleExampleSelect}
              />

              {exampleFeedback ? (
                <p className="text-sm font-medium text-sky-700" aria-live="polite">
                  {exampleFeedback}
                </p>
              ) : null}
            </div>
          </section>
        ) : null}

        {showIcmsReverseFields ? (
          <section className={sectionClassName}>
            <div className="space-y-1">
              <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
                Cálculo reverso
              </h3>
              <p className="text-sm leading-6 text-slate-600">
                Informe o total dos produtos, a alíquota e a redução. O ICMS final é recalculado automaticamente.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <FieldShell
                id="valorProduto"
                label="Valor total dos produtos R$"
                required
                error={errors.valorProduto?.message}
              >
                {({ helpId, errorId }) => (
                  <input
                    id="valorProduto"
                    type="text"
                    inputMode="decimal"
                    autoComplete="off"
                    placeholder="8.254,40"
                    className={inputClassName}
                    aria-invalid={Boolean(errors.valorProduto)}
                    aria-describedby={[helpId, errorId].filter(Boolean).join(' ') || undefined}
                    {...register('valorProduto')}
                  />
                )}
              </FieldShell>

              <FieldShell
                id="aliquotaIcms"
                label="Alíquota ICMS %"
                required
                error={errors.aliquotaIcms?.message}
              >
                {({ helpId, errorId }) => (
                  <input
                    id="aliquotaIcms"
                    type="text"
                    inputMode="decimal"
                    autoComplete="off"
                    placeholder="12"
                    className={inputClassName}
                    aria-invalid={Boolean(errors.aliquotaIcms)}
                    aria-describedby={[helpId, errorId].filter(Boolean).join(' ') || undefined}
                    {...register('aliquotaIcms')}
                  />
                )}
              </FieldShell>

              <FieldShell
                id="reducaoBase"
                label="Redução da base %"
                required
                error={errors.reducaoBase?.message}
                helpText="Define o percentual de redução da base. Quanto maior a redução, menor a base de cálculo do ICMS final."
              >
                {({ helpId, errorId }) => (
                  <input
                    id="reducaoBase"
                    type="text"
                    inputMode="decimal"
                    autoComplete="off"
                    placeholder="70"
                    className={inputClassName}
                    aria-invalid={Boolean(errors.reducaoBase)}
                    aria-describedby={[helpId, errorId].filter(Boolean).join(' ') || undefined}
                    {...register('reducaoBase', {
                      onChange: (event) => {
                        const nextReduction = event.target.value;
                        syncReverseFinalFromReduction(nextReduction);
                      },
                    })}
                  />
                )}
              </FieldShell>
            </div>

            <p className="text-xs leading-5 text-slate-500">
              O ICMS final é ajustado a partir da base de produtos, alíquota e redução, com arredondamento para centavos.
            </p>
          </section>
        ) : null}

        {!showIcmsReverseFields ? (
          <section className={sectionClassName}>
          <div className="space-y-1">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              Valores da operação
            </h3>
          </div>

          {isFcp ? (
            <div className="grid gap-4 sm:grid-cols-2">
              <FieldShell
                id="valorProduto"
                label="Base de cálculo"
                required
                error={errors.valorProduto?.message}
              >
                {({ helpId, errorId }) => (
                  <input
                    id="valorProduto"
                    type="text"
                    inputMode="decimal"
                    autoComplete="off"
                    placeholder="0,00"
                    className={inputClassName}
                    aria-invalid={Boolean(errors.valorProduto)}
                    aria-describedby={[helpId, errorId].filter(Boolean).join(' ') || undefined}
                    {...register('valorProduto')}
                  />
                )}
              </FieldShell>

              <FieldShell id="aliquotaFcp" label="Alíquota FCP %" required error={errors.aliquotaFcp?.message}>
                {({ helpId, errorId }) => (
                  <input
                    id="aliquotaFcp"
                    type="text"
                    inputMode="decimal"
                    autoComplete="off"
                    placeholder="2"
                    className={inputClassName}
                    aria-invalid={Boolean(errors.aliquotaFcp)}
                    aria-describedby={[helpId, errorId].filter(Boolean).join(' ') || undefined}
                    {...register('aliquotaFcp')}
                  />
                )}
              </FieldShell>
            </div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2">
              <FieldShell id="valorProduto" label="Valor do produto" required error={errors.valorProduto?.message}>
                {({ helpId, errorId }) => (
                  <input
                    id="valorProduto"
                    type="text"
                    inputMode="decimal"
                    autoComplete="off"
                    placeholder="0,00"
                    className={inputClassName}
                    aria-invalid={Boolean(errors.valorProduto)}
                    aria-describedby={[helpId, errorId].filter(Boolean).join(' ') || undefined}
                    {...register('valorProduto')}
                  />
                )}
              </FieldShell>

              <FieldShell id="frete" label="Frete" error={errors.frete?.message}>
                {({ helpId, errorId }) => (
                  <input
                    id="frete"
                    type="text"
                    inputMode="decimal"
                    autoComplete="off"
                    placeholder="0,00"
                    className={inputClassName}
                    aria-invalid={Boolean(errors.frete)}
                    aria-describedby={[helpId, errorId].filter(Boolean).join(' ') || undefined}
                    {...register('frete')}
                  />
                )}
              </FieldShell>

              <FieldShell id="seguro" label="Seguro" error={errors.seguro?.message}>
                {({ helpId, errorId }) => (
                  <input
                    id="seguro"
                    type="text"
                    inputMode="decimal"
                    autoComplete="off"
                    placeholder="0,00"
                    className={inputClassName}
                    aria-invalid={Boolean(errors.seguro)}
                    aria-describedby={[helpId, errorId].filter(Boolean).join(' ') || undefined}
                    {...register('seguro')}
                  />
                )}
              </FieldShell>

              <FieldShell id="outrasDespesas" label="Outras despesas" error={errors.outrasDespesas?.message}>
                {({ helpId, errorId }) => (
                  <input
                    id="outrasDespesas"
                    type="text"
                    inputMode="decimal"
                    autoComplete="off"
                    placeholder="0,00"
                    className={inputClassName}
                    aria-invalid={Boolean(errors.outrasDespesas)}
                    aria-describedby={[helpId, errorId].filter(Boolean).join(' ') || undefined}
                    {...register('outrasDespesas')}
                  />
                )}
              </FieldShell>

              <FieldShell id="desconto" label="Desconto" error={errors.desconto?.message}>
                {({ helpId, errorId }) => (
                  <input
                    id="desconto"
                    type="text"
                    inputMode="decimal"
                    autoComplete="off"
                    placeholder="0,00"
                    className={inputClassName}
                    aria-invalid={Boolean(errors.desconto)}
                    aria-describedby={[helpId, errorId].filter(Boolean).join(' ') || undefined}
                    {...register('desconto')}
                  />
                )}
              </FieldShell>
            </div>
          )}
        </section>
        ) : null}

        {showIcmsFiscalFields ? (
          <section className={sectionClassName}>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              Dados fiscais
            </h3>

            <div className="grid gap-4 sm:grid-cols-2">
              <FieldShell id="ufOrigem" label="UF origem" required error={errors.ufOrigem?.message}>
                {({ helpId, errorId }) => (
                  <select
                    id="ufOrigem"
                    className={selectClassName}
                    aria-invalid={Boolean(errors.ufOrigem)}
                    aria-describedby={[helpId, errorId].filter(Boolean).join(' ') || undefined}
                    {...register('ufOrigem')}
                  >
                    <option value="">Selecione</option>
                    {UF_OPTIONS.map((uf) => (
                      <option key={uf} value={uf}>
                        {uf}
                      </option>
                    ))}
                  </select>
                )}
              </FieldShell>

              {showUfDestino ? (
                <FieldShell id="ufDestino" label="UF destino" required error={errors.ufDestino?.message}>
                  {({ helpId, errorId }) => (
                    <select
                      id="ufDestino"
                      className={selectClassName}
                      aria-invalid={Boolean(errors.ufDestino)}
                      aria-describedby={[helpId, errorId].filter(Boolean).join(' ') || undefined}
                      {...register('ufDestino')}
                    >
                      <option value="">Selecione</option>
                      {UF_OPTIONS.map((uf) => (
                        <option key={uf} value={uf}>
                          {uf}
                        </option>
                      ))}
                    </select>
                  )}
                </FieldShell>
              ) : null}

              <FieldShell
                id="aliquotaOrigem"
                label={isDifal ? 'Alíquota interestadual %' : 'Alíquota ICMS origem'}
                required
                error={errors.aliquotaOrigem?.message}
                helpText="Use a alíquota interestadual ou a informada para a operação."
              >
                {({ helpId, errorId }) => (
                  <input
                    id="aliquotaOrigem"
                    type="text"
                    inputMode="decimal"
                    autoComplete="off"
                    placeholder="12"
                    className={inputClassName}
                    aria-invalid={Boolean(errors.aliquotaOrigem)}
                    aria-describedby={[helpId, errorId].filter(Boolean).join(' ') || undefined}
                    {...register('aliquotaOrigem')}
                  />
                )}
              </FieldShell>

              {isDifal ? (
                <FieldShell
                  id="aliquotaInternaDestino"
                  label="Alíquota interna destino %"
                  required
                  error={errors.aliquotaInternaDestino?.message}
                >
                  {({ helpId, errorId }) => (
                    <input
                      id="aliquotaInternaDestino"
                      type="text"
                      inputMode="decimal"
                      autoComplete="off"
                      placeholder="18"
                      className={inputClassName}
                      aria-invalid={Boolean(errors.aliquotaInternaDestino)}
                      aria-describedby={[helpId, errorId].filter(Boolean).join(' ') || undefined}
                      {...register('aliquotaInternaDestino')}
                    />
                  )}
                </FieldShell>
              ) : null}

              {isDifal ? (
                <FieldShell
                  id="reducaoBase"
                  label="Redução de base %"
                  error={errors.reducaoBase?.message}
                  helpText="Opcional. Apenas para referência visual neste modo."
                >
                  {({ helpId, errorId }) => (
                    <input
                      id="reducaoBase"
                      type="text"
                      inputMode="decimal"
                      autoComplete="off"
                      placeholder="0"
                      className={inputClassName}
                      aria-invalid={Boolean(errors.reducaoBase)}
                      aria-describedby={[helpId, errorId].filter(Boolean).join(' ') || undefined}
                      {...register('reducaoBase')}
                    />
                  )}
                </FieldShell>
              ) : null}

              {isDifal ? (
                <FieldShell
                  id="aliquotaFcp"
                  label="Alíquota FCP %"
                  error={errors.aliquotaFcp?.message}
                  helpText="Opcional."
                >
                  {({ helpId, errorId }) => (
                    <input
                      id="aliquotaFcp"
                      type="text"
                      inputMode="decimal"
                      autoComplete="off"
                      placeholder="2"
                      className={inputClassName}
                      aria-invalid={Boolean(errors.aliquotaFcp)}
                      aria-describedby={[helpId, errorId].filter(Boolean).join(' ') || undefined}
                      {...register('aliquotaFcp')}
                    />
                  )}
                </FieldShell>
              ) : null}
            </div>

            <p className="text-xs leading-5 text-slate-500">
              Não há consulta automática de alíquotas por UF neste MVP.
            </p>
          </section>
        ) : null}

        {showIpiRateField ? (
          <section className={sectionClassName}>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">IPI</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              {showIpiManualField ? (
                <FieldShell id="valorIpiManual" label="Valor do IPI R$" error={errors.valorIpiManual?.message}>
                  {({ helpId, errorId }) => (
                    <input
                      id="valorIpiManual"
                      type="text"
                      inputMode="decimal"
                      autoComplete="off"
                      placeholder="0,00"
                      className={inputClassName}
                      aria-invalid={Boolean(errors.valorIpiManual)}
                      aria-describedby={[helpId, errorId].filter(Boolean).join(' ') || undefined}
                      {...register('valorIpiManual')}
                    />
                  )}
                </FieldShell>
              ) : null}

              <FieldShell id="aliquotaIpi" label="Alíquota IPI %" required error={errors.aliquotaIpi?.message}>
                {({ helpId, errorId }) => (
                  <input
                    id="aliquotaIpi"
                    type="text"
                    inputMode="decimal"
                    autoComplete="off"
                    placeholder="0"
                    className={inputClassName}
                    aria-invalid={Boolean(errors.aliquotaIpi)}
                    aria-describedby={[helpId, errorId].filter(Boolean).join(' ') || undefined}
                    {...register('aliquotaIpi')}
                  />
                )}
              </FieldShell>
            </div>
            {showIpiManualField ? (
              <p className="text-xs leading-5 text-slate-500">
                Se o valor do IPI for informado manualmente, ele terá prioridade sobre a alíquota.
              </p>
            ) : null}
          </section>
        ) : null}

        {isIcmsSt || isIcmsCompleto ? (
          <section className={sectionClassName}>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">ICMS-ST</h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <FieldShell
                id="aliquotaInternaDestino"
                label="Alíquota ICMS destino"
                required
                error={errors.aliquotaInternaDestino?.message}
              >
                {({ helpId, errorId }) => (
                  <input
                    id="aliquotaInternaDestino"
                    type="text"
                    inputMode="decimal"
                    autoComplete="off"
                    placeholder="18"
                    className={inputClassName}
                    aria-invalid={Boolean(errors.aliquotaInternaDestino)}
                    aria-describedby={[helpId, errorId].filter(Boolean).join(' ') || undefined}
                    {...register('aliquotaInternaDestino')}
                  />
                )}
              </FieldShell>

              <FieldShell id="mva" label="MVA %" required error={errors.mva?.message}>
                {({ helpId, errorId }) => (
                  <input
                    id="mva"
                    type="text"
                    inputMode="decimal"
                    autoComplete="off"
                    placeholder="40"
                    className={inputClassName}
                    aria-invalid={Boolean(errors.mva)}
                    aria-describedby={[helpId, errorId].filter(Boolean).join(' ') || undefined}
                    {...register('mva')}
                  />
                )}
              </FieldShell>

              <FieldShell id="reducaoBase" label="Redução de base %" error={errors.reducaoBase?.message}>
                {({ helpId, errorId }) => (
                  <input
                    id="reducaoBase"
                    type="text"
                    inputMode="decimal"
                    autoComplete="off"
                    placeholder="0"
                    className={inputClassName}
                    aria-invalid={Boolean(errors.reducaoBase)}
                    aria-describedby={[helpId, errorId].filter(Boolean).join(' ') || undefined}
                    {...register('reducaoBase')}
                  />
                )}
              </FieldShell>
            </div>
            <p className="text-xs leading-5 text-slate-500">
              A redução de base é opcional e reduz a base do ICMS-ST antes da alíquota interna.
            </p>
          </section>
        ) : null}

        {isPisCofins ? (
          <section className={sectionClassName}>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              PIS/COFINS
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <FieldShell id="aliquotaPis" label="Alíquota PIS %" required error={errors.aliquotaPis?.message}>
                {({ helpId, errorId }) => (
                  <input
                    id="aliquotaPis"
                    type="text"
                    inputMode="decimal"
                    autoComplete="off"
                    placeholder="1,65"
                    className={inputClassName}
                    aria-invalid={Boolean(errors.aliquotaPis)}
                    aria-describedby={[helpId, errorId].filter(Boolean).join(' ') || undefined}
                    {...register('aliquotaPis')}
                  />
                )}
              </FieldShell>

              <FieldShell id="creditoPis" label="Crédito PIS R$" error={errors.creditoPis?.message}>
                {({ helpId, errorId }) => (
                  <input
                    id="creditoPis"
                    type="text"
                    inputMode="decimal"
                    autoComplete="off"
                    placeholder="0,00"
                    className={inputClassName}
                    aria-invalid={Boolean(errors.creditoPis)}
                    aria-describedby={[helpId, errorId].filter(Boolean).join(' ') || undefined}
                    {...register('creditoPis')}
                  />
                )}
              </FieldShell>

              <FieldShell
                id="aliquotaCofins"
                label="Alíquota COFINS %"
                required
                error={errors.aliquotaCofins?.message}
              >
                {({ helpId, errorId }) => (
                  <input
                    id="aliquotaCofins"
                    type="text"
                    inputMode="decimal"
                    autoComplete="off"
                    placeholder="7,60"
                    className={inputClassName}
                    aria-invalid={Boolean(errors.aliquotaCofins)}
                    aria-describedby={[helpId, errorId].filter(Boolean).join(' ') || undefined}
                    {...register('aliquotaCofins')}
                  />
                )}
              </FieldShell>

              <FieldShell id="creditoCofins" label="Crédito COFINS R$" error={errors.creditoCofins?.message}>
                {({ helpId, errorId }) => (
                  <input
                    id="creditoCofins"
                    type="text"
                    inputMode="decimal"
                    autoComplete="off"
                    placeholder="0,00"
                    className={inputClassName}
                    aria-invalid={Boolean(errors.creditoCofins)}
                    aria-describedby={[helpId, errorId].filter(Boolean).join(' ') || undefined}
                    {...register('creditoCofins')}
                  />
                )}
              </FieldShell>
            </div>
          </section>
        ) : null}

        {isIbsCbs ? (
          <section className={sectionClassName}>
            <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              IBS/CBS
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <FieldShell id="aliquotaIbs" label="Alíquota IBS %" required error={errors.aliquotaIbs?.message}>
                {({ helpId, errorId }) => (
                  <input
                    id="aliquotaIbs"
                    type="text"
                    inputMode="decimal"
                    autoComplete="off"
                    placeholder="8"
                    className={inputClassName}
                    aria-invalid={Boolean(errors.aliquotaIbs)}
                    aria-describedby={[helpId, errorId].filter(Boolean).join(' ') || undefined}
                    {...register('aliquotaIbs')}
                  />
                )}
              </FieldShell>

              <FieldShell id="creditoIbs" label="Crédito IBS R$" error={errors.creditoIbs?.message}>
                {({ helpId, errorId }) => (
                  <input
                    id="creditoIbs"
                    type="text"
                    inputMode="decimal"
                    autoComplete="off"
                    placeholder="0,00"
                    className={inputClassName}
                    aria-invalid={Boolean(errors.creditoIbs)}
                    aria-describedby={[helpId, errorId].filter(Boolean).join(' ') || undefined}
                    {...register('creditoIbs')}
                  />
                )}
              </FieldShell>

              <FieldShell id="aliquotaCbs" label="Alíquota CBS %" required error={errors.aliquotaCbs?.message}>
                {({ helpId, errorId }) => (
                  <input
                    id="aliquotaCbs"
                    type="text"
                    inputMode="decimal"
                    autoComplete="off"
                    placeholder="9"
                    className={inputClassName}
                    aria-invalid={Boolean(errors.aliquotaCbs)}
                    aria-describedby={[helpId, errorId].filter(Boolean).join(' ') || undefined}
                    {...register('aliquotaCbs')}
                  />
                )}
              </FieldShell>

              <FieldShell id="creditoCbs" label="Crédito CBS R$" error={errors.creditoCbs?.message}>
                {({ helpId, errorId }) => (
                  <input
                    id="creditoCbs"
                    type="text"
                    inputMode="decimal"
                    autoComplete="off"
                    placeholder="0,00"
                    className={inputClassName}
                    aria-invalid={Boolean(errors.creditoCbs)}
                    aria-describedby={[helpId, errorId].filter(Boolean).join(' ') || undefined}
                    {...register('creditoCbs')}
                  />
                )}
              </FieldShell>
            </div>
          </section>
        ) : null}

        <div className="flex flex-col gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex h-11 w-full items-center justify-center rounded-xl border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-sky-200 sm:w-auto sm:min-w-[160px]"
          >
            Limpar campos
          </button>
        </div>
      </form>
    </article>
  );
}
