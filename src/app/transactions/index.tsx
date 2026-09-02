import TransactionFiltersModal from "@/components/home/TransactionFiltersModal";
import TransactionFormModal from "@/components/home/TransactionFormModal";
import TransactionList from "@/components/home/TransactionList";
import TransactionToolbar from "@/components/home/TransactionToolbar";
import { useTransactions } from "@/hooks/useTransactions";
import colors from "@/styles/colors";
import styles from "@/styles/homeStyles";
import { Redirect, Stack } from "expo-router";
import { ActivityIndicator, Text, View } from "react-native";

export default function TransactionsScreen() {
  const {
    categories,
    categoryFilter,
    error,
    filter,
    filteredTransactions,
    hasMoreTransactions,
    isFiltersModalVisible,
    isLoading,
    isLoadingMoreTransactions,
    isSearching,
    isTransactionModalVisible,
    searchTerm,
    sortFilter,
    startDateFilter,
    endDateFilter,
    transactionAmount,
    transactionCategory,
    transactionDate,
    transactionError,
    transactionModalMode,
    transactionReceiptName,
    transactionReceiptUrl,
    transactionTitle,
    transactionType,
    user,
    applyAdvancedFilters,
    closeFiltersModal,
    closeTransactionModal,
    handleDeleteTransaction,
    handleEndDateFilterChange,
    handleFilterChange,
    handleReceiptUploaded,
    handleStartDateFilterChange,
    handleSubmitTransaction,
    handleTransactionAmountChange,
    handleTransactionDateChange,
    loadMoreTransactions,
    openCreateModal,
    openEditModal,
    openFiltersModal,
    resetAdvancedFilters,
    setCategoryFilter,
    setSearchTerm,
    setSortFilter,
    setTransactionCategory,
    setTransactionTitle,
    setTransactionType,
  } = useTransactions();

  if (!user) {
    return <Redirect href="/login" />;
  }

  const listHeader = (
    <>
      {isLoading ? <ActivityIndicator color={colors.financePrimary} /> : null}
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <TransactionToolbar
        filter={filter}
        isSearching={isSearching}
        searchTerm={searchTerm}
        onAddPress={openCreateModal}
        onFilterChange={handleFilterChange}
        onFiltersPress={openFiltersModal}
        onSearchChange={setSearchTerm}
      />
    </>
  );
  const listFooter =
    !hasMoreTransactions && filteredTransactions.length > 0 ? (
      <Text style={styles.loadingMoreTransactions}>Fim da lista</Text>
    ) : undefined;

  return (
    <View style={styles.screen}>
      <Stack.Screen options={{ title: "Transações" }} />

      <TransactionList
        footer={listFooter}
        header={listHeader}
        isLoading={isSearching}
        isLoadingMore={isLoadingMoreTransactions}
        transactions={filteredTransactions}
        onEndReached={loadMoreTransactions}
        onDelete={handleDeleteTransaction}
        onEdit={openEditModal}
      />

      <TransactionFormModal
        amount={transactionAmount}
        category={transactionCategory}
        categories={categories}
        date={transactionDate}
        error={transactionError}
        mode={transactionModalMode}
        receiptName={transactionReceiptName}
        receiptUrl={transactionReceiptUrl}
        title={transactionTitle}
        type={transactionType}
        visible={isTransactionModalVisible}
        onAmountChange={handleTransactionAmountChange}
        onCategoryChange={setTransactionCategory}
        onClose={closeTransactionModal}
        onDateChange={handleTransactionDateChange}
        onReceiptUploaded={handleReceiptUploaded}
        onSubmit={handleSubmitTransaction}
        onTitleChange={setTransactionTitle}
        onTypeChange={setTransactionType}
      />

      <TransactionFiltersModal
        categories={categories}
        category={categoryFilter}
        endDate={endDateFilter}
        sort={sortFilter}
        startDate={startDateFilter}
        visible={isFiltersModalVisible}
        onApply={applyAdvancedFilters}
        onCategoryChange={setCategoryFilter}
        onClose={closeFiltersModal}
        onEndDateChange={handleEndDateFilterChange}
        onReset={resetAdvancedFilters}
        onSortChange={setSortFilter}
        onStartDateChange={handleStartDateFilterChange}
      />
    </View>
  );
}
