export function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

export function formatShortDate(value?: string | Date) {
  if (!value) {
    return "";
  }

  const date = value instanceof Date ? value : new Date(`${value}T00:00:00`);

  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(date);
}

export function formatTodayLabel() {
  return `Hoje, ${formatShortDate(new Date())}`;
}

