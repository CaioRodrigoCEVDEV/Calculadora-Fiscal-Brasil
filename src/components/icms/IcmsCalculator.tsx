'use client';

import { useEffect, useState } from 'react';
import { IcmsCalculatorForm } from './IcmsCalculatorForm';
import { IcmsExplanation } from './IcmsExplanation';
import { IcmsResultCard } from './IcmsResultCard';
import { type CalculationType } from '@/lib/fiscal/constants';
import type { IcmsCalculationView } from '@/lib/fiscal/types';

interface IcmsCalculatorProps {
  initialCalculationType?: CalculationType;
}

export function IcmsCalculator({
  initialCalculationType = 'icms_proprio',
}: IcmsCalculatorProps) {
  const [calculation, setCalculation] = useState<IcmsCalculationView | null>(null);
  const [calculationType, setCalculationType] = useState<CalculationType>(initialCalculationType);

  useEffect(() => {
    setCalculationType(initialCalculationType);
  }, [initialCalculationType]);

  function handleResultChange(values: IcmsCalculationView) {
    setCalculation(values);
  }

  function handleClear() {
    setCalculation(null);
  }

  return (
    <>
      <section
        className="grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] lg:items-start"
        aria-label="Calculadora Fiscal Brasil"
      >
        <IcmsCalculatorForm
          initialCalculationType={initialCalculationType}
          onResultChange={handleResultChange}
          onClear={handleClear}
          onTypeChange={setCalculationType}
        />
        <IcmsResultCard calculation={calculation} />
      </section>
      <section id="explicacao" className="scroll-mt-24">
        <IcmsExplanation calculationType={calculationType} />
      </section>
    </>
  );
}
