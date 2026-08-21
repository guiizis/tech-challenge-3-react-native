import React from "react";
import {
  View,
  Text,
  ImageBackground,
  Image,
  TouchableOpacity,
} from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import styles from "../styles/indexStyles";
import colors from "../styles/colors";

export default function HomeScreen() {
  const router = useRouter();

  return (
    <ImageBackground
      source={require("../assets/BackgroundInicial.png")}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        {/* Logo */}
        <Image
          source={require("../assets/Logo-ByteBank.png")}
          style={styles.logo}
          resizeMode="contain"
        />

        {/* H1 */}
        <Text style={styles.title}>bytebank</Text>

        {/* H3 com destaque */}
        <Text style={styles.subtitle}>
          O futuro das suas <Text style={styles.highlight}>finanças</Text>{" "}
          começa aqui
        </Text>

        {/* Botão com gradiente */}
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push("/login")}
        >
          <LinearGradient
            colors={[colors.gradientLeft, colors.gradientRight]} // aplica o gradiente corrigido
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.gradient}
          >
            <Text style={styles.buttonText}>Começar →</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </ImageBackground>
  );
}
