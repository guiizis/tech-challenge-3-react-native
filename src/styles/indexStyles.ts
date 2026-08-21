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
    backgroundColor: "rgba(0,0,0,0.4)",
    paddingHorizontal: 20,
  },
  logo: {
    position: "absolute",
    width: 150,
    height: 150,
    top: 120,
  },
  title: {
    fontSize: 36,
    fontWeight: "bold",
    color: colors.textLight,
    fontFamily: "Nunito",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 27,
    color: colors.textLight,
    fontWeight: "200",
    fontFamily: "Roboto",
    marginBottom: 100,
    textAlign: "center",
  },
  highlight: {
    color: colors.primary,
    fontWeight: "200",
    fontFamily: "Roboto",
  },
  button: {
    borderRadius: 12,        // bordas menos arredondadas
    overflow: "hidden",
    width: "55%",
    marginTop: 200,
    marginBottom: -190,
  },
  gradient: {
    paddingVertical: 4,
    borderRadius: 12,
  },
  buttonText: {
    color: colors.textLight,
    fontWeight: "200",
    fontSize: 20,            // fonte menor
    textAlign: "center",
  },
});
