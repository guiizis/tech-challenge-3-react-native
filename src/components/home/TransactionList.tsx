import colors from "@/styles/colors";
import styles from "@/styles/homeStyles";
import { Transaction, TransactionType } from "@/types/finance";
import { formatCurrency, formatShortDate } from "@/utils/formatters";
import { FontAwesome5 } from "@expo/vector-icons";
import { ReactElement } from "react";
import {
  ActivityIndicator,
  FlatList,
  Linking,
  ListRenderItemInfo,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type TransactionListProps = {
  footer?: ReactElement;
  header?: ReactElement;
  isLoading?: boolean;
  isLoadingMore?: boolean;
  transactions: Transaction[];
  onDelete: (transaction: Transaction) => void;
  onEdit: (transaction: Transaction) => void;
  onEndReached?: () => void;
};

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

export default function TransactionList({
  footer,
  header,
  isLoading = false,
  isLoadingMore = false,
  transactions,
  onDelete,
  onEdit,
  onEndReached,
}: TransactionListProps) {
  function handleDownloadReceipt(transaction: Transaction) {
    if (transaction.receiptUrl) {
      Linking.openURL(transaction.receiptUrl);
    }
  }

  function renderTransaction({ item: transaction }: ListRenderItemInfo<Transaction>) {
    return (
      <View style={styles.transactionCard}>
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
            style={[styles.transactionAmount, getAmountStyle(transaction.type)]}
          >
            {transaction.type === "income" ? "+" : "-"}{" "}
            {formatCurrency(transaction.amount)}
          </Text>
          <Text style={styles.transactionDate}>
            {formatShortDate(transaction.date)}
          </Text>
          <View style={styles.transactionActions}>
            {transaction.receiptUrl ? (
              <TouchableOpacity
                accessibilityLabel={`Baixar comprovante de ${transaction.title}`}
                accessibilityRole="button"
                onPress={() => handleDownloadReceipt(transaction)}
                style={styles.transactionActionButton}
              >
                <FontAwesome5
                  name="download"
                  size={15}
                  color={colors.financePrimary}
                />
              </TouchableOpacity>
            ) : null}
            <TouchableOpacity
              accessibilityLabel={`Editar ${transaction.title}`}
              accessibilityRole="button"
              onPress={() => onEdit(transaction)}
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
              onPress={() => onDelete(transaction)}
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
    );
  }

  return (
    <FlatList
      contentContainerStyle={styles.container}
      data={transactions}
      keyExtractor={(transaction) => String(transaction.id)}
      ListEmptyComponent={
        <View style={styles.transactions}>
          {isLoading ? (
            <ActivityIndicator color={colors.financePrimary} />
          ) : (
            <Text style={styles.emptyTransactions}>
              Nenhum resultado encontrado.
            </Text>
          )}
        </View>
      }
      ListFooterComponent={
        <>
          {isLoadingMore ? (
            <Text style={styles.loadingMoreTransactions}>Carregando mais...</Text>
          ) : null}
          {footer}
        </>
      }
      ListHeaderComponent={header}
      onEndReached={onEndReached}
      onEndReachedThreshold={0.4}
      renderItem={renderTransaction}
      showsVerticalScrollIndicator={false}
      style={styles.transactionList}
    />
  );
}
