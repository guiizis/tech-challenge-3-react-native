import BalanceCard from "@/components/home/BalanceCard";
import HomeHeader from "@/components/home/HomeHeader";
import OverviewSection from "@/components/home/OverviewSection";
import TransactionFiltersModal from "@/components/home/TransactionFiltersModal";
import TransactionFormModal from "@/components/home/TransactionFormModal";
import TransactionList from "@/components/home/TransactionList";
import TransactionToolbar from "@/components/home/TransactionToolbar";
import { useHomeTransactions } from "@/hooks/useHomeTransactions";
import colors from "@/styles/colors";
import styles from "@/styles/homeStyles";
import { Redirect } from "expo-router";
import { ActivityIndicator, Text, View } from "react-native";

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
    isFiltersModalVisible,
    isLoading,
    isLoadingMoreTransactions,
    isSearching,
    isTransactionModalVisible,
    hasMoreTransactions,
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
    categoryFilter,
    closeTransactionModal,
    handleDeleteTransaction,
    handleEndDateFilterChange,
    handleFilterChange,
    handleStartDateFilterChange,
    handleSubmitTransaction,
    handleTransactionAmountChange,
    handleTransactionDateChange,
    loadMoreTransactions,
    openCreateModal,
    openEditModal,
    resetAdvancedFilters,
    setCategoryFilter,
    setIsFiltersModalVisible,
    setIsBalanceVisible,
    setSearchTerm,
    setSortFilter,
    sortFilter,
    startDateFilter,
    endDateFilter,
    setTransactionTitle,
    setTransactionType,
  } = useHomeTransactions();

  if (!user) {
    return <Redirect href="/login" />;
  }

  const listHeader = (
    <>
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
        onFiltersPress={() => setIsFiltersModalVisible(true)}
        onSearchChange={setSearchTerm}
      />
    </>
  );
  const listFooter = (
    <>
      {!hasMoreTransactions && filteredTransactions.length > 0 ? (
        <Text style={styles.loadingMoreTransactions}>Fim da lista</Text>
      ) : null}
      <OverviewSection
        expenseTotal={expenseTotal}
        incomeTotal={incomeTotal}
        percentage={overviewPercentage}
      />
    </>
  );

  return (
    <View style={styles.screen}>
      <TransactionList
        footer={listFooter}
        header={listHeader}
        isLoadingMore={isLoadingMoreTransactions}
        transactions={filteredTransactions}
        onEndReached={loadMoreTransactions}
        onDelete={handleDeleteTransaction}
        onEdit={openEditModal}
      />

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

      <TransactionFiltersModal
        category={categoryFilter}
        endDate={endDateFilter}
        sort={sortFilter}
        startDate={startDateFilter}
        visible={isFiltersModalVisible}
        onApply={() => setIsFiltersModalVisible(false)}
        onCategoryChange={setCategoryFilter}
        onClose={() => setIsFiltersModalVisible(false)}
        onEndDateChange={handleEndDateFilterChange}
        onReset={resetAdvancedFilters}
        onSortChange={setSortFilter}
        onStartDateChange={handleStartDateFilterChange}
      />
    </View>
  );
}
