'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { APP_NAME, APP_SHORT_NAME } from '@/lib/site/content';
import {
  BRAND_ICON_32_PATH,
  BRAND_LOGO_HEIGHT,
  BRAND_LOGO_PATH,
  BRAND_LOGO_WIDTH,
} from '@/lib/site/brand';
import { CALCULATOR_ROUTE_LIST } from '@/lib/seo/calculatorRoutes';

const CALCULATOR_MENU_ITEMS = CALCULATOR_ROUTE_LIST.filter(
  (route) => route.slug !== 'calculadora-fiscal',
);

export function HomeTopbar() {
  const pathname = usePathname();
  const isHome = pathname === '/pt/calculadora-fiscal';
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const closeAll = useCallback(() => {
    setMenuOpen(false);
    setDropdownOpen(false);
  }, []);

  useEffect(() => {
    if (!dropdownOpen) return;

    function handleMouseDown(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handleMouseDown);
    return () => document.removeEventListener('mousedown', handleMouseDown);
  }, [dropdownOpen]);

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200/80 bg-white/90 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-3 px-4 sm:h-[72px] sm:px-6 lg:px-8">
        <Link
          href="/pt/calculadora-fiscal"
          className="flex min-w-0 flex-1 items-center gap-2"
          aria-label="Ir para a página principal"
        >
          <span className="hidden sm:block">
            <Image
              src={BRAND_LOGO_PATH}
              alt={APP_NAME}
              width={BRAND_LOGO_WIDTH}
              height={BRAND_LOGO_HEIGHT}
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

        <nav className="ml-2 hidden items-center gap-1 md:flex" aria-label="Calculadoras">
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setDropdownOpen((prev) => !prev)}
              className="flex items-center gap-1 rounded-full px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-950 focus:outline-none focus:ring-4 focus:ring-sky-200"
              aria-expanded={dropdownOpen}
              aria-haspopup="true"
            >
              Calculadoras
              <svg
                className={`h-4 w-4 transition ${dropdownOpen ? 'rotate-180' : ''}`}
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
              </svg>
            </button>

            {dropdownOpen && (
              <div className="absolute left-0 top-full z-20 mt-1 w-56 rounded-xl border border-slate-200 bg-white p-1 shadow-lg">
                {CALCULATOR_MENU_ITEMS.map((item) => (
                  <Link
                    key={item.slug}
                    href={item.path}
                    onClick={() => setDropdownOpen(false)}
                    className="block rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-950"
                  >
                    {item.title}
                  </Link>
                ))}
              </div>
            )}
          </div>
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <Link
            href={isHome ? '/pt/calculadora-icms' : '#simule-seu-calculo-fiscal'}
            className="inline-flex h-10 items-center justify-center rounded-full bg-sky-600 px-4 text-sm font-semibold text-white transition hover:bg-sky-700 focus:outline-none focus:ring-4 focus:ring-sky-200"
          >
            <span className="sm:hidden">Começar</span>
            <span className="hidden sm:inline">Começar cálculo</span>
          </Link>

          <button
            type="button"
            onClick={() => setMenuOpen((prev) => !prev)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full text-slate-600 transition hover:bg-slate-100 hover:text-slate-950 focus:outline-none focus:ring-4 focus:ring-sky-200 md:hidden"
            aria-label="Abrir menu de calculadoras"
            aria-expanded={menuOpen}
          >
            {menuOpen ? (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="border-t border-slate-200/80 bg-white px-4 pb-4 pt-2 md:hidden">
          <nav aria-label="Calculadoras">
            <div className="space-y-1">
              <p className="px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-400">
                Calculadoras
              </p>
              {CALCULATOR_MENU_ITEMS.map((item) => (
                <Link
                  key={item.slug}
                  href={item.path}
                  onClick={closeAll}
                  className="block rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100 hover:text-slate-950"
                >
                  {item.title}
                </Link>
              ))}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
