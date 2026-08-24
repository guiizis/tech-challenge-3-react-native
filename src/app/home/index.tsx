import OverviewDonutChart from "@/components/home/OverviewDonutChart";
import { useAuth } from "@/context/AuthContext";
import { useFinance } from "@/context/FinanceContext";
import colors from "@/styles/colors";
import styles from "@/styles/homeStyles";
import { Transaction, TransactionType } from "@/types/finance";
import {
  formatBrazilianDateInput,
  formatCurrency,
  formatDateInput,
  formatMoneyInput,
  formatMoneyValueInput,
  parseBrazilianDateInput,
  parseMoneyInput,
  formatShortDate,
  formatTodayLabel,
} from "@/utils/formatters";
import { FontAwesome5 } from "@expo/vector-icons";
import { Redirect } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

function getAmountStyle(type: TransactionType) {
  return type === "income" ? styles.incomeAmount : styles.expenseAmount;
}

function getTransactionTypeLabel(type: TransactionType) {
  return type === "income" ? "Crédito" : "Débito";
}

function getTransactionIcon(type: TransactionType, category: string) {
  if (category.toLowerCase() === "subscription") {
    return "music";
  }

  return type === "income" ? "briefcase" : "credit-card";
}

function getTodayInputDate() {
  const today = new Date();
  const day = String(today.getDate()).padStart(2, "0");
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const year = today.getFullYear();

  return `${day}/${month}/${year}`;
}

export default function HomeScreen() {
  const { user, logout } = useAuth();
  const [isBalanceVisible, setIsBalanceVisible] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [editingTransactionId, setEditingTransactionId] = useState<
    number | null
  >(null);
  const [newTransactionType, setNewTransactionType] =
    useState<TransactionType>("income");
  const [newTransactionTitle, setNewTransactionTitle] = useState("");
  const [newTransactionAmount, setNewTransactionAmount] = useState("");
  const [newTransactionDate, setNewTransactionDate] =
    useState(getTodayInputDate);
  const [newTransactionDescription, setNewTransactionDescription] =
    useState("");
  const [newTransactionError, setNewTransactionError] = useState("");
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

  function resetNewTransactionForm() {
    setEditingTransactionId(null);
    setNewTransactionType("income");
    setNewTransactionTitle("");
    setNewTransactionAmount("");
    setNewTransactionDate(getTodayInputDate());
    setNewTransactionDescription("");
    setNewTransactionError("");
  }

  function closeCreateModal() {
    setIsCreateModalVisible(false);
    resetNewTransactionForm();
  }

  function openCreateModal() {
    resetNewTransactionForm();
    setIsCreateModalVisible(true);
  }

  function openEditModal(transaction: Transaction) {
    setEditingTransactionId(transaction.id);
    setNewTransactionType(transaction.type);
    setNewTransactionTitle(transaction.title);
    setNewTransactionAmount(formatMoneyValueInput(transaction.amount));
    setNewTransactionDate(formatBrazilianDateInput(transaction.date));
    setNewTransactionDescription(transaction.description);
    setNewTransactionError("");
    setIsCreateModalVisible(true);
  }

  function handleFilterChange(nextFilter: "all" | TransactionType) {
    setFilter(nextFilter);

    if (nextFilter !== "all") {
      setSearchTerm("");
      clearTransactionSearch();
    }
  }

  function handleNewTransactionAmountChange(value: string) {
    setNewTransactionAmount(formatMoneyInput(value));
  }

  function handleNewTransactionDateChange(value: string) {
    setNewTransactionDate(formatDateInput(value));
  }

  async function handleSubmitTransaction() {
    if (!user || !account) {
      setNewTransactionError("Não foi possível identificar a conta.");
      return;
    }

    const amount = parseMoneyInput(newTransactionAmount);

    if (!newTransactionTitle.trim()) {
      setNewTransactionError("Informe o nome da transação.");
      return;
    }

    if (!Number.isFinite(amount) || amount <= 0) {
      setNewTransactionError("Informe um valor valido.");
      return;
    }

    setNewTransactionError("");

    try {
      const transactionInput = {
        userId: user.id,
        accountId: account.id,
        type: newTransactionType,
        title: newTransactionTitle,
        category: newTransactionType === "income" ? "Income" : "Expense",
        amount,
        date: parseBrazilianDateInput(newTransactionDate),
        description: newTransactionDescription,
      };

      if (editingTransactionId) {
        await updateTransaction(editingTransactionId, transactionInput);
      } else {
        await createTransaction(transactionInput);
      }

      setSearchTerm("");
      clearTransactionSearch();
      closeCreateModal();
    } catch (error) {
      setNewTransactionError(
        error instanceof Error
          ? error.message
          : "Não foi possível criar a transação.",
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
          onPress={() => handleFilterChange("income")}
          style={[styles.filter, filter === "income" && styles.filterActive]}
        >
          Entradas
        </Text>
        <Text
          onPress={() => handleFilterChange("expense")}
          style={[styles.filter, filter === "expense" && styles.filterActive]}
        >
          Saídas
        </Text>
        <Text
          onPress={() => handleFilterChange("all")}
          style={[styles.filter, filter === "all" && styles.filterActive]}
        >
          Transações
        </Text>
      </View>

      {filter === "all" ? (
        <View style={styles.searchRow}>
          <TouchableOpacity
            accessibilityLabel="Adicionar transação"
            accessibilityRole="button"
            onPress={openCreateModal}
            style={styles.addTransactionButton}
          >
            <FontAwesome5 name="plus" size={24} color={colors.financePrimary} />
          </TouchableOpacity>

          <View style={styles.searchBox}>
            <TextInput
              accessibilityLabel="Pesquisar transação"
              onChangeText={setSearchTerm}
              placeholder="Pesquisar"
              placeholderTextColor={colors.financePrimary}
              style={styles.searchInput}
              value={searchTerm}
            />
            {isSearching ? (
              <ActivityIndicator color={colors.financePrimary} size="small" />
            ) : (
              <FontAwesome5
                name="search"
                size={24}
                color={colors.financePrimary}
              />
            )}
          </View>
        </View>
      ) : null}

      <View style={styles.transactions}>
        {filteredTransactions.length === 0 ? (
          <Text style={styles.emptyTransactions}>
            Nenhum resultado encontrado.
          </Text>
        ) : null}

        {filteredTransactions.map((transaction) => (
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
                {getTransactionTypeLabel(transaction.type)}
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
              <View style={styles.transactionActions}>
                <TouchableOpacity
                  accessibilityLabel={`Editar ${transaction.title}`}
                  accessibilityRole="button"
                  onPress={() => openEditModal(transaction)}
                  style={styles.transactionActionButton}
                >
                  <FontAwesome5
                    name="edit"
                    size={15}
                    color={colors.financePrimary}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  accessibilityLabel={`Excluir ${transaction.title}`}
                  accessibilityRole="button"
                  onPress={() => handleDeleteTransaction(transaction)}
                  style={styles.transactionActionButton}
                >
                  <FontAwesome5
                    name="trash-alt"
                    size={15}
                    color={colors.financePrimary}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        ))}
      </View>

      <View style={styles.overview}>
        <Text style={styles.overviewTitle}>Overview</Text>
        <OverviewDonutChart percentage={overviewPercentage} />
        <Text style={styles.overviewDescription}>
          Entradas {formatCurrency(incomeTotal)} / Saídas{" "}
          {formatCurrency(expenseTotal)}
        </Text>
      </View>

      <Text onPress={logout} style={styles.logout}>
        Sair
      </Text>

      <Modal
        animationType="slide"
        onRequestClose={closeCreateModal}
        transparent
        visible={isCreateModalVisible}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          keyboardVerticalOffset={Platform.OS === "ios" ? 24 : 0}
          style={styles.modalBackdrop}
        >
          <View style={styles.transactionModalSheet}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>
                {editingTransactionId ? "Editar Transação" : "Nova Transação"}
              </Text>
              <TouchableOpacity
                accessibilityLabel="Fechar nova transação"
                accessibilityRole="button"
                onPress={closeCreateModal}
              >
                <FontAwesome5
                  name="times"
                  size={18}
                  color={colors.financePrimary}
                />
              </TouchableOpacity>
            </View>

            <ScrollView
              contentContainerStyle={styles.modalContent}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
            >
            <View style={styles.transactionTypeControl}>
              <TouchableOpacity
                accessibilityRole="button"
                onPress={() => setNewTransactionType("income")}
                style={[
                  styles.transactionTypeOption,
                  newTransactionType === "income" &&
                    styles.incomeTypeOptionActive,
                ]}
              >
                <FontAwesome5
                  name="plus-circle"
                  size={13}
                  color={
                    newTransactionType === "income"
                      ? colors.income
                      : colors.textInactive
                  }
                />
                <Text
                  style={[
                    styles.transactionTypeText,
                    newTransactionType === "income" &&
                      styles.incomeTypeOptionTextActive,
                  ]}
                >
                  Entrada
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                accessibilityRole="button"
                onPress={() => setNewTransactionType("expense")}
                style={[
                  styles.transactionTypeOption,
                  newTransactionType === "expense" &&
                    styles.expenseTypeOptionActive,
                ]}
              >
                <FontAwesome5
                  name="arrow-circle-down"
                  size={13}
                  color={
                    newTransactionType === "expense"
                      ? colors.expense
                      : colors.textInactive
                  }
                />
                <Text
                  style={[
                    styles.transactionTypeText,
                    newTransactionType === "expense" &&
                      styles.expenseTypeOptionTextActive,
                  ]}
                >
                  Saída
                </Text>
              </TouchableOpacity>
            </View>

            {newTransactionError ? (
              <Text style={styles.modalError}>{newTransactionError}</Text>
            ) : null}

            <Text style={styles.modalLabel}>VALOR:</Text>
            <View
              style={[
                styles.amountInputContainer,
                newTransactionType === "income"
                  ? styles.incomeInput
                  : styles.expenseInput,
              ]}
            >
              <Text
                style={[
                  styles.amountPrefix,
                  newTransactionType === "income"
                    ? styles.incomeAmount
                    : styles.expenseAmount,
                ]}
              >
                R$
              </Text>
              <TextInput
                keyboardType="decimal-pad"
                onChangeText={handleNewTransactionAmountChange}
                placeholder="0,00"
                style={styles.amountInput}
                value={newTransactionAmount}
              />
            </View>

            <Text style={styles.modalLabel}>DATA:</Text>
            <TextInput
              keyboardType="number-pad"
              maxLength={10}
              onChangeText={handleNewTransactionDateChange}
              placeholder="DD/MM/AAAA"
              style={[
                styles.modalInput,
                newTransactionType === "income"
                  ? styles.incomeInput
                  : styles.expenseInput,
              ]}
              value={newTransactionDate}
            />

            <Text style={styles.modalLabel}>DESCRIÇÃO:</Text>
            <TextInput
              onChangeText={setNewTransactionTitle}
              placeholder="Nome da transação"
              style={[
                styles.modalInput,
                newTransactionType === "income"
                  ? styles.incomeInput
                  : styles.expenseInput,
              ]}
              value={newTransactionTitle}
            />

            <Text style={styles.modalLabel}>COMPROVANTE:</Text>
            <View style={styles.receiptDropZone}>
              <FontAwesome5 name="folder" size={20} color={colors.textSubtle} />
              <Text style={styles.receiptDropText}>
                Click to browse or{"\n"}drag and drop your files
              </Text>
            </View>

            <View style={styles.modalActions}>
              <TouchableOpacity
                onPress={handleSubmitTransaction}
                style={styles.modalConfirmButton}
              >
                <Text style={styles.modalButtonText}>CONFIRMAR</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={closeCreateModal}
                style={styles.modalCancelButton}
              >
                <Text style={styles.modalButtonText}>CANCELAR</Text>
              </TouchableOpacity>
            </View>
            </ScrollView>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </ScrollView>
  );
}
