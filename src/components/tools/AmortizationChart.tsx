import React, { useState, useRef, useEffect } from "react";
import Chart from "chart.js/auto";
import type {
  AmortizationData,
  AmortizationTable,
} from "@interfaces/amortization";

const AmortizationChart = ({
  amortization,
}: {
  amortization: AmortizationData | null;
}) => {
  // Chart.js code to create the analytics overview chart
  // This is a placeholder and needs actual data to render the chart

  const chartRef = useRef<HTMLCanvasElement>(null);
  const [groupSize, setGroupSize] = useState(1); // Estado para el tamaño de grupo

  const groupData = (data: AmortizationTable[], size: number) => {
    let groupedData: {
      interest: number[];
      fee: number[];
      principal: number[];
      labels: string[];
    } = {
      interest: [],
      fee: [],
      principal: [],
      labels: [],
    };

    // const labels = amortization.amortizationTable.map(
    //   (entry, index) => index + 1,
    // );

    // let totalInterest = 0;
    // let totalFee = 0;

    // const interestData = amortization.amortizationTable.map((entry) => {
    //   totalInterest += entry.interestPayment;
    //   return totalInterest;
    // });

    // const feeData = amortization.amortizationTable.map((entry) => {
    //   totalFee += entry.feePayment;
    //   return totalFee;
    // });

    // const principalData = amortization.amortizationTable.map(
    //   (entry) => entry.remainingBalance,
    // );

    let interestSum = 0;
    let feeSum = 0;

    for (let i = 0; i < data.length; i += size) {
      let principalVal =
        data[Math.min(i + size - 1, data.length - 1)].remainingBalance;

      for (let j = i; j < i + size && j < data.length; j++) {
        interestSum += data[j].interestPayment;
        feeSum += data[j].feePayment;
      }

      groupedData.interest.push(interestSum);
      groupedData.fee.push(feeSum);
      groupedData.principal.push(principalVal);
      if (size == 1) {
        groupedData.labels.push(`Period ${i + 1} `);
      } else {
        groupedData.labels.push(
          `Period ${i + 1} - ${Math.min(i + size, data.length)}`,
        );
      }
    }

    return groupedData;
  };

  const prepareChartData = () => {
    if (!amortization || !amortization.amortizationTable) return null;

    const grouped = groupData(amortization.amortizationTable, groupSize);

    const PRINCIPAL_COLOR = "rgba(75,192,192,1)";
    const INTEREST_COLOR = "rgba(230,82,82,1)";
    const FEE_COLOR = "rgba(75,192,92,1)";

    return {
      labels: [0, ...grouped.labels],
      datasets: [
        {
          label: "Principal",
          data: [amortization.principal, ...grouped.principal],
          fill: false,
          backgroundColor: PRINCIPAL_COLOR,
          borderColor: PRINCIPAL_COLOR,
          pointBorderColor: PRINCIPAL_COLOR,
          pointBackgroundColor: "#fff",
          pointBorderWidth: 2,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: PRINCIPAL_COLOR,
          pointHoverBorderColor: "rgba(220,220,220,1)",
          pointHoverBorderWidth: 2,
          pointRadius: 4,
          pointHitRadius: 10,
        },
        {
          label: "Interests",
          data: [0, ...grouped.interest],
          fill: false,
          backgroundColor: INTEREST_COLOR,
          borderColor: INTEREST_COLOR,
          pointBorderColor: INTEREST_COLOR,
          pointBackgroundColor: "#fff",
          pointBorderWidth: 2,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: INTEREST_COLOR,
          pointHoverBorderColor: "rgba(220,220,220,1)",
          pointHoverBorderWidth: 2,
          pointRadius: 4,
          pointHitRadius: 10,
          // Resto de configuración para este dataset...
        },
        {
          label: "Installments",
          data: [0, ...grouped.fee],
          fill: false,
          backgroundColor: FEE_COLOR,
          borderColor: FEE_COLOR,
          pointBorderColor: FEE_COLOR,
          pointBackgroundColor: "#fff",
          pointBorderWidth: 2,
          pointHoverRadius: 5,
          pointHoverBackgroundColor: FEE_COLOR,
          pointHoverBorderColor: "rgba(220,220,220,1)",
          pointHoverBorderWidth: 2,
          pointRadius: 4,
          pointHitRadius: 10,

          // Resto de configuración para este dataset...
        },
      ],
    };
  };

  useEffect(() => {
    if (!chartRef.current) return;
    const ctx = chartRef.current.getContext("2d");
    if (!ctx) return;

    const chartData = prepareChartData();
    if (!chartData) return;

    const analyticsChart = new Chart(ctx, {
      type: "line",
      data: chartData,
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true,
          },
        },
        interaction: {
          intersect: false,
          mode: "index",
        },
      },
    });

    return () => {
      analyticsChart.destroy();
    };
  }, [amortization, groupSize]);

  return (
    <div>
      {amortization && (
        <>
          <h3 className="h4 mb-2">Loan Amortization Chart</h3>
          {/* Selector para el tamaño de grupo */}
          <select
            className="combobox form-input col-3"
            onChange={(e) => setGroupSize(parseInt(e.target.value))}
          >
            <option value="1">Ungrouped</option>
            <option value="2">Every 2 Periods</option>
            <option value="3">Every 3 Periods</option>
            <option value="4">Every 4 Periods</option>
            <option value="6">Every 4 Periods</option>
            <option value="12">Every 12 Periods</option>
            {/* Otras opciones... */}
          </select>
          <canvas ref={chartRef} id="analyticsChart" className="py-4"></canvas>
        </>
      )}
    </div>
  );
};

export default AmortizationChart;
