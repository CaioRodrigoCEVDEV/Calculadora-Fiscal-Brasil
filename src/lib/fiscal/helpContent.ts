import type { CalculationType } from './constants';

export interface CalculationHelpItem {
  title: string;
  content: string;
}

export interface CalculationHelpContent {
  subtitle: string;
  items: CalculationHelpItem[];
}

const icmsStHelpContent: CalculationHelpContent = {
  subtitle: 'Resumo curto dos conceitos usados no cálculo de ICMS-ST.',
  items: [
    {
      title: 'O que é ICMS-ST?',
      content:
        'ICMS-ST é a substituição tributária do ICMS. Nesse modelo, o imposto de etapas futuras da cadeia pode ser recolhido antecipadamente por um contribuinte responsável.',
    },
    {
      title: 'O que é MVA?',
      content:
        'MVA significa Margem de Valor Agregado. Ela é usada para estimar a base de cálculo da substituição tributária a partir do valor da operação.',
    },
    {
      title: 'Como o cálculo é feito?',
      content:
        'A calculadora forma a base do ICMS próprio, calcula o ICMS próprio, monta a base de ICMS-ST com IPI e demais valores aplicáveis, aplica a MVA e depois calcula o ICMS-ST a recolher.',
    },
    {
      title: 'Aviso importante',
      content:
        'O cálculo de ICMS-ST depende de regras por UF, produto, NCM, CEST, convênios, protocolos, benefícios fiscais e legislação vigente. Use o resultado apenas como conferência ou simulação.',
    },
  ],
};

const icmsReverseHelpContent: CalculationHelpContent = {
  subtitle: 'Resumo curto dos conceitos usados no cálculo reverso do ICMS.',
  items: [
    {
      title: 'Como funciona?',
      content:
        'A calculadora usa o valor total dos produtos, a alíquota e a redução da base para exibir o ICMS final. Se o ICMS final for editado, a redução é recalculada automaticamente.',
    },
    {
      title: 'Como a base reduzida é encontrada?',
      content:
        'A base reduzida é o total dos produtos multiplicado pelo percentual aproveitado da base, isto é, 100% menos a redução informada.',
    },
    {
      title: 'Como o ICMS final é ajustado?',
      content:
        'Ao editar o valor final do ICMS, a calculadora recalcula a redução da base para manter o cálculo consistente com o valor digitado.',
    },
    {
      title: 'Aviso importante',
      content:
        'Pode haver pequena diferença de centavos porque o valor final exibido é arredondado. A redução pode receber mais casas decimais para preservar a precisão.',
    },
  ],
};

export const CALCULATION_HELP_CONTENT: Record<CalculationType, CalculationHelpContent> = {
  icms_proprio: {
    subtitle: 'Resumo curto dos conceitos usados no cálculo de ICMS.',
    items: [
      {
        title: 'O que é ICMS?',
        content:
          'O ICMS é um imposto estadual aplicado sobre a circulação de mercadorias e alguns serviços. Nesta calculadora, ele é calculado a partir da base da operação e da alíquota informada.',
      },
      {
        title: 'Como a base é formada?',
        content:
          'A base pode considerar o valor do produto, frete, seguro, outras despesas e descontos, conforme os dados informados no formulário.',
      },
      {
        title: 'Como o cálculo é feito?',
        content:
          'O ICMS próprio é calculado multiplicando a base de cálculo pela alíquota de ICMS informada. Se uma redução de base for informada, a base é reduzida antes de aplicar a alíquota.',
      },
      {
        title: 'Aviso importante',
        content:
          'O cálculo é informativo. Alíquotas, reduções, benefícios fiscais e regras específicas podem variar conforme UF, produto, NCM, CFOP, CST, regime tributário e legislação vigente.',
      },
    ],
  },
  icms_reverso: icmsReverseHelpContent,
  icms_st: icmsStHelpContent,
  icms_e_icms_st: icmsStHelpContent,
  ipi: {
    subtitle: 'Resumo curto dos conceitos usados no cálculo de IPI.',
    items: [
      {
        title: 'O que é IPI?',
        content:
          'IPI é o Imposto sobre Produtos Industrializados. Ele pode incidir sobre produtos industrializados nacionais ou importados, conforme classificação fiscal e legislação aplicável.',
      },
      {
        title: 'Como a base é formada?',
        content:
          'A base do IPI pode considerar o valor do produto e demais valores da operação, conforme os campos informados na calculadora.',
      },
      {
        title: 'Como o cálculo é feito?',
        content:
          'O IPI é calculado multiplicando a base de cálculo pela alíquota de IPI informada.',
      },
      {
        title: 'Aviso importante',
        content:
          'A incidência e a alíquota do IPI dependem do produto, NCM, operação, enquadramento fiscal e legislação vigente.',
      },
    ],
  },
  pis_cofins: {
    subtitle: 'Resumo curto dos conceitos usados no cálculo de PIS e COFINS.',
    items: [
      {
        title: 'O que são PIS e COFINS?',
        content:
          'PIS e COFINS são contribuições federais que podem incidir sobre receitas ou operações, conforme o regime tributário e as regras aplicáveis à empresa.',
      },
      {
        title: 'O que são créditos?',
        content:
          'Em alguns regimes, é possível descontar créditos de PIS e COFINS do valor bruto calculado. Nesta calculadora, os créditos informados reduzem o imposto a recolher.',
      },
      {
        title: 'Como o cálculo é feito?',
        content:
          'A calculadora forma a base de PIS/COFINS, aplica as alíquotas informadas, calcula PIS e COFINS brutos e subtrai os créditos, quando preenchidos.',
      },
      {
        title: 'Aviso importante',
        content:
          'O cálculo de PIS e COFINS depende do regime cumulativo ou não cumulativo, natureza da receita, produto, operação, créditos permitidos e legislação vigente.',
      },
    ],
  },
  difal: {
    subtitle: 'Resumo curto dos conceitos usados no cálculo de DIFAL.',
    items: [
      {
        title: 'O que é DIFAL?',
        content:
          'DIFAL é o diferencial de alíquotas do ICMS. Ele representa a diferença entre a alíquota interna do estado de destino e a alíquota interestadual aplicada na operação.',
      },
      {
        title: 'Quando o FCP pode aparecer?',
        content:
          'O FCP é o Fundo de Combate à Pobreza e pode ser cobrado em algumas operações, conforme a legislação da UF de destino.',
      },
      {
        title: 'Como o cálculo é feito?',
        content:
          'A calculadora monta a base do DIFAL, calcula o ICMS pela alíquota interestadual, calcula o ICMS pela alíquota interna de destino e apura a diferença. Se houver FCP informado, ele é somado ao total de destino.',
      },
      {
        title: 'Aviso importante',
        content:
          'Este cálculo usa uma forma simplificada e informativa. Regras de DIFAL podem variar por UF, tipo de operação, consumidor final, contribuinte, produto, benefícios fiscais e legislação vigente.',
      },
    ],
  },
  fcp: {
    subtitle: 'Resumo curto dos conceitos usados no cálculo de FCP.',
    items: [
      {
        title: 'O que é FCP?',
        content:
          'FCP é o Fundo de Combate à Pobreza, um adicional que pode incidir em determinadas operações conforme regras da UF.',
      },
      {
        title: 'Como a base é informada?',
        content:
          'Nesta modalidade, o usuário informa diretamente a base de cálculo sobre a qual a alíquota de FCP será aplicada.',
      },
      {
        title: 'Como o cálculo é feito?',
        content:
          'O FCP é calculado multiplicando a base informada pela alíquota de FCP.',
      },
      {
        title: 'Aviso importante',
        content:
          'A aplicação do FCP depende da UF, produto, operação, alíquota vigente e legislação aplicável.',
      },
    ],
  },
  ibs_cbs: {
    subtitle: 'Resumo curto dos conceitos usados no cálculo de IBS e CBS.',
    items: [
      {
        title: 'O que são IBS e CBS?',
        content:
          'IBS e CBS são tributos previstos na Reforma Tributária sobre o consumo. A CBS é federal e o IBS é de competência compartilhada entre estados e municípios.',
      },
      {
        title: 'Por que as alíquotas são informadas manualmente?',
        content:
          'As alíquotas podem variar conforme regras legais, fase de transição, parametrizações futuras e cenário de simulação. Por isso, a calculadora não fixa alíquotas automaticamente.',
      },
      {
        title: 'Como o cálculo é feito?',
        content:
          'A calculadora forma a base de IBS/CBS, aplica eventual redução de base, calcula IBS e CBS brutos e subtrai créditos informados, quando houver.',
      },
      {
        title: 'Aviso importante',
        content:
          'O cálculo de IBS/CBS é informativo e depende da legislação vigente, regras de transição, parametrizações oficiais, créditos permitidos, produto e tipo de operação.',
      },
    ],
  },
};
