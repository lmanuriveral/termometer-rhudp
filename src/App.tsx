import { useState } from "react";
import { View, Text, StyleSheet, useWindowDimensions } from "react-native-web";
import Header from "./components/Header";
import SurveyForm from "./components/SurveyForm";
import Thermometer from "./components/Thermometer";
import { PREGUNTAS, clasificar } from "./data/questions";
import type { Answer, Diagnosis } from "./types";
import "./App.css";

// Valida que el código tenga la forma: 2 letras + año (4 dígitos),
// ej: "MR2002", y que el año esté en un rango razonable.
function codigoEsValido(codigo: string): boolean {
  const match = /^[A-Za-z]{2}(\d{4})$/.exec(codigo.trim());
  if (!match) return false;
  const anio = parseInt(match[1], 10);
  const anioActual = new Date().getFullYear();
  return anio >= 1900 && anio <= anioActual;
}

export default function App() {
  const [respuestas, setRespuestas] = useState<Answer[]>(
    new Array(PREGUNTAS.length).fill(null),
  );
  const [faltantes, setFaltantes] = useState<number[]>([]);
  const [codigo, setCodigo] = useState("");
  const [camposFaltantes, setCamposFaltantes] = useState<string[]>([]);
  const [resultado, setResultado] = useState<Diagnosis | null>(null);

  // Solo vive en memoria (useState), nunca se guarda en localStorage.
  // Así, al recargar la página o abrirla de nuevo (ej. en la próxima
  // sesión del programa en vivo), el formulario vuelve a estar vacío
  // y disponible para responder otra vez.
  const [yaRespondio, setYaRespondio] = useState(false);

  const { width } = useWindowDimensions();
  const isMobile = width < 800;

  const handleAnswer = (index: number, value: number) => {
    if (yaRespondio) return;
    const copia = [...respuestas];
    copia[index] = value;
    setRespuestas(copia);
    setFaltantes((prev) => prev.filter((i) => i !== index));
  };

  const handleCodigoChange = (value: string) => {
    if (yaRespondio) return;
    setCodigo(value);
    setCamposFaltantes((prev) => prev.filter((c) => c !== "codigo"));
  };

  const handleCalcular = async () => {
    if (yaRespondio) return;

    const vacios = respuestas
      .map((r, i) => (r === null ? i : -1))
      .filter((i) => i !== -1);

    const camposVacios: string[] = [];
    if (!codigo.trim() || !codigoEsValido(codigo)) {
      camposVacios.push("codigo");
    }

    if (vacios.length > 0 || camposVacios.length > 0) {
      setFaltantes(vacios);
      setCamposFaltantes(camposVacios);
      return;
    }

    const suma = respuestas.reduce<number>((acc, v) => acc + (v ?? 0), 0);
    const promedio = suma / PREGUNTAS.length;
    const { colorKey, label } = clasificar(promedio);
    const diagnostico = {
      average: Math.round(promedio * 10) / 10,
      colorKey,
      label,
    };
    setResultado(diagnostico);

    // Marca la sesión actual como respondida (solo en memoria).
    // No se persiste en localStorage a propósito.
    setYaRespondio(true);

    const endpoint = import.meta.env.VITE_SHEET_ENDPOINT;
    if (endpoint) {
      try {
        await fetch(endpoint, {
          method: "POST",
          mode: "no-cors",
          headers: { "Content-Type": "text/plain" },
          body: JSON.stringify({
            nombre: codigo.trim().toUpperCase(),
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
        {yaRespondio ? (
          <View style={styles.yaRespondio}>
            <Text style={styles.yaRespondioTitle}>
              Ya registramos tu respuesta
            </Text>
            <Text style={styles.yaRespondioText}>
              Gracias por participar. Esta encuesta solo permite una respuesta
              por persona en esta sesión.
            </Text>
          </View>
        ) : (
          <SurveyForm
            respuestas={respuestas}
            faltantes={faltantes}
            camposFaltantes={camposFaltantes}
            onAnswer={handleAnswer}
            onCalcular={handleCalcular}
            codigo={codigo}
            onCodigoChange={handleCodigoChange}
          />
        )}
        <Thermometer resultado={resultado} />
      </View>
      <Text style={styles.footer}>
        Herramienta educativa de actitud ciudadana · Los resultados son
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
  yaRespondio: {
    backgroundColor: "var(--card)",
    border: "1px solid var(--line)",
    borderRadius: 18,
    height: "calc(100dvh - 510px)",
    boxShadow: "var(--shadow)",
    padding: 32,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 200,
  },
  yaRespondioTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 8,
    textAlign: "center",
  },
  yaRespondioText: {
    fontSize: 14,
    color: "var(--ink-soft)",
    textAlign: "center",
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