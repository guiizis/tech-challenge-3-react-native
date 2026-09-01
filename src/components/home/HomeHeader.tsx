import colors from "@/styles/colors";
import styles from "@/styles/homeStyles";
import { FontAwesome5 } from "@expo/vector-icons";
import { useState } from "react";
import {
  Alert,
  Image,
  Modal,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type HomeHeaderProps = {
  name: string;
  avatarUrl: string;
  onLogout: () => void;
};

export default function HomeHeader({
  name,
  avatarUrl,
  onLogout,
}: HomeHeaderProps) {
  const [isMenuVisible, setIsMenuVisible] = useState(false);

  function handleLogoutPress() {
    setIsMenuVisible(false);
    Alert.alert("Sair", "Deseja sair da sua conta?", [
      { text: "Cancelar", style: "cancel" },
      { text: "Sair", style: "destructive", onPress: onLogout },
    ]);
  }

  return (
    <View style={styles.header}>
      <View>
        <Text style={styles.headerLabel}>Welcome Back,</Text>
        <Text style={styles.headerName}>{name}</Text>
      </View>

      <TouchableOpacity
        accessibilityLabel="Abrir menu do usuário"
        accessibilityRole="button"
        onPress={() => setIsMenuVisible(true)}
      >
        <Image source={{ uri: avatarUrl }} style={styles.avatar} />
      </TouchableOpacity>

      <Modal
        animationType="fade"
        transparent
        visible={isMenuVisible}
        onRequestClose={() => setIsMenuVisible(false)}
      >
        <Pressable
          style={styles.avatarMenuBackdrop}
          onPress={() => setIsMenuVisible(false)}
        >
          <View style={styles.avatarMenuCard}>
            <TouchableOpacity
              accessibilityLabel="Sair da conta"
              accessibilityRole="button"
              style={styles.avatarMenuItem}
              onPress={handleLogoutPress}
            >
              <FontAwesome5
                color={colors.financePrimary}
                name="sign-out-alt"
                size={16}
              />
              <Text style={styles.logout}>Sair</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}
