import { useEffect, useRef, type ReactNode } from "react";
import { Animated, Text } from "react-native";
import styles from "@/styles/authStyles";

type AuthCardProps = {
  title: string;
  children: ReactNode;
};

export default function AuthCard({ title, children }: AuthCardProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

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