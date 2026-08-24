import styles from "@/styles/homeStyles";
import { Image, Text, View } from "react-native";

type HomeHeaderProps = {
  name: string;
  avatarUrl: string;
};

export default function HomeHeader({ name, avatarUrl }: HomeHeaderProps) {
  return (
    <View style={styles.header}>
      <View>
        <Text style={styles.headerLabel}>Welcome Back,</Text>
        <Text style={styles.headerName}>{name}</Text>
      </View>

      <Image source={{ uri: avatarUrl }} style={styles.avatar} />
    </View>
  );
}

