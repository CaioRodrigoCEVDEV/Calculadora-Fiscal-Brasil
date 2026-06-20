import { formatCurrency } from '@/lib/utils/formatCurrency';
import { formatDecimal, formatPercent } from '@/lib/utils/formatPercent';
import { APP_NAME, FISCAL_WARNING } from '@/lib/site/content';
import type {
  IcmsCalculationMemory,
  IcmsCalculationMemoryLine,
  IcmsCalculationResult,
  IcmsCalculatorFormValues,
} from './types';

function line(title: string, formula: string, calculation: string): IcmsCalculationMemoryLine {
  return { title, formula, calculation };
}

function getIpiUsageLabel(values: IcmsCalculatorFormValues, result: IcmsCalculationResult) {
  if (result.ipiSource === 'manual') {
    return `${formatCurrency(result.ipiEfetivo)}, informado manualmente.`;
  }

  if (result.ipiSource === 'aliquota') {
    return `${formatCurrency(result.ipiEfetivo)}, calculado por alíquota de ${formatPercent(values.aliquotaIpi)}.`;
  }

  return 'R$ 0,00.';
}

function buildInputLines(
  values: IcmsCalculatorFormValues,
  result: IcmsCalculationResult,
) {
  const lines = [
    { label: 'Produto', value: formatCurrency(values.valorProduto) },
    { label: 'Frete', value: formatCurrency(values.frete) },
    { label: 'Seguro', value: formatCurrency(values.seguro) },
    { label: 'Outras despesas', value: formatCurrency(values.outrasDespesas) },
    { label: 'Desconto', value: formatCurrency(values.desconto) },
    { label: 'UF origem', value: values.ufOrigem },
    { label: 'UF destino', value: values.ufDestino },
    { label: 'Alíquota ICMS origem', value: formatPercent(values.aliquotaOrigem) },
  ];

  if (values.tipoCalculo !== 'icms_proprio') {
    lines.push(
      { label: 'Valor do IPI R$', value: formatCurrency(values.valorIpiManual) },
      { label: 'Alíquota IPI %', value: formatPercent(values.aliquotaIpi) },
      { label: 'IPI usado no cálculo', value: getIpiUsageLabel(values, result) },
      {
        label: 'Alíquota ICMS interna destino',
        value: formatPercent(values.aliquotaInternaDestino),
      },
      { label: 'MVA', value: formatPercent(values.mva) },
      { label: 'Redução de base', value: formatPercent(values.reducaoBase) },
    );
  }

  return lines;
}

function buildMemoryLines(
  values: IcmsCalculatorFormValues,
  result: IcmsCalculationResult,
) {
  const isOwn = values.tipoCalculo === 'icms_proprio';
  const titleBaseIcms = 'Base ICMS próprio';
  const baseIcmsFormula = 'Base ICMS próprio = Produto + Frete + Seguro + Outras Despesas - Desconto';
  const baseIcmsCalculation =
    `Base ICMS próprio = ${formatCurrency(values.valorProduto)} + ${formatCurrency(values.frete)} + ${formatCurrency(values.seguro)} + ${formatCurrency(values.outrasDespesas)} - ${formatCurrency(values.desconto)} = ${formatCurrency(result.baseIcms)}`;

  if (isOwn) {
    return [
      line(titleBaseIcms, baseIcmsFormula, baseIcmsCalculation),
      line(
        'ICMS próprio',
        'ICMS próprio = Base ICMS próprio x Alíquota origem',
        `ICMS próprio = ${formatCurrency(result.baseIcms)} x ${formatPercent(values.aliquotaOrigem)} = ${formatCurrency(result.valorIcms)}`,
      ),
      line(
        'Total estimado',
        'Total estimado = Produto + Frete + Seguro + Outras Despesas - Desconto',
        `Total estimado = ${formatCurrency(values.valorProduto)} + ${formatCurrency(values.frete)} + ${formatCurrency(values.seguro)} + ${formatCurrency(values.outrasDespesas)} - ${formatCurrency(values.desconto)} = ${formatCurrency(result.valorTotal)}`,
      ),
    ];
  }

  const baseStBeforeMva = values.valorProduto + result.ipiEfetivo + values.frete + values.seguro + values.outrasDespesas - values.desconto;
  const baseStBeforeMvaText = `Base ST antes da MVA = ${formatCurrency(values.valorProduto)} + ${formatCurrency(result.ipiEfetivo)} + ${formatCurrency(values.frete)} + ${formatCurrency(values.seguro)} + ${formatCurrency(values.outrasDespesas)} - ${formatCurrency(values.desconto)} = ${formatCurrency(baseStBeforeMva)}`;
  const baseStFormula = 'Base ICMS-ST = Base ST antes da MVA x (1 + MVA / 100)';
  const baseStFactor = formatDecimal(1 + values.mva / 100, 3);

  const lines = [
    line(
      titleBaseIcms,
      baseIcmsFormula,
      baseIcmsCalculation,
    ),
  ];

  if (values.tipoCalculo === 'icms_st') {
    lines.push(
      line(
        'ICMS próprio usado como dedução',
        'ICMS próprio usado como dedução = Base ICMS próprio x Alíquota origem',
        `ICMS próprio usado como dedução = ${formatCurrency(result.baseIcms)} x ${formatPercent(values.aliquotaOrigem)} = ${formatCurrency(result.valorIcms)}`,
      ),
    );
  } else {
    lines.push(
      line(
        'ICMS próprio',
        'ICMS próprio = Base ICMS próprio x Alíquota origem',
        `ICMS próprio = ${formatCurrency(result.baseIcms)} x ${formatPercent(values.aliquotaOrigem)} = ${formatCurrency(result.valorIcms)}`,
      ),
    );
  }

  lines.push(
    line(
      'Base ST antes da MVA',
      'Base ST antes da MVA = Produto + IPI + Frete + Seguro + Outras Despesas - Desconto',
      baseStBeforeMvaText,
    ),
    line(
      'Base ICMS-ST',
      baseStFormula,
      `Base ICMS-ST = ${formatCurrency(baseStBeforeMva)} x ${baseStFactor} = ${formatCurrency(result.baseIcmsSt)}`,
    ),
  );

  if (result.reducaoAplicada) {
    lines.push(
      line(
        'Base ICMS-ST final',
        'Base ICMS-ST final = Base ICMS-ST x (1 - Redução de base / 100)',
        `Base ICMS-ST final = ${formatCurrency(result.baseIcmsSt)} x ${formatDecimal(1 - values.reducaoBase / 100, 3)} = ${formatCurrency(result.baseIcmsStFinal)}`,
      ),
    );
  }

  lines.push(
    line(
      'ICMS-ST bruto',
      'ICMS-ST bruto = Base ICMS-ST final x Alíquota interna destino',
      `ICMS-ST bruto = ${formatCurrency(result.baseIcmsStFinal)} x ${formatPercent(values.aliquotaInternaDestino)} = ${formatCurrency(result.icmsStBruto)}`,
    ),
    line(
      'ICMS-ST a recolher',
      'ICMS-ST a recolher = ICMS-ST bruto - ICMS próprio',
      `ICMS-ST a recolher = ${formatCurrency(result.icmsStBruto)} - ${formatCurrency(result.valorIcms)} = ${formatCurrency(result.valorIcmsSt)}`,
    ),
    line(
      'Total estimado',
      'Total estimado = Produto + IPI + Frete + Seguro + Outras Despesas - Desconto + ICMS-ST',
      `Total estimado = ${formatCurrency(values.valorProduto)} + ${formatCurrency(result.ipiEfetivo)} + ${formatCurrency(values.frete)} + ${formatCurrency(values.seguro)} + ${formatCurrency(values.outrasDespesas)} - ${formatCurrency(values.desconto)} + ${formatCurrency(result.valorIcmsSt)} = ${formatCurrency(result.valorTotal)}`,
    ),
  );

  return lines;
}

function buildCopyText(
  result: IcmsCalculationResult,
  inputLines: Array<{ label: string; value: string }>,
  memoryLines: IcmsCalculationMemoryLine[],
) {
  const lines = [
    APP_NAME,
    '',
    `Tipo selecionado: ${result.tipoCalculoLabel}`,
    '',
    'Dados informados:',
    ...inputLines.map((item) => `${item.label}: ${item.value}`),
    '',
    'Memória de cálculo:',
  ];

  memoryLines.forEach((item) => {
    lines.push(item.title, item.formula, item.calculation, '');
  });

  lines.push('Aviso:', FISCAL_WARNING);

  return lines.join('\n');
}

function buildShareText(
  values: IcmsCalculatorFormValues,
  result: IcmsCalculationResult,
) {
  const lines = [
    APP_NAME,
    '',
    `Tipo: ${result.tipoCalculoLabel}`,
    `Produto: ${formatCurrency(values.valorProduto)}`,
    `Frete: ${formatCurrency(values.frete)}`,
    `Seguro: ${formatCurrency(values.seguro)}`,
    `Outras despesas: ${formatCurrency(values.outrasDespesas)}`,
    `Desconto: ${formatCurrency(values.desconto)}`,
    `UF origem: ${values.ufOrigem}`,
    `UF destino: ${values.ufDestino}`,
    `Alíquota origem: ${formatPercent(values.aliquotaOrigem)}`,
  ];

  if (values.tipoCalculo !== 'icms_proprio') {
    lines.push(
      `Valor do IPI R$: ${formatCurrency(values.valorIpiManual)}`,
      `Alíquota IPI %: ${formatPercent(values.aliquotaIpi)}`,
      `IPI usado no cálculo: ${formatCurrency(result.ipiEfetivo)}${result.ipiSource === 'manual' ? ', informado manualmente.' : result.ipiSource === 'aliquota' ? `, calculado por alíquota de ${formatPercent(values.aliquotaIpi)}.` : '.'}`,
      `Alíquota interna destino: ${formatPercent(values.aliquotaInternaDestino)}`,
      `MVA: ${formatPercent(values.mva)}`,
    );

    if (result.reducaoAplicada) {
      lines.push(`Redução de base: ${formatPercent(values.reducaoBase)}`);
    }
  }

  lines.push(
    '',
    `Base ICMS próprio: ${formatCurrency(result.baseIcms)}`,
    `ICMS próprio${values.tipoCalculo === 'icms_st' ? ' usado como dedução' : ''}: ${formatCurrency(result.valorIcms)}`,
  );

  if (values.tipoCalculo !== 'icms_proprio') {
    lines.push(
      `Base ICMS-ST: ${formatCurrency(result.baseIcmsSt)}`,
    );

    if (result.reducaoAplicada) {
      lines.push(`Base ICMS-ST final: ${formatCurrency(result.baseIcmsStFinal)}`);
    }

    lines.push(
      `ICMS-ST bruto: ${formatCurrency(result.icmsStBruto)}`,
      `ICMS-ST a recolher: ${formatCurrency(result.valorIcmsSt)}`,
    );
  }

  lines.push(`Valor total estimado: ${formatCurrency(result.valorTotal)}`, '', FISCAL_WARNING);

  return lines.join('\n');
}

export function buildCalculationMemory(
  values: IcmsCalculatorFormValues,
  result: IcmsCalculationResult,
): IcmsCalculationMemory {
  const inputLines = buildInputLines(values, result);
  const memoryLines = buildMemoryLines(values, result);

  return {
    inputLines,
    sections: [
      {
        title: 'Memória de cálculo',
        lines: memoryLines,
      },
    ],
    copyText: buildCopyText(result, inputLines, memoryLines),
    shareText: buildShareText(values, result),
    fiscalWarning: FISCAL_WARNING,
  };
}
