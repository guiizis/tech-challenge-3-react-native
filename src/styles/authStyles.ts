import { StyleSheet } from "react-native";
import colors from "./colors";

export default StyleSheet.create({
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  overlay: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 32,
    paddingBottom: 96,
  },
  titleContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  titleWhite: {
    fontSize: 32,
    fontWeight: "bold",
    color: colors.textLight,
    textAlign: "center",
  },
  titleAccent: {
    fontSize: 32,
    fontWeight: "bold",
    color: colors.primary,
    textAlign: "center",
  },
  card: {
    width: "88%",
    backgroundColor: colors.cardBackground,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.cardBorder,
    padding: 22,
    marginBottom: 30,
    shadowColor: colors.shadow,
    shadowOpacity: 0.5,
    shadowRadius: 10,
    elevation: 6,
  },
  section: {
    fontSize: 20,
    fontWeight: "bold",
    color: colors.textLight,
    marginBottom: 18,
    textAlign: "center",
  },
  label: {
    color: colors.textMuted,
    fontSize: 13,
    marginBottom: 6,
    marginTop: 8,
  },
  inputContainer: {
    width: "100%",
    backgroundColor: colors.inputBackground,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  inputError: {
    borderColor: colors.borderError,
  },
  input: {
    flex: 1,
    color: colors.textLight,
    padding: 12,
  },
  inputWithTrailingIcon: {
    paddingRight: 4,
  },
  inputIconButton: {
    width: 44,
    height: 44,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    color: colors.textError,
    fontSize: 12,
    marginTop: 5,
  },
  errorAlert: {
    alignItems: "center",
    backgroundColor: colors.errorBackground,
    borderColor: colors.errorBorder,
    borderRadius: 8,
    borderWidth: 1,
    flexDirection: "row",
    gap: 8,
    marginBottom: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  errorAlertText: {
    color: colors.textError,
    flex: 1,
    fontSize: 12,
    fontWeight: "600",
  },
  forgot: {
    color: colors.primary,
    fontSize: 13,
    textAlign: "right",
    marginTop: 10,
    marginBottom: 5,
  },
  button: {
    borderRadius: 25,
    overflow: "hidden",
    marginTop: 15,
  },
  buttonDisabled: {
    opacity: 0.65,
  },
  gradient: {
    paddingVertical: 14,
    borderRadius: 25,
  },
  buttonText: {
    color: colors.textLight,
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
    letterSpacing: 1,
  },
  socialText: {
    color: colors.textMuted,
    fontSize: 13,
    marginBottom: 14,
  },
  socialRow: {
    flexDirection: "row",
    gap: 18,
    marginBottom: 20,
  },
  socialButton: {
    backgroundColor: colors.google,
    width: 46,
    height: 46,
    borderRadius: 23,
    justifyContent: "center",
    alignItems: "center",
  },
  socialButtonFb: {
    backgroundColor: colors.facebook,
  },
  socialButtonDisabled: {
    opacity: 0.45,
  },
  footerText: {
    color: colors.textMuted,
    fontSize: 13,
    textAlign: "center",
  },
  footerLink: {
    color: colors.primary,
    fontWeight: "bold",
  },
  policyRow: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 12,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: colors.primary,
    marginRight: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  checkboxChecked: {
    backgroundColor: colors.primary,
  },
  checkboxMark: {
    color: colors.textLight,
    fontSize: 12,
    fontWeight: "bold",
  },
  policyText: {
    color: colors.textLight,
    fontSize: 13,
  },
  policyLink: {
    color: colors.primary,
    fontWeight: "bold",
  },
  policyErrorText: {
    color: colors.textError,
    fontSize: 12,
    marginTop: 6,
    textAlign: "center",
  },
});
