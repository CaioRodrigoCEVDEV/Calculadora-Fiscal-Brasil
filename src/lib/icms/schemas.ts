import { z } from 'zod';
import { CALCULATION_TYPE_OPTIONS, UF_OPTIONS } from './constants';
import { parseDecimal } from '@/lib/utils/parseDecimal';
import type { CalculationType } from './constants';
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
  ufOrigem: ufSchema('origem'),
  ufDestino: ufSchema('destino'),
  aliquotaOrigem: requiredDecimalSchema('Informe a alíquota ICMS origem / interestadual.'),
} as const;

const stFields = {
  valorIpiManual: decimalSchema('O valor do IPI não pode ser negativo.'),
  aliquotaIpi: decimalSchema('A alíquota de IPI não pode ser negativa.'),
  aliquotaInternaDestino: requiredDecimalSchema('Informe a alíquota ICMS interna destino.'),
  mva: requiredDecimalSchema('Informe a MVA.'),
  reducaoBase: decimalSchema('A redução de base não pode ser negativa.'),
} as const;

const icmsProprioSchema = z.object({
  tipoCalculo: z.literal('icms_proprio'),
  ...commonFields,
});

const icmsStSchema = z.object({
  tipoCalculo: z.literal('icms_st'),
  ...commonFields,
  ...stFields,
});

const icmsCompletoSchema = z.object({
  tipoCalculo: z.literal('icms_e_icms_st'),
  ...commonFields,
  ...stFields,
});

export const icmsCalculatorSchema = z.discriminatedUnion('tipoCalculo', [
  icmsProprioSchema,
  icmsStSchema,
  icmsCompletoSchema,
]);
