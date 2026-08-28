export type Account = {
  id: number;
  userId: number;
  type: string;
  initialBalance: number;
  balance: number;
  currency: string;
  agency: string;
  number: string;
};

export type Card = {
  id: number;
  userId: number;
  accountId: number;
  brand: string;
  lastFourDigits: string;
  holderName: string;
  limit: number;
  availableLimit: number;
};

export type TransactionType = "income" | "expense";

export type Transaction = {
  id: number;
  userId: number;
  accountId: number;
  type: TransactionType;
  title: string;
  category: string;
  amount: number;
  date: string;
  description: string;
};

export type TransactionFilter = "all" | TransactionType;

export type TransactionInput = Omit<Transaction, "id">;
