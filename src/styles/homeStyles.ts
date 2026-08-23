import { StyleSheet } from "react-native";
import colors from "./colors";

export default StyleSheet.create({
  container: {
    backgroundColor: colors.appBackground,
    gap: 18,
    padding: 16,
    paddingTop: 28,
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
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
  avatar: {
    backgroundColor: colors.surface,
    borderRadius: 8,
    height: 48,
    width: 48,
  },
  balanceCard: {
    backgroundColor: colors.financePrimary,
    borderRadius: 8,
    gap: 12,
    minHeight: 252,
    padding: 16,
  },
  balanceHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  balanceGreeting: {
    color: colors.textLight,
    fontSize: 18,
  },
  balanceDate: {
    color: colors.textLight,
    fontSize: 10,
  },
  balanceLabelRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 10,
    marginTop: 18,
  },
  balanceLabel: {
    color: colors.textLight,
    fontSize: 20,
    fontWeight: "800",
  },
  balanceVisibilityButton: {
    alignItems: "center",
    height: 32,
    justifyContent: "center",
    width: 32,
  },
  balanceDivider: {
    backgroundColor: colors.textLight,
    height: 2,
    width: 122,
  },
  accountType: {
    color: colors.textLight,
    fontSize: 18,
    fontWeight: "800",
  },
  balance: {
    color: colors.textLight,
    fontSize: 40,
    fontWeight: "800",
  },
  error: {
    color: colors.danger,
  },
  filters: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    paddingHorizontal: 12,
  },
  filter: {
    color: colors.textInactive,
    fontSize: 14,
  },
  filterActive: {
    color: colors.financePrimary,
    fontWeight: "700",
  },
  transactions: {
    backgroundColor: colors.surface,
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  transactionCard: {
    alignItems: "center",
    borderBottomColor: colors.appBackground,
    borderBottomWidth: 1,
    flexDirection: "row",
    gap: 14,
    paddingVertical: 12,
  },
  transactionIcon: {
    alignItems: "center",
    backgroundColor: colors.iconBackground,
    borderRadius: 6,
    height: 38,
    justifyContent: "center",
    width: 42,
  },
  transactionInfo: {
    flex: 1,
    gap: 4,
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
    textAlign: "right",
  },
  incomeAmount: {
    color: colors.income,
  },
  expenseAmount: {
    color: colors.expense,
  },
  transactionMeta: {
    alignItems: "flex-end",
    gap: 4,
  },
  transactionDate: {
    color: colors.textSubtle,
    fontSize: 12,
  },
  overview: {
    backgroundColor: colors.surfaceMuted,
    borderRadius: 28,
    minHeight: 274,
    padding: 16,
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
