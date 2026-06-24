import type { CalculationType } from '@/lib/fiscal/constants';
import { APP_NAME, APP_SLOGAN, APP_SUBTITLE, CALCULATOR_PAGE_DESCRIPTION } from '@/lib/site/content';

export type RouteComponentVariant = 'default' | 'ipva';

export interface CalculatorRouteConfig {
  slug: string;
  path: string;
  title: string;
  description: string;
  h1: string;
  intro: string[];
  calculationType: CalculationType;
  breadcrumbLabel: string;
  keywords: string[];
  component?: RouteComponentVariant;
}

const CALCULATOR_ROUTE_CONFIGS: CalculatorRouteConfig[] = [
  {
    slug: 'calculadora-fiscal',
    path: '/pt/calculadora-fiscal',
    title: `${APP_NAME} — ICMS, ICMS-ST, IPI, PIS, COFINS, DIFAL, FCP, IBS e CBS`,
    description: CALCULATOR_PAGE_DESCRIPTION,
    h1: APP_NAME,
    intro: [APP_SLOGAN, APP_SUBTITLE],
    calculationType: 'icms_proprio',
    breadcrumbLabel: APP_NAME,
    keywords: [
      'calculadora fiscal brasil',
      'calculadora fiscal online',
      'simulador de impostos',
      'ICMS',
      'ICMS-ST',
      'IPI',
      'PIS/COFINS',
      'DIFAL',
      'FCP',
      'IBS/CBS',
      'memória de cálculo fiscal',
    ],
  },
  {
    slug: 'calculadora-icms',
    path: '/pt/calculadora-icms',
    title: 'Calculadora de ICMS',
    description:
      'Calcule ICMS próprio com base da operação, alíquota e memória de cálculo.',
    h1: 'Calculadora de ICMS',
    intro: [
      'Foco no ICMS próprio para conferir a base e a alíquota da operação.',
      'A memória de cálculo ajuda a validar o imposto antes de seguir com a nota ou com a conferência interna.',
    ],
    calculationType: 'icms_proprio',
    breadcrumbLabel: 'ICMS',
    keywords: ['calculadora ICMS', 'ICMS próprio', 'base ICMS', 'alíquota ICMS'],
  },
  {
    slug: 'calculadora-icms-st',
    path: '/pt/calculadora-icms-st',
    title: 'Calculadora de ICMS-ST',
    description:
      'Simule substituição tributária com MVA, IPI, base ST e ICMS-ST a recolher.',
    h1: 'Calculadora de ICMS-ST',
    intro: [
      'Simule substituição tributária com base, MVA e IPI quando aplicável.',
      'A página ajuda a entender o impacto do ICMS-ST a recolher com uma leitura rápida do cenário.',
    ],
    calculationType: 'icms_st',
    breadcrumbLabel: 'ICMS-ST',
    keywords: ['calculadora ICMS-ST', 'substituição tributária', 'MVA', 'ICMS ST'],
  },
  {
    slug: 'calculadora-ipi',
    path: '/pt/calculadora-ipi',
    title: 'Calculadora de IPI',
    description:
      'Calcule o IPI a partir da base da operação e da alíquota informada.',
    h1: 'Calculadora de IPI',
    intro: [
      'Calcule IPI de forma simples com base e alíquota informadas.',
      'A memória de cálculo mostra como o imposto se forma em operações com produto industrializado.',
    ],
    calculationType: 'ipi',
    breadcrumbLabel: 'IPI',
    keywords: ['calculadora IPI', 'imposto sobre produtos industrializados', 'base IPI'],
  },
  {
    slug: 'calculadora-pis-cofins',
    path: '/pt/calculadora-pis-cofins',
    title: 'Calculadora PIS/COFINS',
    description:
      'Simule PIS e COFINS com alíquotas, créditos e valor a recolher.',
    h1: 'Calculadora PIS/COFINS',
    intro: [
      'Teste PIS e COFINS com créditos informados e base ajustada.',
      'A página facilita a conferência do valor bruto e dos créditos a considerar na simulação.',
    ],
    calculationType: 'pis_cofins',
    breadcrumbLabel: 'PIS/COFINS',
    keywords: ['calculadora PIS COFINS', 'crédito PIS', 'crédito COFINS'],
  },
  {
    slug: 'calculadora-difal',
    path: '/pt/calculadora-difal',
    title: 'Calculadora de DIFAL',
    description:
      'Calcule o diferencial de alíquotas com ICMS interestadual, alíquota interna e FCP.',
    h1: 'Calculadora de DIFAL',
    intro: [
      'Confira o DIFAL entre origem e destino sem sair da calculadora.',
      'O cenário também mostra quando o FCP entra na composição do total.',
    ],
    calculationType: 'difal',
    breadcrumbLabel: 'DIFAL',
    keywords: ['calculadora DIFAL', 'diferencial de alíquotas', 'FCP DIFAL'],
  },
  {
    slug: 'calculadora-fcp',
    path: '/pt/calculadora-fcp',
    title: 'Calculadora de FCP',
    description:
      'Calcule o Fundo de Combate à Pobreza com base e alíquota informadas.',
    h1: 'Calculadora de FCP',
    intro: [
      'Informe a base e a alíquota para calcular o FCP rapidamente.',
      'A página mantém o fluxo simples para simulações específicas de Fundo de Combate à Pobreza.',
    ],
    calculationType: 'fcp',
    breadcrumbLabel: 'FCP',
    keywords: ['calculadora FCP', 'fundo de combate à pobreza', 'base FCP'],
  },
  {
    slug: 'calculadora-ibs-cbs',
    path: '/pt/calculadora-ibs-cbs',
    title: 'Calculadora IBS/CBS',
    description:
      'Simule os novos tributos da Reforma Tributária com alíquotas, créditos e redução de base.',
    h1: 'Calculadora IBS/CBS',
    intro: [
      'Simule IBS e CBS da Reforma Tributária com base ajustada e créditos, quando houver.',
      'A calculadora mantém o cenário pronto para conferência sem consultar sistemas externos.',
    ],
    calculationType: 'ibs_cbs',
    breadcrumbLabel: 'IBS/CBS',
    keywords: ['calculadora IBS CBS', 'reforma tributária', 'crédito IBS', 'crédito CBS'],
  },
  {
    slug: 'calculadora-ipva-pec',
    path: '/pt/calculadora-ipva-pec',
    title: 'Simulador IPVA da PEC do novo IPVA',
    description:
      'Simule o IPVA atual pelo valor FIPE e estado do veículo e compare com uma estimativa baseada no teto de 1% proposto pela PEC do IPVA.',
    h1: 'Simulador de IPVA da PEC do novo IPVA',
    intro: [
      'Compare uma estimativa do IPVA atual do seu estado com uma simulação baseada no teto de 1% proposto pela PEC do IPVA.',
      'Informe o valor FIPE do veículo e o estado de registro para visualizar a comparação e a economia estimada.',
    ],
    calculationType: 'icms_proprio',
    breadcrumbLabel: 'IPVA PEC',
    component: 'ipva',
    keywords: [
      'calculadora IPVA',
      'simular IPVA',
      'IPVA por estado',
      'IPVA 1%',
      'PEC do IPVA',
      'valor FIPE IPVA',
      'simulador IPVA PEC',
    ],
  },
];

export const CALCULATOR_ROUTE_LIST = CALCULATOR_ROUTE_CONFIGS;

export const CALCULATOR_ROUTE_BY_SLUG = Object.fromEntries(
  CALCULATOR_ROUTE_CONFIGS.map((route) => [route.slug, route]),
) as Record<string, CalculatorRouteConfig>;

export const CALCULATOR_ROUTE_PARAMS = CALCULATOR_ROUTE_CONFIGS.map((route) => ({
  slug: route.slug,
}));
