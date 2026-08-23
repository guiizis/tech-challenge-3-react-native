import { AuthProvider } from "@/context/AuthContext";
import { FinanceProvider } from "@/context/FinanceContext";
import { PropsWithChildren } from "react";

export default function AppProviders({ children }: PropsWithChildren) {
  return (
    <AuthProvider>
      <FinanceProvider>{children}</FinanceProvider>
    </AuthProvider>
  );
}

