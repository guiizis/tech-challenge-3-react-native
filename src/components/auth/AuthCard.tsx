import type { ReactNode } from "react";
import { Text, View } from "react-native";
import styles from "@/styles/authStyles";

type AuthCardProps = {
  title: string;
  children: ReactNode;
};

export default function AuthCard({ title, children }: AuthCardProps) {
  return (
    <View style={styles.card}>
      <Text style={styles.section}>{title}</Text>
      {children}
    </View>
  );
}
