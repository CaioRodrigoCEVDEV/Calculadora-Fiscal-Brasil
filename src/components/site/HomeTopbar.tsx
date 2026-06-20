import Image from 'next/image';
import Link from 'next/link';
import { APP_NAME, APP_SHORT_NAME } from '@/lib/site/content';
import { BRAND_ICON_32_PATH, BRAND_LOGO_PATH } from '@/lib/site/brand';

interface HomeTopbarProps {
  variant?: 'home' | 'detail';
}

export function HomeTopbar({ variant = 'home' }: HomeTopbarProps) {
  const isHome = variant === 'home';
  const navItems = isHome
    ? [
        { href: '#calculos-fiscais-disponiveis', label: 'Cálculos' },
        { href: '#simule-seu-calculo-fiscal', label: 'Calculadora' },
        { href: '#duvidas-frequentes', label: 'FAQ' },
      ]
    : [
        { href: '#calculos-fiscais-disponiveis', label: 'Cálculos' },
        { href: '#simule-seu-calculo-fiscal', label: 'Calculadora' },
      ];

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:h-[72px] sm:px-6 lg:px-8">
        {isHome ? (
          <a
            href="#top"
            className="flex min-w-0 flex-1 items-center gap-2"
            aria-label="Voltar ao topo da página"
          >
            <span className="hidden sm:block">
              <Image
                src={BRAND_LOGO_PATH}
                alt={APP_NAME}
                width={2172}
                height={724}
                className="h-10 w-auto sm:h-11"
                sizes="(min-width: 640px) 220px, 0px"
              />
            </span>
            <span className="flex min-w-0 items-center gap-2 sm:hidden">
              <Image
                src={BRAND_ICON_32_PATH}
                alt=""
                width={32}
                height={32}
                aria-hidden="true"
                className="h-8 w-8 shrink-0"
              />
              <span className="truncate text-sm font-semibold tracking-tight text-slate-950">
                {APP_SHORT_NAME}
              </span>
            </span>
          </a>
        ) : (
          <Link href="/pt/calculadora-fiscal" className="flex min-w-0 flex-1 items-center gap-2" aria-label="Ir para a página principal">
            <span className="hidden sm:block">
              <Image
                src={BRAND_LOGO_PATH}
                alt={APP_NAME}
                width={2172}
                height={724}
                className="h-10 w-auto sm:h-11"
                sizes="(min-width: 640px) 220px, 0px"
              />
            </span>
            <span className="flex min-w-0 items-center gap-2 sm:hidden">
              <Image
                src={BRAND_ICON_32_PATH}
                alt=""
                width={32}
                height={32}
                aria-hidden="true"
                className="h-8 w-8 shrink-0"
              />
              <span className="truncate text-sm font-semibold tracking-tight text-slate-950">
                {APP_SHORT_NAME}
              </span>
            </span>
          </Link>
        )}

        <nav className="ml-2 hidden items-center gap-1 md:flex" aria-label="Seções da página">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="rounded-full px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-950 focus:outline-none focus:ring-4 focus:ring-sky-200"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <a
          href="#simule-seu-calculo-fiscal"
          className="ml-auto inline-flex h-10 items-center justify-center rounded-full bg-sky-600 px-4 text-sm font-semibold text-white transition hover:bg-sky-700 focus:outline-none focus:ring-4 focus:ring-sky-200"
        >
          <span className="sm:hidden">Começar</span>
          <span className="hidden sm:inline">Começar cálculo</span>
        </a>
      </div>
    </header>
  );
}
