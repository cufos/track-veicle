import React from "react";
import { View, Text, StyleSheet } from "react-native";

type Props = {
  status: "expired" | "upcoming" | "ok";
};

export default function StatusBadge({ status }: Props) {
  const backgroundColor =
    status === "expired"
      ? "#FF3B3020"
      : status === "upcoming"
      ? "#FF950020"
      : "#34C75920";

  const textColor =
    status === "expired"
      ? "#FF3B30"
      : status === "upcoming"
      ? "#FF9500"
      : "#34C759";

  const label =
    status === "expired"
      ? "VENCIDO"
      : status === "upcoming"
      ? "PRÓXIMO"
      : "EN REGLA";

  return (
    <View style={[styles.container, { backgroundColor }]}>
      <Text style={[styles.text, { color: textColor }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  text: {
    fontSize: 10,
    fontWeight: "700",
  },
});
