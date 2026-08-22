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

export type SignupInput = {
  name: string;
  email: string;
  password: string;
};

export type ChangePasswordInput = {
  email: string;
  password: string;
};

export type SignupResponse = LoginResponse & {
  account: {
    id: number;
    userId: number;
    type: string;
    balance: number;
    currency: string;
    agency: string;
    number: string;
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

export async function signup(input: SignupInput) {
  const response = await fetch(`${env.apiUrl}/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      name: input.name.trim(),
      email: input.email.trim(),
      password: input.password,
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message ?? "Nao foi possivel criar o cadastro.");
  }

  return data as SignupResponse;
}

export async function changePassword(input: ChangePasswordInput) {
  const response = await fetch(`${env.apiUrl}/password`, {
    method: "PATCH",
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
    throw new Error(data.message ?? "Nao foi possivel alterar a senha.");
  }

  return data as LoginResponse;
}
