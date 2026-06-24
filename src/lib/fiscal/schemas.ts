import { z } from 'zod';
import { CALCULATION_TYPE_OPTIONS, UF_OPTIONS } from './constants';
import type { CalculationType } from './constants';
import { parseDecimal } from '@/lib/utils/parseDecimal';
import type { Uf } from './types';

const calculationTypeValues = CALCULATION_TYPE_OPTIONS.map(
  (option) => option.value,
) as [CalculationType, ...CalculationType[]];

const decimalSchema = (message: string) =>
  z.preprocess(
    (value) => parseDecimal(value as string | number | null | undefined),
    z.number().min(0, message),
  );

const requiredDecimalSchema = (message: string) =>
  z.preprocess((value) => {
    if (typeof value === 'string' && value.trim().length === 0) {
      return undefined;
    }

    return parseDecimal(value as string | number | null | undefined);
  }, z.number({ required_error: message, invalid_type_error: message }).min(0, message));

const requiredPositiveDecimalSchema = (message: string) =>
  z.preprocess((value) => {
    if (typeof value === 'string' && value.trim().length === 0) {
      return undefined;
    }

    return parseDecimal(value as string | number | null | undefined);
  }, z.number({ required_error: message, invalid_type_error: message }).positive(message));

const requiredPercentDecimalSchema = (message: string) =>
  z.preprocess((value) => {
    if (typeof value === 'string' && value.trim().length === 0) {
      return undefined;
    }

    return parseDecimal(value as string | number | null | undefined);
  },
    z
      .number({ required_error: message, invalid_type_error: message })
      .min(0, message)
      .max(100, 'A redução da base deve ficar entre 0 e 100%.'),
  );

const ufSchema = (fieldLabel: 'origem' | 'destino') =>
  z
    .string()
    .min(1, `Selecione a UF de ${fieldLabel}.`)
    .refine((value): value is Uf => UF_OPTIONS.includes(value as Uf), {
      message: `Selecione uma UF de ${fieldLabel} válida.`,
    });

const commonFields = {
  valorProduto: requiredPositiveDecimalSchema('O valor do produto deve ser maior que zero.'),
  frete: decimalSchema('O frete não pode ser negativo.'),
  seguro: decimalSchema('O seguro não pode ser negativo.'),
  outrasDespesas: decimalSchema('Outras despesas não podem ser negativas.'),
  desconto: decimalSchema('O desconto não pode ser negativo.'),
} as const;

const icmsFields = {
  ufOrigem: ufSchema('origem'),
  ufDestino: ufSchema('destino'),
  aliquotaOrigem: requiredDecimalSchema('Informe a alíquota ICMS origem / interestadual.'),
} as const;

const ipiFields = {
  valorIpiManual: decimalSchema('O valor do IPI não pode ser negativo.'),
  aliquotaIpi: decimalSchema('A alíquota de IPI não pode ser negativa.'),
} as const;

const stFields = {
  aliquotaInternaDestino: requiredDecimalSchema('Informe a alíquota ICMS interna destino.'),
  mva: requiredDecimalSchema('Informe a MVA.'),
  reducaoBase: decimalSchema('A redução de base não pode ser negativa.'),
} as const;

const reverseFields = {
  valorProduto: requiredPositiveDecimalSchema('O valor total dos produtos deve ser maior que zero.'),
  aliquotaIcms: requiredPositiveDecimalSchema('A alíquota ICMS deve ser maior que zero.'),
  reducaoBase: requiredPercentDecimalSchema('A redução da base deve ser informada.'),
  valorIcmsInformado: decimalSchema('O valor final do ICMS não pode ser negativo.'),
} as const;

const pisCofinsFields = {
  aliquotaPis: requiredDecimalSchema('Informe a alíquota de PIS.'),
  aliquotaCofins: requiredDecimalSchema('Informe a alíquota de COFINS.'),
  creditoPis: decimalSchema('O crédito de PIS não pode ser negativo.'),
  creditoCofins: decimalSchema('O crédito de COFINS não pode ser negativo.'),
} as const;

const fcpField = {
  aliquotaFcp: requiredDecimalSchema('Informe a alíquota de FCP.'),
} as const;

const ibsCbsFields = {
  aliquotaIbs: requiredDecimalSchema('Informe a alíquota de IBS.'),
  aliquotaCbs: requiredDecimalSchema('Informe a alíquota de CBS.'),
  creditoIbs: decimalSchema('O crédito de IBS não pode ser negativo.'),
  creditoCbs: decimalSchema('O crédito de CBS não pode ser negativo.'),
} as const;

const icmsProprioSchema = z.object({
  tipoCalculo: z.literal('icms_proprio'),
  ...commonFields,
  ...icmsFields,
  reducaoBase: decimalSchema('A redução de base não pode ser negativa.'),
});

const icmsStSchema = z.object({
  tipoCalculo: z.literal('icms_st'),
  ...commonFields,
  ...icmsFields,
  ...ipiFields,
  ...stFields,
});

const icmsReverseSchema = z.object({
  tipoCalculo: z.literal('icms_reverso'),
  ...reverseFields,
});

const icmsCompletoSchema = z.object({
  tipoCalculo: z.literal('icms_e_icms_st'),
  ...commonFields,
  ...icmsFields,
  ...ipiFields,
  ...stFields,
});

const ipiSchema = z.object({
  tipoCalculo: z.literal('ipi'),
  ...commonFields,
  ...ipiFields,
});

const pisCofinsSchema = z.object({
  tipoCalculo: z.literal('pis_cofins'),
  ...commonFields,
  ...pisCofinsFields,
});

const difalSchema = z.object({
  tipoCalculo: z.literal('difal'),
  ...commonFields,
  ...icmsFields,
  aliquotaInternaDestino: requiredDecimalSchema('Informe a alíquota ICMS interna destino.'),
  reducaoBase: decimalSchema('A redução de base não pode ser negativa.'),
  aliquotaFcp: decimalSchema('A alíquota de FCP não pode ser negativa.'),
});

const fcpSchema = z.object({
  tipoCalculo: z.literal('fcp'),
  ...commonFields,
  ...fcpField,
});

const ibsCbsSchema = z.object({
  tipoCalculo: z.literal('ibs_cbs'),
  ...commonFields,
  ...ibsCbsFields,
});

export const icmsCalculatorSchema = z.discriminatedUnion('tipoCalculo', [
  icmsProprioSchema,
  icmsReverseSchema,
  icmsStSchema,
  icmsCompletoSchema,
  ipiSchema,
  pisCofinsSchema,
  difalSchema,
  fcpSchema,
  ibsCbsSchema,
]);

export const calculationTypeValuesTuple = calculationTypeValues;
