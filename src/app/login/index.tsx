import { Link } from "expo-router";
import { useState } from "react";
import { Text } from "react-native";
import AuthCard from "@/components/auth/AuthCard";
import AuthHeader from "@/components/auth/AuthHeader";
import AuthPrimaryButton from "@/components/auth/AuthPrimaryButton";
import AuthScreen from "@/components/auth/AuthScreen";
import AuthTextField from "@/components/auth/AuthTextField";
import SocialAuthButtons from "@/components/auth/SocialAuthButtons";
import styles from "@/styles/authStyles";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <AuthScreen>
      <AuthHeader title="Welcome Back" accent="Dear Friend" />

      <AuthCard title="LOGIN">
        <AuthTextField
          label="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          textContentType="emailAddress"
        />

        <AuthTextField
          label="Senha"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          textContentType="password"
        />

        <Text style={styles.forgot}>Esqueceu sua senha ?</Text>

        <AuthPrimaryButton label="LOGIN" onPress={() => console.log("Login")} />
      </AuthCard>

      <SocialAuthButtons />

      <Text style={styles.footerText}>
        Nao tem uma conta?{" "}
        <Link href="/signup" style={styles.footerLink}>
          Cadastrar-se
        </Link>
      </Text>
    </AuthScreen>
  );
}
