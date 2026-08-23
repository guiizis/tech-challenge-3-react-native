import { useAuth } from "@/context/AuthContext";
import {
  createTransaction as createTransactionRequest,
  deleteTransaction as deleteTransactionRequest,
  getAccountByUserId,
  getCardByUserId,
  getTransactionsByUserId,
  searchTransactionsByUserId,
  updateTransaction as updateTransactionRequest,
} from "@/services/financeApi";
import {
  Account,
  Card,
  Transaction,
  TransactionFilter,
  TransactionInput,
} from "@/types/finance";
import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
} from "react";

type FinanceState = {
  account: Account | null;
  card: Card | null;
  transactions: Transaction[];
  searchResults: Transaction[] | null;
  selectedTransaction: Transaction | null;
  filter: TransactionFilter;
  isLoading: boolean;
  isSearching: boolean;
  error: string;
};

type FinanceAction =
  | { type: "LOAD_FINANCE_START" }
  | {
      type: "LOAD_FINANCE_SUCCESS";
      payload: {
        account: Account | null;
        card: Card | null;
        transactions: Transaction[];
      };
    }
  | { type: "LOAD_FINANCE_ERROR"; payload: string }
  | { type: "SET_TRANSACTION_FILTER"; payload: TransactionFilter }
  | { type: "SEARCH_TRANSACTIONS_START" }
  | { type: "SEARCH_TRANSACTIONS_SUCCESS"; payload: Transaction[] }
  | { type: "SEARCH_TRANSACTIONS_ERROR"; payload: string }
  | { type: "CLEAR_TRANSACTION_SEARCH" }
  | { type: "CREATE_TRANSACTION_SUCCESS"; payload: Transaction }
  | { type: "UPDATE_TRANSACTION_SUCCESS"; payload: Transaction }
  | { type: "DELETE_TRANSACTION_SUCCESS"; payload: number }
  | { type: "SELECT_TRANSACTION"; payload: Transaction }
  | { type: "CLEAR_SELECTED_TRANSACTION" }
  | { type: "RESET_FINANCE" };

type FinanceContextValue = FinanceState & {
  filteredTransactions: Transaction[];
  currentBalance: number;
  incomeTotal: number;
  expenseTotal: number;
  overviewPercentage: number;
  setFilter: (filter: TransactionFilter) => void;
  searchTransactions: (
    query: string,
    type?: TransactionFilter,
  ) => Promise<void>;
  clearTransactionSearch: () => void;
  refreshFinance: () => Promise<void>;
  createTransaction: (input: TransactionInput) => Promise<Transaction>;
  updateTransaction: (
    transactionId: number,
    input: Partial<TransactionInput>,
  ) => Promise<Transaction>;
  deleteTransaction: (transactionId: number) => Promise<void>;
  selectTransaction: (transaction: Transaction) => void;
  clearSelectedTransaction: () => void;
};

const initialState: FinanceState = {
  account: null,
  card: null,
  transactions: [],
  searchResults: null,
  selectedTransaction: null,
  filter: "all",
  isLoading: false,
  isSearching: false,
  error: "",
};

const FinanceContext = createContext<FinanceContextValue | null>(null);

function financeReducer(
  state: FinanceState,
  action: FinanceAction,
): FinanceState {
  switch (action.type) {
    case "LOAD_FINANCE_START":
      return { ...state, isLoading: true, error: "" };
    case "LOAD_FINANCE_SUCCESS":
      return {
        ...state,
        ...action.payload,
        searchResults: null,
        isLoading: false,
        error: "",
      };
    case "LOAD_FINANCE_ERROR":
      return { ...state, isLoading: false, error: action.payload };
    case "SET_TRANSACTION_FILTER":
      return { ...state, filter: action.payload };
    case "SEARCH_TRANSACTIONS_START":
      return { ...state, isSearching: true, error: "" };
    case "SEARCH_TRANSACTIONS_SUCCESS":
      return {
        ...state,
        searchResults: action.payload,
        isSearching: false,
        error: "",
      };
    case "SEARCH_TRANSACTIONS_ERROR":
      return { ...state, isSearching: false, error: action.payload };
    case "CLEAR_TRANSACTION_SEARCH":
      return { ...state, searchResults: null, isSearching: false, error: "" };
    case "CREATE_TRANSACTION_SUCCESS":
      return {
        ...state,
        searchResults: null,
        transactions: [action.payload, ...state.transactions],
      };
    case "UPDATE_TRANSACTION_SUCCESS":
      return {
        ...state,
        transactions: state.transactions.map((transaction) =>
          transaction.id === action.payload.id ? action.payload : transaction,
        ),
        searchResults: null,
        selectedTransaction:
          state.selectedTransaction?.id === action.payload.id
            ? action.payload
            : state.selectedTransaction,
      };
    case "DELETE_TRANSACTION_SUCCESS":
      return {
        ...state,
        transactions: state.transactions.filter(
          (transaction) => transaction.id !== action.payload,
        ),
        searchResults: null,
        selectedTransaction:
          state.selectedTransaction?.id === action.payload
            ? null
            : state.selectedTransaction,
      };
    case "SELECT_TRANSACTION":
      return { ...state, selectedTransaction: action.payload };
    case "CLEAR_SELECTED_TRANSACTION":
      return { ...state, selectedTransaction: null };
    case "RESET_FINANCE":
      return initialState;
    default:
      return state;
  }
}

export function FinanceProvider({ children }: PropsWithChildren) {
  const { user } = useAuth();
  const [state, dispatch] = useReducer(financeReducer, initialState);

  const refreshFinance = useCallback(async () => {
    if (!user) {
      dispatch({ type: "RESET_FINANCE" });
      return;
    }

    dispatch({ type: "LOAD_FINANCE_START" });

    try {
      const [account, card, transactions] = await Promise.all([
        getAccountByUserId(user.id),
        getCardByUserId(user.id),
        getTransactionsByUserId(user.id),
      ]);

      dispatch({
        type: "LOAD_FINANCE_SUCCESS",
        payload: { account, card, transactions },
      });
    } catch (error) {
      dispatch({
        type: "LOAD_FINANCE_ERROR",
        payload:
          error instanceof Error
            ? error.message
            : "Nao foi possivel carregar os dados financeiros.",
      });
    }
  }, [user]);

  useEffect(() => {
    refreshFinance();
  }, [refreshFinance]);

  async function createTransaction(input: TransactionInput) {
    const transaction = await createTransactionRequest(input);
    dispatch({ type: "CREATE_TRANSACTION_SUCCESS", payload: transaction });
    return transaction;
  }

  async function updateTransaction(
    transactionId: number,
    input: Partial<TransactionInput>,
  ) {
    const transaction = await updateTransactionRequest(transactionId, input);
    dispatch({ type: "UPDATE_TRANSACTION_SUCCESS", payload: transaction });
    return transaction;
  }

  async function deleteTransaction(transactionId: number) {
    await deleteTransactionRequest(transactionId);
    dispatch({ type: "DELETE_TRANSACTION_SUCCESS", payload: transactionId });
  }

  function setFilter(filter: TransactionFilter) {
    dispatch({ type: "SET_TRANSACTION_FILTER", payload: filter });
  }

  const searchTransactions = useCallback(async (
    query: string,
    type: TransactionFilter = state.filter,
  ) => {
    if (!user) {
      dispatch({ type: "CLEAR_TRANSACTION_SEARCH" });
      return;
    }

    const normalizedQuery = query.trim();

    if (!normalizedQuery) {
      dispatch({ type: "CLEAR_TRANSACTION_SEARCH" });
      return;
    }

    dispatch({ type: "SEARCH_TRANSACTIONS_START" });

    try {
      const transactions = await searchTransactionsByUserId(
        user.id,
        normalizedQuery,
        type,
      );

      dispatch({ type: "SEARCH_TRANSACTIONS_SUCCESS", payload: transactions });
    } catch (error) {
      dispatch({
        type: "SEARCH_TRANSACTIONS_ERROR",
        payload:
          error instanceof Error
            ? error.message
            : "Nao foi possivel pesquisar as transacoes.",
      });
    }
  }, [state.filter, user]);

  const clearTransactionSearch = useCallback(() => {
    dispatch({ type: "CLEAR_TRANSACTION_SEARCH" });
  }, []);

  function selectTransaction(transaction: Transaction) {
    dispatch({ type: "SELECT_TRANSACTION", payload: transaction });
  }

  function clearSelectedTransaction() {
    dispatch({ type: "CLEAR_SELECTED_TRANSACTION" });
  }

  const filteredTransactions = useMemo(() => {
    const transactions = state.searchResults ?? state.transactions;

    if (state.filter === "all") {
      return transactions;
    }

    return transactions.filter(
      (transaction) => transaction.type === state.filter,
    );
  }, [state.filter, state.searchResults, state.transactions]);

  const { incomeTotal, expenseTotal } = useMemo(() => {
    return state.transactions.reduce(
      (totals, transaction) => {
        if (transaction.type === "income") {
          return {
            ...totals,
            incomeTotal: totals.incomeTotal + transaction.amount,
          };
        }

        return {
          ...totals,
          expenseTotal: totals.expenseTotal + transaction.amount,
        };
      },
      { incomeTotal: 0, expenseTotal: 0 },
    );
  }, [state.transactions]);

  const overviewPercentage = useMemo(() => {
    const total = incomeTotal + expenseTotal;

    if (total === 0) {
      return 0;
    }

    return Math.round((incomeTotal / total) * 100);
  }, [expenseTotal, incomeTotal]);

  const currentBalance = useMemo(() => {
    const initialBalance =
      state.account?.initialBalance ?? state.account?.balance ?? 0;

    return initialBalance + incomeTotal - expenseTotal;
  }, [expenseTotal, incomeTotal, state.account]);

  const value = useMemo(
    () => ({
      ...state,
      filteredTransactions,
      currentBalance,
      incomeTotal,
      expenseTotal,
      overviewPercentage,
      setFilter,
      searchTransactions,
      clearTransactionSearch,
      refreshFinance,
      createTransaction,
      updateTransaction,
      deleteTransaction,
      selectTransaction,
      clearSelectedTransaction,
    }),
    [
      currentBalance,
      expenseTotal,
      filteredTransactions,
      incomeTotal,
      overviewPercentage,
      refreshFinance,
      searchTransactions,
      clearTransactionSearch,
      state,
    ],
  );

  return (
    <FinanceContext.Provider value={value}>{children}</FinanceContext.Provider>
  );
}

export function useFinance() {
  const context = useContext(FinanceContext);

  if (!context) {
    throw new Error("useFinance deve ser usado dentro de FinanceProvider.");
  }

  return context;
}
