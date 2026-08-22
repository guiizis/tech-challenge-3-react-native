import AuthCard from "@/components/auth/AuthCard";
import AuthHeader from "@/components/auth/AuthHeader";
import AuthPrimaryButton from "@/components/auth/AuthPrimaryButton";
import AuthScreen from "@/components/auth/AuthScreen";
import AuthTextField from "@/components/auth/AuthTextField";
import styles from "@/styles/authStyles";
import colors from "@/styles/colors";
import { SignupErrors, validateSignupForm } from "@/validators/signupValidator";
import { FontAwesome5 } from "@expo/vector-icons";
import { Link } from "expo-router";
import { useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

type TouchedFields = {
  name: boolean;
  email: boolean;
  password: boolean;
  acceptedPolicy: boolean;
};

export default function SignupScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [acceptedPolicy, setAcceptedPolicy] = useState(false);
  const [touched, setTouched] = useState<TouchedFields>({
    name: false,
    email: false,
    password: false,
    acceptedPolicy: false,
  });

  const errors = validateSignupForm({ name, email, password, acceptedPolicy });
  const isFormValid = Object.keys(errors).length === 0;

  function markAsTouched(field: keyof TouchedFields) {
    setTouched((current) => ({ ...current, [field]: true }));
  }

  function getVisibleError(field: keyof SignupErrors) {
    return touched[field] ? errors[field] : undefined;
  }

  function handleNameChange(value: string) {
    markAsTouched("name");
    setName(value);
  }

  function handleEmailChange(value: string) {
    markAsTouched("email");
    setEmail(value);
  }

  function handlePasswordChange(value: string) {
    markAsTouched("password");
    setPassword(value);
  }

  function handleSignup() {
    setTouched({
      name: true,
      email: true,
      password: true,
      acceptedPolicy: true,
    });

    if (!isFormValid) {
      return;
    }
  }

  return (
    <AuthScreen>
      <AuthHeader title="Crie a sua" accent="Conta" />

      <AuthCard title="Cadastre-se">
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
          label="CADASTRAR"
          onPress={handleSignup}
          disabled={!isFormValid}
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
