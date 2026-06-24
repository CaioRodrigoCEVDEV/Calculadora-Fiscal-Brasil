import { calculateIcms } from '@/lib/icms/calculateIcms';
import type { IcmsCalculationResult as LegacyIcmsCalculationResult, IcmsCalculatorFormValues as LegacyIcmsCalculatorFormValues } from '@/lib/icms/types';
import { CALCULATION_TYPE_LABELS } from './constants';
import { formatCurrency } from '@/lib/utils/formatCurrency';
import type {
  CalculationMessage,
  CalculationMetric,
  DifalCalculationResult,
  FcpCalculationResult,
  IbsCbsCalculationResult,
  IcmsCalculatorFormValues,
  IcmsCalculatorParsedValues,
  IcmsProprioCalculationResult,
  IcmsReverseCalculationResult,
  IcmsStCalculationResult,
  IpiCalculationResult,
  IpiSource,
  PisCofinsCalculationResult,
  FiscalCalculationResult,
} from './types';

function roundToCents(value: number) {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

export function calculateReverseIcmsBaseReduzida(
  valorProduto: number,
  reducaoBase: number,
) {
  return roundToCents(valorProduto * (1 - reducaoBase / 100));
}

export function calculateReverseIcmsFinal(
  valorProduto: number,
  aliquotaIcms: number,
  reducaoBase: number,
) {
  return roundToCents(
    calculateReverseIcmsBaseReduzida(valorProduto, reducaoBase) * (aliquotaIcms / 100),
  );
}

export function calculateReverseIcmsReduction(
  valorProduto: number,
  aliquotaIcms: number,
  valorIcmsFinal: number,
) {
  const baseSemReducao = valorProduto * (aliquotaIcms / 100);

  if (baseSemReducao <= 0) {
    return 0;
  }

  return 100 - (valorIcmsFinal / baseSemReducao) * 100;
}

function calculateBaseOperation(values: Pick<
  IcmsCalculatorFormValues,
  'valorProduto' | 'frete' | 'seguro' | 'outrasDespesas' | 'desconto'
>) {
  return roundToCents(
    values.valorProduto + values.frete + values.seguro + values.outrasDespesas - values.desconto,
  );
}

function resolveIpiEfetivo(values: Pick<
  IcmsCalculatorFormValues,
  'valorProduto' | 'valorIpiManual' | 'aliquotaIpi'
>) {
  const manual = roundToCents(values.valorIpiManual);

  if (manual > 0) {
    return {
      ipiEfetivo: manual,
      ipiSource: 'manual' as IpiSource,
    };
  }

  const calculadoPorAliquota = roundToCents(
    values.valorProduto * (values.aliquotaIpi / 100),
  );

  if (calculadoPorAliquota > 0) {
    return {
      ipiEfetivo: calculadoPorAliquota,
      ipiSource: 'aliquota' as IpiSource,
    };
  }

  return {
    ipiEfetivo: 0,
    ipiSource: 'zero' as IpiSource,
  };
}

function buildIcmsMessages(result: LegacyIcmsCalculationResult, values: IcmsCalculatorFormValues) {
  const messages: CalculationMessage[] = [];

  if (result.ipiSource === 'manual') {
    messages.push({
      tone: 'info',
      text: `IPI usado no cálculo: ${result.ipiEfetivo.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      })}, informado manualmente.`,
    });
  } else if (result.ipiSource === 'aliquota') {
    messages.push({
      tone: 'info',
      text: `IPI usado no cálculo: ${result.ipiEfetivo.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      })}, calculado por alíquota de ${values.aliquotaIpi.toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}%.`,
    });
  }

  if (result.reducaoAplicada) {
    messages.push({
      tone: 'warning',
      text: 'Redução de base aplicada na base do ICMS-ST.',
    });
  }

  if (result.icmsStZerado) {
    messages.push({
      tone: 'warning',
      text: 'ICMS-ST calculado negativo; valor zerado.',
    });
  }

  if (values.aliquotaDifal > 0) {
    messages.push({
      tone: 'info',
      text: `DIFAL incluído no total estimado.`,
    });
  }

  return messages;
}

function buildIcmsSummaryMetrics(
  values: IcmsCalculatorFormValues,
  result: LegacyIcmsCalculationResult & { valorDifal?: number },
): CalculationMetric[] {
  const metrics: CalculationMetric[] = [
    {
      label: values.tipoCalculo === 'icms_st' ? 'ICMS próprio usado como dedução' : 'ICMS próprio',
      value: result.valorIcms,
    },
  ];

  if (result.ipiSource !== 'zero') {
    metrics.push({
      label: 'IPI usado no cálculo',
      value: result.ipiEfetivo,
    });
  }

  if (values.tipoCalculo !== 'icms_proprio') {
    metrics.push({
      label: 'ICMS-ST a recolher',
      value: result.valorIcmsSt,
    });
  }

  if (result.valorDifal && result.valorDifal > 0) {
    metrics.push({
      label: 'DIFAL',
      value: result.valorDifal,
    });
  }

  return metrics;
}

function decorateIcmsResult(
  values: IcmsCalculatorFormValues,
  legacyResult: LegacyIcmsCalculationResult,
): IcmsProprioCalculationResult | IcmsStCalculationResult {
  const baseOperacao = legacyResult.baseIcms;
  const valorDifal = values.aliquotaDifal > 0
    ? roundToCents(baseOperacao * (values.aliquotaDifal / 100))
    : 0;

  const decoratedResult = {
    ...legacyResult,
    valorDifal,
    valorTotal: roundToCents(legacyResult.valorTotal + valorDifal),
  };

  const messages = buildIcmsMessages(decoratedResult, values);
  const summaryMetrics = buildIcmsSummaryMetrics(values, decoratedResult);

  if (values.tipoCalculo === 'icms_proprio') {
    return {
      ...legacyResult,
      tipoCalculo: 'icms_proprio',
      baseOperacao,
      summaryMetrics,
      messages,
    };
  }

  return {
    ...decoratedResult,
    tipoCalculo: values.tipoCalculo as 'icms_st' | 'icms_e_icms_st',
    baseOperacao,
    summaryMetrics,
    messages,
  };
}

function buildStandaloneIpiResult(
  values: IcmsCalculatorFormValues,
): IpiCalculationResult {
  const baseOperacao = calculateBaseOperation(values);
  const { ipiEfetivo, ipiSource } = resolveIpiEfetivo(values);

  const messages: CalculationMessage[] = [];

  if (ipiSource === 'manual') {
    messages.push({
      tone: 'info',
      text: `IPI usado no cálculo: ${ipiEfetivo.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      })}, informado manualmente.`,
    });
  } else if (ipiSource === 'aliquota') {
    messages.push({
      tone: 'info',
      text: `IPI usado no cálculo: ${ipiEfetivo.toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      })}, calculado por alíquota de ${values.aliquotaIpi.toLocaleString('pt-BR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}%.`,
    });
  }

  return {
    tipoCalculo: 'ipi',
    tipoCalculoLabel: CALCULATION_TYPE_LABELS.ipi,
    baseOperacao,
    valorTotal: roundToCents(baseOperacao + ipiEfetivo),
    summaryMetrics: [{ label: 'IPI', value: ipiEfetivo }],
    messages,
    ipiEfetivo,
    ipiSource,
  };
}

function buildPisCofinsResult(
  values: IcmsCalculatorFormValues,
): PisCofinsCalculationResult {
  const baseOperacao = calculateBaseOperation(values);
  const valorPis = roundToCents(baseOperacao * (values.aliquotaPis / 100));
  const valorCofins = roundToCents(baseOperacao * (values.aliquotaCofins / 100));

  return {
    tipoCalculo: 'pis_cofins',
    tipoCalculoLabel: CALCULATION_TYPE_LABELS.pis_cofins,
    baseOperacao,
    valorTotal: roundToCents(baseOperacao + valorPis + valorCofins),
    summaryMetrics: [
      { label: 'PIS', value: valorPis },
      { label: 'COFINS', value: valorCofins },
    ],
    messages: [],
    valorPis,
    valorCofins,
  };
}

function buildDifalResult(
  values: IcmsCalculatorFormValues,
): DifalCalculationResult {
  const baseOperacao = calculateBaseOperation(values);
  const valorIcmsOrigem = roundToCents(baseOperacao * (values.aliquotaOrigem / 100));
  const valorIcmsDestino = roundToCents(
    baseOperacao * (values.aliquotaInternaDestino / 100),
  );
  const valorDifal = Math.max(roundToCents(valorIcmsDestino - valorIcmsOrigem), 0);
  const valorFcp = roundToCents(baseOperacao * (values.aliquotaFcp / 100));

  const summaryMetrics: CalculationMetric[] = [
    { label: 'ICMS origem', value: valorIcmsOrigem },
    { label: 'ICMS destino', value: valorIcmsDestino },
    { label: 'DIFAL', value: valorDifal },
  ];

  if (valorFcp > 0) {
    summaryMetrics.push({ label: 'FCP', value: valorFcp });
  }

  return {
    tipoCalculo: 'difal',
    tipoCalculoLabel: CALCULATION_TYPE_LABELS.difal,
    baseOperacao,
    valorTotal: roundToCents(baseOperacao + valorDifal + valorFcp),
    summaryMetrics,
    messages: valorFcp > 0
      ? [
          {
            tone: 'info',
            text: 'FCP incluído no total estimado.',
          },
        ]
      : [],
    valorIcmsOrigem,
    valorIcmsDestino,
    valorDifal,
    valorFcp,
  };
}

function buildFcpResult(values: IcmsCalculatorFormValues): FcpCalculationResult {
  const baseOperacao = calculateBaseOperation(values);
  const valorFcp = roundToCents(baseOperacao * (values.aliquotaFcp / 100));

  return {
    tipoCalculo: 'fcp',
    tipoCalculoLabel: CALCULATION_TYPE_LABELS.fcp,
    baseOperacao,
    valorTotal: roundToCents(baseOperacao + valorFcp),
    summaryMetrics: [{ label: 'FCP', value: valorFcp }],
    messages: [],
    valorFcp,
  };
}

function buildIbsCbsResult(values: IcmsCalculatorFormValues): IbsCbsCalculationResult {
  const baseOperacao = calculateBaseOperation(values);
  const valorIbs = roundToCents(baseOperacao * (values.aliquotaIbs / 100));
  const valorCbs = roundToCents(baseOperacao * (values.aliquotaCbs / 100));

  return {
    tipoCalculo: 'ibs_cbs',
    tipoCalculoLabel: CALCULATION_TYPE_LABELS.ibs_cbs,
    baseOperacao,
    valorTotal: roundToCents(baseOperacao + valorIbs + valorCbs),
    summaryMetrics: [
      { label: 'IBS', value: valorIbs },
      { label: 'CBS', value: valorCbs },
    ],
    messages: [],
    valorIbs,
    valorCbs,
  };
}

function buildReverseIcmsResult(values: IcmsCalculatorFormValues): IcmsReverseCalculationResult {
  const percentualAproveitado = 100 - values.reducaoBase;
  const baseReduzida = calculateReverseIcmsBaseReduzida(values.valorProduto, values.reducaoBase);
  const valorIcmsFinal = calculateReverseIcmsFinal(
    values.valorProduto,
    values.aliquotaIcms,
    values.reducaoBase,
  );

  const summaryMetrics: CalculationMetric[] = [
    { label: 'Valor total dos produtos', value: values.valorProduto },
    { label: 'Alíquota ICMS', value: values.aliquotaIcms, format: 'percent' },
    { label: 'Redução da base', value: values.reducaoBase, format: 'percent' },
    { label: 'Percentual aproveitado da base', value: percentualAproveitado, format: 'percent' },
    { label: 'Base reduzida encontrada', value: baseReduzida },
  ];

  const messages: CalculationMessage[] = [
    {
      tone: 'info',
      text: 'Ao editar o ICMS final, a redução da base é recalculada automaticamente para manter a consistência do cálculo.',
    },
  ];

  return {
    tipoCalculo: 'icms_reverso',
    tipoCalculoLabel: CALCULATION_TYPE_LABELS.icms_reverso,
    baseOperacao: values.valorProduto,
    valorTotal: valorIcmsFinal,
    summaryMetrics,
    messages,
    valorIcmsInformado: valorIcmsFinal,
    aliquotaIcms: values.aliquotaIcms,
    reducaoBase: values.reducaoBase,
    percentualAproveitado,
    baseReduzida,
  };
}

export function normalizeFiscalValues(
  values: IcmsCalculatorParsedValues,
): IcmsCalculatorFormValues {
  return {
    valorProduto: 'valorProduto' in values ? values.valorProduto : 0,
    frete: 'frete' in values ? values.frete : 0,
    seguro: 'seguro' in values ? values.seguro : 0,
    outrasDespesas: 'outrasDespesas' in values ? values.outrasDespesas : 0,
    desconto: 'desconto' in values ? values.desconto : 0,
    valorIcmsInformado: 'valorIcmsInformado' in values ? values.valorIcmsInformado : 0,
    aliquotaIcms: 'aliquotaIcms' in values ? values.aliquotaIcms : 0,
    ufOrigem: 'ufOrigem' in values ? values.ufOrigem : ('' as IcmsCalculatorFormValues['ufOrigem']),
    ufDestino: 'ufDestino' in values ? values.ufDestino : ('' as IcmsCalculatorFormValues['ufDestino']),
    aliquotaOrigem: 'aliquotaOrigem' in values ? values.aliquotaOrigem : 0,
    valorIpiManual: 'valorIpiManual' in values ? values.valorIpiManual : 0,
    aliquotaIpi: 'aliquotaIpi' in values ? values.aliquotaIpi : 0,
    aliquotaInternaDestino: 'aliquotaInternaDestino' in values ? values.aliquotaInternaDestino : 0,
    mva: 'mva' in values ? values.mva : 0,
    reducaoBase: 'reducaoBase' in values ? values.reducaoBase : 0,
    aliquotaPis: 'aliquotaPis' in values ? values.aliquotaPis : 0,
    aliquotaCofins: 'aliquotaCofins' in values ? values.aliquotaCofins : 0,
    creditoPis: 'creditoPis' in values ? values.creditoPis : 0,
    creditoCofins: 'creditoCofins' in values ? values.creditoCofins : 0,
    aliquotaFcp: 'aliquotaFcp' in values ? values.aliquotaFcp : 0,
    aliquotaDifal: 'aliquotaDifal' in values ? values.aliquotaDifal : 0,
    aliquotaIbs: 'aliquotaIbs' in values ? values.aliquotaIbs : 0,
    aliquotaCbs: 'aliquotaCbs' in values ? values.aliquotaCbs : 0,
    creditoIbs: 'creditoIbs' in values ? values.creditoIbs : 0,
    creditoCbs: 'creditoCbs' in values ? values.creditoCbs : 0,
    tipoCalculo: values.tipoCalculo,
  };
}

export function calculateFiscal(
  values: IcmsCalculatorFormValues,
): FiscalCalculationResult {
  switch (values.tipoCalculo) {
    case 'icms_proprio':
    case 'icms_st':
    case 'icms_e_icms_st': {
      const legacyResult = calculateIcms(
        values as unknown as LegacyIcmsCalculatorFormValues,
      ) as LegacyIcmsCalculationResult;

      return decorateIcmsResult(values, legacyResult);
    }
    case 'icms_reverso':
      return buildReverseIcmsResult(values);
    case 'ipi':
      return buildStandaloneIpiResult(values);
    case 'pis_cofins':
      return buildPisCofinsResult(values);
    case 'difal':
      return buildDifalResult(values);
    case 'fcp':
      return buildFcpResult(values);
    case 'ibs_cbs':
      return buildIbsCbsResult(values);
    default:
      throw new Error(`Unsupported calculation type: ${values.tipoCalculo}`);
  }
}
