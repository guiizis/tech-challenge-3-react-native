import { useEffect, useRef } from "react";
import { Animated } from "react-native";
import styles from "@/styles/authStyles";

type AuthHeaderProps = {
  title: string;
  accent: string;
};

export default function AuthHeader({ title, accent }: AuthHeaderProps) {
  const titleAnim = useRef(new Animated.Value(0)).current;
  const accentAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.stagger(150, [
      Animated.timing(titleAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(accentAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, [titleAnim, accentAnim]);

  return (
    <Animated.View style={styles.titleContainer}>
      <Animated.Text
        style={[
          styles.titleWhite,
          {
            opacity: titleAnim,
            transform: [
              {
                translateY: titleAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-15, 0],
                }),
              },
            ],
          },
        ]}
      >
        {title}
      </Animated.Text>
      <Animated.Text
        style={[
          styles.titleAccent,
          {
            opacity: accentAnim,
            transform: [
              {
                translateY: accentAnim.interpolate({
                  inputRange: [0, 1],
                  outputRange: [-15, 0],
                }),
              },
            ],
          },
        ]}
      >
        {accent}
      </Animated.Text>
    </Animated.View>
  );
}