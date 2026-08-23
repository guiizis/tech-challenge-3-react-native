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
  searchRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 18,
    paddingHorizontal: 34,
  },
  addTransactionButton: {
    alignItems: "center",
    height: 48,
    justifyContent: "center",
    width: 48,
  },
  searchBox: {
    alignItems: "center",
    backgroundColor: colors.surface,
    borderRadius: 4,
    flex: 1,
    flexDirection: "row",
    gap: 12,
    minHeight: 48,
    paddingHorizontal: 12,
  },
  searchInput: {
    color: colors.financePrimary,
    flex: 1,
    fontSize: 24,
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
  emptyTransactions: {
    color: colors.textSubtle,
    fontSize: 14,
    fontWeight: "700",
    paddingVertical: 24,
    textAlign: "center",
  },
  overview: {
    alignItems: "center",
    backgroundColor: colors.surfaceMuted,
    borderRadius: 28,
    gap: 10,
    minHeight: 274,
    padding: 16,
  },
  overviewTitle: {
    alignSelf: "flex-start",
    color: colors.textDark,
    fontSize: 20,
    fontWeight: "800",
  },
  overviewDescription: {
    color: colors.textInactive,
    textAlign: "center",
  },
  logout: {
    color: colors.financePrimary,
    fontWeight: "700",
  },
  modalBackdrop: {
    alignItems: "center",
    backgroundColor: colors.modalBackdrop,
    flex: 1,
    justifyContent: "flex-end",
  },
  transactionModalSheet: {
    backgroundColor: colors.surface,
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    gap: 9,
    maxHeight: "88%",
    padding: 18,
    paddingBottom: 22,
    width: "100%",
  },
  modalContent: {
    gap: 9,
    paddingBottom: 4,
  },
  modalHeader: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  modalTitle: {
    color: colors.financePrimary,
    fontSize: 16,
    fontWeight: "800",
  },
  transactionTypeControl: {
    backgroundColor: colors.surfaceMuted,
    borderRadius: 6,
    flexDirection: "row",
    gap: 6,
    padding: 3,
  },
  transactionTypeOption: {
    alignItems: "center",
    borderRadius: 5,
    flex: 1,
    flexDirection: "row",
    gap: 6,
    justifyContent: "center",
    paddingVertical: 7,
  },
  incomeTypeOptionActive: {
    backgroundColor: colors.surface,
  },
  expenseTypeOptionActive: {
    backgroundColor: colors.surface,
  },
  transactionTypeText: {
    color: colors.textInactive,
    fontSize: 13,
    fontWeight: "700",
  },
  incomeTypeOptionTextActive: {
    color: colors.income,
  },
  expenseTypeOptionTextActive: {
    color: colors.expense,
  },
  modalError: {
    color: colors.danger,
    fontSize: 12,
    fontWeight: "700",
  },
  modalLabel: {
    color: colors.textSubtle,
    fontSize: 11,
    fontWeight: "700",
  },
  modalInput: {
    borderColor: colors.financePrimary,
    borderRadius: 5,
    borderWidth: 1,
    color: colors.textDark,
    minHeight: 38,
    paddingHorizontal: 10,
  },
  incomeInput: {
    borderColor: colors.income,
  },
  expenseInput: {
    borderColor: colors.expense,
  },
  amountInputContainer: {
    alignItems: "center",
    borderRadius: 5,
    borderWidth: 1,
    flexDirection: "row",
    minHeight: 38,
    paddingHorizontal: 10,
  },
  amountPrefix: {
    fontSize: 14,
    fontWeight: "800",
    marginRight: 6,
  },
  amountInput: {
    color: colors.textDark,
    flex: 1,
    minHeight: 36,
  },
  receiptDropZone: {
    alignItems: "center",
    borderColor: colors.inputBorder,
    borderRadius: 12,
    borderStyle: "dashed",
    borderWidth: 1,
    gap: 8,
    justifyContent: "center",
    minHeight: 118,
  },
  receiptDropText: {
    color: colors.textSubtle,
    fontSize: 10,
    lineHeight: 14,
    textAlign: "center",
  },
  modalActions: {
    flexDirection: "row",
    gap: 16,
    justifyContent: "flex-end",
    marginTop: 10,
  },
  modalConfirmButton: {
    backgroundColor: colors.financePrimary,
    borderRadius: 5,
    minWidth: 108,
    paddingVertical: 9,
  },
  modalCancelButton: {
    backgroundColor: colors.financePrimary,
    borderRadius: 5,
    minWidth: 96,
    paddingVertical: 9,
  },
  modalButtonText: {
    color: colors.textLight,
    fontSize: 11,
    fontWeight: "800",
    textAlign: "center",
  },
});
