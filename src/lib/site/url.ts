const DEFAULT_SITE_URL = 'https://calculadorafiscalbrasil.com.br';

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? DEFAULT_SITE_URL).replace(/\/$/, '');

export function absoluteUrl(pathname: string) {
  return new URL(pathname, SITE_URL).toString();
}
