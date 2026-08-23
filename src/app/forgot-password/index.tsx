import AppAlert from "@/components/AppAlert";
import AuthCard from "@/components/auth/AuthCard";
import AuthHeader from "@/components/auth/AuthHeader";
import AuthPrimaryButton from "@/components/auth/AuthPrimaryButton";
import AuthScreen from "@/components/auth/AuthScreen";
import AuthTextField from "@/components/auth/AuthTextField";
import { useAuth } from "@/context/AuthContext";
import {
  PasswordRecoveryErrors,
  validatePasswordRecoveryForm,
} from "@/validators/passwordRecoveryValidator";
import { Link, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Text } from "react-native";
import styles from "@/styles/authStyles";

type TouchedFields = {
  email: boolean;
  password: boolean;
  passwordConfirmation: boolean;
};

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const { changePassword } = useAuth();
  const redirectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [changePasswordError, setChangePasswordError] = useState("");
  const [changePasswordSuccess, setChangePasswordSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [touched, setTouched] = useState<TouchedFields>({
    email: false,
    password: false,
    passwordConfirmation: false,
  });

  const errors = validatePasswordRecoveryForm({
    email,
    password,
    passwordConfirmation,
  });
  const isFormValid = Object.keys(errors).length === 0;
  const isRedirecting = Boolean(changePasswordSuccess);

  useEffect(() => {
    return () => {
      if (redirectTimeoutRef.current) {
        clearTimeout(redirectTimeoutRef.current);
      }
    };
  }, []);

  function markAsTouched(field: keyof TouchedFields) {
    setTouched((current) => ({ ...current, [field]: true }));
  }

  function getVisibleError(field: keyof PasswordRecoveryErrors) {
    return touched[field] ? errors[field] : undefined;
  }

  function clearSubmitMessages() {
    setChangePasswordError("");
    setChangePasswordSuccess("");
  }

  function handleEmailChange(value: string) {
    markAsTouched("email");
    clearSubmitMessages();
    setEmail(value);
  }

  function handlePasswordChange(value: string) {
    markAsTouched("password");
    clearSubmitMessages();
    setPassword(value);
  }

  function handlePasswordConfirmationChange(value: string) {
    markAsTouched("passwordConfirmation");
    clearSubmitMessages();
    setPasswordConfirmation(value);
  }

  async function handleChangePassword() {
    setTouched({
      email: true,
      password: true,
      passwordConfirmation: true,
    });

    if (!isFormValid) {
      return;
    }

    clearSubmitMessages();
    setIsSubmitting(true);

    try {
      await changePassword({ email, password });
      setChangePasswordSuccess("Senha alterada com sucesso. Redirecionando para o login...");
      redirectTimeoutRef.current = setTimeout(() => {
        router.replace("/login");
      }, 4000);
    } catch (error) {
      setChangePasswordError(
        error instanceof Error ? error.message : "Nao foi possivel alterar a senha.",
      );
      setIsSubmitting(false);
    }
  }

  return (
    <AuthScreen>
      <AuthHeader title="Alterar" accent="Senha" />

      <AuthCard title="SENHA">
        <AppAlert message={changePasswordError} />
        <AppAlert message={changePasswordSuccess} variant="success" />

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
          label="Nova senha"
          value={password}
          onChangeText={handlePasswordChange}
          onBlur={() => markAsTouched("password")}
          error={getVisibleError("password")}
          secureTextEntry
          textContentType="newPassword"
        />

        <AuthTextField
          label="Repetir senha"
          value={passwordConfirmation}
          onChangeText={handlePasswordConfirmationChange}
          onBlur={() => markAsTouched("passwordConfirmation")}
          error={getVisibleError("passwordConfirmation")}
          secureTextEntry
          textContentType="newPassword"
        />

        <AuthPrimaryButton
          label={isSubmitting ? "ALTERANDO..." : "ALTERAR"}
          onPress={handleChangePassword}
          disabled={!isFormValid || isSubmitting || isRedirecting}
        />
      </AuthCard>

      <Text style={styles.footerText}>
        Lembrou sua senha?{" "}
        <Link href="/login" style={styles.footerLink}>
          Entrar
        </Link>
      </Text>
    </AuthScreen>
  );
}
