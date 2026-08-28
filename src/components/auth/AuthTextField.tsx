import { FontAwesome5 } from "@expo/vector-icons";
import { useState } from "react";
import { Text, TextInput, TextInputProps, TouchableOpacity, View } from "react-native";
import styles from "@/styles/authStyles";
import colors from "@/styles/colors";
import { useAuthScreen } from "./AuthScreen";

type AuthTextFieldProps = TextInputProps & {
  label: string;
  error?: string;
};

export default function AuthTextField({ label, error, ...inputProps }: AuthTextFieldProps) {
  const hasPasswordVisibilityToggle = Boolean(inputProps.secureTextEntry);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const authScreen = useAuthScreen();
  const secureTextEntry = hasPasswordVisibilityToggle && !isPasswordVisible;

  function handleFocus(event: Parameters<NonNullable<TextInputProps["onFocus"]>>[0]) {
    inputProps.onFocus?.(event);

    if (hasPasswordVisibilityToggle) {
      authScreen?.scrollToFocusedInput();
    }
  }

  return (
    <View>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.inputContainer, error && styles.inputError]}>
        <TextInput
          style={[
            styles.input,
            hasPasswordVisibilityToggle && styles.inputWithTrailingIcon,
          ]}
          placeholderTextColor={colors.textPlaceholder}
          autoCapitalize="none"
          {...inputProps}
          secureTextEntry={secureTextEntry}
          onFocus={handleFocus}
        />
        {hasPasswordVisibilityToggle ? (
          <TouchableOpacity
            style={styles.inputIconButton}
            onPress={() => setIsPasswordVisible((current) => !current)}
            accessibilityRole="button"
            accessibilityLabel={isPasswordVisible ? "Ocultar senha" : "Mostrar senha"}
          >
            <FontAwesome5
              name={isPasswordVisible ? "eye-slash" : "eye"}
              size={18}
              color={colors.textMuted}
            />
          </TouchableOpacity>
        ) : null}
      </View>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}
