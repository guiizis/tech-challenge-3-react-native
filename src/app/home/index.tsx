import BalanceCard from "@/components/home/BalanceCard";
import HomeHeader from "@/components/home/HomeHeader";
import OverviewSection from "@/components/home/OverviewSection";
import TransactionFormModal from "@/components/home/TransactionFormModal";
import TransactionList from "@/components/home/TransactionList";
import TransactionToolbar from "@/components/home/TransactionToolbar";
import { useHomeTransactions } from "@/hooks/useHomeTransactions";
import colors from "@/styles/colors";
import styles from "@/styles/homeStyles";
import { Redirect } from "expo-router";
import { ActivityIndicator, ScrollView, Text } from "react-native";

export default function HomeScreen() {
  const {
    account,
    balanceCardDate,
    displayedBalance,
    error,
    expenseTotal,
    filter,
    filteredTransactions,
    firstName,
    incomeTotal,
    isBalanceVisible,
    isLoading,
    isSearching,
    isTransactionModalVisible,
    logout,
    overviewPercentage,
    searchTerm,
    transactionAmount,
    transactionDate,
    transactionError,
    transactionModalMode,
    transactionTitle,
    transactionType,
    user,
    closeTransactionModal,
    handleDeleteTransaction,
    handleFilterChange,
    handleSubmitTransaction,
    handleTransactionAmountChange,
    handleTransactionDateChange,
    openCreateModal,
    openEditModal,
    setIsBalanceVisible,
    setSearchTerm,
    setTransactionTitle,
    setTransactionType,
  } = useHomeTransactions();

  if (!user) {
    return <Redirect href="/login" />;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <HomeHeader name={user.name} avatarUrl={user.avatarUrl} />

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

      <TransactionToolbar
        filter={filter}
        isSearching={isSearching}
        searchTerm={searchTerm}
        onAddPress={openCreateModal}
        onFilterChange={handleFilterChange}
        onSearchChange={setSearchTerm}
      />

      <TransactionList
        transactions={filteredTransactions}
        onDelete={handleDeleteTransaction}
        onEdit={openEditModal}
      />

      <OverviewSection
        expenseTotal={expenseTotal}
        incomeTotal={incomeTotal}
        percentage={overviewPercentage}
      />

      <Text onPress={logout} style={styles.logout}>
        Sair
      </Text>

      <TransactionFormModal
        amount={transactionAmount}
        date={transactionDate}
        error={transactionError}
        mode={transactionModalMode}
        title={transactionTitle}
        type={transactionType}
        visible={isTransactionModalVisible}
        onAmountChange={handleTransactionAmountChange}
        onClose={closeTransactionModal}
        onDateChange={handleTransactionDateChange}
        onSubmit={handleSubmitTransaction}
        onTitleChange={setTransactionTitle}
        onTypeChange={setTransactionType}
      />
    </ScrollView>
  );
}

