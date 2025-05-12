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
} from "react-native"
import { StatusBar } from "expo-status-bar"
import { Input } from "../components/ui/Input"
import { Button } from "../components/ui/Button"
import { useAuth } from "../context/AuthContext"

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
          Alert.alert(
            "Registro exitoso",
            "Se ha enviado un correo de confirmación a tu dirección de email. Por favor, verifica tu correo para completar el registro.",
          )
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
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
    >
      <StatusBar style="light" />
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
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
  },
  scrollContainer: {
    flexGrow: 1,
    padding: 20,
  },
  logoContainer: {
    alignItems: "center",
    marginTop: 40,
    marginBottom: 40,
  },
  logo: {
    width: 80,
    height: 80,
    marginBottom: 10,
  },
  logoText: {
    fontSize: 42,
    fontWeight: "bold",
    color: "#8A2BE2",
    letterSpacing: 2,
  },
  tagline: {
    color: "#FFFFFF",
    fontSize: 16,
    marginTop: 8,
  },
  formContainer: {
    backgroundColor: "#1A1A1A",
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 20,
  },
  authButton: {
    marginTop: 10,
  },
  toggleContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  toggleText: {
    color: "#8A2BE2",
    fontSize: 14,
  },
  forgotPasswordContainer: {
    marginTop: 15,
    alignItems: "center",
  },
  forgotPasswordText: {
    color: "#8A2BE2",
    fontSize: 14,
  },
  errorText: {
    color: "#FF4D4F",
    marginBottom: 10,
  },
  promoContainer: {
    backgroundColor: "#8A2BE2",
    borderRadius: 12,
    padding: 20,
    alignItems: "center",
  },
  promoTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
  },
})
