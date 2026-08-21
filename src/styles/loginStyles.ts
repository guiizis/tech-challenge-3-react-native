import { StyleSheet } from "react-native";
import colors from "./colors";

export default StyleSheet.create({
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
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
    borderColor: "rgba(255,255,255,0.1)",
    padding: 22,
    marginBottom: 30,
    shadowColor: "#000",
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
  input: {
    width: "100%",
    backgroundColor: colors.inputBackground,
    borderWidth: 1,
    borderColor: colors.inputBorder,
    color: colors.textLight,
    padding: 12,
    borderRadius: 8,
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
    backgroundColor: "#DB4437", // vermelho do Google
    width: 46,
    height: 46,
    borderRadius: 23,
    justifyContent: "center",
    alignItems: "center",
  },
  socialButtonFb: {
    backgroundColor: "#3B5998", // azul do Facebook
  },
  signup: {
    color: colors.textMuted,
    fontSize: 13,
    textAlign: "center",
  },
  signupLink: {
    color: colors.primary,
    fontWeight: "bold",
  },
});