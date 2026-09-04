import colors from "@/styles/colors";
import styles from "@/styles/homeStyles";
import { FontAwesome5 } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { Animated, Text, TouchableOpacity, View } from "react-native";

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
  const [cardFade] = useState(() => new Animated.Value(0));
  const [cardSlide] = useState(() => new Animated.Value(20));
  const [balanceFade] = useState(() => new Animated.Value(1));
  const [iconScale] = useState(() => new Animated.Value(1));

  // Entrada do card ao montar
  useEffect(() => {
    Animated.parallel([
      Animated.timing(cardFade, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(cardSlide, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, [cardFade, cardSlide]);

  // Crossfade quando o saldo muda de conteúdo (visível/oculto)
  useEffect(() => {
    Animated.sequence([
      Animated.timing(balanceFade, {
        toValue: 0,
        duration: 120,
        useNativeDriver: true,
      }),
      Animated.timing(balanceFade, {
        toValue: 1,
        duration: 180,
        useNativeDriver: true,
      }),
    ]).start();
  }, [balance, balanceFade]);

  const handleToggle = () => {
    Animated.sequence([
      Animated.spring(iconScale, {
        toValue: 1.3,
        friction: 3,
        useNativeDriver: true,
      }),
      Animated.spring(iconScale, {
        toValue: 1,
        friction: 3,
        useNativeDriver: true,
      }),
    ]).start();
    onToggleBalance();
  };

  return (
    <Animated.View
      style={[
        styles.balanceCard,
        { opacity: cardFade, transform: [{ translateY: cardSlide }] },
      ]}
    >
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
          onPress={handleToggle}
          style={styles.balanceVisibilityButton}
        >
          <Animated.View style={{ transform: [{ scale: iconScale }] }}>
            <FontAwesome5
              name={isBalanceVisible ? "eye" : "eye-slash"}
              size={16}
              color={colors.textLight}
            />
          </Animated.View>
        </TouchableOpacity>
      </View>
      <View style={styles.balanceDivider} />

      <Text style={styles.accountType}>{accountType}</Text>
      <Animated.Text style={[styles.balance, { opacity: balanceFade }]}>
        {balance}
      </Animated.Text>
    </Animated.View>
  );
}