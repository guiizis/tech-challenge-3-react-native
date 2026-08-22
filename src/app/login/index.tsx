import { Link } from "expo-router";
import { useState } from "react";
import { Text } from "react-native";
import AppAlert from "@/components/AppAlert";
import AuthCard from "@/components/auth/AuthCard";
import AuthHeader from "@/components/auth/AuthHeader";
import AuthPrimaryButton from "@/components/auth/AuthPrimaryButton";
import AuthScreen from "@/components/auth/AuthScreen";
import AuthTextField from "@/components/auth/AuthTextField";
import SocialAuthButtons from "@/components/auth/SocialAuthButtons";
import { login } from "@/services/authApi";
import styles from "@/styles/authStyles";
import { LoginErrors, validateLoginForm } from "@/validators/loginValidator";

type TouchedFields = {
  email: boolean;
  password: boolean;
};

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [touched, setTouched] = useState<TouchedFields>({
    email: false,
    password: false,
  });

  const errors = validateLoginForm({ email, password });
  const isFormValid = Object.keys(errors).length === 0;

  function markAsTouched(field: keyof TouchedFields) {
    setTouched((current) => ({ ...current, [field]: true }));
  }

  function getVisibleError(field: keyof LoginErrors) {
    return touched[field] ? errors[field] : undefined;
  }

  function handleEmailChange(value: string) {
    markAsTouched("email");
    setLoginError("");
    setEmail(value);
  }

  function handlePasswordChange(value: string) {
    markAsTouched("password");
    setLoginError("");
    setPassword(value);
  }

  async function handleLogin() {
    setTouched({
      email: true,
      password: true,
    });

    if (!isFormValid) {
      return;
    }

    setLoginError("");
    setIsSubmitting(true);

    try {
      await login({ email, password });
    } catch (error) {
      setLoginError(
        error instanceof Error ? error.message : "Nao foi possivel entrar.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthScreen>
      <AuthHeader title="Welcome Back" accent="Dear Friend" />

      <AuthCard title="LOGIN">
        <AppAlert message={loginError} />

        <AuthTextField
          label="Email"
          value={email}
          onChangeText={handleEmailChange}
          onBlur={() => markAsTouched("email")}
          error={getVisibleError("email")}
          keyboardType="email-address"
          textContentType="emailAddress"
        />

        <AuthTextField
          label="Senha"
          value={password}
          onChangeText={handlePasswordChange}
          onBlur={() => markAsTouched("password")}
          error={getVisibleError("password")}
          secureTextEntry
          textContentType="password"
        />

        <Text style={styles.forgot}>Esqueceu sua senha ?</Text>

        <AuthPrimaryButton
          label={isSubmitting ? "ENTRANDO..." : "LOGIN"}
          onPress={handleLogin}
          disabled={!isFormValid || isSubmitting}
        />
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
