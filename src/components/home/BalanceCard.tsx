import colors from "@/styles/colors";
import styles from "@/styles/homeStyles";
import { FontAwesome5 } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";

type BalanceCardProps = {
  accountType?: string;
  balance: string;
  dateLabel: string;
  firstName: string;
  isBalanceVisible: boolean;
  onToggleBalance: () => void;
};

export default function BalanceCard({
  accountType,
  balance,
  dateLabel,
  firstName,
  isBalanceVisible,
  onToggleBalance,
}: BalanceCardProps) {
  return (
    <View style={styles.balanceCard}>
      <View style={styles.balanceHeader}>
        <Text style={styles.balanceGreeting}>Ola, {firstName}!</Text>
        <Text style={styles.balanceDate}>{dateLabel}</Text>
      </View>

      <View style={styles.balanceLabelRow}>
        <Text style={styles.balanceLabel}>Saldo</Text>
        <TouchableOpacity
          accessibilityLabel={
            isBalanceVisible ? "Esconder saldo" : "Mostrar saldo"
          }
          accessibilityRole="button"
          onPress={onToggleBalance}
          style={styles.balanceVisibilityButton}
        >
          <FontAwesome5
            name={isBalanceVisible ? "eye" : "eye-slash"}
            size={16}
            color={colors.textLight}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.balanceDivider} />

      <Text style={styles.accountType}>{accountType}</Text>
      <Text style={styles.balance}>{balance}</Text>
    </View>
  );
}

