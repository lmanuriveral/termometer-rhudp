import type { Diagnosis } from "../types";

export const TEMA = "Percepción sobre los derechos menstruales en Colombia";

export const PREGUNTAS: string[] = [
  "En mis entornos cotidianos (familia, estudio o trabajo), se puede hablar de la menstruación sin que se genere incomodidad o tensión.",
  "Las instalaciones sanitarias de mi entorno educativo o laboral cuentan con agua potable y condiciones seguras para gestionar la menstruación.",
  "Cuento con la información y la libertad necesarias para elegir de manera autónoma los productos o métodos con los que gestiono mi menstruación.",
  "Ver una mancha de sangre menstrual en la ropa de alguien suele interpretarse en mi entorno como un descuido o falta de higiene.",
  "Los productos de higiene menstrual (toallas, tampones, copas) deben considerarse bienes esenciales exentos de impuestos.",
  "Mis espacios de estudio o trabajo me permiten ajustar mi ritmo de actividades según las necesidades de mi ciclo menstrual.",
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
