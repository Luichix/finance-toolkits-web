import useInputs from "@lib/utils/useInputs";
import React, { useState } from "react";
import {
  FrequencyType,
  type AmortizationData,
  type RecurrentRate,
  SystemAmortization,
  type FrequenciesOptions,
  type TermOptions,
  FREQUENCY_LIST,
  TERM_OPTIONS,
  FREQUENCY_OPTIONS,
} from "@interfaces/amortization.ts";
import { Combobox } from "@components/common/Combobox.tsx";
import { Collapsed } from "@components/common/Collapsed.tsx";
import { Alert } from "@components/common/Alert.tsx";
import useAlert from "@lib/utils/useAlert";
import InfoButton from "@components/common/InfoButton";

const AmortizationForm = ({
  setAmortization,
}: {
  setAmortization: React.Dispatch<
    React.SetStateAction<AmortizationData | null>
  >;
}) => {
  const [principal, setPrincipal] = useState("");
  const [rate, setRate] = useState("");
  const [rateType, setRateType] = useState("");
  const [periods, setPeriods] = useState("");
  const [periodsType, setPeriodsType] = useState("");
  const [paymentFrecuency, setPaymentFrecuency] = useState("");
  const [systemAmortization, setSystemAmortization] =
    useState<SystemAmortization>(SystemAmortization.FRENCH);
  const [gracePeriod, setGracePeriod] = useState("");
  const [commission, setCommission] = useState("");
  const [newRecurrent, setNewRecurrent] = useState("");
  const [newAdditionalPayment, setNewAdditionalPayment] = useState("");
  const [commissionIsRate, setCommissionIsRate] = useState(false);
  const [recurrentsIsRate, setRecurrentsIsRate] = useState<RecurrentRate[]>([]);

  const {
    inputs: recurrents,
    addInputs: addRecurrent,
    handleChange: handleChangeRecurrent,
    updateForm: clearRecurrents,
  } = useInputs(() => {});

  const {
    inputs: additionalPayments,
    addInputs: addAdditionalPayment,
    handleChange: handleChangeAdditionalPayment,
    updateForm: clearAdditionalPayments,
  } = useInputs(() => {});

  const [show, info, alert, showAlert] = useAlert();

  // Handerl Recurrents Payments
  const handlerNewRecurrent = (value: string) => {
    const newRecurrent = value.trim();

    if (newRecurrent === "") {
      const message = "Cannot add an empty recurring payment";
      showAlert([message], "error");
      throw new Error(message);
    }

    if (recurrents.findIndex((item) => item.label === newRecurrent) >= 0) {
      const message = "The name of the payments should not be repeated";
      showAlert([message], "error");
      throw new Error(message);
    }

    const name = newRecurrent
      .replaceAll(/\s/g, "")
      .concat(recurrents.length.toString());

    addRecurrent({
      label: newRecurrent,
      name: name,
      placeholder: "Payment amount or rate",
      type: "number",
    });

    setRecurrentsIsRate([...recurrentsIsRate, { name: name, isRate: false }]);

    setNewRecurrent("");
  };

  const handlerRecurrentRateCheck = (name: string) => {
    const updateRecurrents = recurrentsIsRate.map((recurrent) => {
      if (recurrent.name === name) {
        return {
          ...recurrent,
          isRate: !recurrent.isRate,
        };
      }
      return recurrent;
    });
    setRecurrentsIsRate(updateRecurrents);
  };

  // Handler Additional Payments
  const handlerNewAdditionalPayment = (value: string) => {
    const validate = parseInt(value);

    if (isNaN(validate)) {
      const message = "The period entered is not valid";
      showAlert([message], "error");
      throw new Error(message);
    }

    if (validate <= 0) {
      const message = "The period entered is not valid";
      showAlert([message], "error");
      throw new Error(message);
    }

    const newAdditionalPayment = validate.toString();

    if (
      additionalPayments.findIndex(
        (item) => item.label === newAdditionalPayment,
      ) >= 0
    ) {
      const message = "The payment period should not be repeated";
      showAlert([message], "error");
      throw new Error(message);
    }

    addAdditionalPayment({
      label: newAdditionalPayment,
      name: newAdditionalPayment,
      placeholder: "Enter the payment amount",
      type: "number",
    });

    setNewAdditionalPayment("");
  };

  // Handler Submit Form
  const handlerSubmit = async (event: any) => {
    event.preventDefault();

    let extraMessage = "";

    try {
      // Obtiene los valores de los campos de entrada.
      const principalValue = parseFloat(principal);
      const rateValue = parseFloat(rate);
      const periodsValue = parseInt(periods);

      // Validate entry fields before to assign value
      function getFrecuencyOption(
        frecuency: FrequenciesOptions,
        list: Record<FrequenciesOptions, FrequencyType>,
        isRate?: boolean,
      ) {
        if (!list.hasOwnProperty(frecuency)) {
          extraMessage = isRate
            ? "The Rate Type you have entered is not valid"
            : "The Payment Frequency you have entered is not valid";
          throw new Error(extraMessage);
        }
        return list[frecuency];
      }

      // Validate entry fields before to assign value
      function getTermOption(
        frecuency: TermOptions,
        list: Record<TermOptions, FrequencyType>,
      ) {
        if (!list.hasOwnProperty(frecuency)) {
          extraMessage = "The Term Type you have entered is not valid";
          throw new Error(extraMessage);
        }
        return list[frecuency];
      }

      const rateTypeValue = getFrecuencyOption(
        rateType as FrequenciesOptions,
        FREQUENCY_LIST,
        true,
      );
      const periodsTypeValue = getTermOption(
        periodsType as TermOptions,
        FREQUENCY_LIST,
      );
      const paymentFrecuencyValue = getFrecuencyOption(
        paymentFrecuency as FrequenciesOptions,
        FREQUENCY_LIST,
      );

      // Assign values

      const gracePeriodValue = isNaN(parseInt(gracePeriod))
        ? 0
        : parseInt(gracePeriod);
      const disbursementFeeValue = isNaN(parseFloat(commission))
        ? null
        : {
            amount: parseFloat(commission),
            isRate: commissionIsRate,
          };
      const recurrentsValue = recurrents
        .map((item, index) => {
          if (isNaN(parseFloat(item.value))) {
            return null;
          }
          return {
            name: item.label,
            amount: parseFloat(item.value),
            isRate: recurrentsIsRate[index].isRate,
          };
        })
        .filter((item) => item !== null);

      const additionalPaymentsValue = additionalPayments
        .map((item) => {
          if (isNaN(parseInt(item.label)) || isNaN(parseFloat(item.value))) {
            return null;
          }
          return {
            period: parseInt(item.label),
            paymentAmount: parseFloat(item.value),
          };
        })
        .filter((item) => item !== null);

      // Verifica si los valores son válidos (puedes agregar más validaciones si es necesario).
      if (isNaN(principalValue) || isNaN(rateValue) || isNaN(periodsValue)) {
        extraMessage = "The values entered are not valid";
        throw new Error(extraMessage);
      }

      if (principalValue <= 0 || rateValue <= 0 || periodsValue <= 0) {
        const message = "Values entered cannot be less than or equal to 0";
        showAlert([message], "error");

        throw new Error(message);
      }

      const body = {
        principal: principalValue,
        interestRate: rateValue,
        periodsNumber: periodsValue,
        paymentFrecuency: paymentFrecuencyValue,
        interestRateType: rateTypeValue,
        periodsType: periodsTypeValue,
        gracePeriod: gracePeriodValue,
        additionalPayments: additionalPaymentsValue,
        recurringPayments: recurrentsValue,
        disbursementFee: disbursementFeeValue,
      };

      const URL = import.meta.env.PUBLIC_API_URL;

      const response = await fetch(
        `${URL}/amortization_table?amortizationType=${systemAmortization}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        },
      );

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();

      // Actualiza el estado con los datos obtenidos
      showAlert(["Amortization table generated successfully"], "success");
      setAmortization(data);
    } catch (error) {
      const message = "Ops, an error has occurred";
      console.error(message, error);
      showAlert([message, extraMessage], "error");
    }
  };

  const handlerReset = () => {
    try {
      setPrincipal("");
      setRate("");
      setRateType("");
      setPeriods("");
      setPeriodsType("");
      setPaymentFrecuency("");
      setSystemAmortization(SystemAmortization.FRENCH);
      setCommission("");
      setGracePeriod("");
      setNewRecurrent("");
      setNewAdditionalPayment("");
      setCommissionIsRate(false);
      setRecurrentsIsRate([]);
      clearRecurrents([]);
      clearAdditionalPayments([]);
      showAlert(["The fields have been cleared successfully..!"], "info");
    } catch (error) {
      const message = "An error occurred while trying to clear the fields";
      showAlert([message], "error");
    }
  };

  return (
    <form
      className="flex flex-col gap-2"
      onSubmit={(event) => handlerSubmit(event)}
      autoComplete="off"
    >
      <Alert show={show} alert={alert} message={info} />
      <fieldset className="flex flex-col gap-4 ">
        <legend className="py-4 font-bold">Required fields</legend>
        <div className="flex flex-col gap-4 lg:gap-8 lg:flex-row lg:item ">
          <div className="relative flex  flex-col justify-between lg:col-4">
            <label htmlFor="principal">
              Principal <span className="text-red-600">*</span>
            </label>
            <InfoButton absolute zIndex={75}>
              The <b className="font-bold">"Principal"</b> is the amount of
              money you are borrowing or planning to invest. In other words,
              it's the initial amount of the loan or investment.
            </InfoButton>
            <input
              className="form-input w-full placeholder:text-base "
              name="principal"
              type="number"
              required
              value={principal}
              min={0}
              step={0.01}
              onChange={({ target }) => setPrincipal(target.value)}
              placeholder="Principal Amount"
              pattern={"d+(.d+)?"}
            />
          </div>
          <div>
            <div className="flex flex-col sm:flex-row sm:items-end gap-4 ">
              <div className="sm:w-60 relative ">
                <label htmlFor="rate">
                  Interest Rate (%)<span className="text-red-600">*</span>{" "}
                </label>
                <InfoButton absolute zIndex={70}>
                  The <b className="font-bold">"Interest Rate"</b> represents
                  the cost of the loan or the gain you will get from your
                  investment. It is expressed in percentage and determines how
                  much you will have to pay or how much you will earn over time.
                </InfoButton>
                <input
                  min={0}
                  className="form-input w-full mt-1  placeholder:text-base"
                  name="rate"
                  type="text"
                  required
                  value={rate}
                  onChange={({ target }) => setRate(target.value)}
                  placeholder="Percentage Interest"
                  title="Enter a valid percentage value, for example: 12.34"
                  pattern="[0-9]*\.?[0-9]+"
                />
              </div>
              <div className="sm:w-60 relative">
                <label htmlFor="rate">
                  Interest Period
                  <span className="text-red-600">*</span>
                </label>
                <InfoButton absolute zIndex={65}>
                  The <b className="font-bold">"Interest Period"</b> refers to
                  the period of the known interest rate. It can be annual,
                  semi-annual, quarterly, monthly, etc. This rate will be
                  converted according to the{" "}
                  <b className="font-bold">Payment Frequency</b>.
                </InfoButton>
                <Combobox
                  query={rateType}
                  setQuery={setRateType}
                  className="form-input w-full placeholder:text-base"
                  placeholder="Rate Type"
                  options={FREQUENCY_OPTIONS}
                  required={true}
                  disabled={true}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col-reverse gap-4  lg:gap-8 lg:flex-row-reverse  lg:justify-end ">
          <div className="flex flex-col sm:flex-row gap-4 sm:items-end">
            <div className="sm:w-60 relative ">
              <label htmlFor="periods">
                Loan Duration<span className="text-red-600">*</span>
              </label>
              <InfoButton absolute zIndex={50}>
                The <b className="font-bold">"Loan Duration"</b> is the period
                of time over which the loan is expected to be paid back or the
                investment results to be seen. Enter the number of years,
                months, or the corresponding term according to the{" "}
                <b className="font-bold">Type of Period</b>.
              </InfoButton>
              <input
                className="form-input w-full mt-1 placeholder:text-base"
                name="periods"
                type="number"
                value={periods}
                onChange={({ target }) => setPeriods(target.value)}
                min={0}
                placeholder="Loan Term"
                pattern={"d+(.d+)?"}
                required={true}
              />
            </div>
            <div className="sm:w-60 relative">
              <label htmlFor="periods">
                Type of Period <span className="text-red-600">*</span>
              </label>
              <InfoButton absolute zIndex={45}>
                The <b className="font-bold">"Type of Period"</b> allows
                indicating whether the duration is measured in years, months, or
                another period. This ensures that the calculation is accurate
                according to your choice.
              </InfoButton>
              <Combobox
                query={periodsType}
                setQuery={setPeriodsType}
                className="form-input w-full placeholder:text-base"
                placeholder="Type of Term"
                options={TERM_OPTIONS}
                required={true}
                disabled={true}
              />
            </div>
          </div>
          <div className="lg:col-4 relative">
            <label htmlFor="payment_frecuency">
              Payment Frequency <span className="text-red-600">*</span>
            </label>
            <InfoButton absolute zIndex={60}>
              The <b className="font-bold">"Payment Frequency"</b> indicates how
              often payments or deposits will be made. It can be annual,
              monthly, semi-annual, bi-weekly, among others. This choice affects
              the number of payments you need to make or the frequency of
              interest capitalization.
            </InfoButton>
            <Combobox
              query={paymentFrecuency}
              setQuery={setPaymentFrecuency}
              className="form-input w-full placeholder:text-base"
              placeholder="Installment Payment Frequency"
              options={FREQUENCY_OPTIONS}
              required={true}
              disabled={true}
            />
          </div>
        </div>
        <div className="relative">
          <div className="flex items-center gap-2">
            <label htmlFor="system">
              Amortization Method <span className="text-red-600">*</span>
            </label>
            <InfoButton zIndex={70}>
              You can find a brief additional explanation about the{" "}
              <b className="font-bold">"Amortization Methods"</b> further down
              in the form instructions.
            </InfoButton>
          </div>

          <div className="flex flex-col py-4 pl-4  gap-2 text-base  ">
            <label className="flex gap-2 items-center">
              <input
                className="text-primary  checked:outline-[#01AD9F] "
                type="radio"
                name="systemAmortization"
                value={SystemAmortization.FRENCH}
                checked={systemAmortization === SystemAmortization.FRENCH}
                onChange={() =>
                  setSystemAmortization(SystemAmortization.FRENCH)
                }
              />
              French System (Fixed Installment)
            </label>
            <label className="flex gap-2 items-center">
              <input
                className="text-primary  checked:outline-[#01AD9F] "
                type="radio"
                name="systemAmortization"
                value={SystemAmortization.GERMAN}
                checked={systemAmortization === SystemAmortization.GERMAN}
                onChange={() =>
                  setSystemAmortization(SystemAmortization.GERMAN)
                }
              />
              German System (Decreasing Installments)
            </label>
            <label className="flex gap-2 items-center">
              <input
                className="text-primary  checked:outline-[#01AD9F] "
                type="radio"
                name="systemAmortization"
                value={SystemAmortization.AMERICAN}
                checked={systemAmortization === SystemAmortization.AMERICAN}
                onChange={() =>
                  setSystemAmortization(SystemAmortization.AMERICAN)
                }
              />
              American System (Constant Interest)
            </label>
          </div>
        </div>
      </fieldset>
      <Collapsed label="Optional Fields">
        <div className="flex flex-col lg:flex-row gap-8 ">
          <div className="flex flex-col items-start gap-1 lg:col-4">
            <div className="relative">
              <label htmlFor="commission">Disbursement Commission</label>
              <InfoButton absolute zIndex={70}>
                You can add the <b className="font-bold">"Commission Amount"</b>{" "}
                or the <b className="font-bold">"Percentage Commission Rate"</b>{" "}
                to be applied to the principal amount of the loan.
              </InfoButton>
              <input
                className="form-input w-full placeholder:text-base"
                name="commission"
                type="number"
                value={commission}
                onChange={({ target }) => setCommission(target.value)}
                min={0}
                step={0.0001}
                placeholder="Add the commission"
              />
            </div>
            <label className="flex flex-row gap-2 items-center text-base outline-none px-2">
              <input
                className="text-primary checked:outline-[#01AD9F] focus:outline-[#01AD9F]"
                type="checkbox"
                checked={commissionIsRate}
                onChange={() => setCommissionIsRate(!commissionIsRate)}
              />
              Use percentage rate %
            </label>
          </div>
          <div className="lg:col-4 relative">
            <label htmlFor="periods">Grace Period</label>
            <InfoButton absolute zIndex={70}>
              The <b className="font-bold">"Grace Period"</b> gives you the
              possibility to add the number of periods or installments that will
              be exempt from principal payment, only accruing interest.
            </InfoButton>
            <input
              className="form-input w-full placeholder:text-base"
              name="grace"
              type="number"
              value={gracePeriod}
              onChange={({ target }) => setGracePeriod(target.value)}
              min={0}
              placeholder="Number of installments"
            />
          </div>
        </div>
      </Collapsed>
      <Collapsed label="Recurrent Payments" dependency={recurrents}>
        <div className="flex flex-row gap-4 items-end">
          <div className="lg:col-4 relative">
            <label htmlFor="periods">Type of Payment</label>
            <InfoButton absolute zIndex={70}>
              The <b className="font-bold">"Recurrent Payments"</b> allow adding
              additional payments that will be applied in each installment of
              the loan, add the name of the payment and then add the amount or
              rate.
            </InfoButton>
            <Combobox
              query={newRecurrent}
              setQuery={setNewRecurrent}
              className="form-input w-full placeholder:text-base"
              placeholder="Select or type"
              options={[
                { id: "1", name: "Recurrent Savings" },
                { id: "2", name: "Life Insurance" },
                { id: "3", name: "Property Insurance" },
                { id: "4", name: "Mortgage Insurance" },
              ]}
            />
          </div>
          <button
            className="btn whitespace-nowrap btn-outline-primary font-bold lg:col-2"
            type="button"
            onClick={() => handlerNewRecurrent(newRecurrent)}
          >
            Add
          </button>
        </div>
        <div className="contact-form row gy-2 justify-center">
          {recurrents &&
            recurrents.map(
              ({ id, label, name, placeholder, type, value }, index) => (
                <div key={id} className="flex flex-row items-end gap-4">
                  <div className="lg:col-3">
                    <label htmlFor={name}>
                      {label} <span className="text-red-600">*</span>
                    </label>
                    <input
                      className="form-input w-full placeholder:text-base"
                      name={name}
                      type={type}
                      value={value}
                      onChange={(event) => handleChangeRecurrent(event, index)}
                      min={0}
                      step={0.0001}
                      placeholder={placeholder}
                    />
                  </div>
                  <label className="flex flex-row gap-2 items-center text-base">
                    <input
                      className="text-primary checked:outline-[#01AD9F] focus:outline-[#01AD9F]"
                      type="checkbox"
                      checked={recurrentsIsRate[index].isRate}
                      onChange={() => handlerRecurrentRateCheck(name)}
                    />
                    Use percentage rate %
                  </label>
                </div>
              ),
            )}
        </div>
      </Collapsed>
      <Collapsed label="Additional Payments" dependency={additionalPayments}>
        <div className="flex flex-row gap-4 items-end">
          <div className="lg:col-4 relative">
            <label htmlFor="additional">Payment Period</label>
            <InfoButton absolute zIndex={70}>
              You can include payments in specific periods with{" "}
              <b className="font-bold">"Additional Payments"</b>. Just add the
              number of the installment where it will be applied and then add
              the amount or rate you require.
            </InfoButton>

            <input
              className="form-input w-full placeholder:text-base"
              value={newAdditionalPayment}
              onChange={({ target }) => setNewAdditionalPayment(target.value)}
              placeholder="Enter the period or month"
              type="number"
              min={1}
            />
          </div>
          <button
            className="btn whitespace-nowrap btn-outline-primary font-bold lg:col-2"
            type="button"
            onClick={() => handlerNewAdditionalPayment(newAdditionalPayment)}
          >
            Add
          </button>
        </div>
        <div>
          {additionalPayments &&
            additionalPayments.map(
              ({ id, label, name, placeholder, type, value }, index) => (
                <div key={id} className="lg:col-3">
                  <label htmlFor={name}>
                    Period {label} <span className="text-red-600">*</span>
                  </label>
                  <input
                    className="form-input w-full placeholder:text-base"
                    name={name}
                    type={type}
                    value={value}
                    onChange={(event) =>
                      handleChangeAdditionalPayment(event, index)
                    }
                    min={0}
                    placeholder={placeholder}
                    step={0.0001}
                  />
                </div>
              ),
            )}
        </div>
      </Collapsed>
      <div className="col-12 gap-6 py-4 pb-8 flex flex-col lg:flex-row">
        <button type="submit" className="btn btn-primary mt-2">
          Generate Table
        </button>
        <button
          type="button"
          onClick={handlerReset}
          className="btn bg-[#e65252] text-white mt-2"
        >
          Reset Fields
        </button>
      </div>
    </form>
  );
};

export default AmortizationForm;
