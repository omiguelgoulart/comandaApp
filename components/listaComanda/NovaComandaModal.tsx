import React from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  Pressable,
} from "react-native";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ModalBase } from "./ModalBase";
import { Select, type SelectOption } from "../ui/input";

type StatusComanda = "ABERTA" | "FECHADA" | "CANCELADA" | "PENDENTE";
const statusOptions: SelectOption[] = [
  { label: "Aberta", value: "ABERTA" },
  { label: "Fechada", value: "FECHADA" },
  { label: "Cancelada", value: "CANCELADA" },
  { label: "Pendente", value: "PENDENTE" },
];

const schema = z.object({
  numero: z
    .string()
    .trim()
    .min(1, "Informe o número/identificador (pode ser mesa, delivery, etc.)"),
  status: z.enum(["ABERTA", "FECHADA", "CANCELADA", "PENDENTE"], {
    required_error: "Selecione um status",
  }),
});

type FormData = z.infer<typeof schema>;

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onCreated?: (payload: FormData) => void;
  useApi?: boolean;
};

export function NovaComandaModal({
  open,
  onOpenChange,
  onCreated,
  useApi = false,
}: Props) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isValid, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    mode: "onChange",
    defaultValues: { numero: "", status: "ABERTA" },
  });

  const closeAndReset = () => {
    onOpenChange(false);
    reset();
  };

  const onSubmit = async (data: FormData) => {
    try {
      if (useApi) {
        const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/comanda`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        if (!res.ok) {
          const txt = await res.text().catch(() => "");
          throw new Error(txt || "Não foi possível criar a comanda.");
        }
      }
      onCreated?.(data);
      closeAndReset();
    } catch (e: any) {
      // opcional: exibir mensagem de erro global
      alert(e?.message ?? "Erro ao criar comanda.");
    }
  };

  return (
    <ModalBase open={open} onOpenChange={onOpenChange}>
      <View style={{ gap: 6, marginBottom: 12 }}>
        <Text style={styles.title}>Nova comanda</Text>
      </View>

      <View style={styles.form}>
        {/* número/mesa */}
        <View style={styles.field}>
          <Text style={styles.label}>Número / Mesa:</Text>
          <Controller
            control={control}
            name="numero"
            render={({ field: { value, onChange, onBlur } }) => (
              <TextInput
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                placeholder="Ex: 123, Mesa 5, Delivery Fulano"
                placeholderTextColor="#A1A1AA"
                style={[styles.input, errors.numero && styles.inputError]}
                autoCapitalize="none"
              />
            )}
          />
          {errors.numero?.message ? (
            <Text style={styles.error}>{errors.numero.message}</Text>
          ) : null}
        </View>

        {/* status */}
        <View style={styles.field}>
          <Text style={styles.label}>Status:</Text>
          <Controller
            control={control}
            name="status"
            render={({ field: { value, onChange } }) => (
              <Select
                
                placeholder="Selecione..."
                options={statusOptions}
                value={value ?? null}
                onChange={(val) => onChange(val as StatusComanda)}
                // UI
                variant="outline"
                size="md"
                // validação/estados
                isValid={!errors?.status}
                error={errors?.status?.message as string | undefined}
                containerStyle={styles.selectWrapper} // opcional
              />
            )}
          />

          {/* helper de erro (se quiser separado do Select) */}
          {!!errors?.status?.message && (
            <Text style={styles.error}>{String(errors.status.message)}</Text>
          )}
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Pressable
            style={[styles.btn, styles.btnGhost]}
            onPress={closeAndReset}
          >
            <Text style={[styles.btnText, styles.btnGhostText]}>Cancelar</Text>
          </Pressable>

          <Pressable
            style={[styles.btn, styles.btnPrimary]}
            onPress={handleSubmit(onSubmit)}
            disabled={!isValid || isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator />
            ) : (
              <Text style={[styles.btnText, styles.btnPrimaryText]}>
                {isValid ? "Criar comanda" : "Preencha os campos"}
              </Text>
            )}
          </Pressable>
        </View>
      </View>
    </ModalBase>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 18, fontWeight: "700", color: "#FAFAFA" },
  description: { fontSize: 14, color: "#A1A1AA" },
  form: { gap: 16, marginTop: 8 },
  field: { gap: 8 },
  label: { fontSize: 14, fontWeight: "600", color: "#fafafa" },
  input: {
    borderWidth: 1,
    borderColor: "#3f3f46",
    borderRadius: 10,
    padding: 12,
    fontSize: 16,
    color: "#fafafa",
    backgroundColor: "#18181b",
  },
  inputError: { borderColor: "#f87171" },
  selectWrapper: {
    borderWidth: 1,
    borderColor: "#3f3f46",
    borderRadius: 10,
    overflow: "hidden",
    backgroundColor: "#18181b",
  },
  select: { color: "#fafafa" },
  error: { color: "#fca5a5", fontSize: 13 },
  footer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 12,
    marginTop: 12,
  },
  btn: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
  },
  btnText: { fontSize: 14 },
  btnGhost: { backgroundColor: "transparent", borderColor: "#3F3F46" },
  btnGhostText: { color: "#E4E4E7" },
  btnPrimary: { backgroundColor: "#2E5951", borderColor: "#2E5951" },
  btnPrimaryText: { color: "#E4E4E7", fontWeight: "700" },
});
