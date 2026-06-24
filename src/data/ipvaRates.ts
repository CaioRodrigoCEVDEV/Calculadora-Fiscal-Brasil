export interface IpvaRateEntry {
  uf: string;
  nome: string;
  aliquotaAtual: number;
  sourceLabel: string;
  sourceUrl?: string;
  lastUpdated: string;
  notes?: string;
}

/* As alíquotas abaixo são referências aproximadas para automóveis.
 * Os valores devem ser revisados periodicamente conforme legislação estadual
 * vigente. Podem variar conforme tipo de veículo, combustível, ano de
 * fabricação, isenções e regras específicas de cada UF. */
export const IPVA_RATES: IpvaRateEntry[] = [
  {
    uf: 'AC', nome: 'Acre', aliquotaAtual: 2.0,
    sourceLabel: 'Alíquota padrão estimada para automóveis',
    lastUpdated: '2026-06-23',
    notes: 'Pode variar conforme tipo de veículo, combustível, isenção ou legislação estadual.',
  },
  {
    uf: 'AL', nome: 'Alagoas', aliquotaAtual: 3.0,
    sourceLabel: 'Alíquota padrão estimada para automóveis',
    lastUpdated: '2026-06-23',
    notes: 'Pode variar conforme tipo de veículo, combustível, isenção ou legislação estadual.',
  },
  {
    uf: 'AP', nome: 'Amapá', aliquotaAtual: 3.0,
    sourceLabel: 'Alíquota padrão estimada para automóveis',
    lastUpdated: '2026-06-23',
    notes: 'Pode variar conforme tipo de veículo, combustível, isenção ou legislação estadual.',
  },
  {
    uf: 'AM', nome: 'Amazonas', aliquotaAtual: 2.0,
    sourceLabel: 'Alíquota padrão estimada para automóveis',
    lastUpdated: '2026-06-23',
    notes: 'Alíquota reduzida para 1% para motos e veículos populares.',
  },
  {
    uf: 'BA', nome: 'Bahia', aliquotaAtual: 2.5,
    sourceLabel: 'Alíquota padrão estimada para automóveis',
    lastUpdated: '2026-06-23',
    notes: 'Pode variar conforme tipo de veículo, combustível, isenção ou legislação estadual.',
  },
  {
    uf: 'CE', nome: 'Ceará', aliquotaAtual: 3.0,
    sourceLabel: 'Alíquota padrão estimada para automóveis',
    lastUpdated: '2026-06-23',
    notes: 'Pode variar conforme tipo de veículo, combustível, isenção ou legislação estadual.',
  },
  {
    uf: 'DF', nome: 'Distrito Federal', aliquotaAtual: 3.0,
    sourceLabel: 'Alíquota padrão estimada para automóveis',
    lastUpdated: '2026-06-23',
    notes: 'Pode variar conforme tipo de veículo, combustível, isenção ou legislação estadual.',
  },
  {
    uf: 'ES', nome: 'Espírito Santo', aliquotaAtual: 2.0,
    sourceLabel: 'Alíquota padrão estimada para automóveis',
    lastUpdated: '2026-06-23',
    notes: 'Pode variar conforme tipo de veículo, combustível, isenção ou legislação estadual.',
  },
  {
    uf: 'GO', nome: 'Goiás', aliquotaAtual: 3.0,
    sourceLabel: 'Alíquota padrão estimada para automóveis',
    lastUpdated: '2026-06-23',
    notes: 'Pode variar conforme tipo de veículo, combustível, isenção ou legislação estadual.',
  },
  {
    uf: 'MA', nome: 'Maranhão', aliquotaAtual: 2.5,
    sourceLabel: 'Alíquota padrão estimada para automóveis',
    lastUpdated: '2026-06-23',
    notes: 'Pode variar conforme tipo de veículo, combustível, isenção ou legislação estadual.',
  },
  {
    uf: 'MT', nome: 'Mato Grosso', aliquotaAtual: 3.0,
    sourceLabel: 'Alíquota padrão estimada para automóveis',
    lastUpdated: '2026-06-23',
    notes: 'Pode variar conforme tipo de veículo, combustível, isenção ou legislação estadual.',
  },
  {
    uf: 'MS', nome: 'Mato Grosso do Sul', aliquotaAtual: 3.0,
    sourceLabel: 'Alíquota padrão estimada para automóveis',
    lastUpdated: '2026-06-23',
    notes: 'Pode variar conforme tipo de veículo, combustível, isenção ou legislação estadual.',
  },
  {
    uf: 'MG', nome: 'Minas Gerais', aliquotaAtual: 4.0,
    sourceLabel: 'Alíquota padrão estimada para automóveis',
    lastUpdated: '2026-06-23',
    notes: 'Pode variar conforme tipo de veículo, combustível, isenção ou legislação estadual.',
  },
  {
    uf: 'PA', nome: 'Pará', aliquotaAtual: 2.5,
    sourceLabel: 'Alíquota padrão estimada para automóveis',
    lastUpdated: '2026-06-23',
    notes: 'Pode variar conforme tipo de veículo, combustível, isenção ou legislação estadual.',
  },
  {
    uf: 'PB', nome: 'Paraíba', aliquotaAtual: 2.5,
    sourceLabel: 'Alíquota padrão estimada para automóveis',
    lastUpdated: '2026-06-23',
    notes: 'Pode variar conforme tipo de veículo, combustível, isenção ou legislação estadual.',
  },
  {
    uf: 'PR', nome: 'Paraná', aliquotaAtual: 4.0,
    sourceLabel: 'Alíquota padrão estimada para automóveis',
    lastUpdated: '2026-06-23',
    notes: 'Pode variar conforme tipo de veículo, combustível, isenção ou legislação estadual.',
  },
  {
    uf: 'PE', nome: 'Pernambuco', aliquotaAtual: 3.0,
    sourceLabel: 'Alíquota padrão estimada para automóveis',
    lastUpdated: '2026-06-23',
    notes: 'Pode variar conforme tipo de veículo, combustível, isenção ou legislação estadual.',
  },
  {
    uf: 'PI', nome: 'Piauí', aliquotaAtual: 2.5,
    sourceLabel: 'Alíquota padrão estimada para automóveis',
    lastUpdated: '2026-06-23',
    notes: 'Pode variar conforme tipo de veículo, combustível, isenção ou legislação estadual.',
  },
  {
    uf: 'RJ', nome: 'Rio de Janeiro', aliquotaAtual: 4.0,
    sourceLabel: 'Alíquota padrão estimada para automóveis',
    lastUpdated: '2026-06-23',
    notes: 'Pode variar conforme tipo de veículo, combustível, isenção ou legislação estadual.',
  },
  {
    uf: 'RN', nome: 'Rio Grande do Norte', aliquotaAtual: 3.0,
    sourceLabel: 'Alíquota padrão estimada para automóveis',
    lastUpdated: '2026-06-23',
    notes: 'Pode variar conforme tipo de veículo, combustível, isenção ou legislação estadual.',
  },
  {
    uf: 'RS', nome: 'Rio Grande do Sul', aliquotaAtual: 3.0,
    sourceLabel: 'Alíquota padrão estimada para automóveis',
    lastUpdated: '2026-06-23',
    notes: 'Pode variar conforme tipo de veículo, combustível, isenção ou legislação estadual.',
  },
  {
    uf: 'RO', nome: 'Rondônia', aliquotaAtual: 3.0,
    sourceLabel: 'Alíquota padrão estimada para automóveis',
    lastUpdated: '2026-06-23',
    notes: 'Pode variar conforme tipo de veículo, combustível, isenção ou legislação estadual.',
  },
  {
    uf: 'RR', nome: 'Roraima', aliquotaAtual: 3.0,
    sourceLabel: 'Alíquota padrão estimada para automóveis',
    lastUpdated: '2026-06-23',
    notes: 'Pode variar conforme tipo de veículo, combustível, isenção ou legislação estadual.',
  },
  {
    uf: 'SC', nome: 'Santa Catarina', aliquotaAtual: 2.0,
    sourceLabel: 'Alíquota padrão estimada para automóveis',
    lastUpdated: '2026-06-23',
    notes: 'Pode variar conforme tipo de veículo, combustível, isenção ou legislação estadual.',
  },
  {
    uf: 'SP', nome: 'São Paulo', aliquotaAtual: 4.0,
    sourceLabel: 'Alíquota padrão estimada para automóveis',
    lastUpdated: '2026-06-23',
    notes: 'Pode variar conforme tipo de veículo, combustível, isenção ou legislação estadual.',
  },
  {
    uf: 'SE', nome: 'Sergipe', aliquotaAtual: 2.5,
    sourceLabel: 'Alíquota padrão estimada para automóveis',
    lastUpdated: '2026-06-23',
    notes: 'Pode variar conforme tipo de veículo, combustível, isenção ou legislação estadual.',
  },
  {
    uf: 'TO', nome: 'Tocantins', aliquotaAtual: 2.0,
    sourceLabel: 'Alíquota padrão estimada para automóveis',
    lastUpdated: '2026-06-23',
    notes: 'Pode variar conforme tipo de veículo, combustível, isenção ou legislação estadual.',
  },
];
