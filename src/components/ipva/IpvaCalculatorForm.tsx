'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useRef, type ReactNode } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { UF_OPTIONS } from '@/lib/fiscal/constants';
import { IPVA_RATES } from '@/data/ipvaRates';
import { parseDecimal } from '@/lib/utils/parseDecimal';
import { calculateIpva } from '@/lib/ipva/calculateIpva';
import type { IpvaResult, IpvaSimulationMode } from '@/lib/ipva/ipvaTypes';

const TIPO_VEICULO_OPTIONS = [
  { value: 'automovel', label: 'Automóvel' },
  { value: 'moto', label: 'Moto' },
  { value: 'caminhonete', label: 'Caminhonete/Utilitário' },
  { value: 'caminhao', label: 'Caminhão/Ônibus' },
] as const;

const ipvaFormSchema = z
  .object({
    valorFipe: z.preprocess(
      (value) => {
        if (typeof value === 'string' && value.trim().length === 0) return undefined;
        return parseDecimal(value as string | number | null | undefined);
      },
      z
        .number({ required_error: 'Informe o valor FIPE do veículo.' })
        .positive('O valor FIPE deve ser maior que zero.'),
    ),
    uf: z.string().min(1, 'Selecione o estado do veículo.'),
    tipoVeiculo: z.string().optional(),
    modoSimulacao: z.enum(['simplified', 'advanced']),
    pesoVeiculoKg: z.preprocess(
      (value) => {
        if (typeof value === 'string' && value.trim().length === 0) return undefined;
        return parseDecimal(value as string | number | null | undefined);
      },
      z.number().optional(),
    ),
  })
  .superRefine((data, ctx) => {
    if (data.modoSimulacao === 'advanced') {
      const peso = data.pesoVeiculoKg;
      if (peso == null || peso <= 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: 'Informe o peso do veículo no modo avançado.',
          path: ['pesoVeiculoKg'],
        });
      }
    }
  });

type IpvaFormInputs = z.infer<typeof ipvaFormSchema>;

interface IpvaCalculatorFormProps {
  onResultChange: (result: IpvaResult | null) => void;
  onClear: () => void;
}

function FieldShell({
  id,
  label,
  required = false,
  error,
  children,
}: {
  id: string;
  label: string;
  required?: boolean;
  error?: string;
  children: (ids: { errorId?: string }) => ReactNode;
}) {
  const errorId = error ? `${id}-error` : undefined;

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-slate-700" htmlFor={id}>
        {label}
        {required ? <span className="ml-1 text-slate-400">*</span> : null}
      </label>
      {children({ errorId })}
      {error ? (
        <p id={errorId} className="text-sm text-rose-600">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function formatAliquota(value: number): string {
  return `${value.toFixed(2).replace('.', ',')}%`;
}

export function IpvaCalculatorForm({
  onResultChange,
  onClear,
}: IpvaCalculatorFormProps) {
  const defaultValues: IpvaFormInputs = {
    valorFipe: undefined as unknown as number,
    uf: '',
    tipoVeiculo: 'automovel',
    modoSimulacao: 'simplified',
    pesoVeiculoKg: undefined as unknown as number,
  };

  const {
    register,
    watch,
    reset,
    clearErrors,
    formState: { errors },
  } = useForm<IpvaFormInputs>({
    resolver: zodResolver(ipvaFormSchema),
    defaultValues,
    mode: 'onChange',
  });

  const onResultChangeRef = useRef(onResultChange);
  const onClearRef = useRef(onClear);

  useEffect(() => {
    onResultChangeRef.current = onResultChange;
  }, [onResultChange]);

  useEffect(() => {
    onClearRef.current = onClear;
  }, [onClear]);

  const valorFipe = watch('valorFipe');
  const uf = watch('uf');
  const tipoVeiculo = watch('tipoVeiculo');
  const modoSimulacao = watch('modoSimulacao') as IpvaSimulationMode;
  const pesoVeiculoKg = watch('pesoVeiculoKg');

  const isAdvanced = modoSimulacao === 'advanced';

  const selectedRate = uf ? IPVA_RATES.find((r) => r.uf === uf) : undefined;

  useEffect(() => {
    const parsed = ipvaFormSchema.safeParse({
      valorFipe,
      uf,
      tipoVeiculo,
      modoSimulacao,
      pesoVeiculoKg,
    });

    if (parsed.success) {
      const result = calculateIpva({
        valorFipe: String(valorFipe ?? ''),
        uf,
        tipoVeiculo: tipoVeiculo ?? 'automovel',
        modoSimulacao,
        pesoVeiculoKg: isAdvanced ? String(pesoVeiculoKg ?? '') : '',
      });
      onResultChangeRef.current(result);
      return;
    }

    onClearRef.current();
  }, [valorFipe, uf, tipoVeiculo, modoSimulacao, pesoVeiculoKg, isAdvanced]);

  function handleReset() {
    reset(defaultValues);
    clearErrors();
    onClearRef.current();
  }

  const inputClassName =
    'mt-1 h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-base text-slate-900 shadow-sm outline-none transition placeholder:text-slate-400 focus:border-sky-400 focus:ring-4 focus:ring-sky-100';
  const selectClassName =
    'mt-1 h-11 w-full rounded-xl border border-slate-200 bg-white px-4 text-base text-slate-900 shadow-sm outline-none transition focus:border-sky-400 focus:ring-4 focus:ring-sky-100';

  return (
    <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <form className="space-y-5" onSubmit={(event) => event.preventDefault()} noValidate>
        <div className="space-y-1">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            Modo de simulação
          </h3>
        </div>

        <fieldset className="flex flex-col gap-3 sm:flex-row">
          <label
            htmlFor="modo-simplified"
            className={`flex flex-1 cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 transition ${
              !isAdvanced
                ? 'border-sky-300 bg-sky-50 ring-2 ring-sky-200'
                : 'border-slate-200 bg-white hover:border-slate-300'
            }`}
          >
            <input
              type="radio"
              id="modo-simplified"
              value="simplified"
              className="h-4 w-4 accent-sky-600"
              {...register('modoSimulacao')}
            />
            <div>
              <span className="text-sm font-medium text-slate-900">Simplificado</span>
              <p className="text-xs leading-5 text-slate-500">Teto de 1% sobre o valor FIPE</p>
            </div>
          </label>

          <label
            htmlFor="modo-advanced"
            className={`flex flex-1 cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 transition ${
              isAdvanced
                ? 'border-sky-300 bg-sky-50 ring-2 ring-sky-200'
                : 'border-slate-200 bg-white hover:border-slate-300'
            }`}
          >
            <input
              type="radio"
              id="modo-advanced"
              value="advanced"
              className="h-4 w-4 accent-sky-600"
              {...register('modoSimulacao')}
            />
            <div>
              <span className="text-sm font-medium text-slate-900">Avançado</span>
              <p className="text-xs leading-5 text-slate-500">Teto de 1% + peso do veículo</p>
            </div>
          </label>
        </fieldset>

        <div className="space-y-1">
          <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">
            Dados do veículo
          </h3>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <FieldShell
            id="valorFipe"
            label="Valor FIPE do veículo R$"
            required
            error={errors.valorFipe?.message}
          >
            {({ errorId }) => (
              <input
                id="valorFipe"
                type="text"
                inputMode="decimal"
                autoComplete="off"
                placeholder="50.000,00"
                className={inputClassName}
                aria-invalid={Boolean(errors.valorFipe)}
                aria-describedby={errorId}
                {...register('valorFipe')}
              />
            )}
          </FieldShell>

          <FieldShell
            id="uf"
            label="Estado do veículo"
            required
            error={errors.uf?.message}
          >
            {({ errorId }) => (
              <select
                id="uf"
                className={selectClassName}
                aria-invalid={Boolean(errors.uf)}
                aria-describedby={errorId}
                {...register('uf')}
              >
                <option value="">Selecione</option>
                {UF_OPTIONS.map((ufCode) => (
                  <option key={ufCode} value={ufCode}>
                    {ufCode}
                  </option>
                ))}
              </select>
            )}
          </FieldShell>
        </div>

        {selectedRate ? (
          <div className="rounded-2xl border border-sky-100 bg-sky-50 px-4 py-3 text-sm leading-6 text-sky-900">
            <p>
              Alíquota atual usada na simulação: <strong>{formatAliquota(selectedRate.aliquotaAtual)}</strong>
            </p>
            <p className="mt-1 text-xs text-sky-700">
              A alíquota pode variar conforme tipo de veículo, combustível, isenção e regras estaduais.
            </p>
          </div>
        ) : null}

        <div className="grid gap-4 sm:grid-cols-2">
          <FieldShell id="tipoVeiculo" label="Tipo de veículo">
            {() => (
              <select
                id="tipoVeiculo"
                className={selectClassName}
                {...register('tipoVeiculo')}
              >
                {TIPO_VEICULO_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            )}
          </FieldShell>

          {isAdvanced ? (
            <FieldShell
              id="pesoVeiculoKg"
              label="Peso do veículo em kg"
              required
              error={errors.pesoVeiculoKg?.message}
            >
              {({ errorId }) => (
                <input
                  id="pesoVeiculoKg"
                  type="text"
                  inputMode="numeric"
                  autoComplete="off"
                  placeholder="Ex: 1250"
                  className={inputClassName}
                  aria-invalid={Boolean(errors.pesoVeiculoKg)}
                  aria-describedby={errorId}
                  {...register('pesoVeiculoKg')}
                />
              )}
            </FieldShell>
          ) : null}
        </div>

        {isAdvanced ? (
          <p className="text-xs leading-5 text-slate-500">
            Use o peso aproximado em ordem de marcha. Essa simulação é experimental, pois a regra oficial ainda pode ser alterada.
          </p>
        ) : null}

        <p className="text-xs leading-5 text-slate-500">
          As alíquotas consideram o tipo Automóvel como padrão. A diferenciação por tipo de veículo será implementada em versões futuras conforme a legislação de cada estado.
        </p>

        <div className="flex flex-col gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex h-11 w-full items-center justify-center rounded-xl border border-slate-300 bg-white px-4 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-4 focus:ring-sky-200 sm:w-auto sm:min-w-[160px]"
          >
            Limpar
          </button>
        </div>
      </form>
    </article>
  );
}
