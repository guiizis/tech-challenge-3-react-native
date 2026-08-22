import { Text, TextInput, TextInputProps, View } from "react-native";
import styles from "@/styles/authStyles";

type AuthTextFieldProps = TextInputProps & {
  label: string;
};

export default function AuthTextField({ label, ...inputProps }: AuthTextFieldProps) {
  return (
    <View>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={styles.input}
        placeholderTextColor="#aaa"
        autoCapitalize="none"
        {...inputProps}
      />
    </View>
  );
}
