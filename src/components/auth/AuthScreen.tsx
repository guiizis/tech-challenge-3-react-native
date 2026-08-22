import type { ReactNode } from "react";
import { ImageBackground, View } from "react-native";
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
      <View style={styles.overlay}>{children}</View>
    </ImageBackground>
  );
}
