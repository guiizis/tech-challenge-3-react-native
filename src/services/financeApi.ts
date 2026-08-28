import { env } from "@/config/env";
import {
  Account,
  Card,
  PaginatedTransactionsResponse,
  Transaction,
  TransactionInput,
  TransactionSearchFilters,
} from "@/types/finance";

async function parseApiResponse<T>(response: Response, fallbackMessage: string) {
  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message ?? fallbackMessage);
  }

  return data as T;
}

export async function getAccountByUserId(userId: number) {
  const response = await fetch(`${env.apiUrl}/accounts?userId=${userId}`);
  const accounts = await parseApiResponse<Account[]>(
    response,
    "Nao foi possivel carregar a conta.",
  );

  return accounts[0] ?? null;
}

export async function getCardByUserId(userId: number) {
  const response = await fetch(`${env.apiUrl}/cards?userId=${userId}`);
  const cards = await parseApiResponse<Card[]>(
    response,
    "Nao foi possivel carregar o cartao.",
  );

  return cards[0] ?? null;
}

export async function getTransactionsByUserId(userId: number) {
  const response = await fetch(
    `${env.apiUrl}/transactions?userId=${userId}&_sort=date&_order=desc`,
  );

  return parseApiResponse<Transaction[]>(
    response,
    "Nao foi possivel carregar as transacoes.",
  );
}

export async function searchTransactionsByFilters(
  userId: number,
  filters: TransactionSearchFilters = {},
) {
  const params = new URLSearchParams({
    userId: String(userId),
    q: filters.query?.trim() ?? "",
    type: filters.type ?? "all",
    _page: String(filters.page ?? 1),
    _limit: "6",
  });

  if (filters.category?.trim()) {
    params.set("category", filters.category.trim());
  }

  if (filters.startDate) {
    params.set("startDate", filters.startDate);
  }

  if (filters.endDate) {
    params.set("endDate", filters.endDate);
  }

  if (filters.sort) {
    params.set("sort", filters.sort);
  }

  const response = await fetch(`${env.apiUrl}/transactions/search?${params}`);

  return parseApiResponse<PaginatedTransactionsResponse>(
    response,
    "Nao foi possivel pesquisar as transacoes.",
  );
}

export async function createTransaction(input: TransactionInput) {
  const response = await fetch(`${env.apiUrl}/transactions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  return parseApiResponse<Transaction>(
    response,
    "Nao foi possivel criar a transacao.",
  );
}

export async function updateTransaction(
  transactionId: number,
  input: Partial<TransactionInput>,
) {
  const response = await fetch(`${env.apiUrl}/transactions/${transactionId}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  return parseApiResponse<Transaction>(
    response,
    "Nao foi possivel atualizar a transacao.",
  );
}

export async function deleteTransaction(transactionId: number) {
  const response = await fetch(`${env.apiUrl}/transactions/${transactionId}`, {
    method: "DELETE",
  });

  await parseApiResponse<Record<string, never>>(
    response,
    "Nao foi possivel remover a transacao.",
  );
}
