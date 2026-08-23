import { useAuth } from "@/context/AuthContext";
import { useFinance } from "@/context/FinanceContext";
import colors from "@/styles/colors";
import styles from "@/styles/homeStyles";
import { TransactionType } from "@/types/finance";
import { Redirect } from "expo-router";
import { useMemo } from "react";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

function getAmountStyle(type: TransactionType) {
  return type === "income" ? styles.incomeAmount : styles.expenseAmount;
}

export default function HomeScreen() {
  const { user, logout } = useAuth();
  const {
    account,
    card,
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
  const firstName = useMemo(() => {
    return user?.name.trim().split(/\s+/)[0] ?? "Usuario";
  }, [user?.name]);

  if (!user) {
    return <Redirect href="/login" />;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View>
        <Text style={styles.headerLabel}>Welcome Back,</Text>
        <Text style={styles.headerName}>{user.name}</Text>
      </View>

      <View style={styles.balanceCard}>
        <Text style={styles.balanceGreeting}>Ola,{firstName}!</Text>
        <Text style={styles.accountType}>{account?.type}</Text>
        <Text style={styles.balance}>{balance}</Text>
        {card ? (
          <Text style={styles.cardInfo}>Cartao final {card.lastFourDigits}</Text>
        ) : null}
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
        {filteredTransactions.map((transaction) => (
          <View key={transaction.id} style={styles.transactionCard}>
            <Text style={styles.transactionTitle}>{transaction.title}</Text>
            <Text style={styles.transactionCategory}>
              {transaction.category}
            </Text>
            <Text
              style={[
                styles.transactionAmount,
                getAmountStyle(transaction.type),
              ]}
            >
              {transaction.type === "income" ? "+" : "-"}{" "}
              {formatCurrency(transaction.amount)}
            </Text>
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
