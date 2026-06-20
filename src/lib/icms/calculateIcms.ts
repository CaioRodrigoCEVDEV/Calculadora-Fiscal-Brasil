import { CALCULATION_TYPE_LABELS } from './constants';
import type {
  IcmsCalculationResult,
  IcmsCalculatorBaseValues,
  IcmsCalculatorFormValues,
  IcmsCalculatorParsedValues,
  IpiSource,
} from './types';

function roundToCents(value: number) {
  return Math.round((value + Number.EPSILON) * 100) / 100;
}

export function normalizeIcmsValues(
  values: IcmsCalculatorParsedValues,
): IcmsCalculatorFormValues {
  return {
    valorProduto: values.valorProduto,
    frete: values.frete,
    seguro: values.seguro,
    outrasDespesas: values.outrasDespesas,
    desconto: values.desconto,
    ufOrigem: values.ufOrigem,
    ufDestino: values.ufDestino,
    aliquotaOrigem: values.aliquotaOrigem,
    tipoCalculo: values.tipoCalculo,
    valorIpiManual: 'valorIpiManual' in values ? values.valorIpiManual : 0,
    aliquotaIpi: 'aliquotaIpi' in values ? values.aliquotaIpi : 0,
    aliquotaInternaDestino: 'aliquotaInternaDestino' in values ? values.aliquotaInternaDestino : 0,
    mva: 'mva' in values ? values.mva : 0,
    reducaoBase: 'reducaoBase' in values ? values.reducaoBase : 0,
  };
}

function calculateBaseIcms(values: IcmsCalculatorBaseValues) {
  return roundToCents(
    values.valorProduto + values.frete + values.seguro + values.outrasDespesas - values.desconto,
  );
}

function resolveIpiEfetivo(values: IcmsCalculatorFormValues) {
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

export function calculateIcms(
  values: IcmsCalculatorFormValues,
): IcmsCalculationResult {
  const baseIcms = calculateBaseIcms(values);

  const valorIcms = roundToCents(baseIcms * (values.aliquotaOrigem / 100));

  const isIcmsProprio = values.tipoCalculo === 'icms_proprio';
  const { ipiEfetivo, ipiSource } = isIcmsProprio
    ? { ipiEfetivo: 0, ipiSource: 'zero' as IpiSource }
    : resolveIpiEfetivo(values);

  const baseIcmsSt = isIcmsProprio
    ? 0
    : roundToCents(
        (values.valorProduto + ipiEfetivo + values.frete + values.seguro + values.outrasDespesas - values.desconto) *
          (1 + values.mva / 100),
      );

  const baseIcmsStFinal = isIcmsProprio
    ? 0
    : values.reducaoBase > 0
      ? roundToCents(baseIcmsSt * (1 - values.reducaoBase / 100))
      : baseIcmsSt;

  const icmsStBruto = isIcmsProprio
    ? 0
    : roundToCents(baseIcmsStFinal * (values.aliquotaInternaDestino / 100));

  const valorIcmsStCalculado = isIcmsProprio ? 0 : roundToCents(icmsStBruto - valorIcms);
  const valorIcmsSt = isIcmsProprio ? 0 : Math.max(valorIcmsStCalculado, 0);

  const valorTotal = isIcmsProprio
    ? roundToCents(
        values.valorProduto + values.frete + values.seguro + values.outrasDespesas - values.desconto,
      )
    : roundToCents(
        values.valorProduto + ipiEfetivo + values.frete + values.seguro + values.outrasDespesas - values.desconto + valorIcmsSt,
      );

  return {
    tipoCalculo: values.tipoCalculo,
    tipoCalculoLabel: CALCULATION_TYPE_LABELS[values.tipoCalculo],
    baseIcms,
    valorIcms,
    ipiEfetivo,
    ipiSource,
    baseIcmsSt,
    baseIcmsStFinal,
    icmsStBruto,
    valorIcmsSt,
    valorTotal,
    reducaoAplicada: !isIcmsProprio && values.reducaoBase > 0,
    icmsStZerado: !isIcmsProprio && valorIcmsStCalculado < 0,
  };
}
