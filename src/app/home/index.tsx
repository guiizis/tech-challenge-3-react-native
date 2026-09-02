import BalanceCard from "@/components/home/BalanceCard";
import HomeHeader from "@/components/home/HomeHeader";
import OverviewSection from "@/components/home/OverviewSection";
import { useHomeOverview } from "@/hooks/useHomeOverview";
import colors from "@/styles/colors";
import styles from "@/styles/homeStyles";
import { FontAwesome5 } from "@expo/vector-icons";
import { Link, Redirect } from "expo-router";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  TouchableOpacity,
} from "react-native";

export default function HomeScreen() {
  const {
    account,
    balanceCardDate,
    displayedBalance,
    error,
    expenseTotal,
    firstName,
    incomeTotal,
    isBalanceVisible,
    isLoading,
    logout,
    overviewPercentage,
    setIsBalanceVisible,
    user,
  } = useHomeOverview();

  if (!user) {
    return <Redirect href="/login" />;
  }

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      style={styles.screen}
    >
      <HomeHeader
        avatarUrl={user.avatarUrl}
        name={user.name}
        onLogout={logout}
      />
      <BalanceCard
        accountType={account?.type}
        balance={displayedBalance}
        dateLabel={balanceCardDate}
        firstName={firstName}
        isBalanceVisible={isBalanceVisible}
        onToggleBalance={() => setIsBalanceVisible((current) => !current)}
      />
      {isLoading ? <ActivityIndicator color={colors.financePrimary} /> : null}
      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Link asChild href="/transactions">
        <TouchableOpacity
          accessibilityLabel="Ver transações"
          accessibilityRole="button"
          style={styles.transactionsLinkButton}
        >
          <Text style={styles.transactionsLinkButtonText}>
            Ver transações
          </Text>
          <FontAwesome5
            color={colors.textLight}
            name="arrow-right"
            size={14}
          />
        </TouchableOpacity>
      </Link>

      <OverviewSection
        expenseTotal={expenseTotal}
        incomeTotal={incomeTotal}
        percentage={overviewPercentage}
      />
    </ScrollView>
  );
}
