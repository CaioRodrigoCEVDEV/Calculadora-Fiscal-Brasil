import { APP_NAME, FISCAL_WARNING } from '@/lib/site/content';
import { formatCurrency } from '@/lib/utils/formatCurrency';
import { formatDecimal, formatPercent } from '@/lib/utils/formatPercent';
import type {
  CalculationMessage,
  CalculationMetric,
  IbsCbsCalculationResult,
  DifalCalculationResult,
  FcpCalculationResult,
  IcmsCalculationMemory,
  IcmsCalculationMemoryLine,
  IcmsCalculatorFormValues,
  IcmsProprioCalculationResult,
  IcmsReverseCalculationResult,
  IcmsStCalculationResult,
  IpiCalculationResult,
  IpiSource,
  PisCofinsCalculationResult,
  FiscalCalculationResult,
} from './types';

function line(title: string, formula: string, calculation: string): IcmsCalculationMemoryLine {
  return { title, formula, calculation };
}

function messageLines(messages: CalculationMessage[]) {
  if (messages.length === 0) {
    return [] as string[];
  }

  return ['Observações:', ...messages.map((message) => `- ${message.text}`), ''];
}

function formatMetricValue(metric: CalculationMetric) {
  if (metric.format === 'percent') {
    return formatPercent(metric.value);
  }

  if (metric.format === 'decimal') {
    return formatDecimal(metric.value);
  }

  return formatCurrency(metric.value);
}

function getIpiUsageLabel(values: IcmsCalculatorFormValues, result: { ipiEfetivo: number; ipiSource: IpiSource; }) {
  if (result.ipiSource === 'manual') {
    return `${formatCurrency(result.ipiEfetivo)}, informado manualmente.`;
  }

  if (result.ipiSource === 'aliquota') {
    return `${formatCurrency(result.ipiEfetivo)}, calculado por alíquota de ${formatPercent(values.aliquotaIpi)}.`;
  }

  return 'R$ 0,00.';
}

function buildInputLines(values: IcmsCalculatorFormValues, result: FiscalCalculationResult) {
  if (values.tipoCalculo === 'icms_reverso') {
    const lines = [
      { label: 'Valor total dos produtos', value: formatCurrency(values.valorProduto) },
      { label: 'Alíquota ICMS', value: formatPercent(values.aliquotaIcms) },
      { label: 'Redução da base', value: formatPercent(values.reducaoBase) },
      { label: 'Valor final do ICMS', value: formatCurrency(result.valorTotal) },
    ];

    return lines;
  }

  const lines =
    values.tipoCalculo === 'fcp'
      ? []
      : [
          { label: 'Produto', value: formatCurrency(values.valorProduto) },
          { label: 'Frete', value: formatCurrency(values.frete) },
          { label: 'Seguro', value: formatCurrency(values.seguro) },
          { label: 'Outras despesas', value: formatCurrency(values.outrasDespesas) },
          { label: 'Desconto', value: formatCurrency(values.desconto) },
        ];

  switch (values.tipoCalculo) {
    case 'icms_proprio':
      lines.push(
        { label: 'UF origem', value: values.ufOrigem },
        { label: 'Alíquota ICMS origem', value: formatPercent(values.aliquotaOrigem) },
      );

      if (values.reducaoBase > 0) {
        lines.push({ label: 'Redução de base', value: formatPercent(values.reducaoBase) });
      }
      break;
    case 'icms_st':
    case 'icms_e_icms_st': {
      const icmsResult = result as IcmsStCalculationResult;

      lines.push(
        { label: 'Valor do IPI R$', value: formatCurrency(values.valorIpiManual) },
        { label: 'Alíquota IPI %', value: formatPercent(values.aliquotaIpi) },
        { label: 'IPI usado no cálculo', value: getIpiUsageLabel(values, icmsResult) },
        { label: 'UF origem', value: values.ufOrigem },
        { label: 'UF destino', value: values.ufDestino },
        { label: 'Alíquota ICMS origem', value: formatPercent(values.aliquotaOrigem) },
        { label: 'Alíquota ICMS interna destino', value: formatPercent(values.aliquotaInternaDestino) },
        { label: 'MVA', value: formatPercent(values.mva) },
      );

      if (values.reducaoBase > 0) {
        lines.push({ label: 'Redução de base', value: formatPercent(values.reducaoBase) });
      }

      if (values.aliquotaDifal > 0) {
        lines.push({ label: 'Alíquota DIFAL', value: formatPercent(values.aliquotaDifal) });
      }
      break;
    }
    case 'ipi': {
      lines.push(
        { label: 'Alíquota IPI %', value: formatPercent(values.aliquotaIpi) },
      );
      break;
    }
    case 'pis_cofins':
      lines.push({ label: 'Alíquota PIS', value: formatPercent(values.aliquotaPis) });

      if (values.creditoPis > 0) {
        lines.push({ label: 'Crédito PIS', value: formatCurrency(values.creditoPis) });
      }

      lines.push({ label: 'Alíquota COFINS', value: formatPercent(values.aliquotaCofins) });

      if (values.creditoCofins > 0) {
        lines.push({ label: 'Crédito COFINS', value: formatCurrency(values.creditoCofins) });
      }

      break;
    case 'difal':
      lines.push(
        { label: 'UF origem', value: values.ufOrigem },
        { label: 'UF destino', value: values.ufDestino },
        { label: 'Alíquota ICMS origem', value: formatPercent(values.aliquotaOrigem) },
        { label: 'Alíquota ICMS interna destino', value: formatPercent(values.aliquotaInternaDestino) },
      );

      if (values.reducaoBase > 0) {
        lines.push({ label: 'Redução de base', value: formatPercent(values.reducaoBase) });
      }

      if (values.aliquotaFcp > 0) {
        lines.push({ label: 'Alíquota FCP', value: formatPercent(values.aliquotaFcp) });
      }

      break;
    case 'fcp':
      lines.push(
        { label: 'Base de cálculo', value: formatCurrency(values.valorProduto) },
        { label: 'Alíquota FCP', value: formatPercent(values.aliquotaFcp) },
      );
      break;
    case 'ibs_cbs':
      lines.push(
        { label: 'Alíquota IBS', value: formatPercent(values.aliquotaIbs) },
        { label: 'Crédito IBS', value: formatCurrency(values.creditoIbs) },
        { label: 'Alíquota CBS', value: formatPercent(values.aliquotaCbs) },
        { label: 'Crédito CBS', value: formatCurrency(values.creditoCbs) },
      );
      break;
  }

  return lines;
}

function buildMemoryLines(values: IcmsCalculatorFormValues, result: FiscalCalculationResult) {
  if (values.tipoCalculo === 'icms_reverso') {
    const reverseResult = result as IcmsReverseCalculationResult;
    const lines = [
      line(
        'Base reduzida',
        'Base reduzida = Valor total dos produtos x Percentual aproveitado da base',
        `Base reduzida = ${formatCurrency(values.valorProduto)} x ${formatPercent(reverseResult.percentualAproveitado)} = ${formatCurrency(reverseResult.baseReduzida)}`,
      ),
      line(
        'ICMS final',
        'ICMS final = Base reduzida x Alíquota ICMS',
        `ICMS final = ${formatCurrency(reverseResult.baseReduzida)} x ${formatPercent(values.aliquotaIcms)} = ${formatCurrency(reverseResult.valorTotal)}`,
      ),
      line(
        'Redução ajustada',
        'Redução ajustada = 100% - (ICMS final ÷ (Valor total dos produtos x Alíquota ICMS))',
        `Redução ajustada = 100% - (${formatCurrency(reverseResult.valorTotal)} ÷ (${formatCurrency(values.valorProduto)} x ${formatPercent(values.aliquotaIcms)})) = ${formatPercent(reverseResult.reducaoBase)}`,
      ),
      line(
        'Percentual aproveitado',
        'Percentual aproveitado = 100% - Redução da base',
        `Percentual aproveitado = 100% - ${formatPercent(values.reducaoBase)} = ${formatPercent(reverseResult.percentualAproveitado)}`,
      ),
    ];

    return lines;
  }

  const baseOperation = values.valorProduto + values.frete + values.seguro + values.outrasDespesas - values.desconto;
  const baseOperationText = `Base da operação = ${formatCurrency(values.valorProduto)} + ${formatCurrency(values.frete)} + ${formatCurrency(values.seguro)} + ${formatCurrency(values.outrasDespesas)} - ${formatCurrency(values.desconto)} = ${formatCurrency(result.baseOperacao)}`;

  if (values.tipoCalculo === 'icms_proprio') {
    const icmsResult = result as IcmsProprioCalculationResult;
    const baseIcmsProprio = icmsResult.baseIcms;
    const baseIcmsReduzida = values.reducaoBase > 0
      ? Math.round((baseIcmsProprio * (1 - values.reducaoBase / 100) + Number.EPSILON) * 100) / 100
      : baseIcmsProprio;

    const lines = [
      line(
        'Base ICMS próprio',
        'Base ICMS próprio = Produto + Frete + Seguro + Outras Despesas - Desconto',
        `Base ICMS próprio = ${formatCurrency(values.valorProduto)} + ${formatCurrency(values.frete)} + ${formatCurrency(values.seguro)} + ${formatCurrency(values.outrasDespesas)} - ${formatCurrency(values.desconto)} = ${formatCurrency(baseIcmsProprio)}`,
      ),
    ];

    if (values.reducaoBase > 0) {
      lines.push(
        line(
          'Redução da base',
          'Redução = valor informado',
          `Redução = ${formatPercent(values.reducaoBase)}`,
        ),
        line(
          'Base ICMS próprio reduzida',
          'Base reduzida = Base ICMS próprio x (1 - Redução/100)',
          `Base reduzida = ${formatCurrency(baseIcmsProprio)} x ${formatDecimal(1 - values.reducaoBase / 100, 3)} = ${formatCurrency(baseIcmsReduzida)}`,
        ),
      );
    }

    lines.push(
      line(
        'ICMS próprio',
        'ICMS próprio = Base ICMS próprio x Alíquota origem',
        `ICMS próprio = ${formatCurrency(baseIcmsReduzida)} x ${formatPercent(values.aliquotaOrigem)} = ${formatCurrency(icmsResult.valorIcms)}`,
      ),
      line(
        'Total estimado',
        'Total estimado = Produto + Frete + Seguro + Outras Despesas - Desconto',
        `Total estimado = ${formatCurrency(values.valorProduto)} + ${formatCurrency(values.frete)} + ${formatCurrency(values.seguro)} + ${formatCurrency(values.outrasDespesas)} - ${formatCurrency(values.desconto)} = ${formatCurrency(icmsResult.valorTotal)}`,
      ),
    );

    return lines;
  }

  if (values.tipoCalculo === 'icms_st' || values.tipoCalculo === 'icms_e_icms_st') {
    const stResult = result as IcmsStCalculationResult;
    const baseStBeforeMva = values.valorProduto + stResult.ipiEfetivo + values.frete + values.seguro + values.outrasDespesas - values.desconto;
    const baseStFactor = formatDecimal(1 + values.mva / 100, 3);

    const lines = [
      line(
        'Base ICMS próprio',
        'Base ICMS próprio = Produto + Frete + Seguro + Outras Despesas - Desconto',
        `Base ICMS próprio = ${formatCurrency(values.valorProduto)} + ${formatCurrency(values.frete)} + ${formatCurrency(values.seguro)} + ${formatCurrency(values.outrasDespesas)} - ${formatCurrency(values.desconto)} = ${formatCurrency(stResult.baseIcms)}`,
      ),
      line(
        values.tipoCalculo === 'icms_st' ? 'ICMS próprio usado como dedução' : 'ICMS próprio',
        'ICMS próprio = Base ICMS próprio x Alíquota origem',
        `ICMS próprio = ${formatCurrency(stResult.baseIcms)} x ${formatPercent(values.aliquotaOrigem)} = ${formatCurrency(stResult.valorIcms)}`,
      ),
      line(
        'Base ST antes da MVA',
        'Base ST antes da MVA = Produto + IPI + Frete + Seguro + Outras Despesas - Desconto',
        `Base ST antes da MVA = ${formatCurrency(values.valorProduto)} + ${formatCurrency(stResult.ipiEfetivo)} + ${formatCurrency(values.frete)} + ${formatCurrency(values.seguro)} + ${formatCurrency(values.outrasDespesas)} - ${formatCurrency(values.desconto)} = ${formatCurrency(baseStBeforeMva)}`,
      ),
      line(
        'Base ICMS-ST',
        'Base ICMS-ST = Base ST antes da MVA x (1 + MVA / 100)',
        `Base ICMS-ST = ${formatCurrency(baseStBeforeMva)} x ${baseStFactor} = ${formatCurrency(stResult.baseIcmsSt)}`,
      ),
    ];

    if (stResult.reducaoAplicada) {
      lines.push(
        line(
          'Base ICMS-ST final',
          'Base ICMS-ST final = Base ICMS-ST x (1 - Redução de base / 100)',
          `Base ICMS-ST final = ${formatCurrency(stResult.baseIcmsSt)} x ${formatDecimal(1 - values.reducaoBase / 100, 3)} = ${formatCurrency(stResult.baseIcmsStFinal)}`,
        ),
      );
    }

    lines.push(
      line(
        'ICMS-ST bruto',
        'ICMS-ST bruto = Base ICMS-ST final x Alíquota interna destino',
        `ICMS-ST bruto = ${formatCurrency(stResult.baseIcmsStFinal)} x ${formatPercent(values.aliquotaInternaDestino)} = ${formatCurrency(stResult.icmsStBruto)}`,
      ),
      line(
        'ICMS-ST a recolher',
        'ICMS-ST a recolher = ICMS-ST bruto - ICMS próprio',
        `ICMS-ST a recolher = ${formatCurrency(stResult.icmsStBruto)} - ${formatCurrency(stResult.valorIcms)} = ${formatCurrency(stResult.valorIcmsSt)}`,
      ),
    );

    if (stResult.valorDifal > 0) {
      lines.push(
        line(
          'DIFAL',
          'DIFAL = Base da operação x Alíquota DIFAL',
          `DIFAL = ${formatCurrency(stResult.baseOperacao)} x ${formatPercent(values.aliquotaDifal)} = ${formatCurrency(stResult.valorDifal)}`,
        ),
      );
    }

    const totalFormula = stResult.valorDifal > 0
      ? 'Total estimado = Produto + IPI + Frete + Seguro + Outras Despesas - Desconto + ICMS-ST + DIFAL'
      : 'Total estimado = Produto + IPI + Frete + Seguro + Outras Despesas - Desconto + ICMS-ST';

    const totalParts = `${formatCurrency(values.valorProduto)} + ${formatCurrency(stResult.ipiEfetivo)} + ${formatCurrency(values.frete)} + ${formatCurrency(values.seguro)} + ${formatCurrency(values.outrasDespesas)} - ${formatCurrency(values.desconto)} + ${formatCurrency(stResult.valorIcmsSt)}${stResult.valorDifal > 0 ? ` + ${formatCurrency(stResult.valorDifal)}` : ''} = ${formatCurrency(stResult.valorTotal)}`;

    lines.push(
      line(
        'Total estimado',
        totalFormula,
        `Total estimado = ${totalParts}`,
      ),
    );

    return lines;
  }

  if (values.tipoCalculo === 'ipi') {
    const ipiResult = result as IpiCalculationResult;

    return [
      line(
        'Base da operação',
        'Base da operação = Produto + Frete + Seguro + Outras Despesas - Desconto',
        baseOperationText,
      ),
      line(
        'IPI',
        'IPI = Base da operação x Alíquota IPI',
        `IPI = ${formatCurrency(ipiResult.baseOperacao)} x ${formatPercent(values.aliquotaIpi)} = ${formatCurrency(ipiResult.ipiEfetivo)}`,
      ),
      line(
        'Total estimado',
        'Total estimado = Base da operação + IPI',
        `Total estimado = ${formatCurrency(baseOperation)} + ${formatCurrency(ipiResult.ipiEfetivo)} = ${formatCurrency(ipiResult.valorTotal)}`,
      ),
    ];
  }

  if (values.tipoCalculo === 'pis_cofins') {
    const pisCofinsResult = result as PisCofinsCalculationResult;

    return [
      line(
        'Base da operação',
        'Base da operação = Produto + Frete + Seguro + Outras Despesas - Desconto',
        baseOperationText,
      ),
      line(
        'PIS',
        'PIS = Base da operação x Alíquota PIS',
        `PIS = ${formatCurrency(pisCofinsResult.baseOperacao)} x ${formatPercent(values.aliquotaPis)} = ${formatCurrency(pisCofinsResult.valorPis)}`,
      ),
      ...(values.creditoPis > 0
        ? [line('Crédito PIS', 'Crédito PIS = valor informado', `Crédito PIS = ${formatCurrency(values.creditoPis)}`)]
        : []),
      line(
        'COFINS',
        'COFINS = Base da operação x Alíquota COFINS',
        `COFINS = ${formatCurrency(pisCofinsResult.baseOperacao)} x ${formatPercent(values.aliquotaCofins)} = ${formatCurrency(pisCofinsResult.valorCofins)}`,
      ),
      ...(values.creditoCofins > 0
        ? [
            line(
              'Crédito COFINS',
              'Crédito COFINS = valor informado',
              `Crédito COFINS = ${formatCurrency(values.creditoCofins)}`,
            ),
          ]
        : []),
      line(
        'Total estimado',
        'Total estimado = Base da operação + PIS + COFINS',
        `Total estimado = ${formatCurrency(pisCofinsResult.baseOperacao)} + ${formatCurrency(pisCofinsResult.valorPis)} + ${formatCurrency(pisCofinsResult.valorCofins)} = ${formatCurrency(pisCofinsResult.valorTotal)}`,
      ),
    ];
  }

  if (values.tipoCalculo === 'difal') {
    const difalResult = result as DifalCalculationResult;

    return [
      line(
        'Base da operação',
        'Base da operação = Produto + Frete + Seguro + Outras Despesas - Desconto',
        baseOperationText,
      ),
      line(
        'ICMS origem',
        'ICMS origem = Base da operação x Alíquota ICMS origem',
        `ICMS origem = ${formatCurrency(difalResult.baseOperacao)} x ${formatPercent(values.aliquotaOrigem)} = ${formatCurrency(difalResult.valorIcmsOrigem)}`,
      ),
      line(
        'ICMS destino',
        'ICMS destino = Base da operação x Alíquota ICMS interna destino',
        `ICMS destino = ${formatCurrency(difalResult.baseOperacao)} x ${formatPercent(values.aliquotaInternaDestino)} = ${formatCurrency(difalResult.valorIcmsDestino)}`,
      ),
      ...(values.reducaoBase > 0
        ? [
            line(
              'Redução de base',
              'Redução de base = valor informado',
              `Redução de base = ${formatPercent(values.reducaoBase)}`,
            ),
          ]
        : []),
      line(
        'DIFAL',
        'DIFAL = max(ICMS destino - ICMS origem, 0)',
        `DIFAL = max(${formatCurrency(difalResult.valorIcmsDestino)} - ${formatCurrency(difalResult.valorIcmsOrigem)}, 0) = ${formatCurrency(difalResult.valorDifal)}`,
      ),
      ...(values.aliquotaFcp > 0
        ? [
            line(
              'FCP',
              'FCP = Base da operação x Alíquota FCP',
              `FCP = ${formatCurrency(difalResult.baseOperacao)} x ${formatPercent(values.aliquotaFcp)} = ${formatCurrency(difalResult.valorFcp)}`,
            ),
          ]
        : []),
      line(
        'Total estimado',
        'Total estimado = Base da operação + DIFAL + FCP',
        `Total estimado = ${formatCurrency(difalResult.baseOperacao)} + ${formatCurrency(difalResult.valorDifal)} + ${formatCurrency(difalResult.valorFcp)} = ${formatCurrency(difalResult.valorTotal)}`,
      ),
    ];
  }

  if (values.tipoCalculo === 'fcp') {
    const fcpResult = result as FcpCalculationResult;
    const baseFcpText = `Base de cálculo = ${formatCurrency(values.valorProduto)} = ${formatCurrency(fcpResult.baseOperacao)}`;

    return [
      line(
        'Base de cálculo',
        'Base de cálculo = valor informado',
        baseFcpText,
      ),
      line(
        'FCP',
        'FCP = Base de cálculo x Alíquota FCP',
        `FCP = ${formatCurrency(fcpResult.baseOperacao)} x ${formatPercent(values.aliquotaFcp)} = ${formatCurrency(fcpResult.valorFcp)}`,
      ),
      line(
        'Total estimado',
        'Total estimado = Base de cálculo + FCP',
        `Total estimado = ${formatCurrency(fcpResult.baseOperacao)} + ${formatCurrency(fcpResult.valorFcp)} = ${formatCurrency(fcpResult.valorTotal)}`,
      ),
    ];
  }

  const ibsCbsResult = result as IbsCbsCalculationResult;

    return [
      line(
        'Base da operação',
        'Base da operação = Produto + Frete + Seguro + Outras Despesas - Desconto',
        baseOperationText,
      ),
      line(
        'IBS',
        'IBS = Base da operação x Alíquota IBS',
        `IBS = ${formatCurrency(ibsCbsResult.baseOperacao)} x ${formatPercent(values.aliquotaIbs)} = ${formatCurrency(ibsCbsResult.valorIbs)}`,
      ),
      ...(values.creditoIbs > 0
        ? [line('Crédito IBS', 'Crédito IBS = valor informado', `Crédito IBS = ${formatCurrency(values.creditoIbs)}`)]
        : []),
      line(
        'CBS',
        'CBS = Base da operação x Alíquota CBS',
        `CBS = ${formatCurrency(ibsCbsResult.baseOperacao)} x ${formatPercent(values.aliquotaCbs)} = ${formatCurrency(ibsCbsResult.valorCbs)}`,
      ),
      ...(values.creditoCbs > 0
        ? [line('Crédito CBS', 'Crédito CBS = valor informado', `Crédito CBS = ${formatCurrency(values.creditoCbs)}`)]
        : []),
      line(
        'Total estimado',
        'Total estimado = Base da operação + IBS + CBS',
        `Total estimado = ${formatCurrency(ibsCbsResult.baseOperacao)} + ${formatCurrency(ibsCbsResult.valorIbs)} + ${formatCurrency(ibsCbsResult.valorCbs)} = ${formatCurrency(ibsCbsResult.valorTotal)}`,
      ),
  ];
}

function buildCopyText(
  values: IcmsCalculatorFormValues,
  result: FiscalCalculationResult,
  inputLines: Array<{ label: string; value: string }>,
  memoryLines: IcmsCalculationMemoryLine[],
) {
  if (values.tipoCalculo === 'icms_reverso') {
    const reverseResult = result as IcmsReverseCalculationResult;
    const lines = [
      'Cálculo reverso do ICMS',
      '',
      ...inputLines.map((item) => `${item.label}: ${item.value}`),
      '',
      'Memória de cálculo:',
    ];

    memoryLines.forEach((item) => {
      lines.push(item.title, item.formula, item.calculation, '');
    });

    lines.push(
      'Resultado:',
      `Valor total dos produtos: ${formatCurrency(values.valorProduto)}`,
      `Base reduzida: ${formatCurrency(reverseResult.baseReduzida)}`,
      `ICMS final: ${formatCurrency(result.valorTotal)}`,
    );

    if (result.messages.length > 0) {
      lines.push('', 'Aviso:', ...result.messages.map((message) => message.text));
    }

    lines.push('', 'Aviso fiscal:', FISCAL_WARNING);
    return lines.join('\n');
  }

  const lines = [
    APP_NAME,
    '',
    `Tipo selecionado: ${result.tipoCalculoLabel}`,
    '',
    'Dados informados:',
    ...inputLines.map((item) => `${item.label}: ${item.value}`),
    '',
  ];

  lines.push(...messageLines(result.messages));
  lines.push('Memória de cálculo:');

  memoryLines.forEach((item) => {
    lines.push(item.title, item.formula, item.calculation, '');
  });

  lines.push('Aviso:', FISCAL_WARNING);

  return lines.join('\n');
}

function buildShareText(values: IcmsCalculatorFormValues, result: FiscalCalculationResult) {
  if (values.tipoCalculo === 'icms_reverso') {
    const reverseResult = result as IcmsReverseCalculationResult;

    const lines = [
      APP_NAME,
      '',
      'Cálculo reverso do ICMS',
      '',
      ...buildInputLines(values, result).map((item) => `${item.label}: ${item.value}`),
      '',
      `Valor total dos produtos: ${formatCurrency(values.valorProduto)}`,
      `Base reduzida: ${formatCurrency(reverseResult.baseReduzida)}`,
      `ICMS final: ${formatCurrency(result.valorTotal)}`,
      '',
      'Resumo:',
      ...reverseResult.summaryMetrics.map((metric) => `${metric.label}: ${formatMetricValue(metric)}`),
    ];

    if (reverseResult.messages.length > 0) {
      lines.push('', 'Observações:', ...reverseResult.messages.map((message) => `- ${message.text}`));
    }

    lines.push('', FISCAL_WARNING);
    return lines.join('\n');
  }

  const lines = [
    APP_NAME,
    '',
    `Tipo: ${result.tipoCalculoLabel}`,
    ...buildInputLines(values, result).map((item) => `${item.label}: ${item.value}`),
    '',
    'Resumo:',
    ...result.summaryMetrics.map((metric) => `${metric.label}: ${formatMetricValue(metric)}`),
    `Total estimado: ${formatCurrency(result.valorTotal)}`,
  ];

  if (result.messages.length > 0) {
    lines.push('', 'Observações:', ...result.messages.map((message) => `- ${message.text}`));
  }

  lines.push('', FISCAL_WARNING);

  return lines.join('\n');
}

export function buildCalculationMemory(
  values: IcmsCalculatorFormValues,
  result: FiscalCalculationResult,
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
    copyText: buildCopyText(values, result, inputLines, memoryLines),
    shareText: buildShareText(values, result),
    fiscalWarning: FISCAL_WARNING,
  };
}
