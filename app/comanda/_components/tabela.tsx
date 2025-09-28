import React from "react";
import { View, StyleSheet, Alert, Text } from "react-native";
import { Card } from "@/components/ui/card";
import { Table, TableColumn } from "@/components/ui/table";

type Row = { id: number; nome: string; qtd: number; preco: number };

const columns: TableColumn<Row>[] = [
  { key: "id", title: "ID", width: 60, align: "center" },
  { key: "nome", title: "Nome", width: 160 },
  { key: "qtd", title: "Qtd", width: 80, align: "right" },
  {
    key: "preco",
    title: "Preço",
    width: 100,
    align: "right",
    render: (v: number) => (
      <Text style={{ color: "#e7e7ea", textAlign: "right" }}>
        R$ {v.toFixed(2)}
      </Text>
    ),
  },
];

const data: Row[] = [
  { id: 1, nome: "X-Salada", qtd: 2, preco: 28.5 },
  { id: 2, nome: "Refrigerante", qtd: 1, preco: 6.0 },
  { id: 3, nome: "Batata", qtd: 1, preco: 12.9 },
];

export default function TabelaScreen() {
  return (
    <View style={styles.container}>
      <Card style={{ width: "100%", maxWidth: 640 }}>
        <Card.Header>
          <Card.Title>Itens da Comanda</Card.Title>
        </Card.Header>

        <Card.Content>
          <Table<Row>
            columns={columns}
            data={data}
            onRowPress={(row) => Alert.alert("Item", `${row.nome} (${row.qtd}x)`)}
          />
        </Card.Content>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, alignItems: "center", justifyContent: "center" },
});
