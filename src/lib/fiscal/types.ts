import type { IcmsCalculationResult as LegacyIcmsCalculationResult } from '@/lib/icms/types';
import { UF_OPTIONS } from './constants';
import type { CalculationType } from './constants';

export type Uf = (typeof UF_OPTIONS)[number];
export type IpiSource = 'manual' | 'aliquota' | 'zero';
export type CalculationMetricFormat = 'currency' | 'percent' | 'decimal';

export interface CalculationMetric {
  label: string;
  value: number;
  format?: CalculationMetricFormat;
}

export interface CalculationMessage {
  tone: 'info' | 'warning';
  text: string;
}

export interface IcmsCalculatorFormInput {
  valorProduto: string;
  frete: string;
  seguro: string;
  outrasDespesas: string;
  desconto: string;
  valorIcmsInformado: string;
  aliquotaIcms: string;
  valorIpiManual: string;
  aliquotaIpi: string;
  ufOrigem: string;
  ufDestino: string;
  aliquotaOrigem: string;
  aliquotaInternaDestino: string;
  mva: string;
  reducaoBase: string;
  aliquotaPis: string;
  aliquotaCofins: string;
  creditoPis: string;
  creditoCofins: string;
  aliquotaFcp: string;
  aliquotaDifal: string;
  aliquotaIbs: string;
  aliquotaCbs: string;
  creditoIbs: string;
  creditoCbs: string;
  tipoCalculo: CalculationType;
}

export interface IcmsCalculatorBaseValues {
  valorProduto: number;
  frete: number;
  seguro: number;
  outrasDespesas: number;
  desconto: number;
  tipoCalculo: CalculationType;
}

export interface IcmsCalculatorFiscalValues {
  ufOrigem: Uf;
  ufDestino: Uf;
  aliquotaOrigem: number;
}

export interface IcmsCalculatorIpiValues {
  valorIpiManual: number;
  aliquotaIpi: number;
}

export interface IcmsCalculatorReverseValues {
  valorProduto: number;
  valorIcmsInformado: number;
  aliquotaIcms: number;
  reducaoBase: number;
}

export interface IcmsCalculatorStValues {
  aliquotaInternaDestino: number;
  mva: number;
  reducaoBase: number;
}

export interface IcmsCalculatorPisCofinsValues {
  aliquotaPis: number;
  aliquotaCofins: number;
  creditoPis: number;
  creditoCofins: number;
}

export interface IcmsCalculatorFcpValues {
  aliquotaFcp: number;
}

export interface IcmsCalculatorDifalValues {
  aliquotaInternaDestino: number;
  reducaoBase: number;
  aliquotaFcp: number;
  aliquotaDifal: number;
}

export interface IcmsCalculatorIbsCbsValues {
  aliquotaIbs: number;
  aliquotaCbs: number;
  creditoIbs: number;
  creditoCbs: number;
}

export interface IcmsCalculatorFormValues
  extends IcmsCalculatorBaseValues,
    IcmsCalculatorFiscalValues,
    IcmsCalculatorIpiValues,
    IcmsCalculatorStValues,
    IcmsCalculatorReverseValues,
    IcmsCalculatorPisCofinsValues,
    IcmsCalculatorDifalValues,
    IcmsCalculatorFcpValues,
    IcmsCalculatorIbsCbsValues {}

export type IcmsCalculatorParsedValues =
  | (IcmsCalculatorBaseValues &
      IcmsCalculatorFiscalValues & {
        tipoCalculo: 'icms_proprio';
        reducaoBase: number;
      })
  | (IcmsCalculatorReverseValues & {
      tipoCalculo: 'icms_reverso';
    })
  | (IcmsCalculatorBaseValues &
      IcmsCalculatorFiscalValues &
      IcmsCalculatorIpiValues &
      IcmsCalculatorStValues & {
        tipoCalculo: 'icms_st' | 'icms_e_icms_st';
      })
  | (IcmsCalculatorBaseValues &
      IcmsCalculatorIpiValues & {
        tipoCalculo: 'ipi';
      })
  | (IcmsCalculatorBaseValues &
      IcmsCalculatorPisCofinsValues & {
        tipoCalculo: 'pis_cofins';
      })
  | (IcmsCalculatorBaseValues &
      IcmsCalculatorFiscalValues &
      IcmsCalculatorDifalValues & {
        tipoCalculo: 'difal';
      })
  | (IcmsCalculatorBaseValues &
      IcmsCalculatorFcpValues & {
        tipoCalculo: 'fcp';
      })
  | (IcmsCalculatorBaseValues &
      IcmsCalculatorIbsCbsValues & {
        tipoCalculo: 'ibs_cbs';
      });

export interface CalculationResultBase {
  baseOperacao: number;
  valorTotal: number;
  summaryMetrics: CalculationMetric[];
  messages: CalculationMessage[];
}

export interface IcmsProprioCalculationResult
  extends LegacyIcmsCalculationResult,
    CalculationResultBase {
  tipoCalculo: 'icms_proprio';
  summaryMetrics: CalculationMetric[];
  messages: CalculationMessage[];
  baseOperacao: number;
}

export interface IcmsStCalculationResult
  extends LegacyIcmsCalculationResult,
    CalculationResultBase {
  tipoCalculo: 'icms_st' | 'icms_e_icms_st';
  summaryMetrics: CalculationMetric[];
  messages: CalculationMessage[];
  baseOperacao: number;
  valorDifal: number;
}

export interface IpiCalculationResult extends CalculationResultBase {
  tipoCalculo: 'ipi';
  tipoCalculoLabel: string;
  ipiEfetivo: number;
  ipiSource: IpiSource;
}

export interface PisCofinsCalculationResult extends CalculationResultBase {
  tipoCalculo: 'pis_cofins';
  tipoCalculoLabel: string;
  valorPis: number;
  valorCofins: number;
}

export interface DifalCalculationResult extends CalculationResultBase {
  tipoCalculo: 'difal';
  tipoCalculoLabel: string;
  valorIcmsOrigem: number;
  valorIcmsDestino: number;
  valorDifal: number;
  valorFcp: number;
}

export interface FcpCalculationResult extends CalculationResultBase {
  tipoCalculo: 'fcp';
  tipoCalculoLabel: string;
  valorFcp: number;
}

export interface IbsCbsCalculationResult extends CalculationResultBase {
  tipoCalculo: 'ibs_cbs';
  tipoCalculoLabel: string;
  valorIbs: number;
  valorCbs: number;
}

export interface IcmsReverseCalculationResult extends CalculationResultBase {
  tipoCalculo: 'icms_reverso';
  tipoCalculoLabel: string;
  valorIcmsInformado: number;
  aliquotaIcms: number;
  reducaoBase: number;
  percentualAproveitado: number;
  baseReduzida: number;
}

export type FiscalCalculationResult =
  | IcmsProprioCalculationResult
  | IcmsReverseCalculationResult
  | IcmsStCalculationResult
  | IpiCalculationResult
  | PisCofinsCalculationResult
  | DifalCalculationResult
  | FcpCalculationResult
  | IbsCbsCalculationResult;

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
  result: FiscalCalculationResult;
  memory: IcmsCalculationMemory;
}
