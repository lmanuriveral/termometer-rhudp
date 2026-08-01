import type { Diagnosis } from "../types";

export const TEMA = "Percepción sobre los derechos menstruales en Colombia";

export const PREGUNTAS: string[] = [
  "Considero que el acceso a productos menstruales (toallas, tampones, copas) debería ser gratuito en las instituciones educativas públicas.",
  "La ausencia de una licencia menstrual remunerada afecta negativamente el bienestar y la productividad de las trabajadoras en Colombia.",
  "La educación menstrual integral debería incluirse de forma obligatoria en el currículo escolar desde la educación básica.",
  'El IVA a los productos de gestión menstrual ("impuesto rosa") es una barrera económica injusta para las mujeres y personas menstruantes.',
  "Existe suficiente infraestructura sanitaria (agua, jabón y disposición de residuos) en espacios públicos y laborales para gestionar la menstruación con dignidad.",
  "El estigma social asociado a la menstruación sigue siendo un obstáculo importante para hablar del tema abiertamente en Colombia.",
  "Las políticas públicas actuales garantizan de manera adecuada los derechos menstruales de las mujeres rurales y de escasos recursos.",
  "Apoyo que el Estado colombiano invierta más recursos en programas de salud y menstruación digna.",
];

export const ETIQUETAS: Record<number, string> = {
  1: "Totalmente en desacuerdo",
  2: "En desacuerdo",
  3: "Ni de acuerdo ni en desacuerdo",
  4: "De acuerdo",
  5: "Totalmente de acuerdo",
};

export function clasificar(promedio: number): Omit<Diagnosis, "average"> {
  if (promedio <= 2.4) {
    return { colorKey: "frio", label: "Rechazo / Percepción desfavorable" };
  } else if (promedio <= 3.5) {
    return { colorKey: "tibio", label: "Neutral / Percepción tibia" };
  } else {
    return { colorKey: "caliente", label: "Aprobación / Percepción favorable" };
  }
}