import { Link } from "expo-router";
import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";
import AuthCard from "@/components/auth/AuthCard";
import AuthHeader from "@/components/auth/AuthHeader";
import AuthPrimaryButton from "@/components/auth/AuthPrimaryButton";
import AuthScreen from "@/components/auth/AuthScreen";
import AuthTextField from "@/components/auth/AuthTextField";
import styles from "@/styles/authStyles";

export default function SignupScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [acceptedPolicy, setAcceptedPolicy] = useState(false);

  return (
    <AuthScreen>
      <AuthHeader title="Create your" accent="Account" />

      <AuthCard title="SIGN UP">
        <AuthTextField
          label="Nome"
          value={name}
          onChangeText={setName}
          textContentType="name"
        />

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
          textContentType="newPassword"
        />

        <TouchableOpacity
          style={styles.policyRow}
          onPress={() => setAcceptedPolicy((current) => !current)}
          accessibilityRole="checkbox"
          accessibilityState={{ checked: acceptedPolicy }}
        >
          <View style={[styles.checkbox, acceptedPolicy && styles.checkboxChecked]}>
            <Text style={styles.checkboxMark}>{acceptedPolicy ? "✓" : ""}</Text>
          </View>
          <Text style={styles.policyText}>
            Eu li a{" "}
            <Text style={styles.policyLink}>Politica de Privacidade</Text>
          </Text>
        </TouchableOpacity>

        <AuthPrimaryButton label="SIGN UP" onPress={() => console.log("Sign up")} />
      </AuthCard>

      <Text style={styles.footerText}>
        Ja tem uma conta?{" "}
        <Link href="/login" style={styles.footerLink}>
          Entrar
        </Link>
      </Text>
    </AuthScreen>
  );
}
