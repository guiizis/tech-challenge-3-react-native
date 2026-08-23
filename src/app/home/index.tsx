import { useAuth } from "@/context/AuthContext";
import { useFinance } from "@/context/FinanceContext";
import colors from "@/styles/colors";
import styles from "@/styles/homeStyles";
import { TransactionType } from "@/types/finance";
import {
  formatCurrency,
  formatShortDate,
  formatTodayLabel,
} from "@/utils/formatters";
import { FontAwesome5 } from "@expo/vector-icons";
import { Redirect } from "expo-router";
import { useMemo, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

function getAmountStyle(type: TransactionType) {
  return type === "income" ? styles.incomeAmount : styles.expenseAmount;
}

function getTransactionIcon(type: TransactionType, category: string) {
  if (category.toLowerCase() === "subscription") {
    return "music";
  }

  return type === "income" ? "briefcase" : "credit-card";
}

export default function HomeScreen() {
  const { user, logout } = useAuth();
  const [isBalanceVisible, setIsBalanceVisible] = useState(true);
  const {
    account,
    filteredTransactions,
    filter,
    setFilter,
    incomeTotal,
    expenseTotal,
    overviewPercentage,
    isLoading,
    error,
  } = useFinance();

  const balance = useMemo(
    () => formatCurrency(account?.balance ?? 0),
    [account?.balance],
  );
  const displayedBalance = isBalanceVisible ? balance : "R$ ••••••";
  const firstName = useMemo(() => {
    return user?.name.trim().split(/\s+/)[0] ?? "Usuario";
  }, [user?.name]);
  const balanceCardDate = useMemo(() => formatTodayLabel(), []);
  const latestTransactions = useMemo(() => {
    return filteredTransactions.slice(0, 2);
  }, [filteredTransactions]);

  if (!user) {
    return <Redirect href="/login" />;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerLabel}>Welcome Back,</Text>
          <Text style={styles.headerName}>{user.name}</Text>
        </View>

        <Image source={{ uri: user.avatarUrl }} style={styles.avatar} />
      </View>

      <View style={styles.balanceCard}>
        <View style={styles.balanceHeader}>
          <Text style={styles.balanceGreeting}>Ola, {firstName}!</Text>
          <Text style={styles.balanceDate}>{balanceCardDate}</Text>
        </View>

        <View style={styles.balanceLabelRow}>
          <Text style={styles.balanceLabel}>Saldo</Text>
          <TouchableOpacity
            accessibilityLabel={
              isBalanceVisible ? "Esconder saldo" : "Mostrar saldo"
            }
            accessibilityRole="button"
            onPress={() => setIsBalanceVisible((current) => !current)}
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

        <Text style={styles.accountType}>{account?.type}</Text>
        <Text style={styles.balance}>{displayedBalance}</Text>
      </View>

      {isLoading ? <ActivityIndicator color={colors.financePrimary} /> : null}
      {error ? <Text style={styles.error}>{error}</Text> : null}

      <View style={styles.filters}>
        <Text
          onPress={() => setFilter("income")}
          style={[styles.filter, filter === "income" && styles.filterActive]}
        >
          Entradas
        </Text>
        <Text
          onPress={() => setFilter("expense")}
          style={[styles.filter, filter === "expense" && styles.filterActive]}
        >
          Saidas
        </Text>
        <Text
          onPress={() => setFilter("all")}
          style={[styles.filter, filter === "all" && styles.filterActive]}
        >
          Transacoes
        </Text>
      </View>

      <View style={styles.transactions}>
        {latestTransactions.map((transaction) => (
          <View key={transaction.id} style={styles.transactionCard}>
            <View style={styles.transactionIcon}>
              <FontAwesome5
                name={getTransactionIcon(transaction.type, transaction.category)}
                size={18}
                color={colors.financePrimary}
              />
            </View>

            <View style={styles.transactionInfo}>
              <Text style={styles.transactionTitle}>{transaction.title}</Text>
              <Text style={styles.transactionCategory}>
                {transaction.category}
              </Text>
            </View>

            <View style={styles.transactionMeta}>
              <Text
                style={[
                  styles.transactionAmount,
                  getAmountStyle(transaction.type),
                ]}
              >
                {transaction.type === "income" ? "+" : "-"}{" "}
                {formatCurrency(transaction.amount)}
              </Text>
              <Text style={styles.transactionDate}>
                {formatShortDate(transaction.date)}
              </Text>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.overview}>
        <Text style={styles.overviewTitle}>Overview</Text>
        <Text style={styles.overviewValue}>{overviewPercentage}%</Text>
        <Text style={styles.overviewDescription}>
          Entradas {formatCurrency(incomeTotal)} / Saidas{" "}
          {formatCurrency(expenseTotal)}
        </Text>
      </View>

      <Text onPress={logout} style={styles.logout}>
        Sair
      </Text>
    </ScrollView>
  );
}
