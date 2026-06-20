export function parseDecimal(value: string | number | null | undefined): number {
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : 0;
  }

  if (value == null) {
    return 0;
  }

  const trimmed = value.trim();

  if (trimmed.length === 0) {
    return 0;
  }

  const normalized = trimmed.replace(/\s/g, '').replace(/[R$]/g, '');
  const lastComma = normalized.lastIndexOf(',');
  const lastDot = normalized.lastIndexOf('.');

  let sanitized = normalized;

  if (lastComma >= 0 && lastDot >= 0) {
    if (lastComma > lastDot) {
      sanitized = normalized.replace(/\./g, '').replace(',', '.');
    } else {
      sanitized = normalized.replace(/,/g, '');
    }
  } else if (lastComma >= 0) {
    sanitized = normalized.replace(/\./g, '').replace(',', '.');
  } else {
    sanitized = normalized.replace(/,/g, '');
  }

  sanitized = sanitized.replace(/[^\d.-]/g, '');

  const firstDotIndex = sanitized.indexOf('.');
  if (firstDotIndex !== -1) {
    const before = sanitized.slice(0, firstDotIndex + 1);
    const after = sanitized.slice(firstDotIndex + 1).replace(/\./g, '');
    sanitized = before + after;
  }

  const parsed = Number.parseFloat(sanitized);

  return Number.isFinite(parsed) ? parsed : 0;
}
