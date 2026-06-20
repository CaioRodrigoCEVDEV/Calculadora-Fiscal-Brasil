const percentFormatter = new Intl.NumberFormat('pt-BR', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const decimalFormatterCache = new Map<number, Intl.NumberFormat>();

function getDecimalFormatter(digits: number) {
  const cached = decimalFormatterCache.get(digits);

  if (cached) {
    return cached;
  }

  const formatter = new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });

  decimalFormatterCache.set(digits, formatter);
  return formatter;
}

export function formatPercent(value: number): string {
  return `${percentFormatter.format(Number.isFinite(value) ? value : 0)}%`;
}

export function formatDecimal(value: number, digits = 3): string {
  return getDecimalFormatter(digits).format(Number.isFinite(value) ? value : 0);
}
