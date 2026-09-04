import { useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import { Animated, Text, TouchableOpacity } from "react-native";
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
  const [scaleAnim] = useState(() => new Animated.Value(1));

  const handlePressIn = () => {
    Animated.spring(scaleAnim, {
      toValue: 0.95,
      useNativeDriver: true,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      friction: 3,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
      <TouchableOpacity
        style={[styles.button, disabled && styles.buttonDisabled]}
        onPress={onPress}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        disabled={disabled}
        accessibilityState={{ disabled }}
        activeOpacity={1}
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
    </Animated.View>
  );
}