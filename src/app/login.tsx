import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ImageBackground } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { FontAwesome5 } from "@expo/vector-icons";
import styles from "../styles/loginStyles";
import colors from "../styles/colors";

export default function LoginScreen() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  return (
    <ImageBackground
      source={require("../assets/BackgroundInicial.png")}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        {/* Título */}
        <View style={styles.titleContainer}>
          <Text style={styles.titleWhite}>Welcome Back</Text>
          <Text style={styles.titleAccent}>Dear Friend</Text>
        </View>

        {/* Card central */}
        <View style={styles.card}>
          <Text style={styles.section}>LOGIN</Text>

          <Text style={styles.label}>Username</Text>
          <TextInput
            style={styles.input}
            placeholderTextColor="#aaa"
            value={username}
            onChangeText={setUsername}
          />

          <Text style={styles.label}>Password</Text>
          <TextInput
            style={styles.input}
            placeholderTextColor="#aaa"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />

          <Text style={styles.forgot}>Forgot Password ?</Text>

          <TouchableOpacity style={styles.button} onPress={() => console.log("Login")}>
            <LinearGradient
              colors={[colors.gradientLeft, colors.gradientRight]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.gradient}
            >
              <Text style={styles.buttonText}>LOGIN</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>

        {/* Redes sociais */}
        <Text style={styles.socialText}>Login with social accounts</Text>
        <View style={styles.socialRow}>
          <TouchableOpacity style={styles.socialButton}>
            <FontAwesome5 name="google" size={20} color="#fff" />
          </TouchableOpacity>
          <TouchableOpacity style={[styles.socialButton, styles.socialButtonFb]}>
            <FontAwesome5 name="facebook-f" size={20} color="#fff" />
          </TouchableOpacity>
        </View>

        {/* Sign up */}
        <Text style={styles.signup}>
          Don't have an account?{" "}
          <Text style={styles.signupLink}>Sign up</Text>
        </Text>
      </View>
    </ImageBackground>
  );
}