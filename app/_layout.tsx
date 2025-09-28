import { Stack } from "expo-router";
import {
  useFonts,
  Inter_400Regular,
  Inter_600SemiBold,
} from "@expo-google-fonts/inter";
import { View, ActivityIndicator } from "react-native";

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_600SemiBold,
  });

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <Stack
      screenOptions={{
        headerTitleStyle: {
          fontFamily: "Inter_600SemiBold", // usa fonte carregada
          fontWeight: "600",                // fallback caso fonte não carregue
        },
        headerBackTitleStyle: {
          fontFamily: "Inter_400Regular",
        },
      }}
    >
      {/* Se não quiser telas fixas, pode deixar só o <Stack /> vazio */}
      <Stack.Screen name="index" options={{ title: "Início" }} />
    </Stack>
  );
}
