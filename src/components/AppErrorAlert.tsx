import { FontAwesome5 } from "@expo/vector-icons";
import { Text, View } from "react-native";
import colors from "@/styles/colors";
import styles from "@/styles/authStyles";

type AppErrorAlertProps = {
  message: string;
};

export default function AppErrorAlert({ message }: AppErrorAlertProps) {
  if (!message) {
    return null;
  }

  return (
    <View style={styles.errorAlert} accessibilityRole="alert">
      <FontAwesome5 name="exclamation-circle" size={14} color={colors.textError} />
      <Text style={styles.errorAlertText}>{message}</Text>
    </View>
  );
}
