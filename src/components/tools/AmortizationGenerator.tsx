import React, { useState } from "react";
import type { AmortizationData } from "@interfaces/amortization.ts";
import AmortizationTable from "./AmortizationTable.tsx";
import AmortizationForm from "./AmortizationForm.tsx";
import AmortizationChart from "./AmortizationChart.tsx";

const AmortizationGenerator = () => {
  const [amortization, setAmortization] = useState<AmortizationData | null>(
    null,
  );

  return (
    <div className="flex flex-col gap-4 ">
      <AmortizationForm setAmortization={setAmortization} />
      <AmortizationChart amortization={amortization} />
      <AmortizationTable amortization={amortization} />
    </div>
  );
};

export default AmortizationGenerator;
