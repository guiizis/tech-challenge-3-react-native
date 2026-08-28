import { useAuth } from "@/context/AuthContext";
import { useFinance } from "@/context/FinanceContext";
import { Transaction, TransactionFilter, TransactionType } from "@/types/finance";
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
  const [transactionError, setTransactionError] = useState("");
  const {
    account,
    currentBalance,
    filteredTransactions,
    filter,
    setFilter,
    searchTransactions,
    clearTransactionSearch,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    incomeTotal,
    expenseTotal,
    overviewPercentage,
    isLoading,
    isSearching,
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

  function resetTransactionForm() {
    setEditingTransactionId(null);
    setTransactionType("income");
    setTransactionTitle("");
    setTransactionAmount("");
    setTransactionDate(getTodayInputDate());
    setTransactionDescription("");
    setTransactionError("");
  }

  function closeTransactionModal() {
    setIsTransactionModalVisible(false);
    resetTransactionForm();
  }

  function openCreateModal() {
    resetTransactionForm();
    setIsTransactionModalVisible(true);
  }

  function openEditModal(transaction: Transaction) {
    setEditingTransactionId(transaction.id);
    setTransactionType(transaction.type);
    setTransactionTitle(transaction.title);
    setTransactionAmount(formatMoneyValueInput(transaction.amount));
    setTransactionDate(formatBrazilianDateInput(transaction.date));
    setTransactionDescription(transaction.description);
    setTransactionError("");
    setIsTransactionModalVisible(true);
  }

  function handleFilterChange(nextFilter: TransactionFilter) {
    setFilter(nextFilter);

    if (nextFilter !== "all") {
      setSearchTerm("");
      clearTransactionSearch();
    }
  }

  function handleTransactionAmountChange(value: string) {
    setTransactionAmount(formatMoneyInput(value));
  }

  function handleTransactionDateChange(value: string) {
    setTransactionDate(formatDateInput(value));
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
      };

      if (editingTransactionId) {
        await updateTransaction(editingTransactionId, transactionInput);
      } else {
        await createTransaction(transactionInput);
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
    if (filter !== "all") {
      return;
    }

    const timeoutId = setTimeout(() => {
      if (searchTerm.trim()) {
        searchTransactions(searchTerm, "all");
        return;
      }

      clearTransactionSearch();
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [clearTransactionSearch, filter, searchTerm, searchTransactions]);

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
  };
}
