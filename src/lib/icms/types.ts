import { UF_OPTIONS } from './constants';
import type { CalculationType } from './constants';

export type Uf = (typeof UF_OPTIONS)[number];
export type IpiSource = 'manual' | 'aliquota' | 'zero';

export interface IcmsCalculatorFormInput {
  valorProduto: string;
  frete: string;
  seguro: string;
  outrasDespesas: string;
  desconto: string;
  valorIpiManual: string;
  aliquotaIpi: string;
  ufOrigem: string;
  ufDestino: string;
  aliquotaOrigem: string;
  aliquotaInternaDestino: string;
  mva: string;
  reducaoBase: string;
  tipoCalculo: CalculationType;
}

export interface IcmsCalculatorBaseValues {
  valorProduto: number;
  frete: number;
  seguro: number;
  outrasDespesas: number;
  desconto: number;
  ufOrigem: Uf;
  ufDestino: Uf;
  aliquotaOrigem: number;
  tipoCalculo: CalculationType;
}

export interface IcmsCalculatorStValues {
  valorIpiManual: number;
  aliquotaIpi: number;
  aliquotaInternaDestino: number;
  mva: number;
  reducaoBase: number;
}

export interface IcmsCalculatorFormValues
  extends IcmsCalculatorBaseValues,
    IcmsCalculatorStValues {}

export type IcmsCalculatorParsedValues =
  | (IcmsCalculatorBaseValues & { tipoCalculo: 'icms_proprio'; reducaoBase: number })
  | (IcmsCalculatorBaseValues &
      IcmsCalculatorStValues & {
        tipoCalculo: 'icms_st' | 'icms_e_icms_st';
      });

export interface IcmsCalculationMemoryLine {
  title: string;
  formula: string;
  calculation: string;
}

export interface IcmsCalculationMemorySection {
  title: string;
  lines: IcmsCalculationMemoryLine[];
}

export interface IcmsCalculationMemory {
  inputLines: Array<{ label: string; value: string }>;
  sections: IcmsCalculationMemorySection[];
  copyText: string;
  shareText: string;
  fiscalWarning: string;
}

export interface IcmsCalculationView {
  values: IcmsCalculatorFormValues;
  result: IcmsCalculationResult;
  memory: IcmsCalculationMemory;
}

export interface IcmsCalculationResult {
  tipoCalculo: CalculationType;
  tipoCalculoLabel: string;
  baseIcms: number;
  valorIcms: number;
  ipiEfetivo: number;
  ipiSource: IpiSource;
  baseIcmsSt: number;
  baseIcmsStFinal: number;
  icmsStBruto: number;
  valorIcmsSt: number;
  valorTotal: number;
  reducaoAplicada: boolean;
  icmsStZerado: boolean;
}
