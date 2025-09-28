import { Text, View } from "react-native";
import { Link } from "expo-router";
import { Button } from "./components/ui/button";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Configuração de usuário</Text>
      {/* Usando Link para navegação */}
      <Link href={{ pathname: "./login" }} asChild>
        <Button>Login</Button>
      </Link>
    </View>
  );
}
