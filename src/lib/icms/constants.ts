export type CalculationType = 'icms_proprio' | 'icms_st' | 'icms_e_icms_st';

export const UF_OPTIONS = [
  'AC',
  'AL',
  'AP',
  'AM',
  'BA',
  'CE',
  'DF',
  'ES',
  'GO',
  'MA',
  'MT',
  'MS',
  'MG',
  'PA',
  'PB',
  'PR',
  'PE',
  'PI',
  'RJ',
  'RN',
  'RS',
  'RO',
  'RR',
  'SC',
  'SP',
  'SE',
  'TO',
] as const;

export const CALCULATION_TYPE_OPTIONS: Array<{
  value: CalculationType;
  label: string;
}> = [
  {
    value: 'icms_proprio',
    label: 'ICMS próprio',
  },
  {
    value: 'icms_st',
    label: 'ICMS-ST',
  },
  {
    value: 'icms_e_icms_st',
    label: 'ICMS + ICMS-ST',
  },
];

export const CALCULATION_TYPE_LABELS: Record<CalculationType, string> = {
  icms_proprio: 'ICMS próprio',
  icms_st: 'ICMS-ST',
  icms_e_icms_st: 'ICMS + ICMS-ST',
};
