import { Text, TextInput, TextInputProps, View } from "react-native";
import styles from "@/styles/authStyles";
import colors from "@/styles/colors";

type AuthTextFieldProps = TextInputProps & {
  label: string;
  error?: string;
};

export default function AuthTextField({ label, error, ...inputProps }: AuthTextFieldProps) {
  return (
    <View>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, error && styles.inputError]}
        placeholderTextColor={colors.textPlaceholder}
        autoCapitalize="none"
        {...inputProps}
      />
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
    </View>
  );
}
