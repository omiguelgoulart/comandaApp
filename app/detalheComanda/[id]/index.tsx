import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { Card } from "@/components/ui/card";
import { COLORS } from "@/app/lib/status";

type Params = {
  id?: string | string[];
  name?: string | string[];
  description?: string | string[]; // <- correto
};

const toStr = (v?: string | string[]) => (Array.isArray(v) ? v[0] : v ?? "");

export default function DetailsScreen() {
  const params = useLocalSearchParams<Params>();

  const id = toStr(params.id);
  const name = toStr(params.name);
  const description = toStr(params.description);

  return (
    <View style={styles.safe}>
      <Card style={{ width: "100%", maxWidth: 560 }}>
        <Card.Header>
          <Card.Title>Detalhes da Comanda {id ? `#${id}` : ""}</Card.Title>
        </Card.Header>

        <Card.Content>
          <Text style={styles.label}>ID:</Text>
          <Text style={styles.value}>{id || "—"}</Text>

          <Text style={[styles.label, { marginTop: 8 }]}>Nome:</Text>
          <Text style={styles.value}>{name || "—"}</Text>

          <Text style={[styles.label, { marginTop: 8 }]}>Descrição:</Text>
          <Text style={styles.value}>{description || "—"}</Text>
        </Card.Content>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { 
    flex: 1, 
    backgroundColor: COLORS.bg, 
    gap: 8, 
    alignItems: "center",
    padding: 16,},
  label: {
    color: "#A1A1AA",
    fontSize: 13,
  },
  value: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
