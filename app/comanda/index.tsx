import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Link } from "expo-router";
import { Card } from "@/components/ui/card";

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      {/* Card 1 */}
      <Card style={{ marginBottom: 12 }}>
        <Card.Header>
          <Card.Title>Comanda Index</Card.Title>
        </Card.Header>
        <Card.Content>
          <Text style={{ color: "#aaa" }}>Bem-vindo 👋</Text>
        </Card.Content>
      </Card>

      {/* Card 2 - clicável via Link asChild */}
      <Link
        href={{
          pathname: "/comanda/detalhes/[id]",
          params: {
            id: String(123),
            name: "item 123",
            description: "descrição do item 123",
          },
        }}
        asChild
      >
        <Card style={{ marginBottom: 12 }}>
          <Card.Content>
            <Text style={{ color: "#fff" }}>Card tocável sem título</Text>
          </Card.Content>
          <Card.Footer>
            <Text style={{ color: "#aaa" }}>Toque para ver detalhes</Text>
          </Card.Footer>
        </Card>
      </Link>

      {/* Card 3 */}
      <Card>
        <Card.Header>
          <Card.Title>Sem onPress</Card.Title>
        </Card.Header>
        <Card.Content>
          <Text style={{ color: "#A1A1AA" }}>Conteúdo livre aqui dentro</Text>
        </Card.Content>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#2f343eff",
    padding: 16,
  },
});
