import Link from 'next/link';

export function IcmsAvailableCalculations() {
  const activeItems = ['ICMS', 'ICMS reverso', 'ICMS-ST', 'IPI', 'PIS/COFINS', 'DIFAL', 'FCP', 'IBS/CBS', 'IPVA PEC'];

  return (
    <div className="space-y-3 text-sm text-slate-600">
      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
        <span className="font-medium text-slate-500">Cálculos disponíveis:</span>
        <div className="flex flex-wrap gap-2">
          {activeItems.map((item) => (
            <span
              key={item}
              className="inline-flex items-center rounded-full border border-sky-200 bg-sky-50 px-3 py-1 text-xs font-medium text-sky-700"
            >
              {item}
            </span>
          ))}
        </div>
      </div>

      <Link href="/pt/calculadora-fiscal" className="inline-flex text-sm font-semibold text-sky-700 transition hover:text-sky-800 focus:outline-none focus:ring-4 focus:ring-sky-200">
        Ver todas as calculadoras fiscais
      </Link>
    </div>
  );
}
