import {
  View,
  Text,
  Pressable,
  ScrollView,
  TextInput,
  StyleSheet,
  useWindowDimensions,
} from "react-native-web";
import { PREGUNTAS, ETIQUETAS } from "../data/questions";
import type { Answer } from "../types";

interface Props {
  respuestas: Answer[];
  faltantes: number[];
  nombre: string;
  apellido: string;
  anioNacimiento: string;
  camposFaltantes: string[];
  onNombreChange: (value: string) => void;
  onApellidoChange: (value: string) => void;
  onAnioNacimientoChange: (value: string) => void;
  onAnswer: (index: number, value: number) => void;
  onCalcular: () => void;
}

const COLOR_POR_VALOR: Record<number, "frio" | "tibio" | "caliente"> = {
  1: "caliente",
  2: "caliente",
  3: "caliente",
  4: "caliente",
  5: "caliente",
};

export default function SurveyForm({
  respuestas,
  faltantes,
  nombre,
  apellido,
  anioNacimiento,
  camposFaltantes,
  onNombreChange,
  onApellidoChange,
  onAnioNacimientoChange,
  onAnswer,
  onCalcular,
}: Props) {
  const { width } = useWindowDimensions();
  const isMobile = width < 800;

  const completo =
    respuestas.length === PREGUNTAS.length &&
    respuestas.every((r) => r !== undefined && r !== null) &&
    nombre.trim().length > 0 &&
    apellido.trim().length > 0 &&
    anioNacimiento.trim().length > 0;

  return (
    <View style={styles.card}>
      <style>{`
      #survey-scroll::-webkit-scrollbar {
        display: none;
        width: 0;
        height: 0;
      }
    `}</style>

      <ScrollView style={styles.scroll} nativeID="survey-scroll">
        <View style={styles.nameBlock}>
          <Text style={styles.nameLabel}>
            Primer Nombre <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            value={nombre}
            onChangeText={onNombreChange}
            placeholder="Escribe tu nombre"
            style={[
              styles.nameInput,
              camposFaltantes.includes("nombre") && styles.nameInputMissing,
            ]}
          />
        </View>
        <View style={styles.nameBlock}>
          <Text style={styles.nameLabel}>
            Primer Apellido <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            value={apellido}
            onChangeText={onApellidoChange}
            placeholder="Escribe tu primer apellido"
            style={[
              styles.nameInput,
              camposFaltantes.includes("apellido") && styles.nameInputMissing,
            ]}
          />
        </View>
        <View style={styles.nameBlock}>
          <Text style={styles.nameLabel}>
            Año de nacimiento <Text style={styles.required}>*</Text>
          </Text>
          <TextInput
            value={anioNacimiento}
            onChangeText={onAnioNacimientoChange}
            placeholder="AAAA"
            keyboardType="numeric"
            maxLength={4}
            style={[
              styles.nameInput,
              camposFaltantes.includes("anioNacimiento") &&
                styles.nameInputMissing,
            ]}
          />
        </View>{" "}
        {PREGUNTAS.map((texto, i) => {
          const missing = faltantes.includes(i);
          return (
            <View
              key={i}
              style={[styles.question, missing && styles.questionMissing]}
            >
              <View style={styles.qHead}>
                <Text style={styles.qNum}>
                  P{String(i + 1).padStart(2, "0")}
                </Text>
                <Text style={styles.qText}>{texto}</Text>
              </View>
              <View style={[styles.scale, isMobile && styles.scaleMobile]}>
                {[1, 2, 3, 4, 5].map((v) => {
                  const colorKey = COLOR_POR_VALOR[v];
                  const isSelected = respuestas[i] === v;
                  return (
                    <Pressable
                      key={v}
                      onPress={() => onAnswer(i, v)}
                      style={[
                        styles.likertBtn,
                        isMobile && styles.likertBtnMobile,
                        isSelected && {
                          backgroundColor: `var(--${colorKey})`,
                          borderColor: `var(--${colorKey})`,
                        },
                      ]}
                    >
                      <Text
                        style={[styles.num, isSelected && styles.selectedText]}
                      >
                        {v}
                      </Text>
                      <Text
                        style={[styles.txt, isSelected && styles.selectedText]}
                      >
                        {ETIQUETAS[v]}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          );
        })}
      </ScrollView>

      <View style={styles.actions}>
        <Pressable
          style={[styles.btnPrimary, !completo && styles.btnDisabled]}
          onPress={onCalcular}
        >
          <Text
            style={[styles.btnPrimaryText, !completo && styles.btnTextDisabled]}
          >
            Calcular Actitud
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "var(--card)",
    border: "1px solid var(--line)",
    borderRadius: 18,
    boxShadow: "var(--shadow)",
    display: "flex",
    flexDirection: "column",
    maxHeight: "calc(100dvh - 30px)",
    overflow: "hidden",
  },
  nameBlock: {
    paddingTop: 22,
    paddingBottom: 18,
    paddingLeft: 28,
    paddingRight: 28,
    borderBottom: "1px solid var(--line)",
  },
  nameLabel: {
    fontSize: 13.5,
    fontWeight: "600",
    marginBottom: 8,
    color: "var(--ink)",
  },
  required: {
    color: "var(--caliente)",
    fontWeight: "700",
  },
  nameInput: {
    border: "1.5px solid var(--line)",
    borderRadius: 10,
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 14,
    paddingRight: 14,
    fontSize: 14.5,
    backgroundColor: "#fefcfb",
    outlineStyle: "none",
  },
  nameInputMissing: {
    borderColor: "var(--caliente)",
    backgroundColor: "var(--caliente-soft)",
  },
  scroll: {
    flex: 1,
    paddingTop: 8,
    scrollbarWidth: "none", // Firefox
    msOverflowStyle: "none", // IE/Edge legacy
  },
  question: {
    paddingTop: 26,
    paddingBottom: 26,
    paddingLeft: 28,
    paddingRight: 28,
    borderBottom: "1px solid var(--line)",
    transition: "border-color 0.3s ease, background-color 0.3s ease",
  },
  questionMissing: {
    borderLeft: "3px solid var(--caliente)",
    backgroundColor: "var(--caliente-soft)",
  },
  qHead: {
    display: "flex",
    flexDirection: "row",
    gap: 14,
    alignItems: "baseline",
    marginBottom: 16,
  },
  qNum: {
    fontSize: 12,
    fontWeight: "600",
    color: "var(--caliente)",
    backgroundColor: "var(--caliente-soft)",
    borderRadius: 999,
    paddingTop: 3,
    paddingBottom: 3,
    paddingLeft: 9,
    paddingRight: 9,
    flexShrink: 0,
  },
  qText: {
    fontSize: 16.5,
    lineHeight: 24,
    fontWeight: "400",
  },
  scale: {
    display: "grid",
    gridTemplateColumns: "repeat(5, 1fr)",
    gap: 8,
  },
  scaleMobile: {
    gridTemplateColumns: "1fr",
  },
  likertBtn: {
    border: "1.5px solid var(--line)",
    backgroundColor: "#fefcfb",
    borderRadius: 12,
    paddingTop: 10,
    paddingBottom: 8,
    paddingLeft: 6,
    paddingRight: 6,
    cursor: "pointer",
    alignItems: "center",
    display: "flex",
    flexDirection: "column",
    gap: 4,
    transition: "all 0.15s ease",
  },
  likertBtnMobile: {
    flexDirection: "row",
    justifyContent: "flex-start",
    paddingLeft: 16,
    paddingRight: 16,
    paddingTop: 12,
    paddingBottom: 12,
    gap: 10,
  },
  num: {
    fontWeight: "700",
    color: "var(--ink-soft)",
  },
  txt: {
    fontSize: 10.5,
    lineHeight: 13,
    color: "var(--ink-soft)",
    textAlign: "center",
  },
  selectedText: {
    color: "#fff",
  },
  actions: {
    paddingTop: 22,
    paddingBottom: 28,
    paddingLeft: 28,
    paddingRight: 28,
    borderTop: "1px solid var(--line)",
    backgroundColor: "var(--card)",
  },
  btnPrimary: {
    backgroundColor: "var(--ink)",
    borderRadius: 12,
    paddingVertical: 13,
    paddingHorizontal: 22,
    border: "none",
    cursor: "pointer",
    alignItems: "center",
  },
  btnPrimaryText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 14.7,
  },
  btnDisabled: {
    backgroundColor: "var(--line)",
    cursor: "not-allowed",
    opacity: 0.6,
  },
  btnTextDisabled: {
    color: "var(--ink-soft)",
  },
});
