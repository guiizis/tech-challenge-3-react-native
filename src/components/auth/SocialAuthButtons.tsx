import styles from "@/styles/authStyles";
import { FontAwesome5 } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";

export default function SocialAuthButtons() {
  return (
    <>
      <View style={styles.socialHeader}>
        <Text style={styles.socialText}>Login com redes sociais</Text>
        <Text style={styles.socialBadge}>Em breve</Text>
      </View>

      <View style={styles.socialRow}>
        <TouchableOpacity
          style={[styles.socialButton, styles.socialButtonDisabled]}
          disabled
          accessibilityState={{ disabled: true }}
          accessibilityLabel="Login com Google em breve"
        >
          <FontAwesome5 name="google" size={20} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.socialButton, styles.socialButtonFb, styles.socialButtonDisabled]}
          disabled
          accessibilityState={{ disabled: true }}
          accessibilityLabel="Login com Facebook em breve"
        >
          <FontAwesome5 name="facebook-f" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </>
  );
}
