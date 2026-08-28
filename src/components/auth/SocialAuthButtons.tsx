import { FontAwesome5 } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";
import styles from "@/styles/authStyles";

export default function SocialAuthButtons() {
  return (
    <>
      <Text style={styles.socialText}>Login with social accounts</Text>
      <View style={styles.socialRow}>
        <TouchableOpacity
          style={[styles.socialButton, styles.socialButtonDisabled]}
          disabled
          accessibilityState={{ disabled: true }}
        >
          <FontAwesome5 name="google" size={20} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.socialButton, styles.socialButtonFb, styles.socialButtonDisabled]}
          disabled
          accessibilityState={{ disabled: true }}
        >
          <FontAwesome5 name="facebook-f" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </>
  );
}
