import { useState } from "react";
import { View, Text, StyleSheet, useWindowDimensions } from "react-native-web";
import Header from "./components/Header";
import SurveyForm from "./components/SurveyForm";
import Thermometer from "./components/Thermometer";
import { PREGUNTAS, clasificar } from "./data/questions";
import type { Answer, Diagnosis } from "./types";
import "./App.css";

export default function App() {
  const [respuestas, setRespuestas] = useState<Answer[]>(
    new Array(PREGUNTAS.length).fill(null),
  );
  const [faltantes, setFaltantes] = useState<number[]>([]);
  const [resultado, setResultado] = useState<Diagnosis | null>(null);

  const { width } = useWindowDimensions();
  const isMobile = width < 800;

  const handleAnswer = (index: number, value: number) => {
    const copia = [...respuestas];
    copia[index] = value;
    setRespuestas(copia);
    setFaltantes((prev) => prev.filter((i) => i !== index));
  };

  const handleCalcular = async () => {
    const vacios = respuestas
      .map((r, i) => (r === null ? i : -1))
      .filter((i) => i !== -1);
    if (vacios.length > 0) {
      setFaltantes(vacios);
      return;
    }
    const suma = respuestas.reduce<number>((acc, v) => acc + (v ?? 0), 0);
    const promedio = suma / PREGUNTAS.length;
    const { colorKey, label } = clasificar(promedio);
    const diagnostico = { average: Math.round(promedio * 10) / 10, colorKey, label };
    setResultado(diagnostico);
  
    const endpoint = import.meta.env.VITE_SHEET_ENDPOINT;
    if (endpoint) {
      try {
        await fetch(endpoint, {
          method: "POST",
          mode: "no-cors", // Apps Script no responde headers CORS por defecto
          headers: { "Content-Type": "text/plain" }, // evita el preflight OPTIONS
          body: JSON.stringify({
            respuestas,
            average: diagnostico.average,
            label: diagnostico.label,
          }),
        });
      } catch (err) {
        console.error("No se pudo registrar la respuesta:", err);
      }
    }
  };

  return (
    <View style={styles.root}>
      <Header />
      <View style={[styles.main, isMobile && styles.mainMobile]}>
        <SurveyForm
          respuestas={respuestas}
          faltantes={faltantes}
          onAnswer={handleAnswer}
          onCalcular={handleCalcular}
        />
        <Thermometer resultado={resultado} />
      </View>
      <Text style={styles.footer}>
        Herramienta educativa de percepción ciudadana · Los resultados son
        autoreportados y no constituyen un estudio estadístico representativo.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    display: "flex",
    flexDirection: "column",
    minHeight: "100vh",
  },
  main: {
    maxWidth: 1160,
    width: "100%",
    marginHorizontal: "auto",
    paddingTop: 24,
    paddingBottom: 48,
    paddingLeft: 24,
    paddingRight: 24,
    display: "grid",
    gridTemplateColumns: "1.55fr 1fr",
    gap: 28,
    alignItems: "start",
  },
  mainMobile: {
    gridTemplateColumns: "1fr",
  },
  footer: {
    maxWidth: 1160,
    width: "100%",
    marginHorizontal: "auto",
    marginTop: 8,
    paddingLeft: 24,
    paddingRight: 24,
    paddingBottom: 48,
    color: "var(--ink-soft)",
    fontSize: 12.5,
    textAlign: "center",
  },
});
