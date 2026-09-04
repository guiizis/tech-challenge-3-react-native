import { useAuth } from "@/context/AuthContext";
import { useFinance } from "@/context/FinanceContext";
import { getCategories } from "@/services/financeApi";
import {
  Category,
  Transaction,
  TransactionFilter,
  TransactionSort,
  TransactionType,
} from "@/types/finance";
import {
  formatBrazilianDateInput,
  formatDateInput,
  formatMoneyInput,
  formatMoneyValueInput,
  parseBrazilianDateInput,
  parseMoneyInput,
} from "@/utils/formatters";
import { useEffect, useState } from "react";
import { Alert } from "react-native";

function getTodayInputDate() {
  const today = new Date();
  const day = String(today.getDate()).padStart(2, "0");
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const year = today.getFullYear();

  return `${day}/${month}/${year}`;
}

export function useTransactions() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [isFiltersModalVisible, setIsFiltersModalVisible] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState("");
  const [categories, setCategories] = useState<Category[]>([]);
  const [startDateFilter, setStartDateFilter] = useState("");
  const [endDateFilter, setEndDateFilter] = useState("");
  const [sortFilter, setSortFilter] = useState<TransactionSort>("date_desc");
  const [appliedCategoryFilter, setAppliedCategoryFilter] = useState("");
  const [appliedStartDateFilter, setAppliedStartDateFilter] = useState("");
  const [appliedEndDateFilter, setAppliedEndDateFilter] = useState("");
  const [appliedSortFilter, setAppliedSortFilter] =
    useState<TransactionSort>("date_desc");
  const [isTransactionModalVisible, setIsTransactionModalVisible] =
    useState(false);
  const [editingTransactionId, setEditingTransactionId] = useState<
    number | null
  >(null);
  const [transactionType, setTransactionType] =
    useState<TransactionType>("income");
  const [transactionTitle, setTransactionTitle] = useState("");
  const [transactionCategory, setTransactionCategory] = useState("");
  const [transactionAmount, setTransactionAmount] = useState("");
  const [transactionDate, setTransactionDate] = useState(getTodayInputDate);
  const [transactionDescription, setTransactionDescription] = useState("");
  const [transactionReceiptUrl, setTransactionReceiptUrl] = useState("");
  const [transactionReceiptName, setTransactionReceiptName] = useState("");
  const [transactionError, setTransactionError] = useState("");
  const {
    account,
    filteredTransactions,
    filter,
    setFilter,
    searchTransactions,
    loadMoreTransactions,
    clearTransactionSearch,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    isLoading,
    isLoadingMoreTransactions,
    isSearching,
    hasMoreTransactions,
    error,
  } = useFinance();

  const transactionModalMode: "create" | "edit" = editingTransactionId
    ? "edit"
    : "create";

  function resetTransactionForm(defaultType: TransactionType = "income") {
    setEditingTransactionId(null);
    setTransactionType(defaultType);
    setTransactionTitle("");
    setTransactionCategory("");
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
    setTransactionCategory(transaction.category);
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

  function openFiltersModal() {
    setCategoryFilter(appliedCategoryFilter);
    setStartDateFilter(appliedStartDateFilter);
    setEndDateFilter(appliedEndDateFilter);
    setSortFilter(appliedSortFilter);
    setIsFiltersModalVisible(true);
  }

  function closeFiltersModal() {
    setCategoryFilter(appliedCategoryFilter);
    setStartDateFilter(appliedStartDateFilter);
    setEndDateFilter(appliedEndDateFilter);
    setSortFilter(appliedSortFilter);
    setIsFiltersModalVisible(false);
  }

  function applyAdvancedFilters() {
    setAppliedCategoryFilter(categoryFilter);
    setAppliedStartDateFilter(startDateFilter);
    setAppliedEndDateFilter(endDateFilter);
    setAppliedSortFilter(sortFilter);
    setIsFiltersModalVisible(false);
  }

  function resetAdvancedFilters() {
    setCategoryFilter("");
    setStartDateFilter("");
    setEndDateFilter("");
    setSortFilter("date_desc");
    setAppliedCategoryFilter("");
    setAppliedStartDateFilter("");
    setAppliedEndDateFilter("");
    setAppliedSortFilter("date_desc");
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

    if (!transactionCategory) {
      setTransactionError("Selecione uma categoria.");
      return;
    }

    if (!Number.isFinite(amount) || amount <= 0) {
      setTransactionError("Informe um valor válido.");
      return;
    }

    if (!/^\d{2}\/\d{2}\/\d{4}$/.test(transactionDate)) {
      setTransactionError("Informe uma data válida.");
      return;
    }

    setTransactionError("");

    try {
      const transactionInput = {
        userId: user.id,
        accountId: account.id,
        type: transactionType,
        title: transactionTitle,
        category: transactionCategory,
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
    getCategories()
      .then(setCategories)
      .catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchTransactions({
        category: appliedCategoryFilter,
        endDate: parseBrazilianDateInput(appliedEndDateFilter),
        query: searchTerm,
        sort: appliedSortFilter,
        startDate: parseBrazilianDateInput(appliedStartDateFilter),
        type: filter,
      });
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [
    appliedCategoryFilter,
    appliedEndDateFilter,
    appliedSortFilter,
    appliedStartDateFilter,
    filter,
    searchTerm,
    searchTransactions,
  ]);

  return {
    error,
    filter,
    filteredTransactions,
    isFiltersModalVisible,
    isLoading,
    isLoadingMoreTransactions,
    isSearching,
    isTransactionModalVisible,
    hasMoreTransactions,
    searchTerm,
    transactionAmount,
    transactionDate,
    transactionError,
    transactionModalMode,
    transactionCategory,
    transactionReceiptName,
    transactionReceiptUrl,
    transactionTitle,
    transactionType,
    user,
    categories,
    categoryFilter,
    applyAdvancedFilters,
    closeFiltersModal,
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
    openFiltersModal,
    resetAdvancedFilters,
    setCategoryFilter,
    setSearchTerm,
    setSortFilter,
    sortFilter,
    startDateFilter,
    endDateFilter,
    setTransactionCategory,
    setTransactionTitle,
    setTransactionType,
  };
}
