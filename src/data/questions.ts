import type { Diagnosis } from "../types";

export const TEMA = "Actitud sobre los derechos menstruales en Colombia";

export const PREGUNTAS: string[] = [
  "Ver la menstruación como un tema de derechos ayuda a que la sociedad la entienda mejor.",
  "Conozco las leyes o normas que existen en Colombia sobre derechos y productos menstruales.",
  "Siento que tengo la información y la libertad para elegir cómo gestionar mi menstruación.",
  "En la USCO he visto o participado en charlas, talleres o espacios sobre educación menstrual o sexual.",
  "Me siento con la tranquilidad de hablar de mi periodo con profes o compañeros en la universidad, sin que nadie se incomode.",
  "Las condiciones en la USCO me permiten cumplir con mis clases normalmente durante los días de mi periodo.",
  "Los baños de la USCO (agua, privacidad, aseo) están en buen estado para gestionar la menstruación sin problemas.",
  "Sé identificar claramente cuándo un dolor o síntoma menstrual es normal y cuándo requiere ir al médico.",
  "Si alguien se mancha la ropa en mi entorno, la gente reacciona con naturalidad y sin juzgar.",
  "Me parece totalmente normal que alguien exprese en plena clase que necesita atender algo de su periodo.",
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
    return { colorKey: "frio", label: "Rechazo / Actitud desfavorable" };
  } else if (promedio <= 3.5) {
    return { colorKey: "tibio", label: "Neutral / Actitud media" };
  } else {
    return { colorKey: "caliente", label: "Aprobación / Actitud favorable" };
  }
}
