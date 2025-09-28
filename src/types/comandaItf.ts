import { Pedido } from "./pedidoItf"

export interface Comanda {
  id: number
  numero: number
  data: string // ou Date se você já converter
  status: "ABERTA" | "FECHADA" | "CANCELADA" | "PENDENTE"
  pedidos: Pedido[]
}