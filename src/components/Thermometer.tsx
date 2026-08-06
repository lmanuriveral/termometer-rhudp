import { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native-web";
import type { Diagnosis } from "../types";

interface Props {
  resultado: Diagnosis | null;
}

const TICKS: {
  v: number;
  label?: string;
  colorKey?: "frio" | "tibio" | "caliente";
}[] = [
  { v: 5, label: "Caliente", colorKey: "caliente" },
  { v: 4 },
  { v: 3, label: "Tibio", colorKey: "tibio" },
  { v: 2 },
  { v: 1, label: "Frío", colorKey: "frio" },
];

export default function Thermometer({ resultado }: Props) {
  const pct = resultado ? ((resultado.average - 1) / 4) * 100 : 0;
  const colorVar = resultado ? `var(--${resultado.colorKey})` : "var(--frio)";

  const [displayValue, setDisplayValue] = useState(0);
  const [visible, setVisible] = useState(false);
  const [prevResultado, setPrevResultado] = useState<Diagnosis | null>(
    resultado,
  );
  if (resultado !== prevResultado) {
    setPrevResultado(resultado);
    if (!resultado) {
      setDisplayValue(0);
      setVisible(false);
    }
  }
  useEffect(() => {
    if (!resultado) return;

    // Dispara la transición de entrada (ticks, diagnóstico, glow) un frame después
    const raf = requestAnimationFrame(() => setVisible(true));

    // Conteo numérico hacia arriba
    const target = resultado.average;
    const duration = 900;
    const start = performance.now();
    let frame: number;
    const step = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      setDisplayValue(target * (1 - Math.pow(1 - t, 3)));
      if (t < 1) frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(raf);
      cancelAnimationFrame(frame);
    };
  }, [resultado]);

  return (
    <View style={styles.thermoPanel}>
      <Text style={styles.title}>Termómetro de actitud</Text>
      <Text style={styles.sub}>Se activa al calcular tu resultado</Text>

      <View style={styles.instrument}>
        <View style={styles.ticks}>
          {TICKS.map(({ v, label, colorKey }) => (
            <View
              key={v}
              style={[styles.tick, { bottom: `${((v - 1) / 4) * 80 + 10}%` }]}
            >
              <View style={styles.dash} />
              <Text
                style={
                  colorKey
                    ? { color: `var(--${colorKey})`, fontWeight: "700" }
                    : styles.tickText
                }
              >
                {v}
                {label ? ` · ${label}` : ""}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.tubeWrap}>
          <View style={styles.tube}>
            <View
              style={[
                styles.fill,
                {
                  height: resultado
                    ? `${Math.max(4, Math.min(100, pct))}%`
                    : "0%",
                  backgroundColor: colorVar,
                },
              ]}
            />
          </View>
          <View
            style={[
              styles.bulb,
              {
                boxShadow: resultado
                  ? "0 0 0 10px rgba(122,31,168,0.18)"
                  : "0 0 0 0 rgba(122,31,168,0)",
              },
            ]}
          >
            <View style={[styles.bulbCore, { backgroundColor: colorVar }]} />
          </View>
        </View>
      </View>

      <View style={styles.reading}>
        <Text style={styles.value}>
          {resultado ? displayValue.toFixed(1) : "—"}{" "}
          <Text style={styles.max}>/ 5.0</Text>
        </Text>
        {resultado && (
          <View
            style={[
              styles.diagnosis,
              {
                backgroundColor: `var(--${resultado.colorKey}-soft)`,
                opacity: visible ? 1 : 0,
                transform: visible
                  ? "scale(1) translateY(0)"
                  : "scale(0.9) translateY(6px)",
              },
            ]}
          >
            <Text
              style={{
                color: `var(--${resultado.colorKey})`,
                fontWeight: "700",
              }}
            >
              Postura: {resultado.label.split(" / ")[1] || resultado.label}
            </Text>
          </View>
        )}
      </View>

      {!resultado && (
        <Text style={styles.emptyState}>
          Responde las 10 afirmaciones y presiona{" "}
          <Text style={{ fontWeight: "700" }}>Calcular Actitud</Text> para ver
          tu resultado.
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  thermoPanel: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    padding: 24,
    borderRadius: 18,
    width: "100%",
    backgroundColor: "var(--card)",
    border: "1px solid var(--line)",
    boxShadow: "var(--shadow)",
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    textAlign: "center",
    margin: 0,
  },
  sub: {
    marginTop: 4,
    marginBottom: 20,
    fontSize: 13,
    opacity: 0.7,
    textAlign: "center",
  },
  instrument: {
    display: "flex",
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "center",
    gap: 14,
    marginLeft: -100,
    width: "100%",
  },
  ticks: {
    position: "relative",
    height: 220,
    width: 100,
    flexShrink: 0,
  },
  tick: {
    position: "absolute",
    left: 0,
    right: 0,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 6,
    paddingBottom: 100,
    transform: "translateY(60%)",
  },
  tickText: {
    fontSize: 12.8,
    whiteSpace: "nowrap",
  },
  dash: {
    width: 12,
    height: 2,
    backgroundColor: "currentColor",
    opacity: 0.4,
    flexShrink: 0,
  },
  tubeWrap: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    flexShrink: 0,
  },
  tube: {
    position: "relative",
    width: 32,
    height: 220,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "rgba(0,0,0,0.06)",
  },
  fill: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    transition:
      "height 1s cubic-bezier(0.22, 1, 0.36, 1), background-color 0.4s ease",
  },
  bulb: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginTop: -8,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f1e9f7",
    border: "2px solid var(--ink)",
    transition: "box-shadow 0.4s ease",
  },
  bulbCore: {
    width: 40,
    height: 40,
    borderRadius: 20,
    transition: "background-color 0.4s ease",
  },
  reading: {
    marginTop: 20,
    display: "flex",
    flexDirection: "column",
    gap: 8,
    alignItems: "center",
    width: "100%",
  },
  value: {
    fontSize: 28,
    fontWeight: "800",
  },
  max: {
    fontSize: 16,
    fontWeight: "400",
    opacity: 0.6,
  },
  diagnosis: {
    marginTop: 4,
    paddingTop: 7,
    paddingBottom: 7,
    paddingLeft: 16,
    paddingRight: 16,
    borderRadius: 999,
    transition:
      "opacity 0.35s ease, transform 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)",
  },
  emptyState: {
    marginTop: 20,
    fontSize: 13.6,
    textAlign: "center",
    opacity: 0.7,
  },
});
