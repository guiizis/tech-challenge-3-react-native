import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useRef,
} from "react";
import {
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import styles from "@/styles/authStyles";

type AuthScreenProps = {
  children: ReactNode;
};

type AuthScreenContextValue = {
  scrollToFocusedInput: () => void;
};

const AuthScreenContext = createContext<AuthScreenContextValue | null>(null);

export function useAuthScreen() {
  return useContext(AuthScreenContext);
}

export default function AuthScreen({ children }: AuthScreenProps) {
  const scrollViewRef = useRef<ScrollView>(null);

  const scrollToFocusedInput = useCallback(() => {
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 250);
  }, []);

  return (
    <ImageBackground
      source={require("../../assets/BackgroundInicial.png")}
      style={styles.background}
      resizeMode="cover"
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingView}
      >
        <AuthScreenContext.Provider value={{ scrollToFocusedInput }}>
          <ScrollView
            ref={scrollViewRef}
            contentContainerStyle={styles.overlay}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            style={styles.scrollView}
          >
            {children}
          </ScrollView>
        </AuthScreenContext.Provider>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}
