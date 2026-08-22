import { LinearGradient } from "expo-linear-gradient";
import { Text, TouchableOpacity } from "react-native";
import colors from "@/styles/colors";
import styles from "@/styles/authStyles";

type AuthPrimaryButtonProps = {
  label: string;
  onPress: () => void;
  disabled?: boolean;
};

export default function AuthPrimaryButton({
  label,
  onPress,
  disabled = false,
}: AuthPrimaryButtonProps) {
  return (
    <TouchableOpacity
      style={[styles.button, disabled && styles.buttonDisabled]}
      onPress={onPress}
      disabled={disabled}
      accessibilityState={{ disabled }}
    >
      <LinearGradient
        colors={
          disabled
            ? [colors.disabledGradientLeft, colors.disabledGradientRight]
            : [colors.gradientLeft, colors.gradientRight]
        }
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
        style={styles.gradient}
      >
        <Text style={styles.buttonText}>{label}</Text>
      </LinearGradient>
    </TouchableOpacity>
  );
}
