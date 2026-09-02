import { useAuth } from "@/context/AuthContext";
import { useFinance } from "@/context/FinanceContext";
import { formatCurrency, formatTodayLabel } from "@/utils/formatters";
import { useMemo, useState } from "react";

export function useHomeOverview() {
  const { user, logout } = useAuth();
  const [isBalanceVisible, setIsBalanceVisible] = useState(true);
  const {
    account,
    currentBalance,
    incomeTotal,
    expenseTotal,
    overviewPercentage,
    isLoading,
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

  return {
    account,
    balanceCardDate,
    displayedBalance,
    error,
    expenseTotal,
    firstName,
    incomeTotal,
    isBalanceVisible,
    isLoading,
    logout,
    overviewPercentage,
    setIsBalanceVisible,
    user,
  };
}
