import React, { useEffect, useState } from "react";
import {
  FREQUENCY_OPTIONS,
  type AmortizationData,
  type OptionalRecurrent,
  type showAdditional,
  TERM_OPTIONS,
} from "@interfaces/amortization";
import Download from "@components/common/Download";
import DownloadFileAPI from "@services/downloadFileAPI";

const AmortizationTable = ({
  amortization,
}: {
  amortization: AmortizationData | null;
}) => {
  const [showAdditionalPayment, setShowAdditionalPayment] =
    useState<showAdditional>({
      show: false,
      activate: true,
    });
  const [optionalInsurances, setOptionalInsurances] =
    useState<OptionalRecurrent>({
      show: false,
      headers: [],
      activate: true,
    });

  useEffect(() => {
    if (amortization && amortization.amortizationTable) {
      const showOptional = amortization.amortizationTable.some(
        (item) =>
          item.recurringPayments !== null &&
          Object.values(item.recurringPayments).length !== 0,
      );

      const showAdditional = amortization.amortizationTable.some(
        (item) =>
          item.additionalPayment !== null && item.additionalPayment !== 0,
      );

      if (showOptional) {
        const headers = Object.keys(
          amortization.amortizationTable[0].recurringPayments,
        );
        setOptionalInsurances({
          ...optionalInsurances,
          show: showOptional,
          headers: headers,
        });
      }

      if (showAdditional) {
        setShowAdditionalPayment({
          ...showAdditionalPayment,
          show: showAdditional,
        });
      }
    }
  }, [amortization]);

  const handleDownloadFile = async () => {
    if (amortization) {
      try {
        // Llama a la API para descargar el archivo
        await DownloadFileAPI.getAmortizationTableFileXLSX({
          amortization: amortization,
        }).then(() => {
          // La descarga se manejará automáticamente por el navegador
          console.log("Download Successfully");
        });
      } catch (error) {
        console.error("Download request failed", error);
      }
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        {amortization && (
          <div className="flex flex-col gap-4">
            <h3 className="h4 mt-8">General Results</h3>
            <div className="flex flex-col gap-6 md:flex-row md:gap-10 ">
              <table className="flex flex-row gap-8">
                <thead>
                  <tr className="flex flex-col justify-start items-start ">
                    <th>Principal:</th>
                    <th>Interests:</th>
                    <th>Principal + Interest:</th>
                    {amortization.disbursementFee !== null &&
                      amortization.disbursementFee !== 0 && (
                        <th>Disbursement Fee:</th>
                      )}
                    {Object.keys(amortization.recurringPayments).map(
                      (item, index) => (
                        <th key={index}>{item}:</th>
                      ),
                    )}
                    {showAdditionalPayment.show && (
                      <th>Additional Payments:</th>
                    )}
                    <th>Total Payments:</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="flex flex-col items-end">
                    <td>{amortization.principal.toFixed(2)}</td>

                    <td>{amortization.interestPayment.toFixed(2)}</td>
                    <td>{amortization.feePayment.toFixed(2)}</td>
                    {amortization.disbursementFee !== null &&
                      amortization.disbursementFee !== 0 && (
                        <td> {amortization.disbursementFee.toFixed(2)}</td>
                      )}
                    {Object.keys(amortization.recurringPayments).map(
                      (item, index) => (
                        <td key={index}>
                          {amortization.recurringPayments[item].toFixed(2)}
                        </td>
                      ),
                    )}
                    {showAdditionalPayment.show && (
                      <td>{amortization.additionalPayment.toFixed(2)}</td>
                    )}
                    <td>{amortization.totalAmountPay.toFixed(2)}</td>
                  </tr>
                </tbody>
              </table>
              <table className="flex flex-row gap-8">
                <thead>
                  <tr className="flex flex-col justify-start items-start ">
                    <th>Interest Rate:</th>
                    <th>Number of Periods:</th>
                    <th>Number of Installments:</th>
                    <th>Payment Period:</th>
                    {amortization.gracePeriod !== null &&
                      amortization.gracePeriod !== 0 && <th>Grace Period:</th>}
                  </tr>
                </thead>
                <tbody>
                  <tr className="flex flex-col items-end">
                    <td>
                      {amortization.interestRate}%{" "}
                      {FREQUENCY_OPTIONS.find(
                        (option) => option.id == amortization.interestRateType,
                      )?.name.toLowerCase()}
                    </td>
                    <td>
                      {amortization.periodsNumber}{" "}
                      {TERM_OPTIONS.find(
                        (option) => option.id == amortization.periodsType,
                      )?.name.toLowerCase()}
                    </td>
                    <td>{amortization.numberInstallments} installments</td>
                    <td>
                      {
                        FREQUENCY_OPTIONS.find(
                          (option) =>
                            option.id == amortization.paymentFrecuency,
                        )?.name
                      }
                    </td>
                    {amortization.gracePeriod !== null &&
                      amortization.gracePeriod !== 0 && (
                        <td> {amortization.gracePeriod} installments</td>
                      )}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
      <div>{amortization && <Download onClick={handleDownloadFile} />}</div>
      {amortization && <h3 className="h4 mt-8">Amortization Table</h3>}
      <div className="overflow-x-auto">
        {amortization && (
          <table className="table table-amortization">
            <thead>
              <tr>
                <th>Period</th>
                <th>Principal</th>
                <th>Fee Payment</th>
                <th>Interest</th>
                {optionalInsurances.show &&
                  optionalInsurances.activate &&
                  optionalInsurances.headers.map((item, index) => (
                    <th key={index}>{item}</th>
                  ))}
                {showAdditionalPayment.show &&
                  showAdditionalPayment.activate && (
                    <th>Additional Payments</th>
                  )}
                <th>Amortization </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>0</td>
                <td
                  colSpan={
                    3 +
                    optionalInsurances.headers.length +
                    (showAdditionalPayment.show &&
                    showAdditionalPayment.activate
                      ? 1
                      : 0)
                  }
                ></td>

                <td className="principal">
                  {amortization && amortization.principal.toFixed(2)}
                </td>
              </tr>
              {amortization &&
                amortization?.amortizationTable.map(
                  (
                    {
                      period,
                      feePayment,
                      interestPayment,
                      principalPayment,
                      remainingBalance,
                      recurringPayments,
                      additionalPayment,
                    },
                    index,
                  ) => (
                    <tr key={index}>
                      <td>{period}</td>
                      <td>{principalPayment.toFixed(2)}</td>
                      <td>{feePayment.toFixed(2)}</td>
                      <td>{interestPayment.toFixed(2)}</td>
                      {optionalInsurances.show &&
                        optionalInsurances.activate &&
                        Object.keys(recurringPayments).map((item, index) => (
                          <td key={index}>
                            {recurringPayments[item].toFixed(2)}
                          </td>
                        ))}
                      {showAdditionalPayment.show &&
                        showAdditionalPayment.activate && (
                          <td>{additionalPayment.toFixed(2)}</td>
                        )}
                      <td>{remainingBalance.toFixed(2)}</td>
                    </tr>
                  ),
                )}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={1}></td>
                <td>{amortization.principal.toFixed(2)}</td>
                <td>{amortization?.feePayment.toFixed(2)}</td>
                <td>{amortization?.interestPayment.toFixed(2)}</td>
                {optionalInsurances.show &&
                  optionalInsurances.activate &&
                  Object.keys(amortization.recurringPayments).map(
                    (item, index) => (
                      <td key={index}>
                        {amortization?.recurringPayments[item].toFixed(2)}
                      </td>
                    ),
                  )}
                {showAdditionalPayment.show &&
                  showAdditionalPayment.activate &&
                  amortization.additionalPayment && (
                    <td>{amortization?.additionalPayment.toFixed(2)}</td>
                  )}
                <td></td>
              </tr>
            </tfoot>
          </table>
        )}
      </div>
    </div>
  );
};

export default AmortizationTable;
