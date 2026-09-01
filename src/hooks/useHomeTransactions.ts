import { useAuth } from "@/context/AuthContext";
import { useFinance } from "@/context/FinanceContext";
import {
  Transaction,
  TransactionFilter,
  TransactionSort,
  TransactionType,
} from "@/types/finance";
import {
  formatBrazilianDateInput,
  formatCurrency,
  formatDateInput,
  formatMoneyInput,
  formatMoneyValueInput,
  formatTodayLabel,
  parseBrazilianDateInput,
  parseMoneyInput,
} from "@/utils/formatters";
import { useEffect, useMemo, useState } from "react";
import { Alert } from "react-native";

function getTodayInputDate() {
  const today = new Date();
  const day = String(today.getDate()).padStart(2, "0");
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const year = today.getFullYear();

  return `${day}/${month}/${year}`;
}

export function useHomeTransactions() {
  const { user, logout } = useAuth();
  const [isBalanceVisible, setIsBalanceVisible] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isFiltersModalVisible, setIsFiltersModalVisible] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState("");
  const [startDateFilter, setStartDateFilter] = useState("");
  const [endDateFilter, setEndDateFilter] = useState("");
  const [sortFilter, setSortFilter] = useState<TransactionSort>("date_desc");
  const [isTransactionModalVisible, setIsTransactionModalVisible] =
    useState(false);
  const [editingTransactionId, setEditingTransactionId] = useState<
    number | null
  >(null);
  const [transactionType, setTransactionType] =
    useState<TransactionType>("income");
  const [transactionTitle, setTransactionTitle] = useState("");
  const [transactionAmount, setTransactionAmount] = useState("");
  const [transactionDate, setTransactionDate] = useState(getTodayInputDate);
  const [transactionDescription, setTransactionDescription] = useState("");
  const [transactionReceiptUrl, setTransactionReceiptUrl] = useState("");
  const [transactionReceiptName, setTransactionReceiptName] = useState("");
  const [transactionError, setTransactionError] = useState("");
  const {
    account,
    currentBalance,
    filteredTransactions,
    filter,
    setFilter,
    searchTransactions,
    loadMoreTransactions,
    clearTransactionSearch,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    incomeTotal,
    expenseTotal,
    overviewPercentage,
    isLoading,
    isLoadingMoreTransactions,
    isSearching,
    hasMoreTransactions,
    error,
  } = useFinance();

  const balance = useMemo(
    () => formatCurrency(currentBalance),
    [currentBalance],
  );
  const displayedBalance = isBalanceVisible ? balance : "R$ ******";
  const firstName = useMemo(() => {
    return user?.name.trim().split(/\s+/)[0] ?? "Usuario";
  }, [user?.name]);
  const balanceCardDate = useMemo(() => formatTodayLabel(), []);
  const transactionModalMode: "create" | "edit" = editingTransactionId
    ? "edit"
    : "create";

  function resetTransactionForm(defaultType: TransactionType = "income") {
    setEditingTransactionId(null);
    setTransactionType(defaultType);
    setTransactionTitle("");
    setTransactionAmount("");
    setTransactionDate(getTodayInputDate());
    setTransactionDescription("");
    setTransactionReceiptUrl("");
    setTransactionReceiptName("");
    setTransactionError("");
  }

  function handleReceiptUploaded(url: string, name: string) {
    setTransactionReceiptUrl(url);
    setTransactionReceiptName(name);
  }

  function closeTransactionModal() {
    setIsTransactionModalVisible(false);
    resetTransactionForm();
  }

  function openCreateModal() {
    const defaultType: TransactionType =
      filter === "expense" ? "expense" : "income";
    resetTransactionForm(defaultType);
    setIsTransactionModalVisible(true);
  }

  function openEditModal(transaction: Transaction) {
    setEditingTransactionId(transaction.id);
    setTransactionType(transaction.type);
    setTransactionTitle(transaction.title);
    setTransactionAmount(formatMoneyValueInput(transaction.amount));
    setTransactionDate(formatBrazilianDateInput(transaction.date));
    setTransactionDescription(transaction.description);
    setTransactionReceiptUrl(transaction.receiptUrl ?? "");
    setTransactionReceiptName(transaction.receiptName ?? "");
    setTransactionError("");
    setIsTransactionModalVisible(true);
  }

  function handleFilterChange(nextFilter: TransactionFilter) {
    setFilter(nextFilter);
  }

  function handleTransactionAmountChange(value: string) {
    setTransactionAmount(formatMoneyInput(value));
  }

  function handleTransactionDateChange(value: string) {
    setTransactionDate(formatDateInput(value));
  }

  function handleStartDateFilterChange(value: string) {
    setStartDateFilter(formatDateInput(value));
  }

  function handleEndDateFilterChange(value: string) {
    setEndDateFilter(formatDateInput(value));
  }

  function resetAdvancedFilters() {
    setCategoryFilter("");
    setStartDateFilter("");
    setEndDateFilter("");
    setSortFilter("date_desc");
    setIsFiltersModalVisible(false);
  }

  async function handleSubmitTransaction() {
    if (!user || !account) {
      setTransactionError("Não foi possível identificar a conta.");
      return;
    }

    const amount = parseMoneyInput(transactionAmount);

    if (!transactionTitle.trim()) {
      setTransactionError("Informe o nome da transação.");
      return;
    }

    if (!Number.isFinite(amount) || amount <= 0) {
      setTransactionError("Informe um valor válido.");
      return;
    }

    setTransactionError("");

    try {
      const transactionInput = {
        userId: user.id,
        accountId: account.id,
        type: transactionType,
        title: transactionTitle,
        category: transactionType === "income" ? "Income" : "Expense",
        amount,
        date: parseBrazilianDateInput(transactionDate),
        description: transactionDescription,
        receiptUrl: transactionReceiptUrl,
        receiptName: transactionReceiptName,
      };

      if (editingTransactionId) {
        await updateTransaction(editingTransactionId, transactionInput);
      } else {
        await createTransaction(transactionInput);

        if (filter !== "all" && filter !== transactionType) {
          setFilter(transactionType);
        }
      }

      setSearchTerm("");
      clearTransactionSearch();
      closeTransactionModal();
    } catch (submitError) {
      setTransactionError(
        submitError instanceof Error
          ? submitError.message
          : "Não foi possível salvar a transação.",
      );
    }
  }

  function handleDeleteTransaction(transaction: Transaction) {
    Alert.alert(
      "Excluir transação",
      `Deseja excluir "${transaction.title}"?`,
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Excluir",
          style: "destructive",
          onPress: async () => {
            await deleteTransaction(transaction.id);
            setSearchTerm("");
            clearTransactionSearch();
          },
        },
      ],
    );
  }

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchTransactions({
        category: categoryFilter,
        endDate: parseBrazilianDateInput(endDateFilter),
        query: searchTerm,
        sort: sortFilter,
        startDate: parseBrazilianDateInput(startDateFilter),
        type: filter,
      });
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [
    categoryFilter,
    endDateFilter,
    filter,
    searchTerm,
    searchTransactions,
    sortFilter,
    startDateFilter,
  ]);

  return {
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
    transactionReceiptName,
    transactionReceiptUrl,
    transactionTitle,
    transactionType,
    user,
    categoryFilter,
    closeTransactionModal,
    handleEndDateFilterChange,
    handleDeleteTransaction,
    handleFilterChange,
    handleReceiptUploaded,
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
  };
}
