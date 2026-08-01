export type Answer = number | null;

export type ColorKey = "frio" | "tibio" | "caliente";

export interface Diagnosis {
  average: number;
  colorKey: ColorKey;
  label: string;
}