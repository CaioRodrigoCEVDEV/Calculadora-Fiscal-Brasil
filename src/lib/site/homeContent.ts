export interface HomeBenefit {
  title: string;
  content: string;
}

export interface HomeContentBlock {
  title: string;
  content: string;
}

export interface HomeFaqItem {
  question: string;
  answer: string;
}

export const HOME_BENEFITS: HomeBenefit[] = [
  {
    title: 'Memória de cálculo clara',
    content: 'Veja as fórmulas aplicadas e os valores substituídos em cada etapa do cálculo.',
  },
  {
    title: 'Vários tributos em um só lugar',
    content:
      'Simule ICMS, ICMS-ST, IPI, PIS, COFINS, DIFAL, FCP, IBS e CBS sem trocar de ferramenta.',
  },
  {
    title: 'Interface simples',
    content: 'Preencha apenas os campos necessários para o cálculo escolhido.',
  },
  {
    title: 'Apoio à conferência fiscal',
    content:
      'Use os resultados para conferir operações, notas fiscais e simulações tributárias.',
  },
];

export const HOME_CONTENT_BLOCKS: HomeContentBlock[] = [
  {
    title: 'O que é uma calculadora fiscal?',
    content:
      'Uma calculadora fiscal é uma ferramenta que ajuda a simular impostos e contribuições com base nos dados de uma operação. Na Calculadora Fiscal Brasil, é possível informar valores como produto, frete, desconto, alíquotas, MVA, créditos e reduções para obter o resultado estimado e a memória de cálculo.',
  },
  {
    title: 'Quais impostos posso calcular?',
    content:
      'A ferramenta permite simular ICMS, ICMS-ST, IPI, PIS, COFINS, DIFAL, FCP, IBS e CBS. Cada modalidade exibe apenas os campos necessários para o cálculo escolhido.',
  },
  {
    title: 'A calculadora substitui um contador?',
    content:
      'Não. A calculadora tem finalidade informativa e educacional. As regras fiscais podem variar conforme UF, produto, NCM, CEST, CFOP, CST, regime tributário e legislação vigente.',
  },
];

export const HOME_FAQ_ITEMS: HomeFaqItem[] = [
  {
    question: 'A Calculadora Fiscal Brasil é gratuita?',
    answer: 'Sim. A ferramenta pode ser usada para simulações fiscais online de forma gratuita.',
  },
  {
    question: 'Quais cálculos fiscais estão disponíveis?',
    answer: 'Atualmente a calculadora simula ICMS, ICMS-ST, IPI, PIS/COFINS, DIFAL, FCP e IBS/CBS.',
  },
  {
    question: 'A calculadora gera memória de cálculo?',
    answer:
      'Sim. Cada resultado exibe a fórmula utilizada, os valores substituídos e o resultado final de cada etapa.',
  },
  {
    question: 'Posso usar o resultado para emitir nota fiscal?',
    answer:
      'O resultado deve ser usado como apoio à conferência e simulação. Antes de emitir NF-e, confira NCM, CEST, CST, CFOP, alíquotas, regime tributário e legislação da UF.',
  },
  {
    question: 'A calculadora considera legislação automática por UF?',
    answer:
      'Não nesta versão. As alíquotas e parâmetros devem ser informados pelo usuário. Isso evita aplicar regras incorretas em operações específicas.',
  },
  {
    question: 'IBS e CBS já têm cálculo definitivo?',
    answer:
      'A modalidade IBS/CBS é uma simulação informativa. As regras e alíquotas podem variar conforme legislação vigente, fase de transição e parametrizações oficiais.',
  },
];
