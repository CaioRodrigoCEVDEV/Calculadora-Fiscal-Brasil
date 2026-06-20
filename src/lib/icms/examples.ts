import type { IcmsCalculatorFormInput } from './types';

export interface IcmsExample {
  id: string;
  title: string;
  subtitle: string;
  values: IcmsCalculatorFormInput;
}

export const ICMS_EXAMPLES: IcmsExample[] = [
  {
    id: 'icms-simples',
    title: 'ICMS simples',
    subtitle: 'Venda com frete e alíquota de origem',
    values: {
      tipoCalculo: 'icms_proprio',
      valorProduto: '1.000,00',
      frete: '100,00',
      seguro: '0,00',
      outrasDespesas: '0,00',
      desconto: '0,00',
      valorIpiManual: '',
      aliquotaIpi: '',
      ufOrigem: 'SP',
      ufDestino: 'MG',
      aliquotaOrigem: '12',
      aliquotaInternaDestino: '',
      mva: '',
      reducaoBase: '',
    },
  },
  {
    id: 'icms-st',
    title: 'ICMS-ST',
    subtitle: 'Produto com IPI manual e MVA',
    values: {
      tipoCalculo: 'icms_st',
      valorProduto: '35.231,64',
      frete: '0,00',
      seguro: '0,00',
      outrasDespesas: '0,00',
      desconto: '0,00',
      valorIpiManual: '3.435,08',
      aliquotaIpi: '',
      ufOrigem: 'DF',
      ufDestino: 'MG',
      aliquotaOrigem: '4',
      aliquotaInternaDestino: '18',
      mva: '63,90',
      reducaoBase: '0',
    },
  },
  {
    id: 'icms-st-frete',
    title: 'ICMS-ST com frete',
    subtitle: 'Operação completa com frete e desconto',
    values: {
      tipoCalculo: 'icms_e_icms_st',
      valorProduto: '5.000,00',
      frete: '300,00',
      seguro: '0,00',
      outrasDespesas: '50,00',
      desconto: '100,00',
      valorIpiManual: '250,00',
      aliquotaIpi: '',
      ufOrigem: 'GO',
      ufDestino: 'SP',
      aliquotaOrigem: '12',
      aliquotaInternaDestino: '18',
      mva: '40',
      reducaoBase: '0',
    },
  },
];
