import { useEffect, useState, type ReactNode } from "react";
import { Animated, Text } from "react-native";
import styles from "@/styles/authStyles";

type AuthCardProps = {
  title: string;
  children: ReactNode;
};

export default function AuthCard({ title, children }: AuthCardProps) {
  const [fadeAnim] = useState(() => new Animated.Value(0));
  const [slideAnim] = useState(() => new Animated.Value(20));

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim]);

  return (
    <Animated.View
      style={[
        styles.card,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <Text style={styles.section}>{title}</Text>
      {children}
    </Animated.View>
  );
}