import { useState } from "react";
import { View, Text, StyleSheet, useWindowDimensions } from "react-native-web";
import Header from "./components/Header";
import SurveyForm from "./components/SurveyForm";
import Thermometer from "./components/Thermometer";
import { PREGUNTAS, clasificar } from "./data/questions";
import type { Answer, Diagnosis } from "./types";
import "./App.css";

const STORAGE_KEY = "encuesta_respondida_v1";

function leerDiagnosticoGuardado(): Diagnosis | null {
  const guardado = localStorage.getItem(STORAGE_KEY);
  if (!guardado) return null;
  try {
    return JSON.parse(guardado) as Diagnosis;
  } catch {
    localStorage.removeItem(STORAGE_KEY);
    return null;
  }
}

// Primera letra en mayúscula de un texto, ej: "manuela" -> "M"
function inicialMayuscula(texto: string): string {
  const limpio = texto.trim();
  if (!limpio) return "";
  return limpio.charAt(0).toUpperCase();
}

// Construye el código: inicial del nombre + inicial del apellido + año.
// Ej: nombre="Manuela", apellido="Rivera", anio="2002" -> "MR2002"
function formatearCodigo(
  nombre: string,
  apellido: string,
  anio: string,
): string {
  return `${inicialMayuscula(nombre)}${inicialMayuscula(apellido)}${anio.trim()}`;
}

function anioEsValido(anio: string): boolean {
  if (!/^\d{4}$/.test(anio.trim())) return false;
  const n = parseInt(anio.trim(), 10);
  const anioActual = new Date().getFullYear();
  return n >= 1900 && n <= anioActual;
}

export default function App() {
  const [respuestas, setRespuestas] = useState<Answer[]>(
    new Array(PREGUNTAS.length).fill(null),
  );
  const [faltantes, setFaltantes] = useState<number[]>([]);
  const [nombre, setNombre] = useState("");
  const [apellido, setApellido] = useState("");
  const [anioNacimiento, setAnioNacimiento] = useState("");
  const [camposFaltantes, setCamposFaltantes] = useState<string[]>([]);
  const [resultado, setResultado] = useState<Diagnosis | null>(() =>
    leerDiagnosticoGuardado(),
  );
  // const [yaRespondio, setYaRespondio] = useState<boolean>(
  //   () => leerDiagnosticoGuardado() !== null,
  // );

  const { width } = useWindowDimensions();
  const isMobile = width < 800;

  const handleAnswer = (index: number, value: number) => {
    // if (yaRespondio) return;
    const copia = [...respuestas];
    copia[index] = value;
    setRespuestas(copia);
    setFaltantes((prev) => prev.filter((i) => i !== index));
  };

  const handleNombreChange = (value: string) => {
    // if (yaRespondio) return;
    setNombre(value);
    setCamposFaltantes((prev) => prev.filter((c) => c !== "nombre"));
  };

  const handleApellidoChange = (value: string) => {
    // if (yaRespondio) return;
    setApellido(value);
    setCamposFaltantes((prev) => prev.filter((c) => c !== "apellido"));
  };

  const handleAnioNacimientoChange = (value: string) => {
    // if (yaRespondio) return;
    setAnioNacimiento(value);
    setCamposFaltantes((prev) => prev.filter((c) => c !== "anioNacimiento"));
  };

  const handleCalcular = async () => {
    // if (yaRespondio) return;

    const vacios = respuestas
      .map((r, i) => (r === null ? i : -1))
      .filter((i) => i !== -1);

    const camposVacios: string[] = [];
    if (!nombre.trim()) camposVacios.push("nombre");
    if (!apellido.trim()) camposVacios.push("apellido");
    if (!anioNacimiento.trim() || !anioEsValido(anioNacimiento)) {
      camposVacios.push("anioNacimiento");
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

    // localStorage.setItem(STORAGE_KEY, JSON.stringify(diagnostico));
    // setYaRespondio(true);

    const endpoint = import.meta.env.VITE_SHEET_ENDPOINT;
    if (endpoint) {
      const codigo = formatearCodigo(nombre, apellido, anioNacimiento);

      try {
        await fetch(endpoint, {
          method: "POST",
          mode: "no-cors",
          headers: { "Content-Type": "text/plain" },
          body: JSON.stringify({
            nombre: codigo,
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
        {/* {yaRespondio ? (
          <View style={styles.yaRespondio}>
            <Text style={styles.yaRespondioTitle}>
              Ya registramos tu respuesta
            </Text>
            <Text style={styles.yaRespondioText}>
              Gracias por participar. Esta encuesta solo permite una respuesta
              por persona.
            </Text>
          </View>
        ) : (
          <SurveyForm
            respuestas={respuestas}
            faltantes={faltantes}
            camposFaltantes={camposFaltantes}
            onAnswer={handleAnswer}
            onCalcular={handleCalcular}
            nombre={nombre}
            apellido={apellido}
            anioNacimiento={anioNacimiento}
            onNombreChange={handleNombreChange}
            onApellidoChange={handleApellidoChange}
            onAnioNacimientoChange={handleAnioNacimientoChange}
          />
          )} */}
        <SurveyForm
          respuestas={respuestas}
          faltantes={faltantes}
          camposFaltantes={camposFaltantes}
          onAnswer={handleAnswer}
          onCalcular={handleCalcular}
          nombre={nombre}
          apellido={apellido}
          anioNacimiento={anioNacimiento}
          onNombreChange={handleNombreChange}
          onApellidoChange={handleApellidoChange}
          onAnioNacimientoChange={handleAnioNacimientoChange}
        />
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
