import AppProviders from "@/context/AppProviders";
import { Stack } from "expo-router";

export default function Layout() {
  return (
    <AppProviders>
      <Stack
        screenOptions={{
          headerStyle: { backgroundColor: "#000" },
          headerTintColor: "#fff",
          headerTitleStyle: { fontWeight: "bold" },
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen
          name="login"
          options={{ headerShown: false, animation: "slide_from_right" }}
        />
        <Stack.Screen
          name="signup"
          options={{ headerShown: false, animation: "slide_from_right" }}
        />
        <Stack.Screen
          name="forgot-password"
          options={{ headerShown: false, animation: "slide_from_bottom" }}
        />
        <Stack.Screen
          name="home"
          options={{ headerShown: false, animation: "slide_from_right" }}
        />
        <Stack.Screen name="transactions" options={{ title: "Transações" }} />
      </Stack>
    </AppProviders>
  );
}