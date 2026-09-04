import styles from "@/styles/authStyles";
import { FontAwesome5 } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { Animated, Text, TouchableOpacity, View } from "react-native";

export default function SocialAuthButtons() {
  const [googleAnim] = useState(() => new Animated.Value(0));
  const [facebookAnim] = useState(() => new Animated.Value(0));

  useEffect(() => {
    Animated.stagger(100, [
      Animated.spring(googleAnim, {
        toValue: 1,
        friction: 4,
        useNativeDriver: true,
      }),
      Animated.spring(facebookAnim, {
        toValue: 1,
        friction: 4,
        useNativeDriver: true,
      }),
    ]).start();
  }, [googleAnim, facebookAnim]);

  return (
    <>
      <View style={styles.socialHeader}>
        <Text style={styles.socialText}>Login com redes sociais</Text>
        <Text style={styles.socialBadge}>Em breve</Text>
      </View>

      <View style={styles.socialRow}>
        <Animated.View
          style={{ opacity: googleAnim, transform: [{ scale: googleAnim }] }}
        >
          <TouchableOpacity
            style={[styles.socialButton, styles.socialButtonDisabled]}
            disabled
            accessibilityState={{ disabled: true }}
            accessibilityLabel="Login com Google em breve"
          >
            <FontAwesome5 name="google" size={20} color="#fff" />
          </TouchableOpacity>
        </Animated.View>

        <Animated.View
          style={{ opacity: facebookAnim, transform: [{ scale: facebookAnim }] }}
        >
          <TouchableOpacity
            style={[styles.socialButton, styles.socialButtonFb, styles.socialButtonDisabled]}
            disabled
            accessibilityState={{ disabled: true }}
            accessibilityLabel="Login com Facebook em breve"
          >
            <FontAwesome5 name="facebook-f" size={20} color="#fff" />
          </TouchableOpacity>
        </Animated.View>
      </View>
    </>
  );
}