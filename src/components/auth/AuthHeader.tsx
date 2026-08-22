import { Text, View } from "react-native";
import styles from "@/styles/authStyles";

type AuthHeaderProps = {
  title: string;
  accent: string;
};

export default function AuthHeader({ title, accent }: AuthHeaderProps) {
  return (
    <View style={styles.titleContainer}>
      <Text style={styles.titleWhite}>{title}</Text>
      <Text style={styles.titleAccent}>{accent}</Text>
    </View>
  );
}
