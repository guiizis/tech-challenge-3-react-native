import type { ReactNode } from "react";
import {
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import styles from "@/styles/authStyles";

type AuthScreenProps = {
  children: ReactNode;
};

export default function AuthScreen({ children }: AuthScreenProps) {
  return (
    <ImageBackground
      source={require("../../assets/BackgroundInicial.png")}
      style={styles.background}
      resizeMode="cover"
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView
          contentContainerStyle={styles.overlay}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          style={styles.scrollView}
        >
          {children}
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}
