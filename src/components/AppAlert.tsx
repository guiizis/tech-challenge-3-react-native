import { FontAwesome5 } from "@expo/vector-icons";
import { Text, View } from "react-native";
import colors from "@/styles/colors";
import styles from "@/styles/authStyles";

type AppAlertVariant = "error" | "success";

type AppAlertProps = {
  message: string;
  variant?: AppAlertVariant;
};

const iconByVariant: Record<AppAlertVariant, "exclamation-circle" | "check-circle"> = {
  error: "exclamation-circle",
  success: "check-circle",
};

export default function AppAlert({ message, variant = "error" }: AppAlertProps) {
  if (!message) {
    return null;
  }

  const isSuccess = variant === "success";

  return (
    <View
      style={[styles.alert, isSuccess ? styles.alertSuccess : styles.alertError]}
      accessibilityRole="alert"
    >
      <FontAwesome5
        name={iconByVariant[variant]}
        size={14}
        color={isSuccess ? colors.textSuccess : colors.textError}
      />
      <Text style={[styles.alertText, isSuccess ? styles.alertSuccessText : styles.alertErrorText]}>
        {message}
      </Text>
    </View>
  );
}
