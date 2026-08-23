import {
  changePassword as changePasswordRequest,
  ChangePasswordInput,
  login as loginRequest,
  LoginInput,
  signup as signupRequest,
  SignupInput,
} from "@/services/authApi";
import { User } from "@/types/auth";
import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

type AuthContextValue = {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string;
  login: (input: LoginInput) => Promise<User>;
  signup: (input: SignupInput) => Promise<User>;
  changePassword: (input: ChangePasswordInput) => Promise<User>;
  logout: () => void;
  clearError: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: PropsWithChildren) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const runAuthRequest = useCallback(async <T extends { user: User }>(
    request: () => Promise<T>,
  ) => {
    setIsLoading(true);
    setError("");

    try {
      const data = await request();
      setUser(data.user);
      return data.user;
    } catch (requestError) {
      const message =
        requestError instanceof Error
          ? requestError.message
          : "Nao foi possivel concluir a operacao.";

      setError(message);
      throw requestError;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = useCallback(async (input: LoginInput) => {
    return runAuthRequest(() => loginRequest(input));
  }, [runAuthRequest]);

  const signup = useCallback(async (input: SignupInput) => {
    return runAuthRequest(() => signupRequest(input));
  }, [runAuthRequest]);

  const changePassword = useCallback(async (input: ChangePasswordInput) => {
    setIsLoading(true);
    setError("");

    try {
      const data = await changePasswordRequest(input);

      setUser((currentUser) =>
        currentUser?.email === data.user.email ? data.user : currentUser,
      );

      return data.user;
    } catch (requestError) {
      const message =
        requestError instanceof Error
          ? requestError.message
          : "Nao foi possivel alterar a senha.";

      setError(message);
      throw requestError;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setError("");
  }, []);

  const clearError = useCallback(() => {
    setError("");
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isLoading,
      error,
      login,
      signup,
      changePassword,
      logout,
      clearError,
    }),
    [
      changePassword,
      clearError,
      error,
      isLoading,
      login,
      logout,
      signup,
      user,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth deve ser usado dentro de AuthProvider.");
  }

  return context;
}
