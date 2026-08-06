import { View, Text, StyleSheet, useWindowDimensions } from "react-native-web";

export default function Header() {
  const { width } = useWindowDimensions();
  const isMobile = width < 800;

  return (
    <View style={[styles.hero, isMobile && styles.heroMobile]}>
      <View style={styles.eyebrowRow}>
        <Text style={styles.eyebrow}>Instrumento de actitud · 10 ítems</Text>
      </View>
      <View style={styles.eyebrowRow}>
        <Text style={[styles.h1, isMobile && styles.h1Mobile]}>
          ¿Qué tan <Text style={styles.em}>favorable</Text> es tu postura
          frente a los derechos menstruales en Colombia?
        </Text>
      </View>
      <Text style={[styles.lede, isMobile && styles.ledeMobile]}>
        Responde cada afirmación según tu nivel de acuerdo. Al calcular, tu promedio se traduce en
        un termómetro: <Text style={styles.tagFrio}>azul</Text> es desfavorable,{" "}
        <Text style={styles.tagTibio}>ámbar</Text> es neutral,{" "}
        <Text style={styles.tagCaliente}>violeta intenso</Text> es totalmente favorable.
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: {
    maxWidth: 1200,
    width: "100%",
    marginHorizontal: "auto",
    paddingTop: 48,
    flexDirection: "column",
    flex: 1,
    paddingLeft: 24,
  },
  heroMobile: {
    paddingTop: 32,
    paddingLeft: 16,
  },
  eyebrowRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 14,
  },
  eyebrowDash: {
    width: 22,
    backgroundColor: "var(--caliente)",
  },
  eyebrow: {
    fontSize: 12.5,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 2,
    paddingLeft: 24,
    color: "var(--caliente)",
  },
  h1: {
    fontSize: 50,
    paddingLeft: 24,
    fontWeight: "600",
    maxWidth: "100%",
  },
  h1Mobile: {
    fontSize: 30,
    paddingLeft: 0,
    maxWidth: "100%",
  },
  em: {
    fontStyle: "italic",
    fontWeight: "500",
    color: "var(--caliente)",
  },
  lede: {
    maxWidth: "60%",
    fontSize: 16.8,
    paddingLeft: 24,
    color: "var(--ink-soft)",
  },
  ledeMobile: {
    maxWidth: "100%",
    paddingLeft: 0,
    fontSize: 15,
  },
  tagFrio: { fontWeight: "700", color: "var(--frio)" },
  tagTibio: { fontWeight: "700", color: "var(--tibio)" },
  tagCaliente: { fontWeight: "700", color: "var(--caliente)" },
});