import type { IpvaFormInput, IpvaResult, IpvaSimulationMode } from './ipvaTypes';
import { IPVA_RATES } from '@/data/ipvaRates';
import { parseDecimal } from '@/lib/utils/parseDecimal';

export function calculateCurrentIpva(fipeValue: number, currentRate: number): number {
  return fipeValue * (currentRate / 100);
}

export function calculatePecSimplifiedIpva(fipeValue: number): number {
  return fipeValue * 0.01;
}

/*
 * Regra experimental. Ajustar quando houver fórmula oficial definitiva da PEC.
 *
 * Atualmente usa faixas de peso demonstrativas:
 * - Até 1.000 kg: fator 0.80
 * - De 1.001 kg até 1.500 kg: fator 0.90
 * - Acima de 1.500 kg: fator 1.00
 *
 * O resultado nunca ultrapassa o teto de 1% do valor FIPE.
 */
export function calculatePecAdvancedIpva(
  fipeValue: number,
  vehicleWeightKg: number,
): { ipvaPecAvancado: number; fatorPeso: number } {
  const tetoPec = calculatePecSimplifiedIpva(fipeValue);

  let fatorPeso: number;
  if (vehicleWeightKg <= 1000) {
    fatorPeso = 0.80;
  } else if (vehicleWeightKg <= 1500) {
    fatorPeso = 0.90;
  } else {
    fatorPeso = 1.00;
  }

  const ipvaPecAvancado = Math.min(tetoPec * fatorPeso, tetoPec);

  return { ipvaPecAvancado, fatorPeso };
}

export function calculateIpva(input: IpvaFormInput): IpvaResult | null {
  const valorFipe = parseDecimal(input.valorFipe);
  if (valorFipe <= 0) return null;

  const rateEntry = IPVA_RATES.find((r) => r.uf === input.uf);
  if (!rateEntry) return null;

  const { aliquotaAtual } = rateEntry;
  const ipvaAtual = calculateCurrentIpva(valorFipe, aliquotaAtual);
  const ipvaPec = calculatePecSimplifiedIpva(valorFipe);

  const modo = input.modoSimulacao as IpvaSimulationMode;
  let economia: number;
  let advanced: IpvaResult['advanced'];
  let mensagemEconomiaZero: string | undefined;

  if (modo === 'advanced') {
    const pesoVeiculo = parseDecimal(input.pesoVeiculoKg);
    if (pesoVeiculo <= 0) return null;

    const advancedResult = calculatePecAdvancedIpva(valorFipe, pesoVeiculo);
    economia = Math.max(ipvaAtual - advancedResult.ipvaPecAvancado, 0);

    advanced = {
      pesoVeiculo,
      tetoPec: advancedResult.ipvaPecAvancado >= ipvaPec ? ipvaPec : ipvaPec,
      ipvaPecAvancado: advancedResult.ipvaPecAvancado,
      fatorPeso: advancedResult.fatorPeso,
    };

    /* No advanced mode tetoPec is always ipvaPec */
    advanced.tetoPec = ipvaPec;

    if (aliquotaAtual <= 1) {
      mensagemEconomiaZero =
        `A alíquota atual do ${rateEntry.uf} (${aliquotaAtual.toFixed(2).replace('.', ',')}%) já é igual ou inferior ao teto de 1% proposto. A simulação não gera economia estimada.`;
    }
  } else {
    economia = Math.max(ipvaAtual - ipvaPec, 0);

    if (aliquotaAtual <= 1) {
      mensagemEconomiaZero =
        `A alíquota atual do ${rateEntry.uf} (${aliquotaAtual.toFixed(2).replace('.', ',')}%) já é igual ou inferior ao teto de 1% proposto. A simulação não gera economia estimada.`;
    }
  }

  const percentualEconomia = economia > 0 ? (economia / ipvaAtual) * 100 : 0;

  return {
    valorFipe,
    uf: rateEntry.uf,
    ufNome: rateEntry.nome,
    aliquotaAtual,
    ipvaAtual,
    ipvaPec,
    economia,
    percentualEconomia,
    mensagemEconomiaZero,
    modoSimulacao: modo,
    advanced,
  };
}
