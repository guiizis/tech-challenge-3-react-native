import { FontAwesome5 } from "@expo/vector-icons";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Text,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  View,
} from "react-native";
import styles from "@/styles/authStyles";
import colors from "@/styles/colors";

type AuthTextFieldProps = TextInputProps & {
  label: string;
  error?: string;
};

export default function AuthTextField({ label, error, ...inputProps }: AuthTextFieldProps) {
  const hasPasswordVisibilityToggle = Boolean(inputProps.secureTextEntry);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const secureTextEntry = hasPasswordVisibilityToggle && !isPasswordVisible;

  const focusAnim = useRef(new Animated.Value(0)).current;
  const errorAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(errorAnim, {
      toValue: error ? 1 : 0,
      duration: 250,
      useNativeDriver: true,
    }).start();
  }, [error, errorAnim]);

  const handleFocus = (e: any) => {
    Animated.timing(focusAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: false, // borderColor não suporta native driver
    }).start();
    inputProps.onFocus?.(e);
  };

  const handleBlur = (e: any) => {
    Animated.timing(focusAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: false,
    }).start();
    inputProps.onBlur?.(e);
  };

  const animatedBorderColor = focusAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [colors.inputBorder, colors.primary],
  });

  return (
    <View>
      <Text style={styles.label}>{label}</Text>
      <Animated.View
        style={[
          styles.inputContainer,
          { borderColor: animatedBorderColor, borderWidth: 1 },
          error && styles.inputError,
        ]}
      >
        <TextInput
          style={[
            styles.input,
            hasPasswordVisibilityToggle && styles.inputWithTrailingIcon,
          ]}
          placeholderTextColor={colors.textPlaceholder}
          autoCapitalize="none"
          {...inputProps}
          secureTextEntry={secureTextEntry}
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
        {hasPasswordVisibilityToggle ? (
          <TouchableOpacity
            style={styles.inputIconButton}
            onPress={() => setIsPasswordVisible((current) => !current)}
            accessibilityRole="button"
            accessibilityLabel={isPasswordVisible ? "Ocultar senha" : "Mostrar senha"}
          >
            <FontAwesome5
              name={isPasswordVisible ? "eye-slash" : "eye"}
              size={18}
              color={colors.textMuted}
            />
          </TouchableOpacity>
        ) : null}
      </Animated.View>
      {error ? (
        <Animated.Text
          style={[
            styles.errorText,
            {
              opacity: errorAnim,
              transform: [
                {
                  translateY: errorAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [-5, 0],
                  }),
                },
              ],
            },
          ]}
        >
          {error}
        </Animated.Text>
      ) : null}
    </View>
  );
}