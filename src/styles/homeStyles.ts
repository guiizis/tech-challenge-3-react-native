import { StyleSheet } from "react-native";
import colors from "./colors";

export default StyleSheet.create({
  container: {
    backgroundColor: colors.appBackground,
    gap: 16,
    padding: 24,
    paddingTop: 64,
  },
  headerLabel: {
    color: colors.textSoft,
    fontSize: 14,
  },
  headerName: {
    color: colors.textDark,
    fontSize: 18,
    fontWeight: "700",
  },
  balanceCard: {
    backgroundColor: colors.financePrimary,
    borderRadius: 8,
    gap: 10,
    padding: 20,
  },
  balanceGreeting: {
    color: colors.textLight,
    fontSize: 16,
  },
  accountType: {
    color: colors.textLight,
    fontSize: 14,
  },
  balance: {
    color: colors.textLight,
    fontSize: 36,
    fontWeight: "800",
  },
  cardInfo: {
    color: colors.financePrimarySoft,
    fontSize: 12,
  },
  error: {
    color: colors.danger,
  },
  filters: {
    flexDirection: "row",
    gap: 12,
  },
  filter: {
    color: colors.textInactive,
  },
  filterActive: {
    color: colors.financePrimary,
    fontWeight: "700",
  },
  transactions: {
    gap: 12,
  },
  transactionCard: {
    backgroundColor: colors.surface,
    borderRadius: 8,
    padding: 14,
  },
  transactionTitle: {
    color: colors.textDark,
    fontWeight: "700",
  },
  transactionCategory: {
    color: colors.textSubtle,
  },
  transactionAmount: {
    fontWeight: "700",
  },
  incomeAmount: {
    color: colors.income,
  },
  expenseAmount: {
    color: colors.expense,
  },
  overview: {
    backgroundColor: colors.surfaceMuted,
    borderRadius: 8,
    padding: 18,
  },
  overviewTitle: {
    color: colors.textDark,
    fontSize: 20,
    fontWeight: "800",
  },
  overviewValue: {
    color: colors.textDark,
    fontSize: 32,
    fontWeight: "800",
  },
  overviewDescription: {
    color: colors.textInactive,
  },
  logout: {
    color: colors.financePrimary,
    fontWeight: "700",
  },
});

