import type { CalculationHelpContent } from '@/lib/fiscal/helpContent';

export const IPVA_HELP_CONTENT: CalculationHelpContent = {
  subtitle: 'Resumo curto dos conceitos usados na simulação do IPVA pela PEC.',
  items: [
    {
      title: 'O que é IPVA?',
      content:
        'IPVA (Imposto sobre Propriedade de Veículos Automotores) é um imposto estadual cobrado anualmente de proprietários de veículos. Cada estado define sua própria alíquota, que geralmente varia entre 1% e 4% do valor do veículo.',
    },
    {
      title: 'O que é a PEC do IPVA?',
      content:
        'É uma proposta em tramitação que busca alterar regras do IPVA, incluindo limite de alíquota e critérios de base de cálculo.',
    },
    {
      title: 'Modo simplificado',
      content:
        'No modo simplificado, a simulação considera o teto de 1% sobre o valor FIPE, independentemente do tipo ou peso do veículo. É a forma mais direta de comparar o IPVA atual com o limite proposto.',
    },
    {
      title: 'Modo avançado (experimental)',
      content:
        'No modo avançado, além do teto de 1%, a simulação considera o peso do veículo em kg como fator adicional. O fator de peso é aplicado sobre o teto de 1% e o resultado nunca ultrapassa esse limite. Essa regra é experimental e pode mudar conforme a tramitação e regulamentação da PEC.',
    },
    {
      title: 'Como o cálculo é feito?',
      content:
        'O IPVA atual estimado é calculado multiplicando o valor FIPE pela alíquota do estado. A simulação pela PEC calcula 1% sobre o mesmo valor. A economia estimada é a diferença positiva entre o valor atual e o valor simulado.',
    },
    {
      title: 'Aviso importante',
      content:
        'Esta é uma simulação informativa baseada na proposta da PEC do IPVA. As alíquotas estaduais podem variar conforme tipo de veículo, ano de fabricação, possíveis descontos, isenções e regras específicas da Secretaria da Fazenda de cada estado. Consulte sempre a legislação vigente.',
    },
  ],
};
