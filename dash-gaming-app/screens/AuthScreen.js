"use client"

import { useState } from "react"
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  Dimensions,
} from "react-native"
import { StatusBar } from "expo-status-bar"
import { Input } from "../components/ui/Input"
import { Button } from "../components/ui/Button"
import { useAuth } from "../context/AuthContext"
import { LinearGradient } from "expo-linear-gradient"
import { ThreeBackground } from "../components/ThreeBackground"

export const AuthScreen = () => {
  const { signIn, signUp } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [username, setUsername] = useState("")
  const [loading, setLoading] = useState(false)
  const [isLogin, setIsLogin] = useState(true)
  const [error, setError] = useState("")

  const handleAuth = async () => {
    setError("")
    setLoading(true)

    try {
      if (isLogin) {
        // Login
        const { success, error } = await signIn(email, password)
        if (!success && error) {
          setError(error)
        }
      } else {
        // Register
        const { success, error } = await signUp(email, password, username)
        if (!success && error) {
          setError(error)
        } else if (success) {
          Alert.alert("Registro exitoso", "Tu cuenta ha sido creada correctamente. Ya puedes usar la aplicación.")
        }
      }
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const toggleAuthMode = () => {
    setIsLogin(!isLogin)
    setError("")
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* Fondo animado con Three.js */}
      <ThreeBackground />

      {/* Gradiente para mejorar la legibilidad */}
      <LinearGradient
        colors={["rgba(18, 18, 18, 0.3)", "rgba(18, 18, 18, 0.7)", "rgba(18, 18, 18, 0.9)"]}
        style={styles.gradient}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.logoContainer}>
            <Image source={require("../assets/logo.png")} style={styles.logo} resizeMode="contain" />
            <Text style={styles.logoText}>DASH</Text>
            <Text style={styles.tagline}>La plataforma de juegos más rápida</Text>
          </View>

          <View style={styles.formContainer}>
            <Text style={styles.title}>{isLogin ? "Iniciar Sesión" : "Crear Cuenta"}</Text>

            {!isLogin && (
              <Input
                label="Nombre de usuario"
                value={username}
                onChangeText={setUsername}
                placeholder="Ingresa tu nombre de usuario"
                autoCapitalize="none"
              />
            )}

            <Input
              label="Correo electrónico"
              value={email}
              onChangeText={setEmail}
              placeholder="Ingresa tu correo electrónico"
              keyboardType="email-address"
              autoCapitalize="none"
            />

            <Input
              label="Contraseña"
              value={password}
              onChangeText={setPassword}
              placeholder="Ingresa tu contraseña"
              secureTextEntry
            />

            {error ? <Text style={styles.errorText}>{error}</Text> : null}

            <Button
              title={isLogin ? "Iniciar Sesión" : "Registrarse"}
              onPress={handleAuth}
              loading={loading}
              style={styles.authButton}
            />

            <TouchableOpacity onPress={toggleAuthMode} style={styles.toggleContainer}>
              <Text style={styles.toggleText}>
                {isLogin ? "¿No tienes cuenta? Regístrate" : "¿Ya tienes cuenta? Inicia sesión"}
              </Text>
            </TouchableOpacity>

            {isLogin && (
              <TouchableOpacity style={styles.forgotPasswordContainer}>
                <Text style={styles.forgotPasswordText}>¿Olvidaste tu contraseña?</Text>
              </TouchableOpacity>
            )}
          </View>

          {!isLogin && (
            <View style={styles.promoContainer}>
              <Text style={styles.promoTitle}>¡Regístrate y recibe un juego gratis al activar tu cuenta!</Text>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  )
}

const { width, height } = Dimensions.get("window")

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
  },
  gradient: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
    justifyContent: "center",
  },
  logoContainer: {
    alignItems: "center",
    marginTop: height * 0.05,
    marginBottom: height * 0.05,
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 10,
  },
  logoText: {
    fontSize: 48,
    fontWeight: "bold",
    color: "#8A2BE2",
    letterSpacing: 2,
    textShadowColor: "rgba(138, 43, 226, 0.5)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 10,
  },
  tagline: {
    color: "#FFFFFF",
    fontSize: 16,
    marginTop: 8,
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  formContainer: {
    backgroundColor: "rgba(26, 26, 26, 0.85)",
    borderRadius: 16,
    padding: 24,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "rgba(138, 43, 226, 0.3)",
    shadowColor: "#8A2BE2",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 24,
    textAlign: "center",
  },
  authButton: {
    marginTop: 16,
    height: 50,
  },
  toggleContainer: {
    marginTop: 24,
    alignItems: "center",
  },
  toggleText: {
    color: "#8A2BE2",
    fontSize: 16,
    fontWeight: "500",
  },
  forgotPasswordContainer: {
    marginTop: 16,
    alignItems: "center",
  },
  forgotPasswordText: {
    color: "#8A2BE2",
    fontSize: 14,
  },
  errorText: {
    color: "#FF4D4F",
    marginBottom: 10,
    textAlign: "center",
  },
  promoContainer: {
    backgroundColor: "rgba(138, 43, 226, 0.85)",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    marginTop: 16,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  promoTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    textShadowColor: "rgba(0, 0, 0, 0.5)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
})
