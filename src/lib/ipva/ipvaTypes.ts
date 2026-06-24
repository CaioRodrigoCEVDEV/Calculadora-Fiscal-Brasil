export type IpvaSimulationMode = 'simplified' | 'advanced';

export interface IpvaFormInput {
  valorFipe: string;
  uf: string;
  tipoVeiculo: string;
  modoSimulacao: IpvaSimulationMode;
  pesoVeiculoKg: string;
}

export interface IpvaAdvancedResult {
  pesoVeiculo: number;
  tetoPec: number;
  ipvaPecAvancado: number;
  fatorPeso: number;
}

export interface IpvaResult {
  valorFipe: number;
  uf: string;
  ufNome: string;
  aliquotaAtual: number;
  ipvaAtual: number;
  ipvaPec: number;
  economia: number;
  percentualEconomia: number;
  mensagemEconomiaZero?: string;
  modoSimulacao: IpvaSimulationMode;
  advanced?: IpvaAdvancedResult;
}
