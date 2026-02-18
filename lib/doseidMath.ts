export type BioSex = "male" | "female";

export type NormalizedPatient = {
  ageYears: number;
  sex: BioSex;
  totalBodyWeightKg: number;
  heightCm: number;
  serumCreatinineMgDl: number;
  bmi: number;
  ibwKg: number;
  adjbwKg: number;
  lbwKg: number;
  crclWeightKg: number;
  crclMlMin: number;
};

const KG_PER_LB = 0.45359237;
const CM_PER_IN = 2.54;

export function toKg(weight: number, unit: "kg" | "lb"): number {
  return unit === "kg" ? weight : weight * KG_PER_LB;
}

export function toCmFromMetric(cm: number): number {
  return cm;
}

export function toCmFromImperial(feet: number, inches: number): number {
  return (feet * 12 + inches) * CM_PER_IN;
}

export function bmiFromKgCm(weightKg: number, heightCm: number): number {
  const heightM = heightCm / 100;
  if (heightM <= 0) return 0;
  return weightKg / (heightM * heightM);
}

export function ibwKg(sex: BioSex, heightCm: number): number {
  const heightIn = heightCm / CM_PER_IN;
  const base = sex === "male" ? 50 : 45;
  const over5Ft = Math.max(0, heightIn - 60);
  return base + 2.3 * over5Ft;
}

export function adjbwKg(tbwKg: number, ibw: number): number {
  return ibw + 0.4 * (tbwKg - ibw);
}

export function lbwKg(sex: BioSex, tbwKg: number, bmi: number): number {
  if (sex === "male") {
    return (9270 * tbwKg) / (6680 + 216 * bmi);
  }
  return (9270 * tbwKg) / (8780 + 244 * bmi);
}

export function crclWeightKg(tbwKg: number, ibw: number, bmi: number): number {
  if (bmi >= 30) {
    return adjbwKg(tbwKg, ibw);
  }
  return tbwKg;
}

export function cockcroftGaultMlMin(
  ageYears: number,
  sex: BioSex,
  scrMgDl: number,
  weightKg: number
): number {
  if (ageYears <= 0 || scrMgDl <= 0 || weightKg <= 0) return 0;
  const base = ((140 - ageYears) * weightKg) / (72 * scrMgDl);
  return sex === "female" ? base * 0.85 : base;
}

export function normalizePatient(args: {
  ageYears: number;
  sex: BioSex;
  totalBodyWeightKg: number;
  heightCm: number;
  serumCreatinineMgDl: number;
}): NormalizedPatient {
  const bmi = bmiFromKgCm(args.totalBodyWeightKg, args.heightCm);
  const ibw = ibwKg(args.sex, args.heightCm);
  const adjbw = adjbwKg(args.totalBodyWeightKg, ibw);
  const lbw = lbwKg(args.sex, args.totalBodyWeightKg, bmi);
  const crclWt = crclWeightKg(args.totalBodyWeightKg, ibw, bmi);
  const crcl = cockcroftGaultMlMin(args.ageYears, args.sex, args.serumCreatinineMgDl, crclWt);

  return {
    ageYears: args.ageYears,
    sex: args.sex,
    totalBodyWeightKg: args.totalBodyWeightKg,
    heightCm: args.heightCm,
    serumCreatinineMgDl: args.serumCreatinineMgDl,
    bmi,
    ibwKg: ibw,
    adjbwKg: adjbw,
    lbwKg: lbw,
    crclWeightKg: crclWt,
    crclMlMin: crcl,
  };
}

export function format1(value: number): string {
  return Number.isFinite(value) ? value.toFixed(1) : "-";
}

export function roundDose(value: number, step = 50): number {
  return Math.round(value / step) * step;
}
