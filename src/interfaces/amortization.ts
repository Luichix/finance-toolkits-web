export interface AmortizationData {
  feePayment: number;
  interestPayment: number;
  additionalPayment: number;
  recurringPayments: Recurring;
  totalAmountPay: number;
  numberInstallments: number;
  disbursementFee: number;
  amortizationTable: AmortizationTable[];
  principal: number;
  interestRate: number;
  periodsNumber: number;
  paymentFrecuency: string;
  interestRateType: string;
  periodsType: string;
  gracePeriod: number;
}

export interface AmortizationTable {
  feePayment: number;
  interestPayment: number;
  additionalPayment: number;
  recurringPayments: Recurring;
  period: number;
  principalPayment: number;
  remainingBalance: number;
}

type Recurring = Record<string, number>;

export interface RecurrentRate {
  name: string;
  isRate: boolean;
}

export interface OptionalRecurrent {
  show: boolean;
  headers: string[];
  activate: boolean;
}

export interface showAdditional {
  show: boolean;
  activate: boolean;
}

export enum FrequencyType {
  annual = "annual",
  semiannual = "semiannual",
  quarterly = "quarterly",
  bimonthly = "bimonthly",
  monthly = "monthly",
  biweekly = "biweekly",
  weekly = "weekly",
  daily = "daily",
}

export enum SystemAmortization {
  FRENCH = "French",
  GERMAN = "German",
  AMERICAN = "American",
}

export const FREQUENCY_LIST = {
  Annual: FrequencyType.annual,
  Semiannual: FrequencyType.semiannual,
  Quarterly: FrequencyType.quarterly,
  Bimonthly: FrequencyType.bimonthly,
  Monthly: FrequencyType.monthly,
  Biweekly: FrequencyType.biweekly,
  Weekly: FrequencyType.weekly,
  Daily: FrequencyType.daily,
  "Year(s)": FrequencyType.annual,
  "Semester(s)": FrequencyType.semiannual,
  "Quarter(s)": FrequencyType.quarterly,
  "Two-Month Period(s)": FrequencyType.bimonthly,
  "Month(s)": FrequencyType.monthly,
  "Fortnight(s)": FrequencyType.biweekly,
  "Week(s)": FrequencyType.weekly,
  "Day(s)": FrequencyType.daily,
};

export type FrequenciesOptions =
  | "Annual"
  | "Semiannual"
  | "Quarterly"
  | "Bimonthly"
  | "Monthly"
  | "Biweekly"
  | "Weekly"
  | "Daily";

export type TermOptions =
  | "Year(s)"
  | "Semester(s)"
  | "Quarter(s)"
  | "Two-Month Period(s)"
  | "Month(s)"
  | "Fortnight(s)"
  | "Week(s)"
  | "Day(s)";

export const TERM_OPTIONS = [
  { id: "annual", name: "Year(s)" },
  { id: "semiannual2", name: "Semester(s)" },
  { id: "quarterly", name: "Quarter(s)" },
  { id: "bimonthly", name: "Two-Month Period(s)" },
  { id: "monthly", name: "Month(s)" },
  { id: "biweekly", name: "Fortnight(s)" },
  { id: "weekly", name: "Week(s)" },
  { id: "daily", name: "Day(s)" },
];

export const FREQUENCY_OPTIONS = [
  { id: "annual", name: "Annual" },
  { id: "semiannual2", name: "Semiannual" },
  { id: "quarterly", name: "Quarterly" },
  { id: "bimonthly", name: "Bimonthly" },
  { id: "monthly", name: "Monthly" },
  { id: "biweekly", name: "Biweekly" },
  { id: "weekly", name: "Weekly" },
  { id: "daily", name: "Daily" },
];
