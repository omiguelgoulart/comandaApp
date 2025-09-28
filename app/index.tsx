import { Text, View } from "react-native";
import { Button } from "../src/components/ui/button";
import { Link } from "expo-router";

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
