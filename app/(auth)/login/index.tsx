import React, { useState } from "react";
import { Button } from "@/src/components/ui/button";        // 👈 ajuste de caminho
import { Card } from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { Link, router } from "expo-router";

import {
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
  Text,
} from "react-native";

import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

// ✅ Schema de validação
const schema = z.object({
  email: z.string().trim().email("E-mail inválido"),
  senha: z.string().min(6, "Mínimo de 6 caracteres"),
});

type FormLogin = z.infer<typeof schema>;

export default function PageLogin() {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormLogin>({
    resolver: zodResolver(schema),
    defaultValues: { email: "", senha: "" },
    mode: "onSubmit",
  });

  async function login(values: FormLogin) {
    const payload = {
      email: values.email.trim().toLowerCase(),
      password: values.senha, // 👈 backend espera "password"
    };

    const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    // tenta ler json (pode vir vazio)
    let data: any = null;
    try {
      data = await res.json();
    } catch {}

    if (!res.ok) {
      const msg = data?.message || `Erro ${res.status}`;
      throw new Error(msg);
    }

    return data; // token / user etc.
  }

  const onSubmit = async (data: FormLogin) => {
    try {
      setIsSubmitting(true);
      const resp = await login(data);
      console.log("Login OK:", resp);
      // se tiver token, aqui é um bom lugar pra salvar no contexto/AsyncStorage
      router.replace("/"); // ajuste conforme sua navegação
    } catch (e: any) {
      console.error("Falha no login:", e?.message || e);
      // opcional: Toast.error(e?.message || "Não foi possível entrar.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.screen}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.container}>
            <Card style={styles.card}>
              <Card.Header>
                <Card.Title>Login</Card.Title>
              </Card.Header>

              <Card.Content>
                <View style={styles.field}>
                  <Label>E-mail</Label>
                  <Controller
                    control={control}
                    name="email"
                    render={({ field: { onChange, value } }) => (
                      <Input
                        placeholder="email@exemplo.com"
                        autoCapitalize="none"
                        autoCorrect={false}
                        keyboardType="email-address"
                        value={value}
                        onChangeText={onChange}
                        returnKeyType="next"
                      />
                    )}
                  />
                  {errors.email && (
                    <Text style={styles.error}>{errors.email.message}</Text>
                  )}
                </View>

                <View style={styles.field}>
                  <Label>Senha</Label>
                  <Controller
                    control={control}
                    name="senha"
                    render={({ field: { onChange, value } }) => (
                      <Input
                        placeholder="••••••"
                        secureTextEntry
                        value={value}
                        onChangeText={onChange}
                        returnKeyType="done"
                        onSubmitEditing={handleSubmit(onSubmit)} // enter envia
                      />
                    )}
                  />
                  {errors.senha && (
                    <Text style={styles.error}>{errors.senha.message}</Text>
                  )}
                </View>

                <View style={styles.actions}>
                  <Button isDisabled={isSubmitting} onPress={handleSubmit(onSubmit)}>
                    {isSubmitting ? "Entrando..." : "Entrar"}
                  </Button>

                  <Link href={{ pathname: "./cadastro" }} asChild>
                    <Button variant="outline">Criar Conta</Button>
                  </Link>

                  <Button
                    variant="ghost"
                    size="sm"
                    onPress={() => router.push("/cadastro")}
                  >
                    Esqueceu a senha?
                  </Button>
                </View>
              </Card.Content>
            </Card>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
  scroll: { flexGrow: 1 },
  container: {
    flex: 1,
    padding: 16,
    justifyContent: "center",
  },
  card: {
    width: "100%",
    maxWidth: 480,
    alignSelf: "center",
    padding: 16,
  },
  field: { marginBottom: 14 },
  actions: { paddingTop: 4, gap: 12 },
  error: { color: "red", fontSize: 12, marginTop: 4 },
});
