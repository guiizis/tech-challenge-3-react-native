import { Stack } from "expo-router";

export default function Layout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: "#000" },
        headerTintColor: "#fff",
        headerTitleStyle: { fontWeight: "bold" },
      }}
    >
      <Stack.Screen
        name="index"
        options={{ headerShown: false }} // remove o cabeçalho da tela inicial
      />
      <Stack.Screen
        name="login"
        options={{ headerShown: false }} 
      />
      <Stack.Screen
        name="signup"
        options={{ headerShown: false }}
      />
    </Stack>
  );
}

