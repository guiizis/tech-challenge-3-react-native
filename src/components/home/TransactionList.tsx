import colors from "@/styles/colors";
import styles from "@/styles/homeStyles";
import { Transaction, TransactionType } from "@/types/finance";
import { formatCurrency, formatShortDate } from "@/utils/formatters";
import { FontAwesome5 } from "@expo/vector-icons";
import { ReactElement } from "react";
import { FlatList, ListRenderItemInfo, Text, TouchableOpacity, View } from "react-native";

type TransactionListProps = {
  footer?: ReactElement;
  header?: ReactElement;
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
  isLoadingMore = false,
  transactions,
  onDelete,
  onEdit,
  onEndReached,
}: TransactionListProps) {
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
          <Text style={styles.emptyTransactions}>Nenhum resultado encontrado.</Text>
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
