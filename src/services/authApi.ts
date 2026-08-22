import { env } from "@/config/env";

export type LoginInput = {
  email: string;
  password: string;
};

export type LoginResponse = {
  user: {
    id: number;
    name: string;
    email: string;
    avatarUrl: string;
    accountId: number;
  };
};

export async function login(input: LoginInput) {
  const response = await fetch(`${env.apiUrl}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: input.email.trim(),
      password: input.password,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message ?? "Nao foi possivel entrar.");
  }

  return data as LoginResponse;
}
