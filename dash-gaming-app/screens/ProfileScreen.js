"use client"

import { useState } from "react"
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert } from "react-native"
import { StatusBar } from "expo-status-bar"
import { Button } from "../components/ui/Button"
import { Input } from "../components/ui/Input"
import { Ionicons } from "@expo/vector-icons"
import { useAuth } from "../context/AuthContext"

export const ProfileScreen = ({ navigation }) => {
  const { user, signOut, updateProfile } = useAuth()
  const [updating, setUpdating] = useState(false)
  const [username, setUsername] = useState(user?.username || "")
  const [isEditing, setIsEditing] = useState(false)

  const handleUpdateProfile = async () => {
    if (!username.trim()) {
      Alert.alert("Error", "El nombre de usuario no puede estar vacío")
      return
    }

    setUpdating(true)
    try {
      await updateProfile({ username })
      setIsEditing(false)
      Alert.alert("Éxito", "Perfil actualizado correctamente")
    } catch (error) {
      Alert.alert("Error", "No se pudo actualizar el perfil")
    } finally {
      setUpdating(false)
    }
  }

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      Alert.alert("Error", "No se pudo cerrar sesión")
    }
  }

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>Mi Perfil</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <Image
              source={user?.avatar_url ? { uri: user.avatar_url } : require("../assets/placeholder-avatar.png")}
              style={styles.avatar}
            />
            <TouchableOpacity style={styles.editAvatarButton}>
              <Ionicons name="camera" size={20} color="#FFFFFF" />
            </TouchableOpacity>
          </View>

          <View style={styles.profileInfo}>
            {isEditing ? (
              <Input
                value={username}
                onChangeText={setUsername}
                placeholder="Nombre de usuario"
                style={styles.usernameInput}
              />
            ) : (
              <Text style={styles.username}>{user?.username || "Usuario"}</Text>
            )}
            <Text style={styles.email}>{user?.email}</Text>
          </View>
        </View>

        {isEditing ? (
          <View style={styles.editButtons}>
            <Button title="Guardar" onPress={handleUpdateProfile} loading={updating} style={styles.saveButton} />
            <Button
              title="Cancelar"
              onPress={() => {
                setIsEditing(false)
                setUsername(user?.username || "")
              }}
              variant="outline"
              style={styles.cancelButton}
            />
          </View>
        ) : (
          <Button
            title="Editar Perfil"
            onPress={() => setIsEditing(true)}
            variant="outline"
            style={styles.editButton}
          />
        )}

        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>0</Text>
            <Text style={styles.statLabel}>Juegos</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>0h</Text>
            <Text style={styles.statLabel}>Tiempo de juego</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statValue}>0</Text>
            <Text style={styles.statLabel}>Amigos</Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Configuración</Text>

          <TouchableOpacity style={styles.settingItem} onPress={() => navigation.navigate("Notifications")}>
            <Ionicons name="notifications-outline" size={24} color="#FFFFFF" style={styles.settingIcon} />
            <Text style={styles.settingText}>Notificaciones</Text>
            <Ionicons name="chevron-forward" size={24} color="#666666" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem} onPress={() => navigation.navigate("Privacy")}>
            <Ionicons name="lock-closed-outline" size={24} color="#FFFFFF" style={styles.settingIcon} />
            <Text style={styles.settingText}>Privacidad</Text>
            <Ionicons name="chevron-forward" size={24} color="#666666" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.settingItem} onPress={() => navigation.navigate("PaymentMethods")}>
            <Ionicons name="card-outline" size={24} color="#FFFFFF" style={styles.settingIcon} />
            <Text style={styles.settingText}>Métodos de pago</Text>
            <Ionicons name="chevron-forward" size={24} color="#666666" />
          </TouchableOpacity>
        </View>

        <Button title="Cerrar Sesión" onPress={handleSignOut} variant="secondary" style={styles.signOutButton} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#121212",
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 16,
    backgroundColor: "#1A1A1A",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  content: {
    flex: 1,
    padding: 16,
  },
  profileHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  avatarContainer: {
    position: "relative",
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#333",
  },
  editAvatarButton: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: "#8A2BE2",
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  profileInfo: {
    marginLeft: 16,
    flex: 1,
  },
  username: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 4,
  },
  email: {
    color: "#CCCCCC",
    fontSize: 14,
  },
  usernameInput: {
    marginBottom: 0,
  },
  editButtons: {
    flexDirection: "row",
    marginBottom: 24,
  },
  saveButton: {
    flex: 1,
    marginRight: 8,
  },
  cancelButton: {
    flex: 1,
    marginLeft: 8,
  },
  editButton: {
    marginBottom: 24,
  },
  statsContainer: {
    flexDirection: "row",
    backgroundColor: "#1A1A1A",
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statValue: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  statLabel: {
    color: "#CCCCCC",
    fontSize: 12,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 16,
  },
  settingItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1A1A1A",
    borderRadius: 8,
    padding: 16,
    marginBottom: 8,
  },
  settingIcon: {
    marginRight: 16,
  },
  settingText: {
    color: "#FFFFFF",
    fontSize: 16,
    flex: 1,
  },
  signOutButton: {
    marginTop: "auto",
  },
})
