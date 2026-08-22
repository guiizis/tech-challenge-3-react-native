import AppAlert from "@/components/AppAlert";
import AuthCard from "@/components/auth/AuthCard";
import AuthHeader from "@/components/auth/AuthHeader";
import AuthPrimaryButton from "@/components/auth/AuthPrimaryButton";
import AuthScreen from "@/components/auth/AuthScreen";
import AuthTextField from "@/components/auth/AuthTextField";
import { signup } from "@/services/authApi";
import styles from "@/styles/authStyles";
import colors from "@/styles/colors";
import { SignupErrors, validateSignupForm } from "@/validators/signupValidator";
import { FontAwesome5 } from "@expo/vector-icons";
import { Link, useRouter } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

type TouchedFields = {
  name: boolean;
  email: boolean;
  password: boolean;
  acceptedPolicy: boolean;
};

export default function SignupScreen() {
  const router = useRouter();
  const redirectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [acceptedPolicy, setAcceptedPolicy] = useState(false);
  const [signupError, setSignupError] = useState("");
  const [signupSuccess, setSignupSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [touched, setTouched] = useState<TouchedFields>({
    name: false,
    email: false,
    password: false,
    acceptedPolicy: false,
  });

  const errors = validateSignupForm({ name, email, password, acceptedPolicy });
  const isFormValid = Object.keys(errors).length === 0;
  const isRedirecting = Boolean(signupSuccess);

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

  function getVisibleError(field: keyof SignupErrors) {
    return touched[field] ? errors[field] : undefined;
  }

  function handleNameChange(value: string) {
    markAsTouched("name");
    setSignupError("");
    setSignupSuccess("");
    setName(value);
  }

  function handleEmailChange(value: string) {
    markAsTouched("email");
    setSignupError("");
    setSignupSuccess("");
    setEmail(value);
  }

  function handlePasswordChange(value: string) {
    markAsTouched("password");
    setSignupError("");
    setSignupSuccess("");
    setPassword(value);
  }

  async function handleSignup() {
    setTouched({
      name: true,
      email: true,
      password: true,
      acceptedPolicy: true,
    });

    if (!isFormValid) {
      return;
    }

    setSignupError("");
    setSignupSuccess("");
    setIsSubmitting(true);

    try {
      await signup({ name, email, password });
      setSignupSuccess("Cadastro realizado com sucesso. Redirecionando para o login...");
      redirectTimeoutRef.current = setTimeout(() => {
        router.replace("/login");
      }, 4000);
    } catch (error) {
      setSignupError(
        error instanceof Error ? error.message : "Nao foi possivel criar o cadastro.",
      );
      setIsSubmitting(false);
    }
  }

  return (
    <AuthScreen>
      <AuthHeader title="Crie a sua" accent="Conta" />

      <AuthCard title="Cadastre-se">
        <AppAlert message={signupError} />
        <AppAlert message={signupSuccess} variant="success" />

        <AuthTextField
          label="Nome"
          value={name}
          onChangeText={handleNameChange}
          onBlur={() => markAsTouched("name")}
          error={getVisibleError("name")}
          textContentType="name"
        />

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
          textContentType="newPassword"
        />

        <TouchableOpacity
          style={styles.policyRow}
          onPress={() => {
            markAsTouched("acceptedPolicy");
            setAcceptedPolicy((current) => !current);
          }}
          accessibilityRole="checkbox"
          accessibilityState={{ checked: acceptedPolicy }}
        >
          <View style={[styles.checkbox, acceptedPolicy && styles.checkboxChecked]}>
            {acceptedPolicy ? (
              <FontAwesome5 name="check" size={10} color={colors.textLight} />
            ) : null}
          </View>
          <Text style={styles.policyText}>
            Eu li a{" "}
            <Text style={styles.policyLink}>Politica de Privacidade</Text>
          </Text>
        </TouchableOpacity>
        {getVisibleError("acceptedPolicy") ? (
          <Text style={styles.policyErrorText}>{getVisibleError("acceptedPolicy")}</Text>
        ) : null}

        <AuthPrimaryButton
          label={isSubmitting ? "CADASTRANDO..." : "CADASTRAR"}
          onPress={handleSignup}
          disabled={!isFormValid || isSubmitting || isRedirecting}
        />
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
